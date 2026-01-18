from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi_cache import FastAPICache

from app.models.settings import Setting
from app.schemas.settings_dashboard import SettingsUpdate


async def get_all_settings(db: AsyncSession) -> Dict[str, Any]:
    """
    Lấy tất cả settings từ database và trả về dạng dict.
    """
    result = await db.execute(select(Setting))
    settings = result.scalars().all()

    return {setting.key: setting.value for setting in settings}


async def update_settings(
    db: AsyncSession, settings_in: SettingsUpdate
) -> Dict[str, Any]:
    """
    Cập nhật settings từ input và trả về dict mới.
    Chỉ update các field có giá trị (không None).
    """
    update_data = settings_in.model_dump(exclude_unset=True, exclude_none=True)

    for key, value in update_data.items():
        result = await db.execute(select(Setting).where(Setting.key == key))
        setting = result.scalar_one_or_none()

        if setting:
            setting.value = str(value)
        else:
            new_setting = Setting(key=key, value=str(value))
            db.add(new_setting)

    await db.flush()
    await FastAPICache.clear(namespace="settings")

    return await get_all_settings(db)
