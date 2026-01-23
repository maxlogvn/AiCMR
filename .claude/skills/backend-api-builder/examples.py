"""
Example: Complete CRUD API Implementation
==========================================

This file shows a complete example of implementing CRUD endpoints
for a new "Product" resource in AiCMR backend.

Use this as reference when creating new APIs.
"""

# ===================================================================
# STEP 1: Define Model (app/models/product.py)
# ===================================================================

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class Product(Base):
    """Product model for e-commerce functionality"""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    is_active = Column(Boolean, default=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    stock = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")


# ===================================================================
# STEP 2: Define Schemas (app/schemas/product.py)
# ===================================================================

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ProductBase(BaseModel):
    """Base product schema"""
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    is_active: bool = True
    category_id: Optional[int] = None
    stock: int = Field(default=0, ge=0)


class ProductCreate(ProductBase):
    """Schema for creating product"""
    pass


class ProductUpdate(BaseModel):
    """Schema for updating product (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    slug: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    is_active: Optional[bool] = None
    category_id: Optional[int] = None
    stock: Optional[int] = Field(None, ge=0)


class ProductResponse(ProductBase):
    """Schema for product response"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Nested relationships (optional)
    category: Optional["CategoryResponse"] = None

    class Config:
        from_attributes = True  # ✅ CRITICAL for SQLAlchemy models


# ===================================================================
# STEP 3: Define CRUD Operations (app/crud/crud_product.py)
# ===================================================================

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import Tuple, List, Optional

from app.models.product import Product


async def get_product_by_id(db: AsyncSession, product_id: int) -> Optional[Product]:
    """Get product by ID"""
    return await db.get(Product, product_id)


async def get_product_by_slug(db: AsyncSession, slug: str) -> Optional[Product]:
    """Get product by slug"""
    result = await db.execute(
        select(Product).where(Product.slug == slug)
    )
    return result.scalar_one_or_none()


async def get_all_products(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 20,
    active_only: bool = True
) -> Tuple[List[Product], int]:
    """
    Get all products with pagination

    Returns:
        Tuple of (products list, total count)
    """
    # Build query
    query = select(Product)

    if active_only:
        query = query.where(Product.is_active == True)

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Get paginated results with eager loading
    result = await db.execute(
        query
        .options(selectinload(Product.category))
        .offset(skip)
        .limit(limit)
        .order_by(Product.created_at.desc())
    )
    products = result.scalars().all()

    return list(products), total


async def create_product(
    db: AsyncSession,
    obj_in: ProductCreate
) -> Product:
    """Create new product"""
    db_obj = Product(**obj_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj


async def update_product(
    db: AsyncSession,
    db_obj: Product,
    obj_in: ProductUpdate
) -> Product:
    """Update product"""
    # Update only provided fields
    for field, value in obj_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)

    await db.commit()
    await db.refresh(db_obj)
    return db_obj


async def delete_product(db: AsyncSession, product_id: int) -> bool:
    """Delete product"""
    product = await db.get(Product, product_id)
    if product:
        await db.delete(product)
        await db.commit()
        return True
    return False


# ===================================================================
# STEP 4: Define API Endpoints (app/api/v1/products.py)
# ===================================================================

from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi_pagination import Page
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi_cache import FastAPICache

from app.core.database import get_db
from app.api.deps import get_current_active_user, require_min_rank
from app.core.security import validate_csrf
from app.core.constants import ADMIN_RANK, MODERATOR_RANK, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from app.models.user import User
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.crud.crud_product import (
    get_product_by_id,
    get_product_by_slug,
    get_all_products,
    create_product,
    update_product,
    delete_product
)
from loguru import logger

router = APIRouter()


# ==================== PUBLIC ENDPOINTS ====================

@router.get("/", response_model=Page[ProductResponse])
async def list_products(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Page size"),
    active_only: bool = Query(True, description="Only show active products"),
    db: AsyncSession = Depends(get_db),
):
    """
    List all products with pagination

    Public endpoint - no authentication required
    """
    products, total = await get_all_products(
        db=db,
        skip=(page - 1) * size,
        limit=size,
        active_only=active_only
    )

    # Manually build pagination response
    return {
        "items": products,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size if size > 0 else 0
    }


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get product by ID (public)"""
    product = await get_product_by_id(db, product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return product


@router.get("/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug_endpoint(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """Get product by slug (public)"""
    product = await get_product_by_slug(db, slug)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return product


# ==================== ADMIN ENDPOINTS ====================

@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED  # ✅ 201 for CREATE
)
async def create_product_endpoint(
    request: Request,
    product_in: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),  # ✅ CSRF required
):
    """
    Create new product (admin only)

    ✅ Returns 201 Created on success
    """
    # Create product
    product = await create_product(db=db, obj_in=product_in)

    # ✅ Re-fetch with eager loading to avoid MissingGreenlet
    result = await db.execute(
        select(Product)
        .options(selectinload(Product.category))
        .where(Product.id == product.id)
    )
    product = result.scalar_one_or_none()

    logger.info(f"Admin {current_user.email} created product: {product.name}")

    # ✅ Clear cache
    await FastAPICache.clear(namespace="products")

    return product


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product_endpoint(
    request: Request,
    product_id: int,
    product_in: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),  # ✅ CSRF required
):
    """
    Update product (admin only)

    ✅ Returns 200 OK with updated product
    """
    # Get existing product
    product = await get_product_by_id(db, product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Update product
    updated_product = await update_product(
        db=db,
        db_obj=product,
        obj_in=product_in
    )

    logger.info(f"Admin {current_user.email} updated product {product_id}")

    # ✅ Clear cache
    await FastAPICache.clear(namespace="products")

    return updated_product


@router.delete("/{product_id}")
async def delete_product_endpoint(
    request: Request,
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK)),
    csrf_token: str = Depends(validate_csrf),  # ✅ CSRF required
):
    """
    Delete product (admin only)

    ✅ Returns 200 OK with success message
    """
    # Check if exists
    product = await get_product_by_id(db, product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Delete product
    success = await delete_product(db=db, product_id=product_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete product"
        )

    logger.info(f"Admin {current_user.email} deleted product {product_id}")

    # ✅ Clear cache
    await FastAPICache.clear(namespace="products")

    return {"message": "Product deleted successfully"}


# ===================================================================
# STEP 5: Register Router (app/main.py)
# ===================================================================

# In app/main.py, add:

# from app.api.v1 import products
# app.include_router(
#     products.router,
#     prefix="/api/v1/products",
#     tags=["Products"]
# )


# ===================================================================
# STEP 6: Write Tests (tests/test_product_api.py)
# ===================================================================

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
async def test_create_product(client: AsyncClient, admin_headers: dict):
    """Test creating product"""
    response = await client.post(
        "/api/v1/products/",
        json={
            "name": "Test Product",
            "slug": "test-product",
            "description": "Test description",
            "price": 99.99,
            "stock": 10
        },
        headers=admin_headers
    )

    assert response.status_code == 201  # ✅ Check for 201
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["slug"] == "test-product"
    assert data["price"] == 99.99
    assert "id" in data


@pytest.mark.asyncio
async def test_get_product(client: AsyncClient, db: AsyncSession):
    """Test getting product"""
    response = await client.get("/api/v1/products/1")

    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "name" in data


@pytest.mark.asyncio
async def test_update_product(client: AsyncClient, admin_headers: dict):
    """Test updating product"""
    response = await client.patch(
        "/api/v1/products/1",
        json={"name": "Updated Product", "price": 149.99},
        headers=admin_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Product"
    assert data["price"] == 149.99


@pytest.mark.asyncio
async def test_delete_product(client: AsyncClient, admin_headers: dict):
    """Test deleting product"""
    response = await client.delete(
        "/api/v1/products/1",
        headers=admin_headers
    )

    assert response.status_code == 200
    assert "message" in response.json()


@pytest.mark.asyncio
async def test_list_products(client: AsyncClient):
    """Test listing products"""
    response = await client.get("/api/v1/products/?page=1&size=10")

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data


@pytest.mark.asyncio
async def test_product_not_found(client: AsyncClient):
    """Test 404 when product doesn't exist"""
    response = await client.get("/api/v1/products/99999")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_unauthorized_cannot_create_product(client: AsyncClient):
    """Test that unauthorized users cannot create products"""
    response = await client.post(
        "/api/v1/products/",
        json={
            "name": "Unauthorized Product",
            "slug": "unauthorized",
            "price": 10.0
        }
        # No auth headers
    )

    assert response.status_code == 401  # Unauthorized


# ===================================================================
# STEP 7: Manual Testing with curl
# ===================================================================

"""
# 1. Login as admin and get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@aicmr.dev","password":"Admin123456!"}' \\
  | jq -r '.access_token')

# 2. Create product
curl -X POST http://localhost:8000/api/v1/products/ \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test Product",
    "slug": "test-product",
    "description": "A test product",
    "price": 99.99,
    "stock": 50
  }'

# 3. Get product
curl http://localhost:8000/api/v1/products/1

# 4. Update product
curl -X PATCH http://localhost:8000/api/v1/products/1 \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Updated Product",
    "price": 149.99
  }'

# 5. List products
curl http://localhost:8000/api/v1/products/?page=1&size=10

# 6. Delete product
curl -X DELETE http://localhost:8000/api/v1/products/1 \\
  -H "Authorization: Bearer $TOKEN"
"""

# ===================================================================
# SUMMARY: What We Learned
# ===================================================================

"""
✅ KEY TAKEAWAYS:

1. **Status Codes**
   - CREATE → 201 Created (not 200!)
   - READ → 200 OK
   - UPDATE → 200 OK
   - DELETE → 200 OK

2. **SQLAlchemy Async**
   - Always re-fetch with selectinload() after create
   - Use select() instead of get() for complex queries
   - Eager load relationships to avoid MissingGreenlet

3. **Security**
   - Add csrf_token for POST/PUT/PATCH/DELETE
   - Use require_min_rank() for role-based access
   - Check ownership for user resources

4. **Cache Management**
   - Clear cache after update/delete operations
   - Use FastAPICache.clear(namespace="...")

5. **Testing**
   - Test success cases
   - Test error cases (404, 401, 403)
   - Test validation (400/422)

6. **Code Organization**
   - Models in app/models/
   - Schemas in app/schemas/
   - CRUD in app/crud/
   - Endpoints in app/api/v1/
   - Tests in tests/

Follow this pattern for all new APIs to ensure consistency and avoid bugs!
"""
