# Cấu hình hệ thống FastAPI - Đọc từ environment variables
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Thông tin ứng dụng
    APP_NAME: str = "AiCMR"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Cấu hình Database MySQL
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "aicmr"
    DB_USER: str = "aicmr_user"
    DB_PASSWORD: str = "password"
    
    @property
    def DATABASE_URL(self) -> str:
        """
        Tự động build DATABASE_URL từ các thành phần nếu không được set trực tiếp.
        Ưu tiên sử dụng biến môi trường DATABASE_URL nếu có.
        """
        import os
        env_url = os.getenv("DATABASE_URL")
        if env_url:
            return env_url
        return f"mysql+aiomysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    # Cấu hình Security - JWT và password hashing
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    INSTALL_SECRET: str = "change-me-in-production"

    # Cấu hình CORS - Danh sách các origin được phép truy cập
    ALLOWED_ORIGINS: list = ["http://localhost:3000"]

    # Cấu hình Redis (cho Caching)
    REDIS_URL: str = "redis://localhost:6379/0"

    # Cấu hình Sentry (tùy chọn)
    SENTRY_DSN: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    """
    Hàm lấy settings instance với cache.
    Sử dụng lru_cache để chỉ đọc file .env một lần duy nhất.
    Tránh việc đọc lại file nhiều lần trong quá trình chạy ứng dụng.
    """
    return Settings()
