# FastAPI Entry Point - Điểm khởi động của application
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis
from loguru import logger
import sys
from contextlib import asynccontextmanager

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

# Startup & Shutdown lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
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
    
    logger.info("Application startup complete")
    yield
    logger.info("Application shutdown")

# Tạo FastAPI app instance với title và version
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    root_path="/backend",
    lifespan=lifespan,
)

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
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])

# Root endpoint
@app.get("/")
async def root():
    """
    Endpoint gốc - Trả về thông tin cơ bản về API.
    """
    return {"message": "Welcome to AiCMR API", "version": settings.APP_VERSION}

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}

# Thêm Pagination vào app (cần đặt sau cùng để middleware hoạt động đúng)
add_pagination(app)
