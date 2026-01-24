from datetime import datetime, timedelta
from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from fastapi_cache.decorator import cache

from app.core.database import get_db
from app.api.deps import require_min_rank
from app.core.constants import MODERATOR_RANK, CACHE_SETTINGS_SECONDS
from app.schemas.settings_dashboard import StatsOverview
from app.schemas.dashboard_stats import DashboardStatsResponse
from app.schemas.stats_details import StatsDetailsResponse
from app.models.user import User
from app.models.post import Post
from app.models.category import Category
from app.crud.crud_user import get_by_id

router = APIRouter()


@router.get("/overview", response_model=StatsOverview)
@cache(expire=CACHE_SETTINGS_SECONDS, namespace="stats")
async def get_stats_overview(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MODERATOR_RANK)),
):
    """
    Thống kê tổng quan hệ thống.
    Moderator+ có thể xem.
    """
    result = await db.execute(select(func.count()).select_from(User))
    total_users = result.scalar()

    result = await db.execute(
        select(func.count()).select_from(User).where(User.is_active == True)
    )
    active_users = result.scalar()

    inactive_users = total_users - active_users

    result = await db.execute(select(User.rank, func.count()).group_by(User.rank))
    rank_counts = result.all()
    by_rank = {rank: count for rank, count in rank_counts}

    # Eager load posts relationship to avoid MissingGreenlet error
    result = await db.execute(
        select(User)
        .options(selectinload(User.posts))
        .order_by(User.created_at.desc())
        .limit(5)
    )
    recent_users = result.scalars().all()

    return StatsOverview(
        total_users=total_users,
        active_users=active_users,
        inactive_users=inactive_users,
        by_rank=by_rank,
        recent_users=list(recent_users),
    )


@router.get("/dashboard", response_model=DashboardStatsResponse)
@cache(expire=300, namespace="dashboard_stats")  # 5 minutes cache
async def get_dashboard_stats(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MODERATOR_RANK)),
):
    """
    Thống kê dashboard cho Moderator+.
    Bao gồm thống kê bài viết và người dùng với xu hướng thay đổi.
    """
    # Get total posts
    result = await db.execute(select(func.count()).select_from(Post))
    total_posts = result.scalar() or 0

    # Get published posts
    result = await db.execute(
        select(func.count()).select_from(Post).where(Post.status == "published")
    )
    published_posts = result.scalar() or 0

    # Get draft posts
    result = await db.execute(
        select(func.count()).select_from(Post).where(Post.status == "draft")
    )
    draft_posts = result.scalar() or 0

    # Get archived posts
    result = await db.execute(
        select(func.count()).select_from(Post).where(Post.status == "archived")
    )
    archived_posts = result.scalar() or 0

    # Get total users
    result = await db.execute(select(func.count()).select_from(User))
    total_users = result.scalar() or 0

    # Calculate trends - compare with last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)

    # Posts created in last 30 days
    result = await db.execute(
        select(func.count()).select_from(Post).where(
            and_(Post.created_at >= thirty_days_ago, Post.created_at < datetime.utcnow())
        )
    )
    recent_posts = result.scalar() or 0

    # Posts created in previous 30 days (30-60 days ago)
    sixty_days_ago = datetime.utcnow() - timedelta(days=60)
    result = await db.execute(
        select(func.count()).select_from(Post).where(
            and_(Post.created_at >= sixty_days_ago, Post.created_at < thirty_days_ago)
        )
    )
    previous_posts = result.scalar() or 0

    # Calculate percentage change
    posts_change_percent = 0.0
    if previous_posts > 0:
        posts_change_percent = round(((recent_posts - previous_posts) / previous_posts) * 100, 1)
    elif recent_posts > 0:
        posts_change_percent = 100.0

    # Users created in last 30 days
    result = await db.execute(
        select(func.count()).select_from(User).where(
            and_(User.created_at >= thirty_days_ago, User.created_at < datetime.utcnow())
        )
    )
    recent_users = result.scalar() or 0

    # Users created in previous 30 days (30-60 days ago)
    result = await db.execute(
        select(func.count()).select_from(User).where(
            and_(User.created_at >= sixty_days_ago, User.created_at < thirty_days_ago)
        )
    )
    previous_users = result.scalar() or 0

    # Calculate percentage change
    users_change_percent = 0.0
    if previous_users > 0:
        users_change_percent = round(((recent_users - previous_users) / previous_users) * 100, 1)
    elif recent_users > 0:
        users_change_percent = 100.0

    return DashboardStatsResponse(
        total_posts=total_posts,
        published_posts=published_posts,
        draft_posts=draft_posts,
        archived_posts=archived_posts,
        total_users=total_users,
        posts_change_percent=posts_change_percent,
        users_change_percent=users_change_percent,
    )


@router.get("/details", response_model=StatsDetailsResponse)
@cache(expire=300, namespace="stats_details")
async def get_stats_details(
    request: Request,
    range: str = "30d",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MODERATOR_RANK)),
):
    """
    Chi tiết thống kê cho trang /dashboard/stats.
    Hỗ trợ các range: 7d, 30d, 90d, all
    """
    # Calculate date range
    now = datetime.utcnow()
    if range == "7d":
        start_date = now - timedelta(days=7)
    elif range == "30d":
        start_date = now - timedelta(days=30)
    elif range == "90d":
        start_date = now - timedelta(days=90)
    else:  # all
        start_date = None

    # 1. Posts over time - grouped by day
    posts_over_time = []
    if start_date:
        # Get posts per day within range
        result = await db.execute(
            select(
                func.date(Post.created_at).label("date"),
                func.count().label("count")
            )
            .where(Post.created_at >= start_date)
            .group_by(func.date(Post.created_at))
            .order_by(func.date(Post.created_at))
        )
        time_data = result.all()

        # Fill in missing dates with 0
        current = start_date.date()
        data_dict = {row.date: row.count for row in time_data}

        while current <= now.date():
            posts_over_time.append({
                "date": current.isoformat(),
                "count": data_dict.get(current, 0)
            })
            current += timedelta(days=1)
    else:
        # For "all" range, group by month to avoid too many data points
        result = await db.execute(
            select(
                func.strftime("%Y-%m", Post.created_at).label("month"),
                func.count().label("count")
            )
            .group_by(func.strftime("%Y-%m", Post.created_at))
            .order_by(func.strftime("%Y-%m", Post.created_at))
        )
        time_data = result.all()
        posts_over_time = [
            {"date": row.month, "count": row.count}
            for row in time_data
        ]

    # 2. Posts by status
    result = await db.execute(
        select(Post.status, func.count().label("count"))
        .group_by(Post.status)
    )
    status_data = result.all()
    posts_by_status = [
        {"status": row.status, "count": row.count}
        for row in status_data
    ]

    # 3. Top categories
    result = await db.execute(
        select(
            Category.id,
            Category.name,
            Category.slug,
            func.count(Post.id).label("count")
        )
        .outerjoin(Post, Post.category_id == Category.id)
        .group_by(Category.id, Category.name, Category.slug)
        .order_by(func.count(Post.id).desc())
        .limit(10)
    )
    category_data = result.all()
    top_categories = [
        {
            "id": row.id,
            "name": row.name,
            "slug": row.slug,
            "count": row.count or 0
        }
        for row in category_data
    ]

    # 4. Top authors
    result = await db.execute(
        select(
            User.id,
            User.username,
            User.full_name,
            User.avatar_url,
            func.count(Post.id).label("count")
        )
        .outerjoin(Post, Post.author_id == User.id)
        .group_by(User.id, User.username, User.full_name, User.avatar_url)
        .order_by(func.count(Post.id).desc())
        .limit(10)
    )
    author_data = result.all()
    top_authors = [
        {
            "id": row.id,
            "username": row.username,
            "full_name": row.full_name,
            "avatar": row.avatar_url,
            "count": row.count or 0
        }
        for row in author_data
    ]

    return StatsDetailsResponse(
        posts_over_time=posts_over_time,
        posts_by_status=posts_by_status,
        top_categories=top_categories,
        top_authors=top_authors,
    )
