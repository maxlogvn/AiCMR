import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, selectinload
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db
from app.models.user import User
from app.models.post import Post
from app.models.category import Category
from app.models.tag import Tag
from app.models.post_tag import PostTag


# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Create async engine for testing
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
)

# Create async session factory
TestingSessionLocal = sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest.fixture
async def db_session():
    """Create a test database session"""
    async with test_engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        yield session

    # Drop all tables after test
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client(db_session):
    """Create a test client with test database"""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.fixture
async def test_user(db_session):
    """Create a test user"""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYU7y7q6qYhY6",  # "password123"
        is_active=True,
        is_superuser=False,
        rank=1,  # MEMBER_RANK
    )

    db_session.add(user)
    await db_session.flush()
    await db_session.refresh(user)

    return user


@pytest.fixture
async def admin_user(db_session):
    """Create an admin user"""
    admin = User(
        email="admin@example.com",
        username="admin",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYU7y7q6qYhY6",  # "password123"
        is_active=True,
        is_superuser=True,
        rank=10,  # ADMIN_RANK
    )

    db_session.add(admin)
    await db_session.flush()
    await db_session.refresh(admin)

    return admin


@pytest.fixture
async def test_category(db_session):
    """Create a test category"""
    category = Category(
        name="Technology",
        slug="technology",
        description="Technology posts",
        is_active=True,
    )

    db_session.add(category)
    await db_session.flush()
    await db_session.refresh(category)

    return category


@pytest.fixture
async def test_tag(db_session):
    """Create a test tag"""
    tag = Tag(
        name="Python",
        slug="python",
        color="#FF5733",
    )

    db_session.add(tag)
    await db_session.flush()
    await db_session.refresh(tag)

    return tag


@pytest.fixture
async def test_post(db_session, test_user, test_category, test_tag):
    """Create a test post"""
    post = Post(
        title="Test Post",
        slug="test-post",
        excerpt="Test excerpt",
        content="# Test Content\n\nThis is a test post.",
        status="published",
        author_id=test_user.id,
        category_id=test_category.id,
        is_featured=False,
        is_pinned=False,
        view_count=10,
        like_count=5,
        comment_count=3,
    )

    db_session.add(post)
    await db_session.flush()
    await db_session.refresh(post)

    # Add tag
    post_tag = PostTag(post_id=post.id, tag_id=test_tag.id)
    db_session.add(post_tag)

    await db_session.commit()
    await db_session.refresh(post, attribute_names=["tags"])

    return post


@pytest.fixture
async def auth_headers(client: AsyncClient, test_user):
    """Get authentication headers for test user"""
    # Login to get token
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user.username,
            "password": "password123",
        },
    )

    assert response.status_code == 200
    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def admin_auth_headers(client: AsyncClient, admin_user):
    """Get authentication headers for admin user"""
    # Login to get token
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": admin_user.username,
            "password": "password123",
        },
    )

    assert response.status_code == 200
    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def moderator_auth_headers(client: AsyncClient, db_session):
    """Get authentication headers for moderator user"""
    # Create moderator user
    moderator = User(
        email="moderator@example.com",
        username="moderator",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYU7y7q6qYhY6",  # "password123"
        is_active=True,
        is_superuser=False,
        rank=5,  # MODERATOR_RANK
    )

    db_session.add(moderator)
    await db_session.flush()
    await db_session.refresh(moderator)

    # Login to get token
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": moderator.username,
            "password": "password123",
        },
    )

    assert response.status_code == 200
    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


# Import Base after models are imported
from app.models.base import Base
