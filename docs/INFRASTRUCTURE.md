# Infrastructure & Deployment

Tài liệu này hướng dẫn cách vận hành và triển khai hệ thống AiCMR.

## Docker Compose
Dự án sử dụng Docker Compose để quản lý các dịch vụ:
- **backend**: FastAPI application.
- **frontend**: Next.js application.
- **db**: MySQL 8.0 database.
- **redis**: Redis cho caching.
- **nginx**: Reverse proxy.

### Các lệnh cơ bản
- Khởi động: `docker compose up -d --build`
- Dừng: `docker compose down`
- Xem logs: `docker compose logs -f [service_name]`

## Nginx Configuration
Nginx đóng vai trò là entry point duy nhất, phân phối request:
- `/api/*` -> Forward tới backend.
- `/backend/docs` -> FastAPI Swagger UI.
- `/*` -> Forward tới frontend.

## Cấu hình Môi trường (`.env`)
Các biến quan trọng cần lưu ý:
- `DATABASE_URL`: Kết nối tới MySQL.
- `REDIS_URL`: Kết nối tới Redis.
- `SECRET_KEY`: Khóa bí mật để ký JWT.
- `ALLOWED_ORIGINS`: Danh sách domain frontend được phép gọi API.

## Database Migrations (Alembic)
Khi thay đổi Model ở backend:
1. Tạo migration: `docker compose exec backend alembic revision --autogenerate -m "description"`
2. Chạy migration: `docker compose exec backend alembic upgrade head`

## Caching Strategy
- Backend: Sử dụng Redis qua `fastapi-cache2`.
- Frontend: Sử dụng TanStack Query cho client-side caching.
