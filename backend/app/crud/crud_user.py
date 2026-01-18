from typing import Optional, Union, Any, Type, TypeVar
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserUpdateMe
from app.core.security import get_password_hash, verify_password

ModelType = TypeVar("ModelType")


async def get_by_field(
    db: AsyncSession, model: Type[ModelType], field: str, value: Any
) -> Optional[ModelType]:
    result = await db.execute(select(model).where(getattr(model, field) == value))
    return result.scalar_one_or_none()


@cache(expire=300, namespace="user")
async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
    return await get_by_field(db, User, "email", email)


async def get_by_username(db: AsyncSession, username: str) -> Optional[User]:
    return await get_by_field(db, User, "username", username)


async def get_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    return await get_by_field(db, User, "id", user_id)


async def create(db: AsyncSession, obj_in: UserCreate) -> User:
    hashed_password = get_password_hash(obj_in.password)
    db_obj = User(
        email=obj_in.email,
        username=obj_in.username,
        hashed_password=hashed_password,
        is_active=obj_in.is_active,
        rank=obj_in.rank,
    )
    db.add(db_obj)
    await db.flush()
    await db.refresh(db_obj)
    return db_obj


async def update(
    db: AsyncSession,
    db_obj: User,
    obj_in: Union[UserUpdate, UserUpdateMe, dict[str, Any]],
) -> User:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_obj, field, value)

    await db.flush()
    await db.refresh(db_obj)
    await FastAPICache.clear(namespace="user")
    return db_obj


async def update_password(db: AsyncSession, user: User, new_password: str) -> User:
    user.hashed_password = get_password_hash(new_password)
    await db.flush()
    await db.refresh(user)
    await FastAPICache.clear(namespace="user")
    return user


async def authenticate(db: AsyncSession, email: str, password: str) -> Optional[User]:
    user = await get_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def get_all_users(
    db: AsyncSession, skip: int = 0, limit: int = 100
) -> list[User]:
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()


async def count_users(db: AsyncSession) -> int:
    from sqlalchemy import func

    result = await db.execute(select(func.count()).select_from(User))
    return result.scalar()


async def delete(db: AsyncSession, user_id: int) -> bool:
    user = await get_by_id(db, user_id)
    if not user:
        return False
    await db.delete(user)
    await db.flush()
    await FastAPICache.clear(namespace="user")
    return True
