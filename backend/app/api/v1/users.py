# Users API Routes
# Chứa các endpoints liên quan đến quản lý users: list, get, update, delete
from typing import Optional

from fastapi import APIRouter

# Tạo router cho users
router = APIRouter()


@router.get("/")
async def list_users(skip: int = 0, limit: int = 100):
    """
    Endpoint liệt kê danh sách users với pagination.

    Args:
        skip: Số lượng users muốn bỏ qua (dùng cho pagination)
        limit: Số lượng users tối đa trả về

    TODO: Implement logic
    - Query users từ database với pagination
    - Apply filters nếu có (role, status, etc.)
    - Return danh sách users

    Returns:
        dict: Danh sách users và tổng số users
    """
    return {
        "message": "List users endpoint - TODO: Implement",
        "skip": skip,
        "limit": limit,
    }


@router.get("/{user_id}")
async def get_user(user_id: int):
    """
    Endpoint lấy thông tin chi tiết của một user theo ID.

    Args:
        user_id: ID của user cần lấy thông tin

    TODO: Implement logic
    - Query user từ database theo user_id
    - Return thông tin user

    Returns:
        dict: Thông tin chi tiết của user
    """
    return {"message": "Get user endpoint - TODO: Implement", "user_id": user_id}


@router.put("/{user_id}")
async def update_user(user_id: int):
    """
    Endpoint cập nhật thông tin user.

    Args:
        user_id: ID của user cần cập nhật

    TODO: Implement logic
    - Validate request body
    - Update thông tin user trong database
    - Return thông tin user đã cập nhật

    Returns:
        dict: Thông tin user sau khi cập nhật
    """
    return {"message": "Update user endpoint - TODO: Implement", "user_id": user_id}


@router.delete("/{user_id}")
async def delete_user(user_id: int):
    """
    Endpoint xóa user.

    Args:
        user_id: ID của user cần xóa

    TODO: Implement logic
    - Xóa user khỏi database (hoặc soft delete)
    - Return thông báo xóa thành công

    Returns:
        dict: Thông báo xóa thành công
    """
    return {"message": "Delete user endpoint - TODO: Implement", "user_id": user_id}


@router.get("/{user_id}/profile")
async def get_user_profile(user_id: int):
    """
    Endpoint lấy profile chi tiết của user.

    Args:
        user_id: ID của user cần lấy profile

    TODO: Implement logic
    - Query user profile từ database
    - Bao gồm thông tin mở rộng: preferences, settings, etc.

    Returns:
        dict: Thông tin profile chi tiết của user
    """
    return {
        "message": "Get user profile endpoint - TODO: Implement",
        "user_id": user_id,
    }
