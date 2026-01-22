from sqlalchemy import Column, Integer, String, Text, DateTime, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    color = Column(String(7), nullable=True)  # Màu sắc hex (#FF0000)
    description = Column(Text, nullable=True)  # Tag description
    post_count = Column(Integer, default=0, nullable=False)  # Cache post count
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    posts = relationship("Post", secondary="post_tags", back_populates="tags")

    # Composite indexes
    __table_args__ = (
        Index("idx_tag_name", "name"),
        Index("idx_tag_post_count", "post_count"),
    )
