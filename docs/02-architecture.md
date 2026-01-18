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

### Attachment Model
Lưu trữ thông tin tập tin đã tải lên:
- `id`: Primary Key.
- `filename`: Tên gốc của tập tin.
- `file_path`: Đường dẫn tương đối trong hệ thống lưu trữ.
- `content_type`: Định dạng MIME của tập tin.
- `file_size`: Dung lượng tính bằng byte.
- `user_id`: Foreign key liên kết tới User đã tải lên.

### Refresh Token Model
Quản lý phiên đăng nhập và cơ chế rotation:
- `token`: Mã định danh duy nhất.
- `user_id`: Foreign key liên kết tới User.
- `expires_at`: Thời gian hết hạn.
- `is_revoked`: Trạng thái thu hồi.

## Cơ chế Lưu trữ Tập tin (Storage Architecture)

AiCMR sử dụng cơ chế **Bind Mount** để chia sẻ dữ liệu tĩnh giữa Backend và Frontend một cách hiệu quả mà không cần qua API trung gian để tải file.

### Cấu trúc Mount
Dựa trên cấu hình trong `docker-compose.yml`:
- **Backend**: Gắn kết `./public/uploads` (Host) vào `/app/static/uploads` (Container).
- **Frontend**: Gắn kết `./public` (Host) vào `/app/public` (Container).

### Luồng xử lý
1. **Upload**: Backend nhận file, lưu vào `/app/static/uploads/YYYY/MM/DD/`. Do cơ chế mount, file thực tế sẽ nằm tại `./public/uploads/...` trên máy chủ (Host).
2. **Access**: Frontend truy cập file trực tiếp qua thư mục `public/` của mình. Ví dụ: `http://aicmr.local/uploads/2026/01/19/uuid_file.jpg`.

Cơ chế này giúp tối ưu hiệu suất, giảm tải cho Backend khi cần phục vụ (serve) các file tĩnh lớn.

## Giám sát (Monitoring)
Hệ thống tích hợp sẵn endpoint `/metrics` theo chuẩn Prometheus:
- **Metrics phổ biến**: Request count, latency, active users, cache hit/miss.
- **Loguru**: Log được ghi dưới định dạng JSON, tự động xoay vòng (Rotation) và nén sau mỗi 100MB.
