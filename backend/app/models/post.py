from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)  # Markdown content
    status = Column(String(50), default="draft", nullable=False, index=True)  # draft, published, archived
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    thumbnail_image_id = Column(Integer, ForeignKey("attachments.id", ondelete="SET NULL"), nullable=True)
    is_featured = Column(Boolean, default=False, nullable=False, index=True)
    is_pinned = Column(Boolean, default=False, nullable=False, index=True)
    view_count = Column(Integer, default=0, nullable=False)
    like_count = Column(Integer, default=0, nullable=False)
    comment_count = Column(Integer, default=0, nullable=False)
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    seo_keywords = Column(String(500), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    # Relationships
    author = relationship("User", back_populates="posts")
    category = relationship("Category", back_populates="posts")
    tags = relationship("Tag", secondary="post_tags", back_populates="posts")
    thumbnail_image = relationship("Attachment")
    post_metadata = relationship("PostMetadata", back_populates="post", cascade="all, delete-orphan")

    # Composite indexes để tối ưu performance
    __table_args__ = (
        Index("idx_post_author_status", "author_id", "status"),
        Index("idx_post_category_status", "category_id", "status"),
        Index("idx_post_published", "published_at"),
        Index("idx_post_featured", "is_featured", "status"),
        Index("idx_post_pinned", "is_pinned", "status"),
    )
