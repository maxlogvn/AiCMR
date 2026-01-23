from typing import Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.models.post_metadata import PostMetadata
from app.schemas.post_metadata import PostMetadataCreate, PostMetadataUpdate


@cache(expire=300, namespace="post_metadata")
async def get_metadata(
    db: AsyncSession,
    post_id: int,
    key: str
) -> Optional[PostMetadata]:
    """Lấy metadata theo post_id và key"""
    result = await db.execute(
        select(PostMetadata).where(
            PostMetadata.post_id == post_id,
            PostMetadata.key == key
        )
    )
    return result.scalar_one_or_none()


async def get_all_metadata(
    db: AsyncSession,
    post_id: int
) -> list[PostMetadata]:
    """Lấy tất cả metadata của một bài viết"""
    result = await db.execute(
        select(PostMetadata)
        .where(PostMetadata.post_id == post_id)
        .order_by(PostMetadata.key)
    )
    return result.scalars().all()


async def set_metadata(
    db: AsyncSession,
    post_id: int,
    key: str,
    value: str
) -> PostMetadata:
    """Thiết lập metadata cho bài viết

    Args:
        db: Database session
        post_id: ID của bài viết
        key: Tên metadata
        value: Giá trị (JSON string)

    Returns:
        PostMetadata: Metadata đã tạo/cập nhật
    """
    # Kiểm tra xem metadata đã tồn tại chưa
    existing = await get_metadata(db, post_id, key)

    if existing:
        # Cập nhật nếu đã tồn tại
        existing.value = value 
        await db.flush()
        await db.refresh(existing)
        await FastAPICache.clear(namespace="post_metadata")
        return existing
    else:
        # Tạo mới nếu chưa tồn tại
        db_obj = PostMetadata(
            post_id=post_id,
            key=key,
            value=value
        )
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        await FastAPICache.clear(namespace="post_metadata")
        return db_obj


async def update_metadata(
    db: AsyncSession,
    post_id: int,
    key: str,
    value: str
) -> Optional[PostMetadata]:
    """Cập nhật metadata

    Args:
        db: Database session
        post_id: ID của bài viết
        key: Tên metadata
        value: Giá trị mới

    Returns:
        Optional[PostMetadata]: Metadata đã cập nhật hoặc None nếu không tìm thấy
    """
    db_obj = await get_metadata(db, post_id, key)
    if not db_obj:
        return None

    db_obj.value = value 
    await db.flush()
    await db.refresh(db_obj)
    await FastAPICache.clear(namespace="post_metadata")

    return db_obj


async def delete_metadata(
    db: AsyncSession,
    post_id: int,
    key: str
) -> bool:
    """Xóa metadata

    Args:
        db: Database session
        post_id: ID của bài viết
        key: Tên metadata

    Returns:
        bool: True nếu xóa thành công, False nếu không tìm thấy
    """
    db_obj = await get_metadata(db, post_id, key)
    if not db_obj:
        return False

    await db.delete(db_obj)
    await db.flush()
    await FastAPICache.clear(namespace="post_metadata")

    return True


async def bulk_set_metadata(
    db: AsyncSession,
    post_id: int,
    metadata: dict[str, Any]
) -> list[PostMetadata]:
    """Thiết lập nhiều metadata cùng lúc

    Args:
        db: Database session
        post_id: ID của bài viết
        metadata: Dictionary của key-value pairs

    Returns:
        list[PostMetadata]: List của các metadata đã tạo/cập nhật
    """
    results = []

    for key, value in metadata.items():
        # Convert value to string (JSON)
        if not isinstance(value, str):
            import json
            value_str = json.dumps(value)
        else:
            value_str = value

        result = await set_metadata(db, post_id, key, value_str)
        results.append(result)

    await db.flush()
    return results


async def delete_all_metadata(db: AsyncSession, post_id: int) -> bool:
    """Xóa tất cả metadata của một bài viết

    Args:
        db: Database session
        post_id: ID của bài viết

    Returns:
        bool: True nếu xóa thành công
    """
    result = await db.execute(
        select(PostMetadata).where(PostMetadata.post_id == post_id)
    )
    metadata_list = result.scalars().all()

    for meta in metadata_list:
        await db.delete(meta)

    await db.flush()
    await FastAPICache.clear(namespace="post_metadata")

    return True
