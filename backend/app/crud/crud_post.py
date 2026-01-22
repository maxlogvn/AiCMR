from typing import Optional, Union
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, update as sql_update
from sqlalchemy.orm import selectinload, joinedload
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.models.post import Post
from app.models.post_tag import PostTag
from app.schemas.post import PostCreate, PostUpdate, PostQuery


@cache(expire=300, namespace="post")
async def get_post_by_id(db: AsyncSession, post_id: int) -> Optional[Post]:
    """Lấy bài viết theo ID với relationships"""
    result = await db.execute(
        select(Post)
         .options(
            selectinload(Post.author),
            selectinload(Post.category),
            selectinload(Post.tags),
            selectinload(Post.post_metadata),
            joinedload(Post.thumbnail_image)
        )
        .where(Post.id == post_id)
    )
    return result.scalar_one_or_none()


@cache(expire=300, namespace="post")
async def get_post_by_slug(db: AsyncSession, slug: str) -> Optional[Post]:
    """Lấy bài viết theo slug"""
    result = await db.execute(
        select(Post)
         .options(
            selectinload(Post.author),
            selectinload(Post.category),
            selectinload(Post.tags),
            selectinload(Post.post_metadata),
            joinedload(Post.thumbnail_image)
        )
        .where(Post.slug == slug)
    )
    return result.scalar_one_or_none()


async def get_all_posts(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    filters: Optional[PostQuery] = None
) -> tuple[list[Post], int]:
    """Lấy danh sách bài viết với filters, pagination, và joins

    Returns:
        tuple[list[Post], int]: (list of posts, total count)
    """
    query = select(Post).options(
        selectinload(Post.author),
        selectinload(Post.category),
        selectinload(Post.tags),
        joinedload(Post.thumbnail_image)
    )

    # Áp dụng filters
    conditions = []

    if filters:
        if filters.status:
            conditions.append(Post.status == filters.status)
        if filters.category_id:
            conditions.append(Post.category_id == filters.category_id)
        if filters.author_id:
            conditions.append(Post.author_id == filters.author_id)
        if filters.date_from:
            conditions.append(Post.created_at >= filters.date_from)
        if filters.date_to:
            conditions.append(Post.created_at <= filters.date_to)
        if filters.search:
            search_term = f"%{filters.search}%"
            conditions.append(or_(
                Post.title.ilike(search_term),
                Post.excerpt.ilike(search_term)
            ))

        # Filter theo tags (many-to-many)
        if filters.tag_ids:
            from app.models.post_tag import PostTag
            # Sử dụng subquery để filter posts có ít nhất một tag trong danh sách
            subq = (
                select(PostTag.post_id)
                .where(PostTag.tag_id.in_(filters.tag_ids))
                .group_by(PostTag.post_id)
                .having(func.count(PostTag.tag_id) == len(filters.tag_ids))
                .subquery()
            )
            conditions.append(Post.id.in_(subq))

    if conditions:
        query = query.where(and_(*conditions))

    # Đếm tổng số records
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Thêm pagination và sorting
    query = query.order_by(Post.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    posts = result.scalars().all()

    return posts, total


async def create_post(
    db: AsyncSession,
    obj_in: PostCreate,
    user_id: int
) -> Post:
    """Tạo bài viết mới

    Args:
        db: Database session
        obj_in: PostCreate schema
        user_id: ID của user tạo bài viết

    Returns:
        Post: Bài viết đã tạo
    """
    # Tạo post record
    db_obj = Post(
        title=obj_in.title,
        slug=obj_in.slug,
        content=obj_in.content,
        excerpt=obj_in.excerpt,
        status=obj_in.status,
        author_id=user_id,
        category_id=obj_in.category_id,
        thumbnail_image_id=obj_in.cover_image_id,
        view_count=0
    )

    db.add(db_obj)
    await db.flush()
    await db.refresh(db_obj)

    # Xử lý tags
    if obj_in.tags:
        from app.models.post_tag import PostTag
        for tag_id in obj_in.tags:
            post_tag = PostTag(post_id=db_obj.id, tag_id=tag_id)
            db.add(post_tag)

    await db.flush()
    await db.refresh(db_obj)
    await FastAPICache.clear(namespace="post")

    return db_obj


async def update_post(
    db: AsyncSession,
    db_obj: Post,
    obj_in: PostUpdate
) -> Post:
    """Cập nhật bài viết

    Args:
        db: Database session
        db_obj: Post object hiện tại
        obj_in: PostUpdate schema

    Returns:
        Post: Bài viết đã cập nhật
    """
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.model_dump(exclude_unset=True)

    # Xử lý tags riêng
    tags = update_data.pop("tags", None)
    
    # Map cover_image_id to thumbnail_image_id
    if "cover_image_id" in update_data:
        update_data["thumbnail_image_id"] = update_data.pop("cover_image_id")

    # Cập nhật các trường khác
    for field, value in update_data.items():
        if hasattr(db_obj, field):
            setattr(db_obj, field, value)

    await db.flush()
    await db.refresh(db_obj)

    # Xử lý tags nếu có
    if tags is not None:
        from app.models.post_tag import PostTag
        # Xóa tất cả tags hiện tại
        existing_tags = await db.execute(
            select(PostTag).where(PostTag.post_id == db_obj.id)
        )
        for tag in existing_tags.scalars().all():
            await db.delete(tag)

        # Thêm tags mới
        for tag_id in tags:
            post_tag = PostTag(post_id=db_obj.id, tag_id=tag_id)
            db.add(post_tag)

    await db.flush()
    await db.refresh(db_obj)
    await FastAPICache.clear(namespace="post")

    return db_obj


async def delete_post(
    db: AsyncSession,
    post_id: int
) -> bool:
    """Xóa bài viết

    Args:
        db: Database session
        post_id: ID của bài viết

    Returns:
        bool: True nếu xóa thành công, False nếu không tìm thấy
    """
    post = await get_post_by_id(db, post_id)
    if not post:
        return False

    # Xóa post record (cascade sẽ tự động xóa metadata và post_tags)
    await db.delete(post)
    await db.flush()
    await FastAPICache.clear(namespace="post")

    return True


async def increment_post_view_count(db: AsyncSession, post_id: int) -> int:
    """Tăng view count cho bài viết

    Args:
        db: Database session
        post_id: ID của bài viết

    Returns:
        int: View count mới
    """
    # Sử dụng update trực tiếp để tránh race condition
    result = await db.execute(
        sql_update(Post)
        .where(Post.id == post_id)
        .values(view_count=Post.view_count + 1)
        .returning(Post.view_count)
    )
    new_count = result.scalar_one()

    await db.flush()
    return new_count


async def get_post_stats(db: AsyncSession) -> dict:
    """Lấy thống kê bài viết theo trạng thái"""
    result = await db.execute(
        select(Post.status, func.count(Post.id))
        .group_by(Post.status)
    )
    
    stats = {
        "total": 0,
        "published": 0,
        "draft": 0,
        "archived": 0
    }
    
    for status, count in result.all():
        stats[status] = count
        stats["total"] += count
        
    return stats


async def get_user_posts(
    db: AsyncSession,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
) -> tuple[list[Post], int]:
    """Lấy bài viết của một user

    Args:
        db: Database session
        user_id: ID của user
        skip: Số records bỏ qua (pagination)
        limit: Số records tối đa (pagination)
        status: Filter theo status (optional)

    Returns:
        tuple[list[Post], int]: (list of posts, total count)
    """
    query = select(Post).options(
        selectinload(Post.author),
        selectinload(Post.category),
        selectinload(Post.tags),
        joinedload(Post.thumbnail_image)
    ).where(Post.author_id == user_id)

    if status:
        query = query.where(Post.status == status)

    # Đếm tổng số records
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Thêm pagination và sorting
    query = query.order_by(Post.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    posts = result.scalars().all()

    return posts, total


async def get_published_posts(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[Post], int]:
    """Lấy danh sách bài viết đã xuất bản

    Args:
        db: Database session
        skip: Số records bỏ qua (pagination)
        limit: Số records tối đa (pagination)

    Returns:
        tuple[list[Post], int]: (list of posts, total count)
    """
    # Không filter theo user_id, chỉ filter theo status
    query = select(Post).options(
        selectinload(Post.author),
        selectinload(Post.category),
        selectinload(Post.tags),
        joinedload(Post.thumbnail_image)
    ).where(Post.status == "published")

    # Đếm tổng số records
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Thêm pagination và sorting
    query = query.order_by(Post.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    posts = result.scalars().all()

    return posts, total
