from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .base import Base


class PostMetadata(Base):
    __tablename__ = "post_metadata"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    key = Column(String(100), nullable=False)
    value = Column(Text, nullable=False)  # Chuỗi JSON cho dữ liệu linh hoạt
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    # Relationship
    post = relationship("Post", back_populates="post_metadata")

    # Composite indexes
    __table_args__ = (
        Index("idx_post_metadata_post_key", "post_id", "key"),
    )
