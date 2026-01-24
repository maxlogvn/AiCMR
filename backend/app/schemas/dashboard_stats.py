from typing import Optional
from pydantic import BaseModel, Field


class DashboardStatsResponse(BaseModel):
    """Schema cho dashboard statistics - Moderator+ có thể xem."""
    total_posts: int = Field(default=0, description="Tổng số bài viết")
    published_posts: int = Field(default=0, description="Số bài viết đã đăng")
    draft_posts: int = Field(default=0, description="Số bài viết nháp")
    archived_posts: int = Field(default=0, description="Số bài viết lưu trữ")
    total_users: int = Field(default=0, description="Tổng số người dùng")
    posts_change_percent: float = Field(default=0.0, description="Tỷ lệ thay đổi bài viết (%)")
    users_change_percent: float = Field(default=0.0, description="Tỷ lệ thay đổi người dùng (%)")
