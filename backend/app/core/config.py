# Cấu hình hệ thống FastAPI - Đọc từ environment variables
from functools import lru_cache

import secrets
from loguru import logger
from pydantic import Field, field_validator
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
    SECRET_KEY: str = Field(
        default=..., description="JWT signing secret - MUST be changed in production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    INSTALL_SECRET: str = "change-me-in-production"

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str, info) -> str:
        # Allow default key in development
        if info.data.get("DEBUG") and v == "your-secret-key":
            logger.warning("Using default SECRET_KEY in development mode")
            return v

        # Reject default key in production
        if v == "your-secret-key":
            raise ValueError(
                "SECRET_KEY must be set to a secure value in production. "
                'Generate one with: python -c "import secrets; print(secrets.token_urlsafe(32))"'
            )

        # Enforce minimum length
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")

        return v

    @staticmethod
    def generate_secret() -> str:
        """Generate a secure random SECRET_KEY"""
        return secrets.token_urlsafe(32)

    # Cấu hình CORS - Danh sách các origin được phép truy cập
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://aicmr.local",
        "https://aicmr.local",
        "http://127.0.0.1:3000",
    ]

    # Cấu hình Redis (cho Caching)
    REDIS_URL: str = "redis://localhost:6379/0"

    # Cấu hình Sentry (tùy chọn)
    SENTRY_DSN: str = ""

    # Cấu hình Loguru
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    LOG_ERROR_FILE: str = "logs/app_error.log"
    LOG_ROTATION: str = "100 MB"
    LOG_RETENTION: str = "30 days"

    # Cấu hình Upload
    UPLOAD_DIR: str = "static/uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB default
    ALLOWED_EXTENSIONS: str = "jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,txt"

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
