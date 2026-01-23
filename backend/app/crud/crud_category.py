from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate
from loguru import logger


@cache(expire=300, namespace="category")
async def get_category_by_id(db: AsyncSession, category_id: int) -> Optional[Category]:
    """Lấy chuyên mục theo ID với relationships"""
    result = await db.execute(
        select(Category)
        .options(selectinload(Category.children))
        .where(Category.id == category_id)
    )
    return result.scalar_one_or_none()


@cache(expire=300, namespace="category")
async def get_category_by_slug(db: AsyncSession, slug: str) -> Optional[Category]:
    """Lấy chuyên mục theo slug"""
    result = await db.execute(
        select(Category)
        .options(selectinload(Category.children))
        .where(Category.slug == slug)
    )
    return result.scalar_one_or_none()


async def get_all_categories(
    db: AsyncSession,
    active_only: bool = True,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[Category], int]:
    """Lấy danh sách chuyên mục

    Args:
        db: Database session
        active_only: Chỉ lấy chuyên mục đang active
        skip: Số records bỏ qua (pagination)
        limit: Số records tối đa (pagination)

    Returns:
        tuple[list[Category], int]: (list of categories, total count)
    """
    query = select(Category).options(selectinload(Category.children))

    if active_only:
        query = query.where(Category.is_active == True)

    # Đếm tổng số records
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Thêm pagination và sorting
    query = query.order_by(Category.display_order.asc(), Category.name.asc()).offset(skip).limit(limit)

    result = await db.execute(query)
    categories = list(result.scalars().all())

    return categories, total


async def create_category(
    db: AsyncSession,
    obj_in: CategoryCreate
) -> Category:
    """Tạo chuyên mục mới"""
    db_obj = Category(
        name=obj_in.name,
        slug=obj_in.slug,
        description=obj_in.description,
        parent_id=obj_in.parent_id,
        is_active=obj_in.is_active,
        icon=obj_in.icon,
        color=obj_in.color,
        display_order=obj_in.display_order,
        show_in_menu=obj_in.show_in_menu,
        post_count=0
    )

    db.add(db_obj)
    await db.flush()
    await db.refresh(db_obj)
    await FastAPICache.clear(namespace="category")

    return db_obj


async def update_category(
    db: AsyncSession,
    db_obj: Category,
    obj_in: CategoryUpdate
) -> Category:
    """Cập nhật chuyên mục"""
    update_data = obj_in.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_obj, field, value)

    await db.flush()
    await db.refresh(db_obj)
    await FastAPICache.clear(namespace="category")

    return db_obj


async def delete_category(db: AsyncSession, category_id: int) -> bool:
    """Xóa chuyên mục"""
    category = await get_category_by_id(db, category_id)
    if not category:
        return False

    await db.delete(category)
    await db.flush()
    await FastAPICache.clear(namespace="category")

    return True


async def get_with_post_count(db: AsyncSession, category_id: int) -> Optional[Category]:
    """Lấy chuyên mục kèm số bài viết"""
    from app.models.post import Post

    category = await get_category_by_id(db, category_id)
    if not category:
        return None

    # Đếm số bài viết trực tiếp trong category
    result = await db.execute(
        select(func.count()).select_from(Post).where(Post.category_id == category_id)
    )
    direct_count = result.scalar() or 0

    # Update post_count
    category.post_count = direct_count 

    return category


async def get_tree_structure(db: AsyncSession) -> list[Category]:
    """Lấy cấu trúc cây của chuyên mục"""
    # Lấy tất cả chuyên mục
    result = await db.execute(select(Category).order_by(Category.display_order.asc(), Category.name.asc()))
    all_categories = result.scalars().all()

    # Build tree structure
    category_map = {cat.id: cat for cat in all_categories}
    root_categories = []

    for category in all_categories:
        if category.parent_id:
            parent = category_map.get(category.parent_id)
            if parent:
                if not hasattr(parent, 'children'):
                    parent.children = []
                parent.children.append(category)
        else:
            root_categories.append(category)

    return root_categories


async def update_post_count(db: AsyncSession, category_id: int, increment: bool = True):
    """Cập nhật post_count cache cho category"""
    category = await get_category_by_id(db, category_id)
    if category:
        category.post_count += 1 if increment else -1 
        await db.flush()


async def reorder_categories(db: AsyncSession, items: list[dict]) -> bool:
    """Reorder categories based on display_order

    Args:
        db: Database session
        items: List of {id: int, order: int}

    Returns:
        bool: Success status
    """
    try:
        for item in items:
            category_id = item.get('id')
            if category_id is None:
                continue
            display_order = item.get('order')

            category = await get_category_by_id(db, category_id)
            if category and display_order is not None:
                category.display_order = display_order 

        await db.flush()
        await FastAPICache.clear(namespace="category")

        logger.info(f"Reordered {len(items)} categories")
        return True
    except Exception as e:
        logger.error(f"Error reordering categories: {e}")
        return False
