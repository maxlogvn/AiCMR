from typing import Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class PostMetadataBase(BaseModel):
    key: str = Field(..., min_length=1, max_length=100)
    value: str = Field(..., min_length=1)  # Chuỗi JSON cho dữ liệu linh hoạt


class PostMetadataCreate(PostMetadataBase):
    pass


class PostMetadataUpdate(BaseModel):
    value: str = Field(None, min_length=1)


class PostMetadataResponse(PostMetadataBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    post_id: int
    created_at: datetime
    updated_at: datetime
