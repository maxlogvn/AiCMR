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

AiCMR sử dụng cơ chế **Hybrid Storage** để cân bằng giữa bảo mật dữ liệu y tế và tối ưu hóa tìm kiếm (SEO).

### Cấu trúc Mount
Dựa trên cấu hình trong `docker-compose.yml`:
- **Backend**: Gắn kết `./storage/uploads` (Host) vào `/app/storage/uploads` (Container).

### Phân loại Lưu trữ (Ưu tiên Public)

| Loại | Đối tượng áp dụng | Cơ chế truy cập | URL Ví dụ |
|------|----------|-----------------|-----------|
| **Public (Mặc định)** | Logo, Favicon, Ảnh bài viết, Tài liệu công khai | Không cần Token, hỗ trợ SEO Slug | `/media/20/logo-phong-kham.png` |
| **Private (Nhạy cảm)** | Hồ sơ bệnh án, Kết quả xét nghiệm cá nhân | Bắt buộc JWT Token (Header/Query) | `/backend/api/v1/uploads/file/21` |

### Luồng xử lý
1. **Upload**: Backend nhận file kèm tham số `is_public`. File lưu vào `storage/uploads/YYYY/MM/DD/`.
2. **Public Access**: Nếu `is_public=true`, Backend cho phép truy cập qua endpoint `/p/{id}/{slug}` mà không kiểm tra auth.
3. **Private Access**: Nếu `is_public=false`, Backend yêu cầu Token và kiểm tra quyền sở hữu/Rank trước khi stream file.

Chi tiết đầy đủ xem [08. Module Upload Tập tin](./08-upload-module.md).

## Giám sát (Monitoring)
Hệ thống tích hợp sẵn endpoint `/metrics` theo chuẩn Prometheus:
- **Metrics phổ biến**: Request count, latency, active users, cache hit/miss.
- **Loguru**: Log được ghi dưới định dạng JSON, tự động xoay vòng (Rotation) và nén sau mỗi 100MB.
