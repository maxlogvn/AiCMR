# API V1 Reference

Tài liệu này liệt kê chi tiết các endpoint API trong version 1.

## Base URL
`/backend/api/v1`

## Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required | Rank |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/register` | Đăng ký tài khoản mới | No | - |
| POST | `/login` | Đăng nhập và nhận JWT token | No | - |

### Schemas
- **UserCreate**: `email`, `username`, `password`
- **UserLogin**: `email`, `password`
- **Token**: `access_token`, `token_type`

---

## User Management (`/users`)

| Method | Endpoint | Description | Auth Required | Rank |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/me` | Lấy thông tin user hiện tại | Yes | 0+ |
| PATCH | `/me` | Cập nhật thông tin bản thân | Yes | 0+ |
| PATCH | `/me/password` | Đổi mật khẩu | Yes | 0+ |
| GET | `/` | Liệt kê danh sách user (Phân trang) | Yes | 5 (Admin) |
| GET | `/{id}` | Xem thông tin user cụ thể | Yes | 3+ (Mod) hoặc chính mình |
| PATCH | `/{id}` | Cập nhật user theo ID | Yes | 5 (Admin) |
| DELETE | `/{id}` | Xóa user | Yes | 5 (Admin) |

### Schemas
- **UserResponse**: `id`, `email`, `username`, `rank`, `is_active`, `created_at`, `updated_at`
- **UserUpdateMe**: `email`, `username` (optional)
- **UserUpdate**: `email`, `username`, `rank`, `is_active` (optional)
- **ChangePassword**: `old_password`, `new_password`

### Pagination
- Các endpoint trả về danh sách sử dụng `fastapi-pagination`.
- Trả về cấu trúc: `{ items: [], total: int, page: int, size: int }`.

---

## Installation (`/install`)

 | Method | Endpoint | Description | Auth Required | Rank |
 | :--- | :--- | :--- | :--- | :--- |
 | GET | `/status` | Kiểm tra trạng thái cài đặt | No | - |
 | POST | `/setup` | Cài đặt ban đầu (Tạo Admin + Cấu hình hệ thống) | No | - |

### Schemas
- **InstallSetupRequest**: `install_secret`, `email`, `username`, `password`, `site_name`, `logo_url`
- **InstallStatusResponse**: `installed` (boolean), `step` (string)

### Notes
- Endpoint `/setup` yêu cầu `INSTALL_SECRET` từ environment variables.
- Chỉ cho phép cài đặt khi chưa có user nào và chưa cài đặt trước đó.
- Sử dụng Transaction để đảm bảo toàn bộ dữ liệu được tạo cùng lúc (Rollback nếu lỗi).

### Dependency Injection
- `get_db`: Cung cấp AsyncSession cho SQLAlchemy.
- `get_current_user`: Xác thực JWT và trả về user.
- `get_current_active_user`: Kiểm tra `is_active` của user.
- `require_min_rank(rank)`: Kiểm tra quyền hạn tối thiểu.

### Caching
- Các endpoint GET có thể được cache bằng `FastAPICache`.
- Sử dụng decorator `@cache(expire=60)`.

### Pagination
- Các endpoint trả về danh sách sử dụng `fastapi-pagination`.
- Trả về cấu trúc: `{ items: [], total: int, page: int, size: int }`.
