from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi_pagination import Page, paginate
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_min_rank
from app.core.security import validate_csrf
from app.core.constants import (
    ADMIN_RANK,
    MODERATOR_RANK,
    MEMBER_RANK,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    CACHE_POST_LIST_SECONDS,
)
from app.models.user import User
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.crud import (
    get_category_by_id,
    get_category_by_slug,
    get_all_categories,
    create_category,
    update_category,
    delete_category,
    get_with_post_count,
    get_tree_structure,
    reorder_categories as reorder_categories_crud,
)
from loguru import logger

router = APIRouter()


# ==================== PUBLIC ENDPOINTS ====================


@router.get("/", response_model=list[CategoryResponse])
@cache(expire=CACHE_POST_LIST_SECONDS, namespace="categories")
async def list_categories(
    request: Request,
    active_only: bool = Query(True, description="Only return active categories"),
    db: AsyncSession = Depends(get_db),
):
    """
    List all categories.

    By default, only returns active categories.
    """
    categories, _ = await get_all_categories(
        db=db,
        active_only=active_only,
        skip=0,
        limit=1000  # Get all categories
    )
    return categories


@router.get("/{slug}", response_model=CategoryResponse)
@cache(expire=CACHE_POST_LIST_SECONDS, namespace="categories")
async def get_category_by_slug_endpoint(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Get category by slug.
    """
    category = await get_category_by_slug(db, slug)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    return category


@router.get("/tree", response_model=list[CategoryResponse])
@cache(expire=CACHE_POST_LIST_SECONDS, namespace="categories")
async def get_category_tree(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Get category tree structure (hierarchical).
    """
    return await get_tree_structure(db=db)


# ==================== ADMIN ENDPOINTS ====================


class ReorderRequest(BaseModel):
    """Request body for reordering categories"""
    items: list[dict]  # [{id: 1, order: 0}, {id: 2, order: 1}, ...]


@router.post("/reorder")
async def reorder_categories_endpoint(
    request: Request,
    reorder_data: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """Reorder categories by display_order (admin only)."""
    success = await reorder_categories_crud(db=db, items=reorder_data.items)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reorder categories"
        )

    logger.info(f"Admin {current_user.email} reordered {len(reorder_data.items)} categories")
    return {"message": "Categories reordered successfully"}


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category_endpoint(
    request: Request,
    category_in: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Create a new category (admin only).
    """
    category = await create_category(db=db, obj_in=category_in)

    # Re-fetch with eager loading to avoid MissingGreenlet error
    result = await db.execute(
        select(Category)
        .options(selectinload(Category.children))
        .where(Category.id == category.id)
    )
    category = result.scalar_one_or_none()

    logger.info(f"Admin {current_user.email} created category: {category.name}")
    return category


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category_endpoint(
    request: Request,
    category_id: int,
    category_in: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Update category (admin only).
    """
    category = await get_category_by_id(db, category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    updated_category = await update_category(db=db, db_obj=category, obj_in=category_in)
    logger.info(f"Admin {current_user.email} updated category {category_id}: {updated_category.name}")
    return updated_category


@router.delete("/{category_id}")
async def delete_category_endpoint(
    request: Request,
    category_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Delete category (admin only).
    """
    # Check if category has posts
    category_with_count = await get_with_post_count(db, category_id)

    if category_with_count and category_with_count.post_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete category with {category_with_count.post_count} posts. Move or delete posts first."
        )

    success = await delete_category(db=db, category_id=category_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    logger.info(f"Admin {current_user.email} deleted category {category_id}")
    return {"message": "Category deleted successfully"}
