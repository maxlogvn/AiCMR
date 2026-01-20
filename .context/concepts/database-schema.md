# Database Schema

Sơ đồ cơ sở dữ liệu chính của hệ thống AiCMR.

## User Model

Lưu thông tin người dùng và phân quyền:
- `id`: Primary Key (INT)
- `email`: Duy nhất, dùng để đăng nhập
- `username`: Duy nhất, hiển thị
- `hashed_password`: Mật khẩu bcrypt
- `rank`: Cấp bậc (0-5)
- `is_active`: Trạng thái kích hoạt
- `created_at`, `updated_at`: Timestamps

## Attachment Model

Lưu thông tin tập tin đã tải lên:
- `id`: Primary Key
- `filename`: Tên gốc file
- `file_path`: Đường dẫn (`storage/uploads/YYYY/MM/DD/...`)
- `content_type`: MIME type
- `file_size`: Dung lượng (bytes)
- `user_id`: FK → User
- `created_at`: Timestamp

## Refresh Token Model

Quản lý phiên đăng nhập:
- `token`: Mã định danh duy nhất
- `user_id`: FK → User
- `expires_at`: Thời gian hết hạn
- `is_revoked`: Trạng thái thu hồi
- `created_at`: Timestamp

## Settings Model

Cấu hình hệ thống (dynamic settings):
- `key`: Tên cấu hình
- `value`: Giá trị (JSON string)
- `description`: Mô tả
- `updated_at`: Timestamp

## Quan Hệ

```
User (1) ←→ (N) Attachment
User (1) ←→ (N) Refresh Token
Settings (N) ←→ (N) User (dynamic)
```

## Migration

```bash
# Tạo migration
docker compose exec backend alembic revision --autogenerate -m "mô tả"

# Áp dụng migration
docker compose exec backend alembic upgrade head
```

## Tham Chiếu
- Architecture: `concepts/architecture.md`
- CRUD patterns: `examples/crud-patterns.md`
- Docker workflow: `concepts/docker-workflow.md`
