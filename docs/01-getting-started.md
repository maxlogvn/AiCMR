# 01. Hướng dẫn bắt đầu (Getting Started)

Tài liệu này hướng dẫn cách cài đặt môi trường phát triển và triển khai hệ thống AiCMR bằng Docker.

## Yêu cầu hệ thống
- Docker và Docker Compose.
- Node.js (nếu chạy frontend ngoài Docker).
- Python 3.11+ (nếu chạy backend ngoài Docker).

## Khởi động nhanh với Docker
Dự án được tối ưu hóa để chạy trong môi trường container:

```bash
# Khởi động toàn bộ dịch vụ (Backend, Frontend, DB, Redis, Nginx)
docker compose up -d --build

# Xem logs của backend
docker compose logs -f backend

# Dừng hệ thống
docker compose down
```

## Cấu hình biến môi trường (`.env`)
Tạo file `.env` tại thư mục gốc của dự án dựa trên các tham số sau:

```bash
# Security
SECRET_KEY=your-secret-key-at-least-32-chars  # Khóa JWT (Bắt buộc >= 32 ký tự trong production)
DEBUG=false                                   # Set true để dùng secret-key mặc định khi dev
INSTALL_SECRET=your-random-install-secret     # Khóa dùng cho bước cài đặt

# Database & Redis
DATABASE_URL=mysql+aiomysql://user:password@db/aicmr
REDIS_URL=redis://redis:6379/0

# App Settings
ALLOWED_ORIGINS=http://aicmr.local
REDIS_CACHE_TTL=300
```

## Luồng cài đặt ban đầu (Installation Flow)
Sau khi khởi động container lần đầu tiên:

1. Truy cập `http://aicmr.local/install`.
   - **Lưu ý**: Đảm bảo bạn đã thêm `127.0.0.1 aicmr.local` vào file hosts của hệ điều hành.
2. Hệ thống sẽ kiểm tra trạng thái qua endpoint `/api/v1/install/status`.
3. Nếu chưa cài đặt, bạn sẽ được dẫn tới form Setup:
   - Nhập `INSTALL_SECRET` (từ file .env).
   - Tạo tài khoản Admin (Rank 5).
   - Cấu hình thông tin cơ bản của site.
4. Sau khi hoàn tất, hệ thống sẽ khóa endpoint `/install/setup` để đảm bảo an toàn.

## Database Migrations (Alembic)
Khi có sự thay đổi về Models trong Backend, hãy thực hiện migration trong container:

```bash
# Tạo bản ghi thay đổi
docker compose exec backend alembic revision --autogenerate -m "mô tả thay đổi"

# Áp dụng thay đổi vào Database
docker compose exec backend alembic upgrade head
```

## Các lệnh phát triển (Local)
Nếu không dùng Docker cho quá trình code:

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install # Bắt buộc để cài đặt các thư viện mới (shadcn, zustand, sonner...)
npm run dev
```
