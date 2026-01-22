import pytest
from sqlalchemy import select
from app.crud.crud_post import (
    get_post_by_id,
    get_post_by_slug,
    get_all_posts,
    create_post,
    update_post,
    delete_post,
    increment_post_view_count,
    get_user_posts,
    get_published_posts,
)
from app.models.post import Post
from app.models.user import User
from app.models.category import Category
from app.models.tag import Tag
from app.schemas.post import PostStatus, PostCreate, PostUpdate


class TestPostCRUD:
    """Test Post CRUD operations"""

    @pytest.mark.asyncio
    async def test_get_by_id(self, db_session, test_post):
        """Test get post by ID"""
        post = await get_post_by_id(db_session, test_post.id)

        assert post is not None
        assert post.id == test_post.id
        assert post.title == test_post.title
        assert post.slug == test_post.slug

    @pytest.mark.asyncio
    async def test_get_by_id_not_found(self, db_session):
        """Test get non-existent post by ID"""
        post = await get_post_by_id(db_session, 999999)

        assert post is None

    @pytest.mark.asyncio
    async def test_get_by_slug(self, db_session, test_post):
        """Test get post by slug"""
        post = await get_post_by_slug(db_session, test_post.slug)

        assert post is not None
        assert post.id == test_post.id
        assert post.slug == test_post.slug

    @pytest.mark.asyncio
    async def test_get_by_slug_not_found(self, db_session):
        """Test get non-existent post by slug"""
        post = await get_post_by_slug(db_session, "non-existent-slug")

        assert post is None

    @pytest.mark.asyncio
    async def test_get_all_with_filters(self, db_session, test_post, test_user):
        """Test get all posts with filters"""
        # Create multiple posts
        for i in range(5):
            post = Post(
                title=f"Test Post {i}",
                slug=f"test-post-{i}",
                content=f"# Test {i}",
                status=PostStatus.PUBLISHED,
                author_id=test_user.id,
                view_count=0,
                like_count=0,
                comment_count=0,
            )
            db_session.add(post)

        await db_session.commit()

        # Get all published posts
        result = await get_all_posts(
            db_session,
            page=1,
            pageSize=10,
            status=PostStatus.PUBLISHED,
        )

        assert result.total >= 6  # 5 new + 1 test_post
        assert len(result.items) >= 6
        assert result.page == 1
        assert result.size == 10

        # Filter by status
        result = await get_all_posts(
            db_session,
            page=1,
            pageSize=10,
            status=PostStatus.DRAFT,
        )

        assert len(result.items) == 0

        # Filter by author
        result = await get_all_posts(
            db_session,
            page=1,
            pageSize=10,
            author_id=test_user.id,
        )

        assert result.total >= 6

        # Filter by category
        result = await get_all_posts(
            db_session,
            page=1,
            pageSize=10,
            category_id=test_post.category_id,
        )

        assert result.total >= 1

        # Filter with search
        result = await get_all_posts(
            db_session,
            page=1,
            pageSize=10,
            search="test",
        )

        assert result.total >= 6

        # Sort by view count
        result = await get_all_posts(
            db_session,
            page=1,
            pageSize=10,
            sort_by="view_count",
            sort_order="desc",
        )

        assert len(result.items) > 0

    @pytest.mark.asyncio
    async def test_create_post(self, db_session, test_user, test_category):
        """Test create post"""
        post_data = PostCreate(
            title="New Post",
            slug="new-post",
            excerpt="New excerpt",
            content="# New Post\n\nContent here",
            category_id=test_category.id,
            status=PostStatus.DRAFT,
        )

        post = await create_post(db_session, post_data, test_user.id)

        assert post.id is not None
        assert post.title == "New Post"
        assert post.slug == "new-post"
        assert post.author_id == test_user.id
        assert post.category_id == test_category.id
        assert post.status == PostStatus.DRAFT

        # Verify in database
        stmt = select(Post).where(Post.id == post.id)
        result = await db_session.execute(stmt)
        db_post = result.scalar_one()

        assert db_post is not None

    @pytest.mark.asyncio
    async def test_update_post(self, db_session, test_post):
        """Test update post"""
        update_data = PostUpdate(
            title="Updated Title",
            excerpt="Updated excerpt",
            content="# Updated Content",
        )

        updated_post = await update_post(db_session, test_post.id, update_data)

        assert updated_post.id == test_post.id
        assert updated_post.title == "Updated Title"
        assert updated_post.excerpt == "Updated excerpt"

        # Refresh from database
        await db_session.refresh(test_post)
        assert test_post.title == "Updated Title"

    @pytest.mark.asyncio
    async def test_delete_post(self, db_session, test_post):
        """Test delete post"""
        result = await delete_post(db_session, test_post.id)

        assert result is True

        # Verify deleted
        post = await get_post_by_id(db_session, test_post.id)
        assert post is None

    @pytest.mark.asyncio
    async def test_increment_view_count(self, db_session, test_post):
        """Test increment view count"""
        initial_count = test_post.view_count

        new_count = await increment_post_view_count(db_session, test_post.id)

        assert new_count == initial_count + 1

        # Refresh from database
        await db_session.refresh(test_post)
        assert test_post.view_count == initial_count + 1

    @pytest.mark.asyncio
    async def test_get_user_posts(self, db_session, test_user, test_post):
        """Test get user's posts"""
        result = await get_user_posts(
            db_session,
            user_id=test_user.id,
            page=1,
            pageSize=10,
        )

        assert result.total >= 1
        assert test_post.id in [post.id for post in result.items]

    @pytest.mark.asyncio
    async def test_get_published_posts(self, db_session, test_post):
        """Test get published posts"""
        result = await get_published_posts(
            db_session,
            page=1,
            pageSize=10,
        )

        assert result.total >= 1
        assert all(
            post.status == PostStatus.PUBLISHED for post in result.items
        )
