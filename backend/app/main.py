# FastAPI Entry Point - Điểm khởi động của application
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi_pagination import add_pagination
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis
from slowapi.errors import RateLimitExceeded
from loguru import logger
from starlette.middleware.sessions import SessionMiddleware
from prometheus_client import Counter, Histogram, make_asgi_app, REGISTRY
import sys
import time
import os
from contextlib import asynccontextmanager

# Import rate limiter
from .core.rate_limit import limiter
from .core.security import generate_csrf_token


# Use REGISTRY to check if collectors are already registered to avoid errors in tests
def get_metric(metric_class, name, *args, **kwargs):
    if name in REGISTRY._names_to_collectors:
        return REGISTRY._names_to_collectors[name]
    return metric_class(name, *args, **kwargs)


http_requests_total = get_metric(
    Counter,
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status"],
)

http_request_duration_seconds = get_metric(
    Histogram,
    "http_request_duration_seconds",
    "HTTP request duration",
    ["method", "endpoint"],
)

# Import API routers
from .api.v1 import auth, users, install, settings_dashboard, stats, uploads, posts, categories, tags


# Import settings và database functions
from .core.config import get_settings
from .core.database import init_db

# Lấy configuration từ environment variables
settings = get_settings()

# Cấu hình Loguru với structured logging
logger.remove()

# Console logging with colors
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    colorize=True,
    level=settings.LOG_LEVEL,
)

# File logging with rotation
logger.add(
    settings.LOG_FILE,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    rotation=settings.LOG_ROTATION,
    retention=settings.LOG_RETENTION,
    compression="zip",
    level="DEBUG",
)

# Error logging to separate file
logger.add(
    settings.LOG_ERROR_FILE,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    rotation=settings.LOG_ROTATION,
    retention=settings.LOG_RETENTION,
    compression="zip",
    level="ERROR",
)


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
        redis = aioredis.from_url(
            settings.REDIS_URL, encoding="utf8", decode_responses=True
        )
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
    lifespan=lifespan,
    openapi_url="/openapi.json",
    docs_url="/docs",
)

# Set limiter to app state
app.state.limiter = limiter

# Configure CORS Middleware
# Cho phép frontend (Next.js) gọi API từ domain khác
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Session Middleware for CSRF tokens
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="aicmr_session",
    max_age=3600,
    same_site="lax",
    https_only=False,
)


# Add Prometheus Middleware for metrics tracking
@app.middleware("http")
async def prometheus_middleware(request: Request, call_next):
    """
    Track HTTP requests and duration for Prometheus metrics.
    """
    method = request.method
    path = request.url.path
    start_time = time.time()
    status_code = 200

    try:
        response = await call_next(request)
        status_code = response.status_code
    except Exception:
        status_code = 500
        raise
    finally:
        duration = time.time() - start_time
        http_requests_total.labels(  # type: ignore[attr-defined]
            method=method, endpoint=path, status=status_code
        ).inc()
        http_request_duration_seconds.labels(method=method, endpoint=path).observe(  # type: ignore[attr-defined]
            duration
        )

    return response


# Add custom exception handler for rate limiting
@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={"detail": "Too many requests. Please try again later."},
    )


# Include API routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(install.router, prefix="/api/v1/install", tags=["Install"])
app.include_router(
    settings_dashboard.router, prefix="/api/v1/settings", tags=["Settings"]
)
app.include_router(stats.router, prefix="/api/v1/stats", tags=["Stats"])
app.include_router(uploads.router, prefix="/api/v1/uploads", tags=["Uploads"])
app.include_router(posts.router, prefix="/api/v1/posts", tags=["Posts"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(tags.router, prefix="/api/v1/tags", tags=["Tags"])


# CSRF token endpoint
@app.get("/api/v1/csrf-token")
async def get_csrf_token(request: Request):
    """Generate and store CSRF token if not exists"""
    try:
        csrf_token = request.session.get("csrf_token")
        if not csrf_token:
            csrf_token = generate_csrf_token()
            request.session["csrf_token"] = csrf_token
            logger.debug("Generated new CSRF token in session")
        else:
            logger.debug("Reusing CSRF token from session")
        return {"csrf_token": csrf_token}
    except Exception as e:
        logger.error(f"CSRF Token Error: {e}")
        import traceback

        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# Thêm Pagination vào app
add_pagination(app)


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


# Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)
