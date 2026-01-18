from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class InstallSetupRequest(BaseModel):
    install_secret: str = Field(..., min_length=1, description="Mã cài đặt bảo mật từ .env")
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    site_name: str = Field(..., max_length=100)
    logo_url: Optional[str] = Field(None, max_length=500)

class InstallStatusResponse(BaseModel):
    installed: bool
    step: str = "ready"
