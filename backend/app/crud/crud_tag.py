from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagUpdate


@cache(expire=300, namespace="tag")
async def get_tag_by_id(db: AsyncSession, tag_id: int) -> Optional[Tag]:
    """Lấy tag theo ID"""
    result = await db.execute(select(Tag).where(Tag.id == tag_id))
    return result.scalar_one_or_none()


@cache(expire=300, namespace="tag")
async def get_tag_by_slug(db: AsyncSession, slug: str) -> Optional[Tag]:
    """Lấy tag theo slug"""
    result = await db.execute(select(Tag).where(Tag.slug == slug))
    return result.scalar_one_or_none()


async def get_all_tags(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[Tag], int]:
    """Lấy danh sách tags

    Args:
        db: Database session
        skip: Số records bỏ qua (pagination)
        limit: Số records tối đa (pagination)

    Returns:
        tuple[list[Tag], int]: (list of tags, total count)
    """
    # Đếm tổng số records
    count_query = select(func.count()).select_from(Tag)
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Lấy tags với pagination và sorting
    query = select(Tag).order_by(Tag.name).offset(skip).limit(limit)
    result = await db.execute(query)
    tags = result.scalars().all()

    return tags, total


async def create_tag(
    db: AsyncSession,
    obj_in: TagCreate
) -> Tag:
    """Tạo tag mới"""
    db_obj = Tag(
        name=obj_in.name,
        slug=obj_in.slug,
        color=obj_in.color
    )

    db.add(db_obj)
    await db.flush()
    await db.refresh(db_obj)
    await FastAPICache.clear(namespace="tag")

    return db_obj


async def update_tag(
    db: AsyncSession,
    db_obj: Tag,
    obj_in: TagUpdate
) -> Tag:
    """Cập nhật tag"""
    update_data = obj_in.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_obj, field, value)

    await db.flush()
    await db.refresh(db_obj)
    await FastAPICache.clear(namespace="tag")

    return db_obj


async def delete_tag(db: AsyncSession, tag_id: int) -> bool:
    """Xóa tag"""
    tag = await get_tag_by_id(db, tag_id)
    if not tag:
        return False

    await db.delete(tag)
    await db.flush()
    await FastAPICache.clear(namespace="tag")

    return True


async def get_trending_tags(
    db: AsyncSession,
    limit: int = 10
) -> list[Tag]:
    """Lấy các tags phổ biến nhất (được sử dụng nhiều nhất)

    Args:
        db: Database session
        limit: Số tags tối đa

    Returns:
        list[Tag]: List of trending tags
    """
    from app.models.post_tag import PostTag
    from sqlalchemy import desc

    # Join với PostTag để đếm số bài viết sử dụng mỗi tag
    subq = (
        select(PostTag.tag_id, func.count(PostTag.post_id).label('usage_count'))
        .group_by(PostTag.tag_id)
        .order_by(desc('usage_count'))
        .limit(limit)
        .subquery()
    )

    result = await db.execute(
        select(Tag).join(subq, Tag.id == subq.c.tag_id)
    )

    return result.scalars().all()
