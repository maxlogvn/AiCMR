# Backend Logging (Loguru)

Sử dụng Loguru cho logging trong backend FastAPI.

## Sử Dụng Cơ Bản

```python
from loguru import logger

logger.info("Thông báo")
logger.error("Lỗi: {}", e)
logger.debug("Debug info")
logger.warning("Warning message")
```

## Cấu Trúc Logs

- **Vị trí**: `backend/logs/app.log`
- **Định dạng**: JSON
- **Rotation**: Tự động xoay vòng sau 100MB
- **Nén**: Tự động nén file cũ

## Levels

- **DEBUG**: Chi tiết debug
- **INFO**: Thông báo chung
- **WARNING**: Cảnh báo
- **ERROR**: Lỗi không nghiêm trọng
- **CRITICAL**: Lỗi nghiêm trọng

## Ví Dụ trong CRUD

```python
from loguru import logger

async def create_user(db: AsyncSession, user_data: UserCreate):
    try:
        logger.info("Creating user: {}", user_data.email)
        # ... logic CRUD
        logger.success("User created: {}", user.id)
    except Exception as e:
        logger.error("Failed to create user: {}", e)
        raise
```

## Logging Context

```python
# Gắn context để track request
with logger.contextualize(request_id=request_id, user_id=user.id):
    logger.info("Processing request")
    # Tất cả logs sẽ tự động có context
```

## Tham Chiếu
- Backend guide: `concepts/code-style.md`
- Docker workflow: `concepts/docker-workflow.md`
- Debugging: `guides/debugging.md`
