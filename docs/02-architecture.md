# 02. Kiến trúc hệ thống (Architecture)

Tài liệu này mô tả kiến trúc tổng thể và cách thức các thành phần trong AiCMR tương tác với nhau.

## Kiến trúc tổng quan
Hệ thống được xây dựng theo mô hình Microservices-lite, đóng gói bằng Docker:

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, **shadcn/ui**, **Zustand**.
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy 2.0 (Async), Pydantic v2.
- **Database**: MySQL 8.0 - Lưu trữ dữ liệu quan hệ.
- **Cache & Queue**: Redis - Caching (TTL 300s), Rate Limiting và quản lý Session.
- **Reverse Proxy**: Nginx - Điều phối request và quản lý SSL/Static files.

## Hạ tầng (Infrastructure)

### Điều phối Request (Nginx)
Nginx đóng vai trò là entry point duy nhất, giúp bảo mật và tối ưu hóa:
- `http://domain/api/*` -> Forward tới Backend.
- `http://domain/backend/docs` -> FastAPI Swagger UI.
- `http://domain/*` -> Forward tới Frontend.

### Docker Services
Hệ thống bao gồm các container:
- `backend`: FastAPI app chạy trên cổng 8000.
- `frontend`: Next.js app chạy trên cổng 3000.
- `db`: MySQL lưu trữ dữ liệu bền vững.
- `redis`: Lưu trữ cache và session tốc độ cao.
- `nginx`: Lắng nghe cổng 80/443.

## Sơ đồ Cơ sở dữ liệu (Database Schema)

### User Model
Lưu trữ thông tin người dùng và phân quyền:
- `id`: Primary Key.
- `email`: Duy nhất, dùng để đăng nhập.
- `username`: Duy nhất, hiển thị.
- `hashed_password`: Mật khẩu đã mã hóa bcrypt.
- `rank`: Cấp bậc từ 0 đến 5.
- `is_active`: Trạng thái kích hoạt tài khoản.

### Refresh Token Model
Quản lý phiên đăng nhập và cơ chế rotation:
- `token`: Mã định danh duy nhất.
- `user_id`: Foreign key liên kết tới User.
- `expires_at`: Thời gian hết hạn.
- `is_revoked`: Trạng thái thu hồi.

## Giám sát (Monitoring)
Hệ thống tích hợp sẵn endpoint `/metrics` theo chuẩn Prometheus:
- **Metrics phổ biến**: Request count, latency, active users, cache hit/miss.
- **Loguru**: Log được ghi dưới định dạng JSON, tự động xoay vòng (Rotation) và nén sau mỗi 100MB.
