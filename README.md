# AiCMR Project

Dự án AiCMR là hệ thống quản lý hồ sơ y tế tích hợp AI, bao gồm Frontend Next.js, Backend FastAPI, Cơ sở dữ liệu MySQL và công cụ quản lý phpMyAdmin.

## Kiến trúc Hệ thống

```text
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Browser    │      │    Nginx    │      │  Next.js    │      │  FastAPI    │
│ aicmr.local │◄────►│ (Port 80)   │◄────►│  Frontend   │◄────►│   Backend   │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
                                                 ▲                    │
                                                 │      ┌─────────────┐
                                                 ├──────┤   MySQL     │
                                                 │      │  Database   │
                                                 │      └─────────────┘
                                                 │      ┌─────────────┐
                                                 └──────┤ phpMyAdmin  │
                                                        └─────────────┘
```

## Cấu trúc Dự án

```text
/home/AiCMR/
├── docker-compose.yml              # Docker Compose cấu hình toàn bộ hệ thống
├── .env                            # Environment variables (local)
├── README.md                       # File này (tổng quan dự án)
│
├── backend/                        # FastAPI Backend
│   ├── Dockerfile                  # Docker image cho backend
│   ├── requirements.txt            # Python dependencies (đã sửa lỗi xung đột email-validator)
│   └── app/                        # Mã nguồn FastAPI
│       ├── core/                   # Cấu hình hệ thống và Database
│       ├── models/                 # SQLAlchemy Models (đã có User model)
│       ├── schemas/                # Pydantic Schemas (Validation)
│       └── api/                    # API Endpoints (Auth, Users)
│
├── frontend/                       # Next.js Frontend (v16+)
│   ├── Dockerfile                  # Docker image cho frontend (Node 20+)
│   ├── package.json                # Node.js dependencies (Tailwind CSS)
│   ├── README.md                   # Chi tiết về Frontend
│   └── src/                        # Mã nguồn Next.js (App Router)
│
└── nginx/                          # Nginx Reverse Proxy
    └── conf.d/
        └── default.conf            # Cấu hình routing cho aicmr.local
```

## Yêu cầu Cài đặt

- Docker Engine 20.10+
- Docker Compose 2.0+

## Cấu hình Tên miền Local

Để truy cập dự án qua tên miền `aicmr.local`, bạn cần thêm dòng sau vào file `hosts`:

- **Windows**: `C:\Windows\System32\drivers\etc\hosts`
- **Linux/macOS**: `/etc/hosts`

```text
127.0.0.1 aicmr.local
```

## Quick Start

### 1. Setup Environment Variables

```bash
# Kiểm tra và cấu hình .env
cat .env
```

### 2. Khởi động dự án

```bash
docker compose up -d --build
```

### 3. Các địa chỉ truy cập

- **Frontend**: [http://aicmr.local](http://aicmr.local)
- **Backend API Docs**: [http://aicmr.local/backend/docs](http://aicmr.local/backend/docs)
- **phpMyAdmin**: [http://aicmr.local/phpmyadmin](http://aicmr.local/phpmyadmin)

## Quản lý Cơ sở dữ liệu

- **phpMyAdmin**: Sử dụng để quản lý MySQL trực quan.
- **MySQL Auth**: Sử dụng `mysql_native_password` để tương thích tốt nhất với các công cụ quản lý.

## Tài liệu Chi tiết

- [Module Auth & User](docs/MODULE_AUTH.md) - Hướng dẫn đầy đủ về hệ thống xác thực và quản lý người dùng
- [Hướng dẫn cho AI Agents](AGENTS.md) - Coding conventions, build commands, và quy tắc phát triển
- [Frontend Documentation](frontend/README.md) - Chi tiết về Frontend Next.js

## Lưu ý Phát triển

- **Frontend**: Sử dụng Next.js 16 với Turbopack để tăng tốc độ phát triển.
- **Backend**: FastAPI đã được cấu hình tự động kết nối MySQL và khởi tạo database.
- **Database**: Các bảng (Tables) sẽ được tự động tạo khi ứng dụng khởi động thông qua hàm `init_db` trong `app/core/database.py`. Đảm bảo các model mới được import vào `app/models/__init__.py`.
- **Nginx**: Đóng vai trò Reverse Proxy, điều hướng toàn bộ yêu cầu qua cổng 80.

## Troubleshooting

Nếu gặp lỗi kết nối Database hoặc Backend không khởi động:
1. Kiểm tra log của backend: `docker compose logs -f backend`
2. Kiểm tra trạng thái MySQL: `docker compose ps`
3. Đảm bảo file `.env` chứa thông tin đăng nhập chính xác.
