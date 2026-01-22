from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, backref
from .base import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    icon = Column(String(50), nullable=True)  # Icon name/class
    color = Column(String(7), nullable=True)  # Hex color (#FF0000)
    post_count = Column(Integer, default=0, nullable=False)  # Cache post count
    display_order = Column(Integer, default=0, nullable=False)  # Sort order
    show_in_menu = Column(Boolean, default=True, nullable=False)  # Show in navigation menu
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Self-referential relationship cho hierarchical structure
    children = relationship("Category", backref=backref("parent", remote_side=[id]))

    # Relationships
    posts = relationship("Post", back_populates="category")

    # Composite indexes
    __table_args__ = (
        Index("idx_category_parent", "parent_id", "is_active"),
        Index("idx_category_order", "display_order"),
    )
