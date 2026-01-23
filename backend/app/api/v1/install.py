from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import ProgrammingError
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

from app.core.database import get_db, init_db
from app.core.config import get_settings
from app.schemas.settings import InstallSetupRequest, InstallStatusResponse
from app.schemas.user import UserCreate
from app.models.user import User
from app.models.settings import Setting
from app.crud import create
from loguru import logger

router = APIRouter()
settings = get_settings()


@router.get("/status", response_model=InstallStatusResponse)
@cache(expire=60, namespace="get_install_status")
async def get_install_status(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Kiểm tra trạng thái cài đặt hệ thống.
    Cached for 60 seconds to reduce DB load.
    Tự động migrate database nếu chưa có tables.
    """
    try:
        result = await db.execute(select(Setting).where(Setting.key == "is_installed"))
        setting = result.scalar_one_or_none()

        # Explicit bool conversion for type safety
        is_installed: bool = bool(setting and setting.value == "true")

        return InstallStatusResponse(
            installed=is_installed, step="setup_done" if is_installed else "ready"
        )
    except ProgrammingError as e:
        # Nếu table không tồn tại (lỗi 1146), tự động migrate
        if e.orig and hasattr(e.orig, 'args') and e.orig.args[0] == 1146:
            logger.warning(f"Database tables chưa tồn tại. Đang tự động tạo... ({e})")
            try:
                await init_db()
                logger.info("Đã tạo database tables thành công. Thử lại query...")
                # Retry query sau khi migrate
                result = await db.execute(select(Setting).where(Setting.key == "is_installed"))
                setting = result.scalar_one_or_none()

                is_installed: bool = bool(setting and setting.value == "true")

                return InstallStatusResponse(
                    installed=is_installed, step="setup_done" if is_installed else "ready"
                )
            except Exception as migrate_error:
                logger.error(f"Lỗi khi tự động migrate database: {migrate_error}")
                return InstallStatusResponse(installed=False, step="ready")
        else:
            raise
    except Exception as e:
        logger.error(f"Lỗi khi kiểm tra trạng thái cài đặt: {e}")
        # Nếu lỗi khác, coi như chưa cài đặt
        return InstallStatusResponse(installed=False, step="ready")


@router.post("/setup", status_code=status.HTTP_201_CREATED)
async def setup_install(data: InstallSetupRequest, db: AsyncSession = Depends(get_db)):
    """
    Cài đặt ban đầu cho hệ thống.
    - Tự động migrate database nếu cần.
    - Tạo tài khoản Admin đầu tiên.
    - Lưu cấu hình hệ thống.
    """

    # 0. Tự động migrate database nếu chưa có tables
    try:
        result = await db.execute(select(Setting).where(Setting.key == "is_installed"))
        result.scalar_one_or_none()
    except ProgrammingError as e:
        if e.orig and hasattr(e.orig, 'args') and e.orig.args[0] == 1146:
            logger.warning(f"Database tables chưa tồn tại. Đang tự động tạo... ({e})")
            await init_db()
            logger.info("Đã tạo database tables thành công.")
        else:
            raise

    # 1. Kiểm tra INSTALL_SECRET
    if data.install_secret != settings.INSTALL_SECRET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Mã cài đặt không hợp lệ."
        )

    # 2. Thực hiện Transaction tạo dữ liệu
    try:
        async with db.begin():
            # 2.1. Kiểm tra lại trạng thái cài đặt với lock để tránh race condition
            result = await db.execute(
                select(Setting).where(Setting.key == "is_installed")
                .with_for_update()
            )
            setting = result.scalar_one_or_none()

            if setting and setting.value == "true":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Hệ thống đã được cài đặt. Không thể cài đặt lại.",
                )

            # 2.2. Kiểm tra đã có user nào chưa (Chặn install nếu đã có admin)
            result = await db.execute(select(User).limit(1))
            existing_user = result.scalar_one_or_none()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Hệ thống đã có người dùng. Không thể cài đặt lại.",
                )
            # Tạo User Admin
            user_data = UserCreate(
                email=data.email,
                username=data.username,
                password=data.password,
                rank=5,  # Admin
            )
            admin_user = await create(db, user_data)

            # Lưu cấu hình hệ thống với các giá trị mặc định
            settings_to_save = [
                Setting(key="is_installed", value="true"),
                Setting(key="site_name", value=data.site_name),
                Setting(key="logo_url", value=data.logo_url or ""),
                Setting(key="favicon_url", value=""),
                Setting(key="seo_title", value=""),
                Setting(key="seo_description", value=""),
                Setting(key="seo_keywords", value=""),
                Setting(key="og_title", value=""),
                Setting(key="og_description", value=""),
                Setting(key="og_image", value=""),
                Setting(key="og_type", value="website"),
                Setting(key="og_url", value=""),
                Setting(key="twitter_card", value="summary"),
                Setting(key="twitter_title", value=""),
                Setting(key="twitter_description", value=""),
                Setting(key="twitter_image", value=""),
                Setting(key="robots", value="index, follow"),
                Setting(key="canonical_url", value=""),
                Setting(key="google_analytics_id", value=""),
                Setting(key="custom_meta", value=""),
                Setting(key="upload_allowed_extensions", value="jpg,jpeg,png,pdf,docx"),
                Setting(key="upload_max_size_mb", value="10"),
            ]

            db.add_all(settings_to_save)

            logger.info(f"Hệ thống đã được cài đặt bởi Admin: {admin_user.email}")

        # Cache clear sau khi commit thành công
        await FastAPICache.clear(namespace="get_install_status")

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
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
