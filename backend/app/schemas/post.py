
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from app.schemas.user import UserResponse
from app.schemas.tag import TagResponse


class PostBaseCommon(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    excerpt: Optional[str] = None
    category_id: Optional[int] = None
    cover_image_id: Optional[int] = None


class PostBase(PostBaseCommon):
    tags: Optional[List[TagResponse]] = []


class PostCreate(PostBaseCommon):
    content: str = Field(..., min_length=1)
    status: str = "draft"
    tags: Optional[List[int]] = []


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    excerpt: Optional[str] = None
    status: Optional[str] = None
    category_id: Optional[int] = None
    tags: Optional[List[int]] = None
    cover_image_id: Optional[int] = None
    content: Optional[str] = Field(None, min_length=1)


class PostResponse(PostBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    view_count: int
    author_id: int = Field(alias="author_id") # Map author_id from model
    author: Optional[UserResponse] = None
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class PostBulkAction(BaseModel):
    post_ids: List[int]


class PostQuery(BaseModel):
    status: Optional[str] = None  # draft, published, archived
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None
    search: Optional[str] = None  # Tìm kiếm theo tiêu đề/nội dung
    author_id: Optional[int] = None
    date_from: Optional[str] = None  # ISO date string from query params
    date_to: Optional[str] = None    # ISO date string from query params


class PostStats(BaseModel):
    total: int
    published: int
    draft: int
    archived: int


class PostListWithStats(BaseModel):
    items: List[PostResponse]
    total: int
    page: int
    size: int
    pages: int
    stats: PostStats
