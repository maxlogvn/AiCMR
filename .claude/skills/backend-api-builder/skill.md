# Backend API Builder Skill - AiCMR

**Version:** 1.0
**Purpose:** Hướng dẫn agents xây dựng và sửa FastAPI endpoints trong AiCMR backend một cách chính xác, tránh các lỗi phổ biến.

---

## 🎯 Mục Tiêu Skill

Khi người dùng yêu cầu:
- "tạo api mới cho..."
- "sửa api..."
- "build backend endpoint..."
- "add CRUD operations..."
- "fix backend bug..."

→ LOAD SKILL NÀY TRƯỚC!

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [CRUD Endpoint Templates](#crud-endpoint-templates)
3. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
4. [Status Code Best Practices](#status-code-best-practices)
5. [SQLalchemy Async Patterns](#sqlalchemy-async-patterns)
6. [Response Models](#response-models)
7. [Error Handling](#error-handling)
8. [Testing Guidelines](#testing-guidelines)
9. [Checklist](#checklist)

---

## 🏗️ Architecture Overview

### Backend Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── posts.py          # Post endpoints
│   │       ├── categories.py     # Category endpoints
│   │       ├── tags.py           # Tag endpoints
│   │       ├── users.py          # User endpoints
│   │       └── ...
│   ├── core/
│   │   ├── database.py           # DB session
│   │   ├── security.py           # CSRF, auth
│   │   └── constants.py          # Constants
│   ├── crud/                     # Database operations
│   ├── models/                   # SQLAlchemy models
│   ├── schemas/                  # Pydantic schemas
│   └── services/                 # Business logic
```

### Request Flow

```
User Request
    ↓
FastAPI Route (api/v1/*.py)
    ↓
Dependency Injection (deps.py)
    ↓
Business Logic / CRUD (crud/*.py)
    ↓
Database Operation (models/*.py)
    ↓
Response Validation (schemas/*.py)
    ↓
JSON Response
```

---

## 📝 CRUD Endpoint Templates

### CREATE (POST) - Tạo resource mới

```python
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.api.deps import require_min_rank, get_current_active_user
from app.core.security import validate_csrf
from app.core.constants import ADMIN_RANK
from app.models.user import User
from app.models.resource import Resource
from app.schemas.resource import ResourceCreate, ResourceResponse
from app.crud import create_resource
from loguru import logger

router = APIRouter()

@router.post(
    "/",
    response_model=ResourceResponse,
    status_code=status.HTTP_201_CREATED  # ✅ QUAN TRỌNG: 201 cho CREATE
)
async def create_resource_endpoint(
    request: Request,  # ✅ Thêm Request param cho logging
    resource_in: ResourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),  # ✅ BẮT BUỘC cho POST/PUT/PATCH/DELETE
):
    """
    Create a new resource (admin only).

    ✅ Returns 201 Created on success
    """
    # Step 1: Create resource via CRUD
    resource = await create_resource(db=db, obj_in=resource_in)

    # Step 2: Re-fetch with eager loading (QUAN TRỌNG!)
    result = await db.execute(
        select(Resource)
        .options(selectinload(Resource.relationship))  # ✅ Eager load relationships
        .where(Resource.id == resource.id)
    )
    resource = result.scalar_one_or_none()

    # Step 3: Log success
    logger.info(f"User {current_user.email} created resource: {resource.name}")

    # Step 4: Return response
    return resource
```

### READ (GET) - Lấy một resource

```python
@router.get("/{resource_id}", response_model=ResourceResponse)
async def get_resource_endpoint(
    resource_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Get resource by ID (public).

    ✅ Returns 200 OK with resource data
    """
    resource = await get_resource_by_id(db, resource_id)

    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    return resource
```

### LIST (GET) - Lấy danh sách có pagination

```python
from fastapi_pagination import Page

@router.get("/", response_model=Page[ResourceResponse])
async def list_resources(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Page size"),
    db: AsyncSession = Depends(get_db),
):
    """
    List all resources with pagination.

    ✅ Returns 200 OK with paginated list
    """
    resources, total = await get_all_resources(
        db=db,
        skip=(page - 1) * size,
        limit=size
    )

    # Manually build pagination response
    return {
        "items": resources,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size if size > 0 else 0
    }
```

### UPDATE (PATCH) - Cập nhật resource

```python
@router.patch("/{resource_id}", response_model=ResourceResponse)
async def update_resource_endpoint(
    request: Request,
    resource_id: int,
    resource_in: ResourceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Update resource (admin only).

    ✅ Returns 200 OK with updated resource
    """
    # Step 1: Get existing resource
    resource = await get_resource_by_id(db, resource_id)

    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # Step 2: Update via CRUD
    updated_resource = await update_resource(
        db=db,
        db_obj=resource,
        obj_in=resource_in
    )

    # Step 3: Log
    logger.info(f"User {current_user.email} updated resource {resource_id}")

    return updated_resource
```

### DELETE (DELETE) - Xóa resource

```python
@router.delete("/{resource_id}")
async def delete_resource_endpoint(
    request: Request,
    resource_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Delete resource (admin only).

    ✅ Returns 200 OK with success message
    """
    # Step 1: Check if exists
    resource = await get_resource_by_id(db, resource_id)

    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # Step 2: Delete via CRUD
    success = await delete_resource(db=db, resource_id=resource_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete resource"
        )

    # Step 3: Clear cache if needed
    await FastAPICache.clear(namespace="resources")

    # Step 4: Log
    logger.info(f"User {current_user.email} deleted resource {resource_id}")

    return {"message": "Resource deleted successfully"}
```

---

## ⚠️ Common Pitfalls & Solutions

### Pitfall 1: Thiếu status_code=201 cho CREATE

❌ **SAI:**
```python
@router.post("/", response_model=ResourceResponse)
async def create_resource(...):
    return resource  # Trả về 200 OK
```

✅ **ĐÚNG:**
```python
@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_resource(...):
    return resource  # Trả về 201 Created
```

### Pitfall 2: MissingGreenlet Error với SQLAlchemy async

❌ **SAI:**
```python
@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_resource(...):
    resource = await create_resource(db=db, obj_in=resource_in)
    return resource  # ❌ Có thể gây MissingGreenlet nếu có relationships
```

✅ **ĐÚNG:**
```python
@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_resource(...):
    resource = await create_resource(db=db, obj_in=resource_in)

    # ✅ Re-fetch with eager loading
    result = await db.execute(
        select(Resource)
        .options(selectinload(Resource.children))  # Eager load relationships
        .where(Resource.id == resource.id)
    )
    resource = result.scalar_one_or_none()

    return resource
```

### Pitfall 3: Quên validate_csrf cho state-changing operations

❌ **SAI:**
```python
@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_resource(
    resource_in: ResourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    # ❌ Thiếu CSRF protection
):
```

✅ **ĐÚNG:**
```python
@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
async def create_resource(
    request: Request,
    resource_in: ResourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),  # ✅ CSRF protection
):
```

### Pitfall 4: Không check permissions

❌ **SAI:**
```python
@router.patch("/{resource_id}", response_model=ResourceResponse)
async def update_resource(
    resource_id: int,
    resource_in: ResourceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),  # ❌ Bất kỳ user nào đều update được
):
```

✅ **ĐÚNG:**
```python
@router.patch("/{resource_id}", response_model=ResourceResponse)
async def update_resource(
    resource_id: int,
    resource_in: ResourceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),  # ✅ Chỉ admin
):
```

Hoặc ownership check:
```python
@router.patch("/me/{resource_id}", response_model=ResourceResponse)
async def update_my_resource(
    resource_id: int,
    resource_in: ResourceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    resource = await get_resource_by_id(db, resource_id)

    if not resource:
        raise HTTPException(status_code=404, detail="Not found")

    # ✅ Check ownership
    if resource.owner_id != current_user.id and current_user.rank < MODERATOR_RANK:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # ... continue update
```

### Pitfall 5: Không invalidate cache sau khi update/delete

❌ **SAI:**
```python
@router.patch("/{resource_id}", response_model=ResourceResponse)
async def update_resource(...):
    updated = await update_resource(db=db, db_obj=resource, obj_in=resource_in)
    return updated  # ❌ Cache vẫn chứa data cũ
```

✅ **ĐÚNG:**
```python
from fastapi_cache import FastAPICache

@router.patch("/{resource_id}", response_model=ResourceResponse)
async def update_resource(...):
    updated = await update_resource(db=db, db_obj=resource, obj_in=resource_in)

    # ✅ Clear cache
    await FastAPICache.clear(namespace="resources")

    return updated
```

---

## 🔢 Status Code Best Practices

| Operation | Success Status | Description |
|-----------|----------------|-------------|
| POST (Create) | **201 Created** | Tạo resource thành công |
| GET (Read) | **200 OK** | Lấy data thành công |
| PATCH/PUT (Update) | **200 OK** | Update thành công |
| DELETE | **200 OK** | Xóa thành công |
| Not Found | **404** | Resource không tồn tại |
| Unauthorized | **401** | Chưa login |
| Forbidden | **403** | Không có quyền |
| Validation Error | **422** | Pydantic validation fail |
| Server Error | **500** | Lỗi server |

### Quick Reference

```python
from fastapi import status

# Success codes
status.HTTP_200_OK          # GET, PATCH, DELETE success
status.HTTP_201_CREATED     # POST success
status.HTTP_204_NO_CONTENT  # DELETE success (no body)

# Error codes
status.HTTP_400_BAD_REQUEST          # Bad input
status.HTTP_401_UNAUTHORIZED         # Not logged in
status.HTTP_403_FORBIDDEN            # No permission
status.HTTP_404_NOT_FOUND            # Resource not found
status.HTTP_422_UNPROCESSABLE_ENTITY # Validation error
status.HTTP_500_INTERNAL_SERVER_ERROR # Server error
```

---

## 🔍 SQLAlchemy Async Patterns

### Pattern 1: Create with Eager Loading

```python
from sqlalchemy import select
from sqlalchemy.orm import selectinload

# CREATE
new_obj = MyModel(**data)
db.add(new_obj)
await db.commit()
await db.refresh(new_obj)

# Re-fetch with eager loading
result = await db.execute(
    select(MyModel)
    .options(selectinload(MyModel.relationship))
    .where(MyModel.id == new_obj.id)
)
return result.scalar_one_or_none()
```

### Pattern 2: Update with Check

```python
# Get existing
obj = await db.get(MyModel, obj_id)
if not obj:
    raise HTTPException(status_code=404, detail="Not found")

# Update fields
for field, value in obj_in.model_dump(exclude_unset=True).items():
    setattr(obj, field, value)

await db.commit()
await db.refresh(obj)

# Re-fetch with eager loading if needed
result = await db.execute(
    select(MyModel)
    .options(selectinload(MyModel.relationship))
    .where(MyModel.id == obj.id)
)
return result.scalar_one_or_none()
```

### Pattern 3: Delete with Cascade Check

```python
# Check if has dependencies
result = await db.execute(
    select(func.count()).select_from(DependentModel).where(DependentModel.parent_id == obj_id)
)
count = result.scalar()

if count > 0:
    raise HTTPException(
        status_code=400,
        detail=f"Cannot delete: {count} dependent items exist"
    )

# Delete
obj = await db.get(MyModel, obj_id)
if obj:
    await db.delete(obj)
    await db.commit()
```

---

## 📦 Response Models

### Basic Response Model

```python
from pydantic import BaseModel
from datetime import datetime

class ResourceResponse(BaseModel):
    id: int
    name: str
    slug: str
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True  # ✅ BẮT BUỘC cho SQLAlchemy models
```

### Nested Response Model

```python
class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    parent_id: int | None = None

    # Nested relationships
    children: list['CategoryResponse'] = []  # ✅ Self-reference
    posts: list[PostResponse] = []  # ✅ Forward reference

    class Config:
        from_attributes = True
```

### Paginated Response

```python
from fastapi_pagination import Page

# ✅ Use fastapi-pagination Page
@router.get("/", response_model=Page[ResourceResponse])
async def list_resources(...):
    # Returns: { "items": [...], "total": 100, "page": 1, "size": 20, "pages": 5 }
    ...
```

---

## 🚨 Error Handling

### HTTPException

```python
from fastapi import HTTPException, status

# 404 - Not found
if not resource:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Resource not found"
    )

# 403 - Forbidden
if resource.owner_id != current_user.id:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You don't have permission to access this resource"
    )

# 400 - Bad request
if invalid_data:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid data provided"
    )
```

### Custom Exception Handlers

```python
# In app/main.py
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )
```

---

## 🧪 Testing Guidelines

### Test Structure

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_resource(client: AsyncClient, admin_headers):
    response = await client.post(
        "/api/v1/resources/",
        json={"name": "Test", "slug": "test"},
        headers=admin_headers
    )

    assert response.status_code == 201  # ✅ Check 201
    data = response.json()
    assert data["name"] == "Test"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_resource(client: AsyncClient):
    response = await client.get("/api/v1/resources/1")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1

@pytest.mark.asyncio
async def test_update_resource(client: AsyncClient, admin_headers):
    response = await client.patch(
        "/api/v1/resources/1",
        json={"name": "Updated"},
        headers=admin_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated"

@pytest.mark.asyncio
async def test_delete_resource(client: AsyncClient, admin_headers):
    response = await client.delete(
        "/api/v1/resources/1",
        headers=admin_headers
    )

    assert response.status_code == 200
    assert "message" in response.json()
```

---

## ✅ Checklist

Trước khi hoàn thành API endpoint mới, check:

### Structure Checklist

- [ ] Endpoint được thêm vào router trong `app/api/v1/*.py`
- [ ] Router được register trong `app/main.py`
- [ ] Schemas được định nghĩa trong `app/schemas/*.py`
- [ ] CRUD operations trong `app/crud/*.py`
- [ ] Model trong `app/models/*.py`

### Security Checklist

- [ ] Authentication required (nếu cần): `Depends(get_current_active_user)` hoặc `Depends(require_min_rank(RANK))`
- [ ] CSRF protection cho POST/PUT/PATCH/DELETE: `csrf_token: str = Depends(validate_csrf)`
- [ ] Authorization check (ownership hoặc role-based)
- [ ] Input validation với Pydantic schemas

### Code Quality Checklist

- [ ] **CREATE endpoints return 201 Created**: `status_code=status.HTTP_201_CREATED`
- [ ] **Eager load relationships** để tránh MissingGreenlet: `.options(selectinload(Model.rel))`
- [ ] **Clear cache** sau update/delete: `await FastAPICache.clear(namespace="...")`
- [ ] **Logging** cho operations quan trọng: `logger.info(...)`
- [ ] **Error handling** với HTTPException
- [ ] **Type hints** cho tất cả parameters

### Testing Checklist

- [ ] Test success case
- [ ] Test 404 Not Found
- [ ] Test 403 Forbidden (nếu cần auth)
- [ ] Test 401 Unauthorized (nếu cần login)
- [ ] Test validation errors (400/422)
- [ ] Test pagination (nếu applicable)

### Documentation Checklist

- [ ] Docstring cho endpoint
- [ ] Parameter descriptions trong Query/Path/Body
- [ ] Response model rõ ràng
- [ ] Error cases documented

---

## 🎯 Workflow: Tạo API Mới

1. **Define Model** (`app/models/*.py`)
   ```python
   class MyResource(Base):
       __tablename__ = "my_resources"

       id = Column(Integer, primary_key=True)
       name = Column(String(200), nullable=False)
       slug = Column(String(200), unique=True, nullable=False)
   ```

2. **Define Schemas** (`app/schemas/*.py`)
   ```python
   class MyResourceBase(BaseModel):
       name: str
       slug: str

   class MyResourceCreate(MyResourceBase):
       pass

   class MyResourceUpdate(MyResourceBase):
       pass

   class MyResourceResponse(MyResourceBase):
       id: int
       created_at: datetime

       class Config:
           from_attributes = True
   ```

3. **Define CRUD** (`app/crud/*.py`)
   ```python
   async def get_my_resource_by_id(db: AsyncSession, id: int):
       return await db.get(MyResource, id)

   async def create_my_resource(db: AsyncSession, obj_in: MyResourceCreate):
       db_obj = MyResource(**obj_in.model_dump())
       db.add(db_obj)
       await db.commit()
       await db.refresh(db_obj)
       return db_obj
   ```

4. **Define Endpoints** (`app/api/v1/*.py`)
   - Copy template từ phần [CRUD Endpoint Templates](#crud-endpoint-templates)
   - Adjust cho use case cụ thể
   - Check tất cả items trong [Checklist](#checklist)

5. **Register Router** (`app/main.py`)
   ```python
   from app.api.v1 import my_resources
   app.include_router(my_resources.router, prefix="/api/v1/my-resources", tags=["My Resources"])
   ```

6. **Test**
   - Run tests
   - Test manually với curl/httpx
   - Verify Swagger UI at http://localhost:8000/docs

---

## 📚 Quick Reference

### Imports cần thiết

```python
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from fastapi_cache import FastAPICache

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_min_rank
from app.core.security import validate_csrf
from app.core.constants import ADMIN_RANK, MODERATOR_RANK, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from app.models.user import User
from app.models.resource import Resource
from app.schemas.resource import ResourceCreate, ResourceUpdate, ResourceResponse
from app.crud import get_resource_by_id, create_resource, update_resource, delete_resource
from loguru import logger
```

### Common patterns

```python
# Check existence
if not resource:
    raise HTTPException(status_code=404, detail="Not found")

# Check permission
if resource.owner_id != current_user.id and current_user.rank < MODERATOR_RANK:
    raise HTTPException(status_code=403, detail="Forbidden")

# Eager loading
result = await db.execute(
    select(Model)
    .options(selectinload(Model.relationship))
    .where(Model.id == id)
)
obj = result.scalar_one_or_none()

# Clear cache
await FastAPICache.clear(namespace="resources")

# Log
logger.info(f"User {current_user.email} performed action on resource {resource_id}")
```

---

## 🔗 Related Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **SQLAlchemy 2.0 Async:** https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html
- **Pydantic V2:** https://docs.pydantic.dev/latest/
- **Project Structure:** [CLAUDE.md](../../CLAUDE.md)

---

**Version History:**
- 1.0 (2026-01-23) - Initial version with CRUD templates, pitfalls, and best practices

---

**Usage Note:**
Khi người dùng yêu cầu xây dựng/sửa API:
1. Load skill này
2. Review templates và patterns
3. Copy-paste appropriate template
4. Customise cho use case
5. Follow checklist
6. Test thoroughly
