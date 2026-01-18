from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.core.database import get_db
from app.core.config import get_settings
from app.schemas.settings import InstallSetupRequest, InstallStatusResponse
from app.schemas.user import UserCreate
from app.models.user import User
from app.models.settings import Setting
from app.crud import create, get_by_email
from loguru import logger

router = APIRouter()
settings = get_settings()


@router.get("/status", response_model=InstallStatusResponse)
@cache(expire=60, namespace="get_install_status")
async def get_install_status(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Kiểm tra trạng thái cài đặt hệ thống.
    Cached for 60 seconds to reduce DB load.
    """
    try:
        result = await db.execute(select(Setting).where(Setting.key == "is_installed"))
        setting = result.scalar_one_or_none()

        is_installed = setting is not None and setting.value == "true"

        return InstallStatusResponse(
            installed=is_installed, step="setup_done" if is_installed else "ready"
        )
    except Exception as e:
        logger.error(f"Lỗi khi kiểm tra trạng thái cài đặt: {e}")
        # Nếu lỗi (vd chưa có table), coi như chưa cài đặt
        return InstallStatusResponse(installed=False, step="ready")


@router.post("/setup", status_code=status.HTTP_201_CREATED)
async def setup_install(data: InstallSetupRequest, db: AsyncSession = Depends(get_db)):
    """
    Cài đặt ban đầu cho hệ thống.
    - Tạo tài khoản Admin đầu tiên.
    - Lưu cấu hình hệ thống.
    """

    # 1. Kiểm tra INSTALL_SECRET
    if data.install_secret != settings.INSTALL_SECRET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Mã cài đặt không hợp lệ."
        )

    # 2. Kiểm tra trạng thái cài đặt (Chặn reinstall)
    result = await db.execute(select(Setting).where(Setting.key == "is_installed"))
    setting = result.scalar_one_or_none()

    if setting and setting.value == "true":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hệ thống đã được cài đặt. Không thể cài đặt lại.",
        )

    # 3. Kiểm tra đã có user nào chưa (Chặn install nếu đã có admin)
    result = await db.execute(select(User).limit(1))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hệ thống đã có người dùng. Không thể cài đặt lại.",
        )

    # 4. Thực hiện Transaction tạo dữ liệu
    try:
        async with db.begin_nested():
            # Tạo User Admin
            user_data = UserCreate(
                email=data.email,
                username=data.username,
                password=data.password,
                rank=5,  # Admin
            )
            admin_user = await create(db, user_data)

            # Lưu cấu hình hệ thống
            settings_to_save = [
                Setting(key="is_installed", value="true"),
                Setting(key="site_name", value=data.site_name),
            ]

            if data.logo_url:
                settings_to_save.append(Setting(key="logo_url", value=data.logo_url))

            db.add_all(settings_to_save)
            await db.flush()

            # Explicitly commit the transaction before returning response
            await db.commit()

            # Clear cache for status endpoint
            await FastAPICache.clear(namespace="get_install_status")

            logger.info(f"Hệ thống đã được cài đặt bởi Admin: {admin_user.email}")

    except Exception as e:
        logger.error(f"Lỗi cài đặt: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cài đặt thất bại. Vui lòng thử lại.",
        )

    return {
        "message": "Cài đặt thành công. Vui lòng đăng nhập.",
        "admin_email": admin_user.email,
    }
