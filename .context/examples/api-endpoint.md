# API Endpoint Example

Ví dụ API endpoint chuẩn trong FastAPI backend.

## CRUD Endpoint Pattern

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import crud_user
from app.schemas import UserCreate, UserResponse
from app.core.database import get_db

router = APIRouter(prefix="/api/v1/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Tạo user mới.

    Args:
        user: Dữ liệu user cần tạo
        db: Database session

    Returns:
        UserResponse: User đã tạo
    """
    return await crud_user.create(db, user)

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """Lấy thông tin user.

    Args:
        user_id: ID của user
        db: Database session

    Returns:
        UserResponse: Thông tin user
    """
    return await crud_user.get(db, user_id)
```

## Error Handling Pattern

```python
from fastapi import HTTPException
from app.core.exceptions import UserNotFoundError, DuplicateUserError

@router.post("/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    try:
        return await crud_user.create(db, user)
    except DuplicateUserError as e:
        raise HTTPException(status_code=409, detail=str(e))
```

## Dependency Injection

```python
from app.core.security import get_current_user, require_rank

@router.get("/profile")
async def get_profile(
    current_user: User = Depends(get_current_user),
    _: None = Depends(require_rank(1))  # Minimum Member
) -> UserResponse:
    return current_user
```

## Tham Chiếu
- Code style: `concepts/code-style.md`
- CRUD patterns: `examples/crud-patterns.md`
- Security: `concepts/security.md`
