# Database connection MySQL với connection pool
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

# Import settings từ config module
from .config import get_settings

# Lấy settings instance
settings = get_settings()

# Tạo async engine cho MySQL với connection pool
# Echo=True sẽ hiển thị SQL queries trong console khi DEBUG=True
# pool_pre_ping giúp kiểm tra connection trước khi sử dụng
# pool_size và max_overflow để tối ưu performance
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

# Session factory để tạo database sessions
# expire_on_commit=False cho phép truy cập objects sau khi commit
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Base class cho tất cả SQLAlchemy models
# Các model sẽ inherit từ Base này
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency injection cho database session.

    Sử dụng trong FastAPI endpoints để lấy database session.
    Tự động commit khi thành công, rollback khi lỗi.
    Luôn đóng session sau khi sử dụng.

    Yields:
        AsyncSession: Database session
    """
    async with AsyncSessionLocal() as session:
        try:
            # Yield session cho endpoint sử dụng
            yield session

            # Commit transaction nếu không có lỗi
            await session.commit()

        except Exception:
            # Rollback nếu có exception
            await session.rollback()

            # Re-raise exception để lỗi được xử lý ở trên
            raise

        finally:
            # Đóng session sau khi sử dụng
            await session.close()


async def init_db() -> None:
    """
    Initialize database - tạo tất cả tables.

    Hàm này sẽ đọc tất cả models và tạo tables tương ứng
    trong database. Nên được gọi khi khởi động ứng dụng.

    Sử dụng Alembic cho production để quản lý migrations.
    """
    async with engine.begin() as conn:
        # Tạo tất cả tables từ Base metadata
        await conn.run_sync(Base.metadata.create_all)
