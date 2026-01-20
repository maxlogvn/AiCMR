# API Reference

Tất cả API endpoints có tiền tố: `/backend/api/v1`

---

## 🔐 Authentication (`/auth`)

| Method | Endpoint | Auth | Rate Limit |
|--------|----------|------|------------|
| POST | `/register` | No | 3/min |
| POST | `/login` | No | 5/min |
| POST | `/refresh` | No | 10/min |
| POST | `/logout` | Bearer | 10/min |
| GET | `/csrf-token` | No | 30/min |
| POST | `/forgot-password` | No | 3/min |
| POST | `/reset-password` | No | 3/min |

**Chi tiết**: [.context/concepts/authentication-system.md](../.context/concepts/authentication-system.md)

---

## 👥 User Management (`/users`)

| Method | Endpoint | Rank |
|--------|----------|------|
| GET | `/me` | 0+ |
| PATCH | `/me` | 0+ |
| PATCH | `/me/password` | 0+ |
| GET | `/` | 5 (Admin) |
| GET | `/{id}` | 3+ |
| PATCH | `/{id}` | 5 |
| DELETE | `/{id}` | 5 |

---

## 🔧 Installation (`/install`)

| Method | Endpoint | Ghi chú |
|--------|----------|---------|
| GET | `/status` | Trả `installed: bool` |
| POST | `/setup` | Cần `INSTALL_SECRET` |

---

## 📤 Upload Management (`/uploads`)

Yêu cầu `X-CSRF-Token` và đã đăng nhập.

| Method | Endpoint | Rank | Query |
|--------|----------|------|-------|
| POST | `/` | 1+ | `is_public=true/false` |
| GET | `/file/{id}` | 1+ | `?token=...` |
| GET | `/p/{id}/{slug}` | No | SEO Friendly |
| GET | `/{id}` | 1+ | Metadata |
| DELETE | `/{id}` | 1+ | Owner or Admin |

**Chi tiết**: [.context/concepts/upload-system.md](../.context/concepts/upload-system.md)

---

## 📊 System

| Method | Endpoint | Ghi chú |
|--------|----------|---------|
| GET | `/metrics` | Prometheus (nội bộ) |
| GET | `/health` | Health check |

---

## 📋 Response Format

**Thành công**: JSON hoặc phân trang `{ items: [], total, page, size }`

**Lỗi**:
```json
{
  "detail": "Thông báo lỗi cụ thể"
}
```

**Caching**: GET endpoints cache 300s (ví dụ: `/users/me`, `/install/status`)

---

## 📚 Tham Khảo Chi Tiết

- Authentication: `.context/concepts/authentication-system.md`
- Upload system: `.context/concepts/upload-system.md`
- Frontend API calls: `.context/examples/api-call.md`

---

*Chi tiết: [Getting Started](./getting-started.md) | [Architecture](./architecture.md)*
