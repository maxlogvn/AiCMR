# AiCMR Backend Schemas Package
# Package chứa các Pydantic schemas - dùng cho request/response validation
# Schemas định nghĩa cấu trúc dữ liệu cho API requests và responses

from .post import PostBase, PostCreate, PostUpdate, PostResponse, PostQuery
from .category import CategoryBase, CategoryCreate, CategoryUpdate, CategoryResponse
from .tag import TagBase, TagCreate, TagUpdate, TagResponse
from .post_metadata import PostMetadataBase, PostMetadataCreate, PostMetadataUpdate, PostMetadataResponse

__all__ = [
    "PostBase", "PostCreate", "PostUpdate", "PostResponse", "PostQuery",
    "CategoryBase", "CategoryCreate", "CategoryUpdate", "CategoryResponse",
    "TagBase", "TagCreate", "TagUpdate", "TagResponse",
    "PostMetadataBase", "PostMetadataCreate", "PostMetadataUpdate", "PostMetadataResponse"
]

