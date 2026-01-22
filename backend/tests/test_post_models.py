import pytest
from sqlalchemy import select
from app.models.post import Post
from app.models.user import User
from app.models.category import Category
from app.models.tag import Tag
from app.schemas.post import PostStatus


class TestPostModel:
    """Test Post model"""

    @pytest.mark.asyncio
    async def test_create_post(self, db_session, test_user):
        """Test creating a post"""
        post = Post(
            title="Test Post",
            slug="test-post",
            excerpt="Test excerpt",
            content="# Test Content\n\nThis is a test post.",
            status=PostStatus.PUBLISHED,
            author_id=test_user.id,
            view_count=0,
            like_count=0,
            comment_count=0,
        )

        db_session.add(post)
        await db_session.flush()
        await db_session.refresh(post)

        assert post.id is not None
        assert post.title == "Test Post"
        assert post.slug == "test-post"
        assert post.status == PostStatus.PUBLISHED
        assert post.author_id == test_user.id
        assert post.view_count == 0
        assert post.like_count == 0
        assert post.comment_count == 0

    @pytest.mark.asyncio
    async def test_post_relationships(self, db_session, test_post):
        """Test post relationships"""
        # Refresh post with relationships
        stmt = select(Post).options(
            selectinload(Post.author),
            selectinload(Post.category),
            selectinload(Post.tags),
        ).where(Post.id == test_post.id)
        
        result = await db_session.execute(stmt)
        post = result.scalar_one()

        assert post.author is not None
        assert post.author.id == post.author_id

        assert post.category is not None
        assert post.category.id == post.category_id

        assert post.tags is not None
        assert isinstance(post.tags, list)

    @pytest.mark.asyncio
    async def test_post_status_enum(self, db_session, test_user):
        """Test post status enum values"""
        statuses = [PostStatus.DRAFT, PostStatus.PUBLISHED, PostStatus.ARCHIVED]

        for status in statuses:
            post = Post(
                title=f"Test {status} Post",
                slug=f"test-{status}-post",
                content="# Test",
                status=status,
                author_id=test_user.id,
                view_count=0,
                like_count=0,
                comment_count=0,
            )

            db_session.add(post)
            await db_session.flush()
            await db_session.refresh(post)

            assert post.status == status

    @pytest.mark.asyncio
    async def test_post_validation(self, db_session, test_user):
        """Test post field validation"""
        # Test required fields
        with pytest.raises(Exception):
            post = Post()  # Missing required fields
            db_session.add(post)
            await db_session.flush()

        # Test slug uniqueness
        post1 = Post(
            title="Test Post 1",
            slug="duplicate-slug",
            content="# Test",
            status=PostStatus.DRAFT,
            author_id=test_user.id,
            view_count=0,
            like_count=0,
            comment_count=0,
        )
        db_session.add(post1)
        await db_session.flush()

        post2 = Post(
            title="Test Post 2",
            slug="duplicate-slug",  # Same slug
            content="# Test",
            status=PostStatus.DRAFT,
            author_id=test_user.id,
            view_count=0,
            like_count=0,
            comment_count=0,
        )
        db_session.add(post2)

        with pytest.raises(Exception):  # Should raise integrity error
            await db_session.flush()

    @pytest.mark.asyncio
    async def test_post_featured_and_pinned(self, db_session, test_user):
        """Test featured and pinned flags"""
        post = Post(
            title="Featured Post",
            slug="featured-post",
            content="# Test",
            status=PostStatus.PUBLISHED,
            author_id=test_user.id,
            is_featured=True,
            is_pinned=True,
            view_count=0,
            like_count=0,
            comment_count=0,
        )

        db_session.add(post)
        await db_session.flush()
        await db_session.refresh(post)

        assert post.is_featured is True
        assert post.is_pinned is True

    @pytest.mark.asyncio
    async def test_post_seo_fields(self, db_session, test_user):
        """Test SEO fields"""
        post = Post(
            title="SEO Test Post",
            slug="seo-test-post",
            content="# Test",
            status=PostStatus.PUBLISHED,
            author_id=test_user.id,
            seo_title="Custom SEO Title",
            seo_description="Custom SEO Description",
            seo_keywords="seo, keywords, test",
            view_count=0,
            like_count=0,
            comment_count=0,
        )

        db_session.add(post)
        await db_session.flush()
        await db_session.refresh(post)

        assert post.seo_title == "Custom SEO Title"
        assert post.seo_description == "Custom SEO Description"
        assert post.seo_keywords == "seo, keywords, test"
