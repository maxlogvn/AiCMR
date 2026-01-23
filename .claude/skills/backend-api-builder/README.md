# Backend API Builder Skill - Quick Reference

**🚀 Use this skill when:** Building or fixing FastAPI endpoints in AiCMR backend

---

## 🎯 Triggers

Load this skill when user says:
- "build api", "create endpoint", "add crud"
- "fix backend", "sửa api", "tạo endpoint"
- "backend bug", "API error"

---

## ⚡ Quick Templates

### CREATE Endpoint (Copy-Paste Ready)

```python
from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

@router.post(
    "/",
    response_model=ResourceResponse,
    status_code=status.HTTP_201_CREATED  # ✅ 201 for CREATE
)
async def create_resource_endpoint(
    request: Request,
    resource_in: ResourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),  # ✅ CSRF required
):
    resource = await create_resource(db=db, obj_in=resource_in)

    # ✅ Re-fetch to avoid MissingGreenlet
    result = await db.execute(
        select(Resource)
        .options(selectinload(Resource.relationships))
        .where(Resource.id == resource.id)
    )
    resource = result.scalar_one_or_none()

    logger.info(f"User {current_user.email} created resource {resource.name}")
    return resource
```

---

## 🔴 Top 5 Mistakes to Avoid

### 1. ❌ Wrong Status Code for CREATE
```python
# WRONG
@router.post("/", response_model=ResourceResponse)  # Returns 200

# CORRECT
@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
```

### 2. ❌ MissingGreenlet with Relationships
```python
# WRONG
resource = await create_resource(db=db, obj_in=data)
return resource  # Crashes with MissingGreenlet

# CORRECT
resource = await create_resource(db=db, obj_in=data)
result = await db.execute(
    select(Resource).options(selectinload(Resource.children)).where(Resource.id == resource.id)
)
return result.scalar_one_or_none()
```

### 3. ❌ No CSRF Protection
```python
# WRONG
async def create_endpoint(...):
    pass  # No CSRF token

# CORRECT
async def create_endpoint(
    ...,
    csrf_token: str = Depends(validate_csrf)  # Required for POST/PUT/PATCH/DELETE
):
    pass
```

### 4. ❌ No Permission Check
```python
# WRONG
@router.patch("/{id}")
async def update_resource(..., current_user: User = Depends(get_current_active_user)):
    # Anyone can update anything!

# CORRECT
@router.patch("/{id}")
async def update_resource(..., current_user: User = Depends(require_min_rank(ADMIN_RANK))):
    # Only admins can update
```

### 5. ❌ Forgetting Cache Invalidation
```python
# WRONG
updated = await update_resource(...)
return updated  # Cache still has old data

# CORRECT
updated = await update_resource(...)
await FastAPICache.clear(namespace="resources")
return updated
```

---

## ✅ Pre-Commit Checklist

- [ ] **201 Created** for POST endpoints
- [ ] **Eager load** relationships with `selectinload()`
- [ ] **CSRF token** for state-changing ops
- [ ] **Permission check** (role or ownership)
- [ ] **Clear cache** after update/delete
- [ ] **Log** important operations
- [ ] **Type hints** on all params
- [ ] **Error handling** with HTTPException
- [ ] **Tests** written
- [ ] **Docstring** added

---

## 📦 Status Codes Quick Ref

| Code | Usage |
|------|-------|
| **201** | POST create resource ✅ |
| **200** | GET read, PATCH/PUT update, DELETE |
| **404** | Resource not found |
| **403** | No permission |
| **401** | Not logged in |
| **422** | Validation error |

---

## 🔗 Full Documentation

See [skill.md](./skill.md) for complete guide with:
- All CRUD operation templates
- SQLAlchemy async patterns
- Error handling strategies
- Testing guidelines
- Complete workflow for creating new APIs

---

**🎯 Remember:** When in doubt, copy the template and follow the checklist!
