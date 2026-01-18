from fastapi import APIRouter, Depends, Request, status, HTTPException
from fastapi_cache.decorator import cache
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import validate_csrf
from app.api.deps import get_current_active_user, require_min_rank
from app.core.constants import ADMIN_RANK, MODERATOR_RANK, CACHE_SETTINGS_SECONDS
from app.models.user import User
from app.schemas.settings_dashboard import SettingsResponse, SettingsUpdate
from app.crud.crud_settings import get_all_settings, update_settings
from loguru import logger

router = APIRouter()


@router.get("/", response_model=SettingsResponse)
@cache(expire=CACHE_SETTINGS_SECONDS, namespace="settings")
async def get_settings(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(MODERATOR_RANK)),
):
    """
    Lấy tất cả settings.
    Moderator+ có thể xem.
    """
    settings_dict = await get_all_settings(db)

    return SettingsResponse(**settings_dict)


@router.put("/", response_model=SettingsResponse)
async def update_system_settings(
    request: Request,
    settings_in: SettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Cập nhật settings hệ thống.
    Chỉ Admin có quyền cập nhật.
    """
    updated_settings = await update_settings(db, settings_in)

    logger.info(f"Admin {current_user.email} updated system settings")

    return SettingsResponse(**updated_settings)
