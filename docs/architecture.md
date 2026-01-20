# Architecture

Kiến trúc tổng quan hệ thống AiCMR.

## 🏗 Kiến Trúc Tổng Quan

**Stack Công Nghệ**:
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, Zustand
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy 2.0 (Async), Pydantic v2
- **Database**: MySQL 8.0
- **Cache & Queue**: Redis (Caching TTL 300s, Rate limiting, Session)
- **Reverse Proxy**: Nginx (Điều phối request, SSL/Static files)

---

## 🌐 Hạ Tầng (Infrastructure)

**Nginx** - Entry point duy nhất:
- `http://domain/api/*` → Forward tới Backend
- `http://domain/backend/docs` → FastAPI Swagger UI
- `http://domain/*` → Forward tới Frontend

**Docker Services**:
- `backend`: FastAPI (port 8000)
- `frontend`: Next.js (port 3000)
- `db`: MySQL
- `redis`: Cache & Session
- `nginx`: Entry point (port 80/443)

---

## 🗂 Cơ Sở Dữ Liệu

**User Model**:
- `id`, `email`, `username`, `hashed_password`
- `rank` (0-5): Guest, Member, Moderator, Admin
- `is_active`, `created_at`, `updated_at`

**Attachment Model**:
- `id`, `filename`, `file_path`, `content_type`, `file_size`
- `user_id` FK → User
- `created_at`

**Refresh Token Model**:
- `token`, `user_id` FK → User
- `expires_at`, `is_revoked`, `created_at`

**Settings Model**:
- `key`, `value`, `description`
- `updated_at` (Dynamic settings)

---

## 📁 Cơ Chế Lưu Trữ (Storage)

**Hybrid Storage** - Ưu tiên Public cho SEO:

| Loại | Áp dụng | URL | Token |
|------|---------|-----|-------|
| Public | Logo, Favicon, Ảnh bài viết | `/media/{id}/{slug}` | Không |
| Private | Hồ sơ bệnh án, Kết quả xét nghiệm | `/backend/api/v1/uploads/file/{id}` | Có |

**Cấu trúc**:
- Storage: `storage/uploads/YYYY/MM/DD/uuid_filename.ext`
- Private: Không truy cập trực tiếp URL
- Streaming: 1MB chunks → tối ưu RAM

**Chi tiết**: [.context/concepts/upload-system.md](../.context/concepts/upload-system.md)

---

## 📊 Monitoring

- **Metrics**: `/metrics` (Prometheus standard)
- **Health Check**: `/health`
- **Logs**: Loguru (JSON, rotation 100MB, auto-compress)

---

## 📚 Tham Khảo Chi Tiết

- Database schema: `.context/concepts/database-schema.md`
- Docker workflow: `.context/concepts/docker-workflow.md`
- Upload system: `.context/concepts/upload-system.md`

---

*Chi tiết: [Getting Started](./getting-started.md) | [API Reference](./api-reference.md)*
