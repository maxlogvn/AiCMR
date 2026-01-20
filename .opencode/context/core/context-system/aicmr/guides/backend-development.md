# Guide: Backend Development

**Core Idea**: Develop AiCMR backend using FastAPI with async SQLAlchemy, following strict type hints, async patterns, and established patterns for CRUD operations, caching, and error handling.

**Key Points**:
1. Use type hints for all function parameters and return values
2. Implement async/await for all I/O operations (database, Redis, external APIs)
3. Use snake_case for variables/functions, PascalCase for classes, UPPER_SNAKE_CASE for constants
4. Apply FastAPI Cache2 for expensive GET endpoints with TTL
5. Use custom exceptions and FastAPI Pagination for consistent error handling and list responses

**Quick Example**:
```python
from fastapi import APIRouter
from fastapi_cache.decorator import cache

router = APIRouter()

@router.get("/users", response_model=Page[UserSchema])
@cache(expire=300)
async def list_users():
    users = await crud.get_all_users()
    return paginate(users)
```

**Reference**: docs/03-backend-guide.md

**Related**: concepts/database-schema.md, concepts/jwt-authentication.md