# Getting Started

Hướng dẫn setup môi trường và chạy dự án AiCMR.

## 🚀 Khởi Tạo Nhanh (Docker)

```bash
# Khởi động toàn bộ services
docker compose up -d --build

# Xem logs backend
docker compose logs -f backend

# Dừng hệ thống
docker compose down
```

## ⚙️ Cấu Hình `.env`

Tạo file `.env` tại thư mục gốc:

```bash
# Security
SECRET_KEY=your-secret-key-at-least-32-chars  # BẮT BUỘC >= 32 ký tự (production)
DEBUG=false
INSTALL_SECRET=your-random-install-secret

# Database & Redis
DATABASE_URL=mysql+aiomysql://user:password@db/aicmr
REDIS_URL=redis://redis:6379/0

# App Settings
ALLOWED_ORIGINS=http://aicmr.local
REDIS_CACHE_TTL=300
```

## 🌐 Cài Đặt Ban Đầu

1. Thêm `127.0.0.1 aicmr.local` vào `/etc/hosts`
2. Truy cập `http://aicmr.local/install`
3. Nhập `INSTALL_SECRET` từ file `.env`
4. Tạo tài khoản Admin (Rank 5)
5. Cấu hình thông tin site

Endpoint `/install/setup` sẽ bị khóa sau khi cài xong.

## 💻 Local Development (không Docker)

**Backend**:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install  # Bắt buộc
npm run dev
```

## 🗄 Database Migrations

```bash
# Tạo migration
docker compose exec backend alembic revision --autogenerate -m "mô tả"

# Áp dụng migration
docker compose exec backend alembic upgrade head

# Rollback
docker compose exec backend alembic downgrade -1
```

## 📚 Tham Khảo Chi Tiết

- Environment variables: `.context/lookup/env-variables.md`
- Docker workflow: `.context/concepts/docker-workflow.md`
- Architecture: `.context/concepts/architecture.md`

---

*Chi tiết: [Architecture](./architecture.md) | [API Reference](./api-reference.md)*
