from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi_pagination import Page, paginate
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_min_rank
from app.core.security import validate_csrf
from app.core.constants import (
    ADMIN_RANK,
    MODERATOR_RANK,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    CACHE_POST_LIST_SECONDS,
)
from app.models.user import User
from app.schemas.tag import TagCreate, TagUpdate, TagResponse
from app.crud import (
    get_tag_by_id,
    get_tag_by_slug,
    get_all_tags,
    create_tag,
    update_tag,
    delete_tag,
    get_trending_tags,
)
from loguru import logger

router = APIRouter()


# ==================== PUBLIC ENDPOINTS ====================


@router.get("/", response_model=list[TagResponse])
@cache(expire=CACHE_POST_LIST_SECONDS, namespace="tags")
async def list_tags(
    request: Request,
    page: int = Query(1, ge=1, description="Page number (starts from 1)"),
    size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Page size"),
    db: AsyncSession = Depends(get_db),
):
    """
    List all tags with pagination.
    """
    tags, _ = await get_all_tags(
        db=db,
        skip=(page - 1) * size,
        limit=size
    )
    return tags


@router.get("/{slug}", response_model=TagResponse)
@cache(expire=CACHE_POST_LIST_SECONDS, namespace="tags")
async def get_tag_by_slug_endpoint(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Get tag by slug.
    """
    tag = await get_tag_by_slug(db, slug)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    return tag


@router.get("/trending", response_model=list[TagResponse])
@cache(expire=CACHE_POST_LIST_SECONDS, namespace="tags")
async def get_trending_tags_endpoint(
    request: Request,
    limit: int = Query(10, ge=1, le=50, description="Number of trending tags to return"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get most used tags (trending).

    Returns the top N tags based on usage count.
    """
    return await get_trending_tags(db=db, limit=limit)


# ==================== ADMIN ENDPOINTS ====================


@router.post("/", response_model=TagResponse)
async def create_tag_endpoint(
    request: Request,
    tag_in: TagCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Create a new tag (admin only).
    """
    tag = await create_tag(db=db, obj_in=tag_in)
    logger.info(f"Admin {current_user.email} created tag: {tag.name}")
    return tag


@router.patch("/{tag_id}", response_model=TagResponse)
async def update_tag_endpoint(
    request: Request,
    tag_id: int,
    tag_in: TagUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Update tag (admin only).
    """
    tag = await get_tag_by_id(db, tag_id)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    updated_tag = await update_tag(db=db, db_obj=tag, obj_in=tag_in)
    logger.info(f"Admin {current_user.email} updated tag {tag_id}: {updated_tag.name}")
    return updated_tag


@router.delete("/{tag_id}")
async def delete_tag_endpoint(
    request: Request,
    tag_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Delete tag (admin only).
    """
    success = await delete_tag(db=db, tag_id=tag_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    logger.info(f"Admin {current_user.email} deleted tag {tag_id}")
    return {"message": "Tag deleted successfully"}
