# AiCMR Backend Models Package
# Package chứa các SQLAlchemy models - định nghĩa database schema

# Export Base class và các models để SQLAlchemy nhận diện
from .base import Base
from .user import User
from .settings import Setting

__all__ = ["Base", "User", "Setting"]
