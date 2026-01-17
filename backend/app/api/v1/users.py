from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_pagination import Page, paginate
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_min_rank, get_current_user
from app.core.security import verify_password
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserUpdateMe, ChangePassword
from app.crud import get_by_id, update, update_password, get_all_users, delete
from loguru import logger

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    user_in: UserUpdateMe,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    updated_user = await update(db, current_user, user_in)
    logger.info(f"User updated profile: {current_user.email}")
    return updated_user


@router.patch("/me/password")
async def change_current_user_password(
    password_data: ChangePassword,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if not verify_password(password_data.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )
    
    await update_password(db, current_user, password_data.new_password)
    logger.info(f"User changed password: {current_user.email}")
    return {"message": "Password updated successfully"}


@router.get("/", response_model=Page[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(5))
):
    users = await get_all_users(db, limit=1000)  # Lấy giới hạn lớn để paginate
    return paginate(users)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if current_user.rank >= 3 or current_user.id == user_id:
        user = await get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to view other users"
        )


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user_by_id(
    user_id: int,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(5))
):
    user = await get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    updated_user = await update(db, user, user_in)
    logger.info(f"Admin {current_user.email} updated user {user.email}")
    return updated_user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(5))
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
    
    success = await delete(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    logger.info(f"Admin {current_user.email} deleted user {user_id}")
    return {"message": "User deleted successfully"}
