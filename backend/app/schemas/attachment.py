from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AttachmentBase(BaseModel):
    filename: str
    content_type: str
    file_size: int


class AttachmentCreate(AttachmentBase):
    file_path: str
    user_id: int


class AttachmentResponse(AttachmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    file_path: str
    user_id: int
    created_at: datetime
    url: Optional[str] = None


class UploadSettings(BaseModel):
    allowed_extensions: str
    max_upload_size_mb: int
