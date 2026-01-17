# Cấu hình hệ thống FastAPI - Đọc từ environment variables
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Thông tin ứng dụng
    APP_NAME: str = "AiCMR"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Cấu hình Database MySQL
    # DATABASE_URL được build từ các biến môi trường riêng
    DATABASE_URL: str = "mysql+aiomysql://user:password@localhost:3306/aicmr"
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "aicmr"
    DB_USER: str = "aicmr_user"
    DB_PASSWORD: str = "password"

    # Cấu hình Security - JWT và password hashing
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Cấu hình CORS - Danh sách các origin được phép truy cập
    ALLOWED_ORIGINS: list = ["http://localhost:3000"]

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
