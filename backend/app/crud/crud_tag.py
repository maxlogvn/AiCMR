from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagUpdate
from loguru import logger


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
    total = total_result.scalar() or 0

    # Lấy tags với pagination và sorting
    query = select(Tag).order_by(Tag.post_count.desc(), Tag.name.asc()).offset(skip).limit(limit)
    result = await db.execute(query)
    tags = list(result.scalars().all())

    return tags, total


async def create_tag(
    db: AsyncSession,
    obj_in: TagCreate
) -> Tag:
    """Tạo tag mới"""
    db_obj = Tag(
        name=obj_in.name,
        slug=obj_in.slug,
        color=obj_in.color,
        description=obj_in.description,
        post_count=0
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

    return list(result.scalars().all())


async def update_post_count(db: AsyncSession, tag_id: int, increment: bool = True):
    """Cập nhật post_count cache cho tag"""
    tag = await get_tag_by_id(db, tag_id)
    if tag:
        tag.post_count += 1 if increment else -1 
        await db.flush()


async def get_unused_tags(db: AsyncSession) -> list[Tag]:
    """Lấy các tag không được sử dụng (post_count = 0)"""
    result = await db.execute(select(Tag).where(Tag.post_count == 0).order_by(Tag.name.asc()))
    return list(result.scalars().all())


async def merge_tags(db: AsyncSession, source_id: int, target_id: int) -> bool:
    """Gộp source tag vào target tag

    Args:
        db: Database session
        source_id: Tag ID to merge from
        target_id: Tag ID to merge into

    Returns:
        bool: Success status
    """
    from app.models.post_tag import PostTag

    try:
        # Get post counts for update
        source_tag = await get_tag_by_id(db, source_id)
        if not source_tag:
            return False

        target_tag = await get_tag_by_id(db, target_id)
        if not target_tag:
            return False

        # Move all posts from source to target
        await db.execute(
            update(PostTag)
            .where(PostTag.tag_id == source_id)
            .values(tag_id=target_id)
        )

        # Update target tag post count
        target_tag.post_count += source_tag.post_count 

        # Delete source tag
        await db.delete(source_tag)

        await db.flush()
        await FastAPICache.clear(namespace="tag")

        logger.info(f"Merged tag {source_id} into {target_id}")
        return True
    except Exception as e:
        logger.error(f"Error merging tags: {e}")
        return False
