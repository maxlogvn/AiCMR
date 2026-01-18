from typing import Optional, Dict, List
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse


class SettingsResponse(BaseModel):
    model_config = {"from_attributes": True}

    site_name: str
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    og_type: str = "website"
    og_url: Optional[str] = None
    twitter_card: str = "summary"
    twitter_title: Optional[str] = None
    twitter_description: Optional[str] = None
    twitter_image: Optional[str] = None
    robots: str = "index, follow"
    canonical_url: Optional[str] = None
    google_analytics_id: Optional[str] = None
    custom_meta: Optional[str] = None
    upload_allowed_extensions: Optional[str] = None
    upload_max_size_mb: Optional[str] = None


class SettingsUpdate(BaseModel):
    site_name: Optional[str] = Field(None, min_length=1, max_length=100)
    logo_url: Optional[str] = Field(None, max_length=500)
    favicon_url: Optional[str] = Field(None, max_length=500)
    seo_title: Optional[str] = Field(None, max_length=200)
    seo_description: Optional[str] = Field(None, max_length=500)
    seo_keywords: Optional[str] = Field(None, max_length=500)
    og_title: Optional[str] = Field(None, max_length=200)
    og_description: Optional[str] = Field(None, max_length=500)
    og_image: Optional[str] = Field(None, max_length=500)
    og_type: Optional[str] = Field(None, max_length=50)
    og_url: Optional[str] = Field(None, max_length=500)
    twitter_card: Optional[str] = Field(None, max_length=50)
    twitter_title: Optional[str] = Field(None, max_length=200)
    twitter_description: Optional[str] = Field(None, max_length=500)
    twitter_image: Optional[str] = Field(None, max_length=500)
    robots: Optional[str] = Field(None, max_length=100)
    canonical_url: Optional[str] = Field(None, max_length=500)
    google_analytics_id: Optional[str] = Field(None, max_length=50)
    custom_meta: Optional[str] = None
    upload_allowed_extensions: Optional[str] = None
    upload_max_size_mb: Optional[str] = None


class StatsOverview(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int
    by_rank: Dict[int, int]
    recent_users: List[UserResponse]
