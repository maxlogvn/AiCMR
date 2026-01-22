import pytest
from httpx import AsyncClient
from app.models.post import Post
from app.models.user import User
from app.models.category import Category
from app.models.tag import Tag
from app.schemas.post import PostStatus


class TestPostAPI:
    """Test Post API endpoints"""

    @pytest.mark.asyncio
    async def test_list_posts_public(self, client: AsyncClient, test_post):
        """Test list published posts"""
        response = await client.get("/api/v1/posts")

        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "size" in data
        assert isinstance(data["items"], list)
        assert data["total"] >= 1

    @pytest.mark.asyncio
    async def test_list_posts_with_filters(self, client: AsyncClient, test_post, test_category, test_tag):
        """Test list posts with filters"""
        # Filter by category
        response = await client.get(
            f"/api/v1/posts?category_id={test_category.id}"
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data

        # Filter by tags
        response = await client.get(
            f"/api/v1/posts?tags={test_tag.id}"
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data

        # Filter by status
        response = await client.get(
            "/api/v1/posts?status=published"
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data

        # Filter with search
        response = await client.get(
            "/api/v1/posts?search=test"
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data

    @pytest.mark.asyncio
    async def test_get_post_by_slug(self, client: AsyncClient, test_post):
        """Test get post by slug"""
        response = await client.get(f"/api/v1/posts/{test_post.slug}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_post.id
        assert data["title"] == test_post.title
        assert data["slug"] == test_post.slug

    @pytest.mark.asyncio
    async def test_get_post_not_found(self, client: AsyncClient):
        """Test get non-existent post"""
        response = await client.get("/api/v1/posts/non-existent-slug")

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_create_post_unauthorized(self, client: AsyncClient):
        """Test create post without authentication"""
        response = await client.post(
            "/api/v1/posts/me",
            json={
                "title": "Test Post",
                "slug": "test-post",
                "content": "# Test Content",
                "status": "draft",
            },
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_create_post_authorized(
        self, client: AsyncClient, auth_headers, test_user
    ):
        """Test create post with authentication"""
        response = await client.post(
            "/api/v1/posts/me",
            headers=auth_headers,
            json={
                "title": "New Test Post",
                "slug": "new-test-post",
                "excerpt": "Test excerpt",
                "content": "# New Test Content\n\nThis is a new post.",
                "status": "draft",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "New Test Post"
        assert data["slug"] == "new-test-post"
        assert data["status"] == "draft"
        assert data["author_id"] == test_user.id

    @pytest.mark.asyncio
    async def test_create_post_validation(self, client: AsyncClient, auth_headers):
        """Test create post validation"""
        # Missing required fields
        response = await client.post(
            "/api/v1/posts/me",
            headers=auth_headers,
            json={
                "title": "Test Post",
                # Missing slug, content
            },
        )

        assert response.status_code == 422

        # Invalid slug format
        response = await client.post(
            "/api/v1/posts/me",
            headers=auth_headers,
            json={
                "title": "Test Post",
                "slug": "invalid slug!",  # Invalid characters
                "content": "# Test",
            },
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_update_own_post(
        self, client: AsyncClient, auth_headers, test_post, test_user
    ):
        """Test update own post"""
        response = await client.patch(
            f"/api/v1/posts/me/{test_post.id}",
            headers=auth_headers,
            json={
                "title": "Updated Title",
                "excerpt": "Updated excerpt",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["excerpt"] == "Updated excerpt"

    @pytest.mark.asyncio
    async def test_update_other_post_forbidden(
        self, client: AsyncClient, test_post
    ):
        """Test update other user's post"""
        # Create second user
        second_user_data = {
            "email": "second@example.com",
            "username": "seconduser",
            "password": "password123",
        }
        await client.post("/api/v1/auth/register", json=second_user_data)

        # Login as second user
        login_response = await client.post(
            "/api/v1/auth/login",
            data={
                "username": "seconduser",
                "password": "password123",
            },
        )
        token = login_response.json()["access_token"]
        second_auth_headers = {"Authorization": f"Bearer {token}"}

        # Try to update first user's post
        response = await client.patch(
            f"/api/v1/posts/me/{test_post.id}",
            headers=second_auth_headers,
            json={"title": "Hacked Title"},
        )

        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_delete_own_post(
        self, client: AsyncClient, auth_headers, test_post
    ):
        """Test delete own post"""
        response = await client.delete(
            f"/api/v1/posts/me/{test_post.id}",
            headers=auth_headers,
        )

        assert response.status_code == 204

        # Verify post is deleted
        response = await client.get(f"/api/v1/posts/{test_post.slug}")
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_other_post_forbidden(
        self, client: AsyncClient, test_post
    ):
        """Test delete other user's post"""
        # Create second user
        second_user_data = {
            "email": "second2@example.com",
            "username": "seconduser2",
            "password": "password123",
        }
        await client.post("/api/v1/auth/register", json=second_user_data)

        # Login as second user
        login_response = await client.post(
            "/api/v1/auth/login",
            data={
                "username": "seconduser2",
                "password": "password123",
            },
        )
        token = login_response.json()["access_token"]
        second_auth_headers = {"Authorization": f"Bearer {token}"}

        # Try to delete first user's post
        response = await client.delete(
            f"/api/v1/posts/me/{test_post.id}",
            headers=second_auth_headers,
        )

        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_change_post_status(
        self, client: AsyncClient, auth_headers, test_post
    ):
        """Test change post status"""
        # Publish post
        response = await client.patch(
            f"/api/v1/posts/me/{test_post.id}/status",
            headers=auth_headers,
            json={"status": "published"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "published"

        # Archive post
        response = await client.patch(
            f"/api/v1/posts/me/{test_post.id}/status",
            headers=auth_headers,
            json={"status": "archived"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "archived"

    @pytest.mark.asyncio
    async def test_bulk_operations_admin(
        self,
        client: AsyncClient,
        admin_auth_headers,
        test_post,
        db_session,
    ):
        """Test bulk operations (admin only)"""
        # Create test posts
        posts = []
        for i in range(3):
            post = Post(
                title=f"Bulk Test Post {i}",
                slug=f"bulk-test-post-{i}",
                content=f"# Test {i}",
                status=PostStatus.DRAFT,
                author_id=1,  # admin id
                view_count=0,
                like_count=0,
                comment_count=0,
            )
            db_session.add(post)
            posts.append(post)
        await db_session.commit()

        post_ids = [post.id for post in posts]

        # Bulk publish
        response = await client.post(
            "/api/v1/posts/bulk/publish",
            headers=admin_auth_headers,
            json={"post_ids": post_ids},
        )

        assert response.status_code == 200

        # Bulk archive
        response = await client.post(
            "/api/v1/posts/bulk/archive",
            headers=admin_auth_headers,
            json={"post_ids": post_ids},
        )

        assert response.status_code == 200

        # Bulk delete
        response = await client.post(
            "/api/v1/posts/bulk/delete",
            headers=admin_auth_headers,
            json={"post_ids": post_ids},
        )

        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_get_post_raw(
        self, client: AsyncClient, test_post
    ):
        """Test get raw markdown content"""
        response = await client.get(f"/api/v1/posts/{test_post.slug}/raw")

        assert response.status_code == 200
        content = response.text
        assert isinstance(content, str)
        assert len(content) > 0

    @pytest.mark.asyncio
    async def test_list_all_posts_admin(
        self, client: AsyncClient, admin_auth_headers
    ):
        """Test list all posts (admin)"""
        response = await client.get(
            "/api/v1/posts/all",
            headers=admin_auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
