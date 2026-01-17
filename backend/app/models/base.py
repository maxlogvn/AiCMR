# Base Model Class for SQLAlchemy
# Import declarative base từ database module
# Base class này được tất cả models inherit để định nghĩa database schema
from app.core.database import Base

# Export Base class để có thể import từ models package
# Ví dụ: from app.models import Base
# Hoặc: from app.models.user import User
__all__ = ["Base"]
