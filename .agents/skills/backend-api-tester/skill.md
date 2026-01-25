# Backend API Tester Skill - AiCMR

**Version:** 1.0
**Purpose:** Hướng dẫn agents test backend APIs một cách toàn diện, có hệ thống và hiệu quả.

---

## 🎯 Mục Tiêu Skill

Khi người dùng yêu cầu:
- "kiểm tra api", "test api", "test endpoint"
- "verify backend api", "check nếu api hoạt động"
- "debug api error", "tại sao api fail"
- "test toàn bộ backend"

→ LOAD SKILL NÀY TRƯỚC!

---

## 📋 Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Test Framework Setup](#test-framework-setup)
3. [Manual Testing Patterns](#manual-testing-patterns)
4. [Automated Testing with Pytest](#automated-testing-with-pytest)
5. [Test Data Preparation](#test-data-preparation)
6. [Common Test Scenarios](#common-test-scenarios)
7. [Assertion Patterns](#assertion-patterns)
8. [Debugging Failed Tests](#debugging-failed-tests)
9. [Test Checklist](#test-checklist)

---

## 🎲 Testing Strategy

### Testing Pyramid

```
           E2E Tests (10%)
         ↗               ↖
       Integration Tests (30%)
     ↗                       ↖
   Unit Tests (60%)
```

### Test Categories

| Category | Purpose | Tools | Examples |
|----------|---------|-------|----------|
| **Unit Tests** | Test individual functions | pytest | CRUD operations |
| **Integration Tests** | Test API endpoints | pytest + httpx | POST /api/v1/posts |
| **E2E Tests** | Test complete workflows | httpx/curl | Login → Create → View |
| **Manual Tests** | Quick verification | curl/httpx | Debugging issues |

### When to Use What

- **Unit Tests**: CRUD functions, validators, business logic
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: User workflows (login → create post → logout)
- **Manual Tests**: Quick debugging, exploratory testing

---

## 🛠️ Test Framework Setup

### Pytest Configuration

**File: `backend/pytest.ini`**
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
asyncio_mode = auto
addopts =
    -v
    --strict-markers
    --tb=short
markers =
    unit: Unit tests
    integration: Integration tests
    e2e: End-to-end tests
    slow: Slow-running tests
```

### Test Fixtures

**File: `backend/tests/conftest.py`**

```python
import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.config import settings
from app.models.base import Base
from app.models.user import User


# ===== Database Fixtures =====

@pytest.fixture(scope="session")
async def engine():
    """Create test database engine"""
    engine = create_async_engine(
        f"mysql+aiomysql://{settings.DB_USER}:{settings.DB_PASSWORD}@"
        f"{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}_test"
    )

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    # Cleanup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest.fixture
async def db_session(engine) -> AsyncSession:
    """Create test database session"""
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        yield session
        # Rollback after test
        await session.rollback()


# ===== HTTP Client Fixtures =====

@pytest.fixture
async def client() -> AsyncClient:
    """Create test HTTP client"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


# ===== User Fixtures =====

@pytest.fixture
async def test_user(db_session: AsyncSession):
    """Create test user"""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password="$2b$12$...",  # hashed "password123"
        is_active=True,
        rank=1  # Member
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture
async def admin_user(db_session: AsyncSession):
    """Create admin user"""
    user = User(
        email="admin@example.com",
        username="admin",
        hashed_password="$2b$12$...",  # hashed "Admin123456!"
        is_active=True,
        rank=10  # Admin
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


# ===== Auth Header Fixtures =====

@pytest.fixture
async def user_headers(client: AsyncClient, test_user: User):
    """Get authentication headers for regular user"""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def admin_headers(client: AsyncClient, admin_user: User):
    """Get authentication headers for admin user"""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "admin@example.com",
            "password": "Admin123456!"
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def csrf_token(client: AsyncClient, admin_headers: dict):
    """Get CSRF token for state-changing operations"""
    response = await client.get("/api/v1/csrf-token")
    return response.json()["csrf_token"]
```

---

## 🧪 Manual Testing Patterns

### Pattern 1: Quick Health Check

```python
import asyncio
import httpx

async def quick_health_check():
    """Check if backend is running"""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get("http://localhost:8000/health", timeout=2.0)
            if resp.status_code == 200:
                print("✅ Backend is healthy")
                return True
            else:
                print(f"❌ Backend returned {resp.status_code}")
                return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

asyncio.run(quick_health_check())
```

### Pattern 2: Test Single Endpoint

```python
async def test_create_post():
    """Test POST /api/v1/posts/me"""

    # Step 1: Login
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "test@example.com", "password": "password123"}
        )

        if resp.status_code != 200:
            print(f"❌ Login failed: {resp.text}")
            return

        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Step 2: Get CSRF token
        resp = await client.get("http://localhost:8000/api/v1/csrf-token")
        csrf_token = resp.json()["csrf_token"]
        headers["X-CSRF-Token"] = csrf_token

        # Step 3: Create post
        resp = await client.post(
            "http://localhost:8000/api/v1/posts/me",
            json={
                "title": "Test Post",
                "slug": "test-post",
                "content": "Test content",
                "excerpt": "Test",
                "status": "draft"
            },
            headers=headers
        )

        # Step 4: Verify
        print(f"Status Code: {resp.status_code}")
        if resp.status_code == 201:
            print("✅ SUCCESS: Returns 201 Created")
            data = resp.json()
            print(f"   Post ID: {data.get('id')}")
            print(f"   Title: {data.get('title')}")
        else:
            print(f"❌ FAILED: {resp.text}")

asyncio.run(test_create_post())
```

### Pattern 3: Test Multiple Endpoints

```python
async def test_post_crud():
    """Test full CRUD for posts"""

    async with httpx.AsyncClient() as client:
        # Login
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "Admin123456!"}
        )
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Get CSRF
        resp = await client.get("http://localhost:8000/api/v1/csrf-token")
        csrf_token = resp.json()["csrf_token"]
        headers["X-CSRF-Token"] = csrf_token

        post_id = None

        # CREATE
        print("\n" + "="*60)
        print("TEST 1: CREATE Post")
        print("="*60)
        resp = await client.post(
            "http://localhost:8000/api/v1/posts/me",
            json={
                "title": "CRUD Test Post",
                "slug": f"crud-test-{asyncio.get_event_loop().time()}",
                "content": "Testing CRUD",
                "excerpt": "Test",
                "status": "draft"
            },
            headers=headers
        )
        print(f"Status: {resp.status_code}")
        if resp.status_code == 201:
            post_id = resp.json()["id"]
            print(f"✅ Created post ID: {post_id}")
        else:
            print(f"❌ Create failed: {resp.text}")
            return

        # READ
        print("\n" + "="*60)
        print("TEST 2: READ Post")
        print("="*60)
        resp = await client.get(f"http://localhost:8000/api/v1/posts/me/{post_id}", headers=headers)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"✅ Retrieved post: {resp.json()['title']}")
        else:
            print(f"❌ Read failed: {resp.text}")

        # UPDATE
        print("\n" + "="*60)
        print("TEST 3: UPDATE Post")
        print("="*60)
        resp = await client.patch(
            f"http://localhost:8000/api/v1/posts/me/{post_id}",
            json={"title": "Updated CRUD Test Post"},
            headers=headers
        )
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"✅ Updated title: {resp.json()['title']}")
        else:
            print(f"❌ Update failed: {resp.text}")

        # DELETE
        print("\n" + "="*60)
        print("TEST 4: DELETE Post")
        print("="*60)
        resp = await client.delete(f"http://localhost:8000/api/v1/posts/me/{post_id}", headers=headers)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"✅ Deleted post")
        else:
            print(f"❌ Delete failed: {resp.text}")

asyncio.run(test_post_crud())
```

### Pattern 4: Batch Test Multiple APIs

```python
async def test_all_create_endpoints():
    """Test all CREATE endpoints to verify 201 status"""

    async with httpx.AsyncClient() as client:
        # Login as admin
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "Admin123456!"}
        )
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Get CSRF
        resp = await client.get("http://localhost:8000/api/v1/csrf-token")
        csrf_token = resp.json()["csrf_token"]
        headers["X-CSRF-Token"] = csrf_token

        tests = [
            {
                "name": "POST /api/v1/categories/",
                "method": "POST",
                "url": "http://localhost:8000/api/v1/categories/",
                "data": {
                    "name": "Test Category",
                    "slug": f"test-cat-{asyncio.get_event_loop().time()}",
                    "description": "Test"
                },
                "expected": 201
            },
            {
                "name": "POST /api/v1/tags/",
                "method": "POST",
                "url": "http://localhost:8000/api/v1/tags/",
                "data": {
                    "name": "Test Tag",
                    "slug": f"test-tag-{asyncio.get_event_loop().time()}",
                    "color": "#FF0000"
                },
                "expected": 201
            },
            {
                "name": "POST /api/v1/posts/me",
                "method": "POST",
                "url": "http://localhost:8000/api/v1/posts/me",
                "data": {
                    "title": "Test Post",
                    "slug": f"test-post-{asyncio.get_event_loop().time()}",
                    "content": "Test",
                    "excerpt": "Test",
                    "status": "draft"
                },
                "expected": 201
            }
        ]

        results = {"passed": 0, "failed": 0, "total": len(tests)}

        print("="*80)
        print(f"Testing {len(tests)} CREATE endpoints")
        print("="*80)

        for test in tests:
            print(f"\n{test['name']}")
            print("-" * 80)

            resp = await client.request(
                test['method'],
                test['url'],
                json=test['data'],
                headers=headers
            )

            if resp.status_code == test['expected']:
                print(f"✅ PASSED - Status: {resp.status_code}")
                results["passed"] += 1
            else:
                print(f"❌ FAILED - Expected {test['expected']}, got {resp.status_code}")
                print(f"   Response: {resp.text[:200]}")
                results["failed"] += 1

        print("\n" + "="*80)
        print(f"Results: {results['passed']}/{results['total']} passed")
        if results['failed'] > 0:
            print(f"❌ {results['failed']} tests failed")
        else:
            print(f"✅ All tests passed!")
        print("="*80)

asyncio.run(test_all_create_endpoints())
```

---

## 🤖 Automated Testing with Pytest

### Test Structure

```python
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

# Mark tests
@pytest.mark.integration
@pytest.mark.asyncio
async def test_create_post_success(
    client: AsyncClient,
    user_headers: dict,
    db_session: AsyncSession
):
    """Test successful post creation"""

    # Arrange
    post_data = {
        "title": "Test Post",
        "slug": "test-post",
        "content": "Test content",
        "excerpt": "Test",
        "status": "draft"
    }

    # Act
    response = await client.post(
        "/api/v1/posts/me",
        json=post_data,
        headers=user_headers
    )

    # Assert
    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Test Post"
    assert data["slug"] == "test-post"
    assert "id" in data
    assert data["status"] == "draft"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_create_post_unauthorized(client: AsyncClient):
    """Test that unauthorized users cannot create posts"""

    response = await client.post(
        "/api/v1/posts/me",
        json={
            "title": "Unauthorized Post",
            "slug": "unauthorized",
            "content": "Test"
        }
        # No auth headers
    )

    assert response.status_code == 401


@pytest.mark.integration
@pytest.mark.asyncio
async def test_get_post_not_found(client: AsyncClient):
    """Test getting non-existent post returns 404"""

    response = await client.get("/api/v1/posts/99999")

    assert response.status_code == 404


@pytest.mark.integration
@pytest.mark.asyncio
async def test_update_post_success(
    client: AsyncClient,
    user_headers: dict,
    test_post: int  # Assuming fixture creates post and returns ID
):
    """Test updating post"""

    response = await client.patch(
        f"/api/v1/posts/me/{test_post}",
        json={"title": "Updated Title"},
        headers=user_headers
    )

    assert response.status_code == 200

    data = response.json()
    assert data["title"] == "Updated Title"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_delete_post_success(
    client: AsyncClient,
    user_headers: dict,
    test_post: int
):
    """Test deleting post"""

    response = await client.delete(
        f"/api/v1/posts/me/{test_post}",
        headers=user_headers
    )

    assert response.status_code == 200
    assert "message" in response.json()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_list_posts_pagination(client: AsyncClient):
    """Test post list pagination"""

    response = await client.get("/api/v1/posts/?page=1&size=10")

    assert response.status_code == 200

    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "size" in data
    assert data["page"] == 1
    assert data["size"] == 10
```

### Parameterized Tests

```python
@pytest.mark.integration
@pytest.mark.asyncio
@pytest.mark.parametrize(
    "endpoint,method,data,expected_status",
    [
        ("/api/v1/categories/", "POST", {"name": "Test", "slug": "test"}, 201),
        ("/api/v1/tags/", "POST", {"name": "Test", "slug": "test", "color": "#FF0000"}, 201),
        ("/api/v1/posts/me", "POST", {"title": "Test", "slug": "test", "content": "Test", "excerpt": "T", "status": "draft"}, 201),
    ]
)
async def test_create_endpoints(
    client: AsyncClient,
    admin_headers: dict,
    endpoint: str,
    method: str,
    data: dict,
    expected_status: int
):
    """Test CREATE endpoints return correct status codes"""

    response = await client.request(
        method,
        endpoint,
        json=data,
        headers=admin_headers
    )

    assert response.status_code == expected_status
```

### Test Classes

```python
@pytest.mark.integration
class TestPostAPI:
    """Test suite for Post API"""

    async def test_create_post(self, client: AsyncClient, user_headers: dict):
        """Test POST /api/v1/posts/me"""
        response = await client.post(
            "/api/v1/posts/me",
            json={
                "title": "Test",
                "slug": "test",
                "content": "Test",
                "excerpt": "T",
                "status": "draft"
            },
            headers=user_headers
        )
        assert response.status_code == 201

    async def test_get_post(self, client: AsyncClient, test_post_id: int):
        """Test GET /api/v1/posts/{id}"""
        response = await client.get(f"/api/v1/posts/{test_post_id}")
        assert response.status_code == 200

    async def test_update_post(self, client: AsyncClient, user_headers: dict, test_post_id: int):
        """Test PATCH /api/v1/posts/me/{id}"""
        response = await client.patch(
            f"/api/v1/posts/me/{test_post_id}",
            json={"title": "Updated"},
            headers=user_headers
        )
        assert response.status_code == 200

    async def test_delete_post(self, client: AsyncClient, user_headers: dict, test_post_id: int):
        """Test DELETE /api/v1/posts/me/{id}"""
        response = await client.delete(
            f"/api/v1/posts/me/{test_post_id}",
            headers=user_headers
        )
        assert response.status_code == 200
```

---

## 📊 Test Data Preparation

### Factory Pattern

```python
# tests/factories.py

import random
import string
from datetime import datetime

def random_string(length=10):
    """Generate random string"""
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def random_email():
    """Generate random email"""
    return f"{random_string()}@example.com"

class TestUserData:
    """Factory for test user data"""

    @staticmethod
    def create(**kwargs):
        """Create test user data with defaults"""
        defaults = {
            "email": random_email(),
            "username": random_string(),
            "password": "TestPassword123!",
            "is_active": True,
            "rank": 1
        }
        defaults.update(kwargs)
        return defaults

class TestPostData:
    """Factory for test post data"""

    @staticmethod
    def create(**kwargs):
        """Create test post data with defaults"""
        timestamp = datetime.now().timestamp()
        defaults = {
            "title": f"Test Post {timestamp}",
            "slug": f"test-post-{int(timestamp)}",
            "content": "Test content",
            "excerpt": "Test",
            "status": "draft"
        }
        defaults.update(kwargs)
        return defaults

class TestCategoryData:
    """Factory for test category data"""

    @staticmethod
    def create(**kwargs):
        """Create test category data with defaults"""
        timestamp = datetime.now().timestamp()
        defaults = {
            "name": f"Test Category {timestamp}",
            "slug": f"test-category-{int(timestamp)}",
            "description": "Test"
        }
        defaults.update(kwargs)
        return defaults
```

### Using Factories in Tests

```python
from tests.factories import TestPostData, TestCategoryData

@pytest.mark.asyncio
async def test_with_factory(client: AsyncClient, admin_headers: dict):
    """Test using factory data"""

    # Create with defaults
    post_data = TestPostData.create()

    # Or override specific fields
    custom_post = TestPostData.create(
        title="Custom Title",
        status="published"
    )

    response = await client.post(
        "/api/v1/posts/me",
        json=custom_post,
        headers=admin_headers
    )

    assert response.status_code == 201
```

---

## 🎯 Common Test Scenarios

### Scenario 1: Success Case

```python
@pytest.mark.asyncio
async def test_success_scenario(client: AsyncClient, admin_headers: dict):
    """Test happy path - everything works"""

    # Create
    response = await client.post(
        "/api/v1/categories/",
        json={"name": "Test", "slug": "test", "description": "Test"},
        headers=admin_headers
    )
    assert response.status_code == 201
    category_id = response.json()["id"]

    # Read
    response = await client.get(f"/api/v1/categories/{category_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Test"

    # Update
    response = await client.patch(
        f"/api/v1/categories/{category_id}",
        json={"name": "Updated"},
        headers=admin_headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated"

    # Delete
    response = await client.delete(
        f"/api/v1/categories/{category_id}",
        headers=admin_headers
    )
    assert response.status_code == 200
```

### Scenario 2: Authentication Required

```python
@pytest.mark.asyncio
async def test_authentication_required(client: AsyncClient):
    """Test that endpoint requires authentication"""

    # Without auth
    response = await client.post(
        "/api/v1/categories/",
        json={"name": "Test", "slug": "test"}
    )
    assert response.status_code == 401  # Unauthorized

    # With invalid token
    response = await client.post(
        "/api/v1/categories/",
        json={"name": "Test", "slug": "test"},
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401
```

### Scenario 3: Authorization Required

```python
@pytest.mark.asyncio
async def test_admin_only_endpoint(
    client: AsyncClient,
    user_headers: dict,  # Regular user
    admin_headers: dict  # Admin
):
    """Test that endpoint requires admin role"""

    # Regular user should be forbidden
    response = await client.post(
        "/api/v1/categories/",
        json={"name": "Test", "slug": "test"},
        headers=user_headers
    )
    assert response.status_code == 403  # Forbidden

    # Admin should succeed
    response = await client.post(
        "/api/v1/categories/",
        json={"name": "Test2", "slug": "test2"},
        headers=admin_headers
    )
    assert response.status_code == 201
```

### Scenario 4: Validation Errors

```python
@pytest.mark.asyncio
async def test_validation_errors(client: AsyncClient, admin_headers: dict):
    """Test input validation"""

    # Missing required field
    response = await client.post(
        "/api/v1/categories/",
        json={"name": "Test"}  # Missing slug
        headers=admin_headers
    )
    assert response.status_code == 422  # Validation error

    # Invalid data type
    response = await client.post(
        "/api/v1/categories/",
        json={"name": 123, "slug": "test"},  # name should be string
        headers=admin_headers
    )
    assert response.status_code == 422
```

### Scenario 5: Not Found

```python
@pytest.mark.asyncio
async def test_not_found(client: AsyncClient):
    """Test 404 response"""

    response = await client.get("/api/v1/categories/99999")
    assert response.status_code == 404

    data = response.json()
    assert "detail" in data
    assert "not found" in data["detail"].lower()
```

### Scenario 6: Duplicate Data

```python
@pytest.mark.asyncio
async def test_duplicate_slug(client: AsyncClient, admin_headers: dict):
    """Test duplicate slug handling"""

    slug = "duplicate-test"

    # Create first category
    response = await client.post(
        "/api/v1/categories/",
        json={"name": "First", "slug": slug},
        headers=admin_headers
    )
    assert response.status_code == 201

    # Try to create duplicate
    response = await client.post(
        "/api/v1/categories/",
        json={"name": "Second", "slug": slug},
        headers=admin_headers
    )
    # Should either return 400 (bad request) or 200 (if updates existing)
    assert response.status_code in [400, 409, 200]
```

---

## ✅ Assertion Patterns

### Status Code Assertions

```python
# Single status code
assert response.status_code == 200

# Multiple acceptable codes
assert response.status_code in [200, 201]

# Range check
assert 200 <= response.status_code < 300

# Using HTTP status constants
from http import HTTPStatus
assert response.status_code == HTTPStatus.CREATED
```

### Response Data Assertions

```python
# Check response is JSON
data = response.json()
assert isinstance(data, dict)

# Check fields exist
assert "id" in data
assert "title" in data

# Check field values
assert data["title"] == "Expected Title"
assert data["id"] > 0

# Check nested fields
assert data["user"]["email"] == "test@example.com"

# Check list
assert isinstance(data["items"], list)
assert len(data["items"]) > 0
```

### Database Assertions

```python
# Check record exists
result = await db_session.execute(
    select(Post).where(Post.id == post_id)
)
post = result.scalar_one_or_none()
assert post is not None

# Check record count
result = await db_session.execute(
    select(func.count()).select_from(Post)
)
count = result.scalar()
assert count > 0

# Check field values
assert post.title == "Expected"
assert post.is_active is True
```

### Header Assertions

```python
# Check content type
assert response.headers["content-type"] == "application/json"

# Check auth header
assert "authorization" in response.headers
```

---

## 🐛 Debugging Failed Tests

### Enable Detailed Output

```bash
# Run with verbose output
pytest -v tests/test_api.py

# Show print statements
pytest -s tests/test_api.py

# Show local variables on failure
pytest -l tests/test_api.py

# Very verbose traceback
pytest --vv tests/test_api.py
```

### Debug Specific Test

```bash
# Run single test
pytest tests/test_api.py::test_create_post

# Run with pdb debugger
pytest --pdb tests/test_api.py::test_create_post

# Stop on first failure
pytest -x tests/test_api.py
```

### Print Debugging

```python
@pytest.mark.asyncio
async def test_with_debug(client: AsyncClient):
    """Test with debug output"""

    response = await client.get("/api/v1/posts/")

    # Print status
    print(f"\nStatus: {response.status_code}")

    # Print headers
    print(f"Headers: {dict(response.headers)}")

    # Print body
    print(f"Response: {response.text}")

    # Pretty print JSON
    import json
    try:
        print(f"JSON: {json.dumps(response.json(), indent=2)}")
    except:
        pass

    assert response.status_code == 200
```

### Common Failures and Solutions

#### Failure 1: 401 Unauthorized

```python
# Problem
assert response.status_code == 201
# Got 401

# Solution: Check auth headers
headers = {"Authorization": f"Bearer {token}"}
assert "Authorization" in headers
assert token is not None
```

#### Failure 2: 403 Forbidden

```python
# Problem
assert response.status_code == 201
# Got 403

# Solution: Check user role
# User might not have required rank
# Check with: user.rank >= ADMIN_RANK
```

#### Failure 3: 422 Validation Error

```python
# Problem
assert response.status_code == 201
# Got 422

# Solution: Check request body
# Print validation errors
if response.status_code == 422:
    print(response.json())  # Shows validation errors
```

#### Failure 4: 500 Server Error

```python
# Problem
assert response.status_code == 201
# Got 500

# Solution: Check backend logs
# docker logs aicmr-backend
# or check test output for traceback
```

---

## ✅ Test Checklist

### Before Writing Tests

- [ ] Understand API endpoint requirements
- [ ] Identify success scenarios
- [ ] Identify failure scenarios
- [ ] List all edge cases
- [ ] Prepare test data

### While Writing Tests

- [ ] Test success case (200/201)
- [ ] Test authentication (401)
- [ ] Test authorization (403)
- [ ] Test not found (404)
- [ ] Test validation errors (422)
- [ ] Test conflicts (409)
- [ ] Test pagination (if applicable)
- [ ] Test filtering (if applicable)

### Before Committing Tests

- [ ] All tests pass: `pytest -v`
- [ ] Code coverage acceptable: `pytest --cov`
- [ ] No flaky tests
- [ ] Tests run fast (< 30s total)
- [ ] Tests are independent
- [ ] Tests cleanup after themselves

### Test Quality Checklist

- [ ] Tests are readable
- [ ] Tests have clear names
- [ ] Tests have docstrings
- [ ] Assertions are specific
- [ ] Tests use fixtures appropriately
- [ ] No hardcoded values (use factories)
- [ ] Tests are maintainable

---

## 📦 Quick Test Scripts

### Script 1: Smoke Test

```python
# scripts/smoke_test.py
"""Quick smoke test to verify backend is working"""

import asyncio
import httpx

async def smoke_test():
    """Run basic smoke tests"""
    tests_passed = 0
    tests_failed = 0

    async with httpx.AsyncClient() as client:
        print("="*60)
        print("SMOKE TEST")
        print("="*60)

        # Test 1: Health check
        print("\n1. Health Check...")
        try:
            resp = await client.get("http://localhost:8000/health", timeout=2)
            if resp.status_code == 200:
                print("   ✅ PASS")
                tests_passed += 1
            else:
                print(f"   ❌ FAIL - Status: {resp.status_code}")
                tests_failed += 1
        except Exception as e:
            print(f"   ❌ FAIL - Error: {e}")
            tests_failed += 1

        # Test 2: Login
        print("\n2. Login...")
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "Admin123456!"}
        )
        if resp.status_code == 200:
            print("   ✅ PASS")
            tests_passed += 1
            token = resp.json()["access_token"]
        else:
            print(f"   ❌ FAIL - Status: {resp.status_code}")
            tests_failed += 1
            token = None

        if token:
            # Test 3: Protected endpoint
            print("\n3. Protected Endpoint...")
            resp = await client.get(
                "http://localhost:8000/api/v1/users/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            if resp.status_code == 200:
                print("   ✅ PASS")
                tests_passed += 1
            else:
                print(f"   ❌ FAIL - Status: {resp.status_code}")
                tests_failed += 1

        print("\n" + "="*60)
        print(f"Results: {tests_passed} passed, {tests_failed} failed")
        print("="*60)

        return tests_failed == 0

if __name__ == "__main__":
    success = asyncio.run(smoke_test())
    exit(0 if success else 1)
```

### Script 2: Comprehensive API Test

```python
# scripts/comprehensive_api_test.py
"""Comprehensive API test suite"""

import asyncio
import httpx
from typing import Dict, List, Any

class APITester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.client = None
        self.token = None
        self.results = []

    async def __aenter__(self):
        self.client = httpx.AsyncClient(base_url=self.base_url)
        return self

    async def __aexit__(self, *args):
        await self.client.aclose()

    async def login(self, email: str, password: str):
        """Login and store token"""
        resp = await self.client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password}
        )
        if resp.status_code == 200:
            self.token = resp.json()["access_token"]
            return True
        return False

    def get_headers(self) -> Dict[str, str]:
        """Get auth headers"""
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    async def test_endpoint(
        self,
        name: str,
        method: str,
        endpoint: str,
        expected_status: int,
        data: Dict[str, Any] = None,
        params: Dict[str, Any] = None,
        check_response: callable = None
    ):
        """Test a single endpoint"""
        print(f"\n{name}")
        print("-" * 60)

        headers = self.get_headers()

        resp = await self.client.request(
            method,
            endpoint,
            json=data,
            params=params,
            headers=headers
        )

        passed = resp.status_code == expected_status

        if passed:
            print(f"✅ PASS - Status: {resp.status_code}")
        else:
            print(f"❌ FAIL - Expected {expected_status}, got {resp.status_code}")
            print(f"   Response: {resp.text[:200]}")

        # Custom check
        if passed and check_response:
            try:
                check_response(resp)
            except AssertionError as e:
                print(f"❌ FAIL - Custom check failed: {e}")
                passed = False

        self.results.append({
            "name": name,
            "passed": passed,
            "status": resp.status_code,
            "expected": expected_status
        })

        return passed

    def print_summary(self):
        """Print test summary"""
        total = len(self.results)
        passed = sum(1 for r in self.results if r["passed"])
        failed = total - passed

        print("\n" + "="*80)
        print("SUMMARY")
        print("="*80)
        print(f"Total: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")

        if failed > 0:
            print("\nFailed Tests:")
            for r in self.results:
                if not r["passed"]:
                    print(f"  - {r['name']}")
                    print(f"    Expected: {r['expected']}, Got: {r['status']}")

        print("="*80)

async def run_comprehensive_test():
    """Run comprehensive API test"""

    async with APITester() as tester:
        print("="*80)
        print("COMPREHENSIVE API TEST")
        print("="*80)

        # Login
        print("\n1. Logging in...")
        if not await tester.login("admin@example.com", "Admin123456!"):
            print("❌ Login failed")
            return
        print("✅ Login successful")

        # Test suite
        await tester.test_endpoint(
            "2. GET /api/v1/categories/",
            "GET",
            "/api/v1/categories/",
            200
        )

        await tester.test_endpoint(
            "3. POST /api/v1/categories/ (Create)",
            "POST",
            "/api/v1/categories/",
            201,
            data={
                "name": "Test Category",
                "slug": f"test-cat-{asyncio.get_event_loop().time()}",
                "description": "Test"
            },
            check_response=lambda r: r.json().get("id") is not None
        )

        await tester.test_endpoint(
            "4. GET /api/v1/posts/",
            "GET",
            "/api/v1/posts/",
            200
        )

        await tester.test_endpoint(
            "5. POST /api/v1/posts/me (Create)",
            "POST",
            "/api/v1/posts/me",
            201,
            data={
                "title": "Test Post",
                "slug": f"test-post-{asyncio.get_event_loop().time()}",
                "content": "Test content",
                "excerpt": "Test",
                "status": "draft"
            }
        )

        await tester.test_endpoint(
            "6. GET /api/v1/tags/",
            "GET",
            "/api/v1/tags/",
            200
        )

        await tester.test_endpoint(
            "7. GET /api/v1/users/me",
            "GET",
            "/api/v1/users/me",
            200
        )

        await tester.test_endpoint(
            "8. GET /api/v1/stats/overview",
            "GET",
            "/api/v1/stats/overview",
            200
        )

        # Print summary
        tester.print_summary()

if __name__ == "__main__":
    asyncio.run(run_comprehensive_test())
```

---

## 🎯 Testing Best Practices

### DO's ✅

1. **Use descriptive test names**
   ```python
   # Good
   async def test_create_post_returns_201_when_user_is_authenticated():

   # Bad
   async def test_1():
   ```

2. **Follow AAA pattern** (Arrange-Act-Assert)
   ```python
   async def test_update_post():
       # Arrange
       post_id = await create_test_post()
       update_data = {"title": "Updated"}

       # Act
       response = await client.patch(f"/posts/{post_id}", json=update_data)

       # Assert
       assert response.status_code == 200
       assert response.json()["title"] == "Updated"
   ```

3. **Use fixtures for common setup**
   ```python
   # Good
   async def test_with_fixture(client: AsyncClient, admin_headers: dict):
       response = await client.get("/users/me", headers=admin_headers)

   # Bad
   async def test_without_fixture():
       client = AsyncClient(base_url="http://test")
       resp = await client.post("/login", ...)
       headers = {"Authorization": f"Bearer {resp.json()['token']}"}
       response = await client.get("/users/me", headers=headers)
   ```

4. **Test one thing per test**
   ```python
   # Good
   async def test_create_post_returns_201():
       # Only test status code

   async def test_create_post_sets_created_at():
       # Only test timestamp

   # Bad
   async def test_create_post():
       # Tests everything at once
   ```

### DON'Ts ❌

1. **Don't test frameworks**
   ```python
   # Bad - testing FastAPI
   async def test_route_exists():
       assert client.app.routes[0].path == "/api/v1/posts"

   # Good - test behavior
   async def test_posts_endpoint_returns_list():
       response = await client.get("/api/v1/posts/")
       assert isinstance(response.json()["items"], list)
   ```

2. **Don't use hardcoded values**
   ```python
   # Bad
   async def test_get_post():
       response = await client.get("/api/v1/posts/1")  # Hardcoded ID

   # Good
   async def test_get_post(test_post_id: int):
       response = await client.get(f"/api/v1/posts/{test_post_id}")
   ```

3. **Don't ignore test failures**
   ```python
   # Bad
   try:
       assert response.status_code == 200
   except:
       pass  # Ignore failure

   # Good
   assert response.status_code == 200, f"Expected 200, got {response.status_code}"
   ```

4. **Don't make tests dependent**
   ```python
   # Bad - tests depend on execution order
   async def test_1_create_post():
       # Creates post with ID 1

   async def test_2_update_post():
       # Assumes post ID 1 exists from test_1

   # Good - each test is independent
   async def test_update_post(test_post_id):
       # Creates its own test data
   ```

---

## 📚 Quick Reference

### Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific file
pytest tests/test_posts.py

# Run specific test
pytest tests/test_posts.py::test_create_post

# Run with coverage
pytest --cov=app --cov-report=html

# Stop on first failure
pytest -x

# Show print statements
pytest -s
```

### Common Marks

```python
@pytest.mark.unit        # Unit tests
@pytest.mark.integration # Integration tests
@pytest.mark.e2e         # End-to-end tests
@pytest.mark.slow        # Slow tests
@pytest.mark.asyncio     # Async tests
```

### Run by Mark

```bash
# Run only unit tests
pytest -m unit

# Run only integration tests
pytest -m integration

# Skip slow tests
pytest -m "not slow"
```

---

**Version:** 1.0
**Last Updated:** 2026-01-23

---

**🎯 Remember:** Good tests catch bugs early, document expected behavior, and enable safe refactoring. Invest time in writing quality tests!
