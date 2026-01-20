# Test Example - Pytest

Ví dụ test pytest cho FastAPI backend.

## Test File Structure

```python
# tests/test_main.py
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.main import app

# Test database setup
@pytest.fixture
async def db_session():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
    await engine.dispose()

@pytest.fixture
async def client(db_session: AsyncSession):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
```

## API Endpoint Tests

```python
@pytest.mark.asyncio
async def test_read_main(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    user_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    response = await client.post("/api/v1/users/", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
```

## Authentication Tests

```python
@pytest.mark.asyncio
async def test_protected_endpoint_without_auth(client: AsyncClient):
    response = await client.get("/api/v1/users/profile")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_protected_endpoint_with_auth(client: AsyncClient):
    # Login first
    login_data = {"email": "test@example.com", "password": "password123"}
    login_response = await client.post("/api/v1/auth/login", json=login_data)
    token = login_response.json()["access_token"]

    # Access protected endpoint
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/api/v1/users/profile", headers=headers)
    assert response.status_code == 200
```

## Run Tests

```bash
# All tests
docker compose exec backend pytest

# Specific file
docker compose exec backend pytest tests/test_main.py

# Specific test
docker compose exec backend pytest tests/test_main.py::test_read_main

# Verbose
docker compose exec backend pytest -v

# Show logs
docker compose exec backend pytest -s

# Coverage
docker compose exec backend pytest --cov=app --cov-report=html
```

## Tham Chiếu
- Docker workflow: `concepts/docker-workflow.md`
- Debugging: `guides/debugging.md`
- Common errors: `errors/common-errors.md`
