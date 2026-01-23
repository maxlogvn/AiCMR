from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi_pagination import Page, paginate
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_min_rank
from app.core.security import verify_password, validate_csrf
from app.core.constants import (
    ADMIN_RANK,
    MODERATOR_RANK,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    CACHE_USER_LIST_SECONDS,
)
from app.core.exceptions import UserNotFound, NotEnoughPermissions
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserUpdateMe, ChangePassword
from app.crud import get_by_id, update, update_password, get_all_users, delete
from loguru import logger

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    request: Request, current_user: User = Depends(get_current_active_user)
):
    """
    Get current user info.
    Not cached to ensure data is always fresh after updates.
    """
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    request: Request,
    user_in: UserUpdateMe,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    updated_user = await update(db, current_user, user_in)

    logger.info(f"User updated profile: {current_user.email}")
    return updated_user


@router.patch("/me/password")
async def change_current_user_password(
    request: Request,
    password_data: ChangePassword,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    if not verify_password(password_data.old_password, str(current_user.hashed_password)):  # type: ignore[arg-type]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password"
        )

    await update_password(db, current_user, password_data.new_password)
    logger.info(f"User changed password: {current_user.email}")
    return {"message": "Password updated successfully"}


@router.get("/", response_model=Page[UserResponse])
@cache(expire=CACHE_USER_LIST_SECONDS, namespace="users")
async def list_users(
    request: Request,
    page: int = Query(1, ge=1),
    size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
):
    """
    List users with pagination.
    Default: page 1, 10 users per page.
    Max page size: 100.
    Cached for 2 minutes per page.
    """
    # Validate size limits (already validated by Query)
    if size > MAX_PAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Page size cannot exceed {MAX_PAGE_SIZE}",
        )

    skip = (page - 1) * size
    users = await get_all_users(db, skip=skip, limit=size)
    return paginate(users)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if current_user.rank >= MODERATOR_RANK or current_user.id == user_id:
        user = await get_by_id(db, user_id)
        if not user:
            raise UserNotFound()
        return user
    else:
        raise NotEnoughPermissions("Not enough permissions to view other users")


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user_by_id(
    request: Request,
    user_id: int,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MODERATOR_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    user = await get_by_id(db, user_id)
    if not user:
        raise UserNotFound()

    if current_user.rank == ADMIN_RANK:
        updated_user = await update(db, user, user_in)

        await FastAPICache.clear(namespace="users")
        await FastAPICache.clear(namespace="user")

        logger.info(f"Admin {current_user.email} updated user {user.email}")
        return updated_user
    elif current_user.rank == MODERATOR_RANK:
        for field in user_in.model_fields_set:
            if field != "is_active":
                raise NotEnoughPermissions("Moderator chỉ có thể thay đổi is_active")

        if user.rank == ADMIN_RANK:
            raise NotEnoughPermissions("Moderator không được thay đổi trạng thái Admin")

        if user.rank > current_user.rank:
            raise NotEnoughPermissions(
                f"Moderator không được thay đổi trạng thái user có Rank cao hơn ({user.rank})"
            )

        update_data = {"is_active": user_in.is_active}
        updated_user = await update(db, user, update_data)

        await FastAPICache.clear(namespace="users")
        await FastAPICache.clear(namespace="user")

        logger.info(
            f"Moderator {current_user.email} updated is_active of user {user.email}"
        )
        return updated_user
    else:
        raise NotEnoughPermissions("Not enough permissions")


@router.delete("/{user_id}")
async def delete_user(
    request: Request,
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete yourself"
        )

    success = await delete(db, user_id)
    if not success:
        raise UserNotFound()

    # Invalidate cache for user list
    await FastAPICache.clear(namespace="users")

    logger.info(f"Admin {current_user.email} deleted user {user_id}")
    return {"message": "User deleted successfully"}
