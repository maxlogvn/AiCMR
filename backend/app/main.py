# FastAPI Entry Point - Điểm khởi động của application
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis
from loguru import logger
import sys

# Import API routers
from .api.v1 import auth, users

# Import settings và database functions
from .core.config import get_settings
from .core.database import init_db

# Lấy configuration từ environment variables
settings = get_settings()

# Cấu hình Loguru
logger.remove()
logger.add(sys.stdout, format="{time} | {level} | {message}", level="INFO")
logger.add("logs/app.log", rotation="10 MB", level="DEBUG")

# Tạo FastAPI app instance với title và version
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    root_path="/backend",  # Cấu hình root_path để Swagger UI hoạt động đúng đằng sau Nginx proxy
)

# Thêm Pagination vào app
add_pagination(app)

# Configure CORS Middleware
# Cho phép frontend (Next.js) gọi API từ domain khác
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # Danh sách domain được phép
    allow_credentials=True,  # Cho phép gửi cookies
    allow_methods=["*"],  # Cho phép tất cả HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Cho phép tất cả headers
)


# Include API routers
# Auth router: đăng nhập, đăng ký, refresh token
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

# Users router: quản lý user
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])


# Startup event - Chạy khi application khởi động
@app.on_event("startup")
async def startup_event():
    """
    Initialize database, cache và các dịch vụ khác khi start app.
    """
    # Khởi tạo database
    await init_db()
    
    # Khởi tạo Redis Cache
    try:
        redis = aioredis.from_url(settings.REDIS_URL, encoding="utf8", decode_responses=True)
        FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
        logger.info("Successfully connected to Redis for caching")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
        # Bạn có thể fallback sang InMemoryBackend nếu muốn
    
    logger.info("Application startup complete")


# Root endpoint - Endpoint gốc để test API đang hoạt động
@app.get("/")
async def root():
    """
    Endpoint gốc - Trả về thông tin cơ bản về API.

    Returns:
        dict: Thông tin API bao gồm message và version
    """
    return {"message": "Welcome to AiCMR API", "version": settings.APP_VERSION}


# Health check endpoint - Dùng để kiểm tra health status của API
@app.get("/health")
async def health_check():
    """
    Health check endpoint.

    Dùng bởi load balancers, orchestration tools (Kubernetes, Docker Compose)
    để kiểm tra xem application có hoạt động bình thường không.

    Returns:
        dict: Health status của application
    """
    return {"status": "healthy"}
