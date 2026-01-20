# Code Style - Backend (Python/FastAPI)

Quy chuẩn code cho backend theo PEP 8 + FastAPI best practices.

## Naming Conventions
- **Class**: `PascalCase` → `UserService`, `BaseModel`
- **Function/Variable**: `snake_case` → `get_user_by_id`
- **File/Directory**: `snake_case` → `auth_router.py`
- **API Endpoints**: `kebab-case` → `/api/v1/user-profiles`

## Type Hints
**BẮT BUỘC** cho mọi tham số và giá trị trả về:
```python
async def get_user(user_id: int) -> UserResponse:
    ...
```

## Async/Await
Sử dụng cho mọi thao tác I/O:
```python
async def create_user(user: UserCreate, db: AsyncSession):
    result = await db.execute(...)
```

**Áp dụng cho**: Database, Redis, HTTP calls

## Error Handling
- Sử dụng custom exceptions trong `app/core/exceptions.py`
- Tránh raise trực tiếp `HTTPException` trong logic CRUD
- Catch errors cụ thể, không catch chung

```python
from app.core.exceptions import UserNotFoundError

try:
    user = await get_user(user_id)
except UserNotFoundError:
    raise
```

## Database
- Sử dụng `Depends(get_db)` cho database sessions
- Logic CRUD tập trung tại `app/crud/`

```python
@router.get("/users/{user_id}")
async def read_user(user_id: int, db: AsyncSession = Depends(get_db)):
    return await crud_user.get(db, user_id)
```

## Imports Order
1. Standard library
2. Third-party (fastapi, sqlalchemy...)
3. Local (app.*)

Sắp xếp alphabet trong từng nhóm.

## Docstrings
Google style cho public functions/classes:
```python
def create_user(user: UserCreate) -> User:
    """Tạo user mới.

    Args:
        user: Dữ liệu user cần tạo

    Returns:
        User: User đã tạo
    """
```

## Tham khảo
- Frontend code style: `concepts/code-style-frontend.md`
- Ví dụ endpoint: `examples/api-endpoint.md`
