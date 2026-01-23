from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from fastapi_cache.decorator import cache

from app.core.database import get_db
from app.api.deps import require_min_rank
from app.core.constants import MODERATOR_RANK, CACHE_SETTINGS_SECONDS
from app.schemas.settings_dashboard import StatsOverview
from app.models.user import User
from app.models.post import Post
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
