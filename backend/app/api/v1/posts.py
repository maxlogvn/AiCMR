from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi_pagination import Page, paginate
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
    CACHE_POST_DETAIL_SECONDS,
    PostStatus,
)
from app.models.user import User
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate, PostQuery, PostResponse, PostBulkAction
from app.crud import (
    get_post_by_id,
    get_post_by_slug,
    get_all_posts,
    create_post,
    update_post,
    delete_post,
    increment_post_view_count,
    get_user_posts,
    get_post_stats,
    set_metadata,
    get_all_metadata,
    update_metadata,
    delete_metadata,
)
from app.services.post_storage import PostStorageService
from loguru import logger

router = APIRouter()


# ==================== PUBLIC ENDPOINTS ====================


@router.get("/", response_model=Page[PostResponse])
@cache(expire=CACHE_POST_LIST_SECONDS, namespace="posts")
async def list_posts(
    request: Request,
    status: str = Query("published", description="Filter by status (draft, published, archived)"),
    category_id: int | None = Query(None, description="Filter by category ID"),
    tag_ids: list[int] | None = Query(None, description="Filter by tag IDs"),
    search: str | None = Query(None, description="Search in title and excerpt"),
    author_id: int | None = Query(None, description="Filter by author ID"),
    date_from: str | None = Query(None, description="Filter posts from this date"),
    date_to: str | None = Query(None, description="Filter posts until this date"),
    page: int = Query(1, ge=1, description="Page number (starts from 1)"),
    size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Page size"),
    db: AsyncSession = Depends(get_db),
):
    """
    List published posts with pagination and filters.

    Default: lists only published posts.
    Max page size: 100.
    Cached for 5 minutes.
    """
    # Build filter object
    filters = PostQuery(
        status=status,
        category_id=category_id,
        tag_ids=tag_ids,
        search=search,
        author_id=author_id,
        date_from=date_from,
        date_to=date_to,
    )

    # Get posts with filters
    posts, total = await get_all_posts(
        db=db,
        skip=(page - 1) * size,
        limit=size,
        filters=filters
    )

    # Get overall stats for the dashboard
    stats = await get_post_stats(db)

    # Manually build pagination response
    return {
        "items": posts,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size if size > 0 else 0,
        "stats": stats
    }



# ==================== AUTHENTICATED USER ENDPOINTS ====================


@router.post("/me", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post_endpoint(
    request: Request,
    post_in: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MEMBER_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Create a new post.

    Requires authentication with MEMBER_RANK or higher.
    Requires valid CSRF token.
    """
    # Create post
    post = await create_post(
        db=db,
        obj_in=post_in,
        user_id=int(current_user.id)  # type: ignore[arg-type]
    )

    # Re-fetch with eager loading to avoid MissingGreenlet error
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.tags))
        .where(Post.id == post.id)
    )
    post = result.scalar_one_or_none()

    logger.info(f"User {current_user.email} created post: {post.title}")
    return post


@router.get("/me", response_model=Page[PostResponse])
async def list_my_posts(
    request: Request,
    status: str | None = Query(None, description="Filter by status (draft, published, archived)"),
    page: int = Query(1, ge=1, description="Page number (starts from 1)"),
    size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Page size"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    List current user's posts with pagination.

    Filter by status (draft, published, archived) optionally.
    """
    posts, total = await get_user_posts(
        db=db,
        user_id=int(current_user.id),  # type: ignore[arg-type]
        skip=(page - 1) * size,
        limit=size,
        status=status
    )

    # Manually build pagination response
    return {
        "items": posts,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size if size > 0 else 0
    }


@router.get("/me/{post_id}", response_model=PostResponse)
async def get_my_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get one of current user's posts by ID.

    Users can only view their own posts.
    """
    post = await get_post_by_id(db, post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check ownership
    if post.author_id != current_user.id and current_user.rank < MODERATOR_RANK:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to view this post"
        )

    return post


@router.patch("/me/{post_id}", response_model=PostResponse)
async def update_my_post(
    request: Request,
    post_id: int,
    post_in: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Update current user's post.

    Users can only update their own posts.
    Requires valid CSRF token.
    """
    post = await get_post_by_id(db, post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check ownership
    if post.author_id != current_user.id and current_user.rank < MODERATOR_RANK:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this post"
        )

    # Update post
    updated_post = await update_post(
        db=db,
        db_obj=post,
        obj_in=post_in
    )

    logger.info(f"User {current_user.email} updated post {post_id}: {updated_post.title}")
    return updated_post


@router.delete("/me/{post_id}")
async def delete_my_post(
    request: Request,
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Delete current user's post.

    Users can only delete their own posts.
    Requires valid CSRF token.
    """
    post = await get_post_by_id(db, post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check ownership
    if post.author_id != current_user.id and current_user.rank < MODERATOR_RANK:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this post"
        )

    # Delete post
    success = await delete_post(
        db=db,
        post_id=post_id
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    logger.info(f"User {current_user.email} deleted post {post_id}: {post.title}")
    return {"message": "Post deleted successfully"}


@router.patch("/me/{post_id}/status")
async def change_post_status(
    request: Request,
    post_id: int,
    new_status: str = Query(..., description="New status: draft, published, or archived"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Change post status.

    Valid statuses: draft, published, archived.
    Sets published_at when changing to 'published'.
    Requires valid CSRF token.
    """
    post = await get_post_by_id(db, post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check ownership
    if post.author_id != current_user.id and current_user.rank < MODERATOR_RANK:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to change status of this post"
        )

    # Validate status
    if new_status not in ["draft", "published", "archived"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Must be one of: draft, published, archived"
        )

    # Update status
    post.status = new_status 
    if new_status == "published" and post.published_at is None:
        from datetime import datetime, timezone
        post.published_at = datetime.now(timezone.utc) 

    await db.flush()
    await db.refresh(post)

    await FastAPICache.clear(namespace="post")

    logger.info(f"User {current_user.email} changed post {post_id} status to {new_status}")
    return {"message": f"Post status changed to {new_status}", "status": new_status}


# ==================== ADMIN/MODERATOR ENDPOINTS ====================


@router.get("/all", response_model=Page[PostResponse])
async def list_all_posts_admin(
    request: Request,
    status: str | None = Query(None, description="Filter by status (draft, published, archived)"),
    category_id: int | None = Query(None, description="Filter by category ID"),
    author_id: int | None = Query(None, description="Filter by author ID"),
    search: str | None = Query(None, description="Search in title and excerpt"),
    page: int = Query(1, ge=1, description="Page number (starts from 1)"),
    size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Page size"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MODERATOR_RANK)),
):
    """
    List all posts with any status (admin/moderator only).

    Can filter by status, category, author.
    Moderators can see all posts but only modify is_active.
    """
    # Build filter object
    filters = PostQuery(
        status=status,
        category_id=category_id,
        author_id=author_id,
        search=search,
    )

    # Get posts with filters
    posts, total = await get_all_posts(
        db=db,
        skip=(page - 1) * size,
        limit=size,
        filters=filters
    )

    # Get overall stats for the dashboard
    stats = await get_post_stats(db)

    # Manually build pagination response
    return {
        "items": posts,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size if size > 0 else 0,
        "stats": stats
    }


@router.patch("/{post_id}", response_model=PostResponse)
async def update_any_post(
    request: Request,
    post_id: int,
    post_in: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MODERATOR_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Update any post (admin/moderator only).

    Admins can update any field.
    Moderators can only update is_active.
    Requires valid CSRF token.
    """
    post = await get_post_by_id(db, post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Moderator restrictions
    if current_user.rank == MODERATOR_RANK:
        updating_fields = post_in.model_fields_set

        if not updating_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields provided for update"
            )

        # Allow if ONLY status field is being updated
        if updating_fields == {"status"}:
            pass  # Allowed
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Moderators can only update post status. Attempted to update: {', '.join(updating_fields)}"
            )

    updated_post = await update_post(
        db=db,
        db_obj=post,
        obj_in=post_in
    )

    logger.info(f"Admin/Mod {current_user.email} updated post {post_id}: {updated_post.title}")
    return updated_post


@router.delete("/{post_id}")
async def delete_any_post(
    request: Request,
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Delete any post (admin only).

    Admins can delete any post.
    Requires valid CSRF token.
    """
    post = await get_post_by_id(db, post_id)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Delete post
    success = await delete_post(
        db=db,
        post_id=post_id
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    logger.info(f"Admin {current_user.email} deleted post {post_id}: {post.title}")
    return {"message": "Post deleted successfully"}


@router.post("/bulk/publish")
async def bulk_publish_posts(
    request: Request,
    action: PostBulkAction,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MODERATOR_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Bulk publish multiple posts (admin/moderator only).

    Changes status to 'published' and sets published_at.
    Requires valid CSRF token.
    """
    if not action.post_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No post IDs provided"
        )

    from datetime import datetime, timezone

    updated_posts = []
    for post_id in action.post_ids:
        post = await get_post_by_id(db, post_id)
        if post:
            post.status = "published" 
            if post.published_at is None:
                post.published_at = datetime.now(timezone.utc) 
            updated_posts.append(post_id)

    await db.flush()
    await FastAPICache.clear(namespace="post")

    logger.info(f"Admin/Mod {current_user.email} bulk published {len(updated_posts)} posts")
    return {
        "message": f"Successfully published {len(updated_posts)} posts",
        "updated_count": len(updated_posts),
        "post_ids": updated_posts
    }


@router.post("/bulk/archive")
async def bulk_archive_posts(
    request: Request,
    action: PostBulkAction,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MODERATOR_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Bulk archive multiple posts (admin/moderator only).

    Changes status to 'archived'.
    Requires valid CSRF token.
    """
    if not action.post_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No post IDs provided"
        )

    updated_posts = []
    for post_id in action.post_ids:
        post = await get_post_by_id(db, post_id)
        if post:
            post.status = "archived" 
            updated_posts.append(post_id)

    await db.flush()
    await FastAPICache.clear(namespace="post")

    logger.info(f"Admin/Mod {current_user.email} bulk archived {len(updated_posts)} posts")
    return {
        "message": f"Successfully archived {len(updated_posts)} posts",
        "updated_count": len(updated_posts),
        "post_ids": updated_posts
    }


@router.post("/bulk/delete")
async def bulk_delete_posts(
    request: Request,
    action: PostBulkAction,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Bulk delete multiple posts (admin only).

    Requires valid CSRF token.
    """
    if not action.post_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No post IDs provided"
        )

    deleted_posts = []
    for post_id in action.post_ids:
        success = await delete_post(
            db=db,
            post_id=post_id
        )
        if success:
            deleted_posts.append(post_id)

    await FastAPICache.clear(namespace="post")

    logger.info(f"Admin {current_user.email} bulk deleted {len(deleted_posts)} posts")
    return {
        "message": f"Successfully deleted {len(deleted_posts)} posts",
        "deleted_count": len(deleted_posts),
        "post_ids": deleted_posts
    }


# ==================== METADATA ENDPOINTS ====================


@router.get("/{post_id}/metadata")
async def get_post_metadata(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get all metadata for a post.

    Users can view metadata of their own posts.
    Admins/Mods can view metadata of any post.
    """
    # Get post to check permissions
    post = await get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check permissions
    if post.author_id != current_user.id and current_user.rank < MODERATOR_RANK:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to view metadata"
        )

    # Get all metadata
    metadata_list = await get_all_metadata(db, int(post_id))  # type: ignore[arg-type]
    return {
        "post_id": post_id,
        "metadata": [{"key": m.key, "value": m.value} for m in metadata_list],
        "count": len(metadata_list)
    }


@router.patch("/{post_id}/metadata")
async def update_post_metadata(
    request: Request,
    post_id: int,
    metadata: dict[str, str],  # Key-value pairs
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Update multiple metadata for a post.

    Creates new metadata or updates existing ones.
    Users can update metadata of their own posts.
    Requires valid CSRF token.
    """
    # Get post to check permissions
    post = await get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check permissions
    if post.author_id != current_user.id and current_user.rank < MODERATOR_RANK:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update metadata"
        )

    # Validate metadata size
    if len(metadata) > 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many metadata items. Maximum 20 allowed."
        )

    # Validate key lengths
    for key, value in metadata.items():
        if len(key) > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Key '{key}' is too long. Maximum 100 characters."
            )
        if len(value) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Value for key '{key}' is too long. Maximum 1000 characters."
            )

    # Update metadata
    updated_metadata = []
    for key, value in metadata.items():
        updated = await set_metadata(db, post_id, key, value)
        updated_metadata.append({"key": updated.key, "value": updated.value})

    await db.flush()

    logger.info(f"User {current_user.email} updated metadata for post {post_id}")
    return {
        "message": "Metadata updated successfully",
        "updated_count": len(updated_metadata),
        "metadata": updated_metadata
    }


@router.delete("/{post_id}/metadata/{key}")
async def delete_post_metadata_key(
    request: Request,
    post_id: int,
    key: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Delete a specific metadata key for a post.

    Users can delete metadata of their own posts.
    Requires valid CSRF token.
    """
    # Get post to check permissions
    post = await get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check permissions
    if post.author_id != current_user.id and current_user.rank < MODERATOR_RANK:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete metadata"
        )

    # Delete metadata
    success = await delete_metadata(db, post_id, key)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Metadata key not found"
        )

    await db.flush()

    logger.info(f"User {current_user.email} deleted metadata '{key}' for post {post_id}")
    return {"message": "Metadata deleted successfully"}


# ==================== RAG EXPORT ENDPOINTS ====================


@router.get("/export")
@cache(expire=CACHE_POST_LIST_SECONDS, namespace="posts")
async def export_posts_for_rag(
    request: Request,
    post_ids: list[int] = Query(..., description="List of post IDs to export"),
    format: str = Query("markdown", enum=["markdown", "json"], description="Export format"),
    include_metadata: bool = Query(True, description="Include metadata in export"),
    chunk_size: int = Query(500, description="Character count per chunk (for JSON format)"),
    chunk_overlap: int = Query(50, description="Character count overlap (for JSON format)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
):
    """
    Export posts for RAG pipeline.

    Each chunk will have:
    - content: Chunk content
    - metadata: {
        post_id: 123,
        chunk_id: 1,
        title: "Post Title",
        slug: "post-slug",
        author: "username",
        category: "technology",
        tags: ["AI", "Python"],
        publish_date: "2026-01-22",
        language: "vi",
        difficulty: "intermediate",
        ...
      }
    """
    posts_data = []
    
    # Load posts
    for post_id in post_ids:
        post = await get_post_by_id(db, post_id)
        if not post:
            continue
            
        # Get content from storage
        try:
            content = await PostStorageService.read_post_content(post_id, str(post.slug))  # type: ignore[arg-type]
        except Exception as e:
            logger.error(f"Failed to read content for post {post_id}: {e}")
            continue
        
        # Get metadata
        metadata_list = await get_all_metadata(db, int(post_id))  # type: ignore[arg-type]
        metadata_dict = {m.key: m.value for m in metadata_list}
        
        posts_data.append({
            "post": post,
            "content": content,
            "metadata": metadata_dict if include_metadata else None,
        })
    
    if format == "json":
        # Return JSON with chunks
        from typing import Any
        import re
        
        chunks = []
        
        for post_data in posts_data:
            post = post_data["post"]
            content = post_data["content"]
            metadata = post_data["metadata"] or {}
            
            # Split text into chunks
            text_chunks = []
            for i in range(0, len(content), chunk_size - chunk_overlap):
                chunk = content[i:i + chunk_size]
                if not chunk.strip():
                    continue
                text_chunks.append({
                    "index": len(chunks) + len(text_chunks) + 1,
                    "content": chunk,
                })
            
            # Create chunk entries with metadata
            for chunk_info in text_chunks:
                chunk_entry = {
                    "content": chunk_info["content"],
                    "metadata": {
                        "post_id": post.id,
                        "chunk_id": chunk_info["index"],
                        "title": post.title,
                        "slug": post.slug,
                        "author": post.author.username if post.author else None,
                        "category": post.category.name if post.category else None,
                        "category_id": post.category_id,
                        "tags": [tag.name for tag in post.tags] if post.tags else [],
                        "tag_ids": [tag.id for tag in post.tags] if post.tags else [],
                        "publish_date": post.published_at.isoformat() if post.published_at else None,
                        "created_date": post.created_at.isoformat() if post.created_at else None,
                        "updated_date": post.updated_at.isoformat() if post.updated_at else None,
                        "view_count": post.view_count,
                        "like_count": post.like_count,
                        "comment_count": post.comment_count,
                        "status": post.status,
                        "is_featured": post.is_featured,
                        "is_pinned": post.is_pinned,
                        "excerpt": post.excerpt,
                        "seo_title": post.seo_title,
                        "seo_description": post.seo_description,
                        "seo_keywords": post.seo_keywords,
                        **metadata,
                    },
                }
                chunks.append(chunk_entry)
        
        return {
            "format": "json",
            "total_posts": len(posts_data),
            "total_chunks": len(chunks),
            "chunks": chunks,
            "chunk_size": chunk_size,
            "chunk_overlap": chunk_overlap,
        }
    else:
        # Return markdown files as zip
        import io
        import zipfile
        from fastapi.responses import StreamingResponse
        
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for post_data in posts_data:
                post = post_data["post"]
                content = post_data["content"]
                
                # Create markdown filename
                filename = f"{post.id}_{post.slug}.md"
                zip_file.writestr(filename, content)
        
        zip_buffer.seek(0)
        
        # Return as streaming response
        return StreamingResponse(
            io.BytesIO(zip_buffer.getvalue()),
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename=posts_export.zip"
            }
        )


@router.get("/{slug}", response_model=PostResponse)
async def get_post_by_slug_endpoint(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Get post detail by slug.

    Increments view count.
    Not cached to ensure view count is accurate.
    """
    # Get post
    post = await get_post_by_slug(db, slug)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Increment view count
    try:
        await increment_post_view_count(db, int(post.id))  # type: ignore[arg-type]
    except Exception as e:
        logger.warning(f"Failed to increment view count for post {post.id}: {e}")

    return post


@router.get("/{slug}/raw")
async def get_post_raw_content(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Get raw markdown content of a post.

    Returns markdown file content as plain text.
    Useful for preview or download.
    """
    # Get post
    post = await get_post_by_slug(db, slug)

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Read markdown content
    content = post.content

    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post content not found"
        )

    return {"content": content, "post_id": post.id, "slug": post.slug}

@router.get("/{slug}/rag-ready")
@cache(expire=CACHE_POST_DETAIL_SECONDS, namespace="posts")
async def get_post_for_rag(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Get post data ready for RAG indexing.
    Includes content and all metadata.
    """
    post = await get_post_by_slug(db, slug)
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Get content from storage
    try:
        content = await PostStorageService.read_post_content(int(post.id), str(post.slug))  # type: ignore[arg-type]
    except Exception as e:
        logger.error(f"Failed to read content for post {slug}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to read post content"
        )
    
    # Get metadata
    metadata_list = await get_all_metadata(db, int(post.id))  # type: ignore[arg-type]
    metadata_dict = {m.key: m.value for m in metadata_list}
    
    return {
        "post": {
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "author": post.author.username if post.author else None,
            "author_id": post.author_id,
            "category": post.category.name if post.category else None,
            "category_id": post.category_id,
            "tags": [tag.name for tag in post.tags] if post.tags else [],
            "tag_ids": [tag.id for tag in post.tags] if post.tags else [],
            "excerpt": post.excerpt,
            "status": post.status,
            "is_featured": post.is_featured,
            "is_pinned": post.is_pinned,
            "view_count": post.view_count,
            "like_count": post.like_count,
            "comment_count": post.comment_count,
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "updated_at": post.updated_at.isoformat() if post.updated_at else None,
            "published_at": post.published_at.isoformat() if post.published_at else None,
            "seo_title": post.seo_title,
            "seo_description": post.seo_description,
            "seo_keywords": post.seo_keywords,
        },
        "content": content,
        "metadata": metadata_dict,
    }

