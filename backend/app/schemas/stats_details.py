from typing import List, Optional
from pydantic import BaseModel, Field


class PostTimeData(BaseModel):
    """Dữ liệu bài viết theo thời gian."""
    date: str = Field(..., description="Ngày (format: YYYY-MM-DD)")
    count: int = Field(default=0, description="Số bài viết")


class StatusCountData(BaseModel):
    """Dữ liệu đếm theo trạng thái."""
    status: str = Field(..., description="Trạng thái (published, draft, archived)")
    count: int = Field(default=0, description="Số bài viết")


class CategoryStatsData(BaseModel):
    """Thống kê danh mục."""
    id: int = Field(..., description="ID danh mục")
    name: str = Field(..., description="Tên danh mục")
    slug: str = Field(..., description="Slug danh mục")
    count: int = Field(default=0, description="Số bài viết")


class AuthorStatsData(BaseModel):
    """Thống kê tác giả."""
    id: int = Field(..., description="ID người dùng")
    username: str = Field(..., description="Tên đăng nhập")
    full_name: Optional[str] = Field(None, description="Họ tên")
    avatar: Optional[str] = Field(None, description="URL avatar")
    count: int = Field(default=0, description="Số bài viết")


class StatsDetailsResponse(BaseModel):
    """Chi tiết thống kê cho trang /dashboard/stats."""
    posts_over_time: List[PostTimeData] = Field(default_factory=list, description="Số bài viết theo thời gian")
    posts_by_status: List[StatusCountData] = Field(default_factory=list, description="Số bài viết theo trạng thái")
    top_categories: List[CategoryStatsData] = Field(default_factory=list, description="Top danh mục")
    top_authors: List[AuthorStatsData] = Field(default_factory=list, description="Top tác giả")
