from typing import Optional
import re
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from datetime import datetime


def validate_password_strength(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if not any(c.isupper() for c in v):
        raise ValueError("Password must contain at least 1 uppercase letter")
    if not any(c.islower() for c in v):
        raise ValueError("Password must contain at least 1 lowercase letter")
    if not any(c.isdigit() for c in v):
        raise ValueError("Password must contain at least 1 digit")
    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in v):
        raise ValueError("Password must contain at least 1 special character")
    weak_passwords = [
        "password",
        "12345678",
        "qwerty123",
        "admin123",
        "Password123",
        "1234567890",
    ]
    if v.lower() in weak_passwords:
        raise ValueError("Password is too common. Choose a stronger one.")
    return v


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    is_active: bool = True


class UserCreate(UserBase):
    """Schema cho internal use (install, admin create user)"""

    password: str = Field(..., min_length=8)
    rank: int = Field(default=0, ge=0, le=5)

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_-]{3,50}$", v):
            raise ValueError(
                "Username must be 3-50 characters long and contain only letters, numbers, underscores, and hyphens"
            )
        return v

    _validate_password = field_validator("password")(validate_password_strength)


class UserRegister(UserBase):
    """Schema cho public register - không cho phép set rank"""

    password: str = Field(..., min_length=8)

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_-]{3,50}$", v):
            raise ValueError(
                "Username must be 3-50 characters long and contain only letters, numbers, underscores, and hyphens"
            )
        return v

    _validate_password = field_validator("password")(validate_password_strength)


class UserUpdate(BaseModel):
    """Schema for Admin to update user"""

    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    is_active: Optional[bool] = None
    rank: Optional[int] = Field(None, ge=0, le=5)

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if v is not None and not re.match(r"^[a-zA-Z0-9_-]{3,50}$", v):
            raise ValueError(
                "Username must be 3-50 characters long and contain only letters, numbers, underscores, and hyphens"
            )
        return v


class UserUpdateMe(BaseModel):
    """Schema for User to update their own profile"""

    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if v is not None and not re.match(r"^[a-zA-Z0-9_-]{3,50}$", v):
            raise ValueError(
                "Username must be 3-50 characters long and contain only letters, numbers, underscores, and hyphens"
            )
        return v


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    rank: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

    _validate_password = field_validator("new_password")(validate_password_strength)


class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)

    _validate_password = field_validator("new_password")(validate_password_strength)
