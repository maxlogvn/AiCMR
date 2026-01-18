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
 │   ├── requirements.txt            # Python dependencies
 │   └── app/                        # Mã nguồn FastAPI
 │       ├── core/                   # Cấu hình hệ thống và Database
 │       ├── models/                 # SQLAlchemy Models (User, Settings)
 │       ├── schemas/                # Pydantic Schemas (Validation)
 │       └── api/                    # API Endpoints (Auth, Users, Install)
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

## Environment Variables

Các biến môi trường quan trọng cần thiết lập trong file `.env`. Tham khảo [01. Getting Started](docs/01-getting-started.md) để biết chi tiết.

```bash
# Security
SECRET_KEY=your-super-secret-key-at-least-32-chars
INSTALL_SECRET=your_random_install_secret

# Database & Redis
DATABASE_URL=mysql+aiomysql://aicmr_user:password@db/aicmr
REDIS_URL=redis://redis:6379/0
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

Hệ thống tài liệu được tổ chức tại thư mục `docs/`:

- [**Tài liệu Tổng quan (README)**](docs/README.md) - Mục lục và hướng dẫn đọc tài liệu.
- [**01. Hướng dẫn bắt đầu**](docs/01-getting-started.md) - Cài đặt môi trường, Docker và thiết lập ban đầu.
- [**02. Kiến trúc hệ thống**](docs/02-architecture.md) - Chi tiết hạ tầng và sơ đồ dữ liệu.
- [**03. Quy chuẩn Backend**](docs/03-backend-guide.md) - Code style, API và Database patterns.
- [**04. Quy chuẩn Frontend**](docs/04-frontend-guide.md) - Next.js patterns, State và UI components.
- [**05. Xác thực & Phân quyền**](docs/05-authentication.md) - JWT, Refresh Token, CSRF và Rank system.
- [**Hướng dẫn cho AI Agents**](AGENTS.md) - Quy tắc dành cho các AI Coding Assistant.

## Lưu ý Phát triển

- **Frontend**: Sử dụng Next.js 16 (App Router), React 19 và Tailwind CSS 4.
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy 2.0 (Async) và Pydantic v2.
- **Database**: Tự động tạo bảng thông qua `init_db`. Luôn sử dụng Alembic cho migrations.
- **Tài liệu**: Luôn cập nhật thư mục `docs/` khi có thay đổi lớn về kiến trúc hoặc logic nghiệp vụ.

## Troubleshooting

Nếu gặp lỗi kết nối Database hoặc Backend không khởi động:
1. Kiểm tra log của backend: `docker compose logs -f backend`
2. Kiểm tra trạng thái MySQL: `docker compose ps`
3. Đảm bảo file `.env` chứa thông tin đăng nhập chính xác.
