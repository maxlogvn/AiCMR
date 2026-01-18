# AGENTS.md - Hướng dẫn cho AI Coding Agents

> **LƯU Ý QUAN TRỌNG**: File này cung cấp các quy tắc nhanh cho AI. Để hiểu sâu hơn về kiến trúc và quy chuẩn chi tiết, hãy đọc [**Tài liệu Hệ thống (docs/)**](./docs/README.md).

## 🚀 Tổng quan công nghệ
- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy 2.0 (Async), Pydantic v2.
- **Database**: MySQL 8.0, Redis (Caching/FastAPI-Cache2).
- **Infrastructure**: Docker Compose, Nginx (Reverse Proxy).

---

## 🛠 Lệnh Build/Lint/Test

### 🐍 Backend (FastAPI)
- **Dev Server**: `uvicorn app.main:app --reload`
- **Chạy Tests**: 
  - Tất cả: `pytest`
  - Một file: `pytest tests/test_main.py`
  - Một test cụ thể: `pytest tests/test_main.py::test_root`
  - Với Coverage: `pytest --cov=app --cov-report=term-missing`
- **Migrations (Alembic)**:
  - Tạo: `alembic revision --autogenerate -m "desc"`
  - Áp dụng: `alembic upgrade head`
- **Docker Exec**: `docker compose exec backend pytest <path_to_test>`

### ⚛️ Frontend (Next.js)
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

### 🐳 Docker Compose
- **Khởi động**: `docker compose up -d --build`
- **Logs**: `docker compose logs -f backend`
- **Dừng**: `docker compose down`

---

## 📐 Quy chuẩn Code

### 🔹 Backend (FastAPI)
- **Imports**: (1) Standard Lib, (2) Third-party, (3) Local (`app.xxx`).
- **Types**: **BẮT BUỘC** Type Hints cho mọi function/variable.
- **Naming**: Class (`PascalCase`), Function/Var (`snake_case`), Const (`UPPER_SNAKE_CASE`).
- **Logging**: Dùng `loguru`. Cấm dùng `print()`.
- **Async**: Luôn `await` cho Database và API calls.
- **Models**: Đồng bộ hóa SQLAlchemy Model ↔️ Pydantic Schema.
- **CRUD**: Tái sử dụng `app.crud.base` (ví dụ: `get_by_field`).

### 🔹 Frontend (Next.js)
- **Imports**: (1) React/Next, (2) Libs, (3) Components (`@/components`), (4) Local Utils.
- **State**: Dùng **TanStack Query** (`useQuery`, `useMutation`).
- **API**: Dùng Axios instance tại `src/lib/api.ts` (đã cấu hình CSRF & Auth).
- **Components**: Functional Components + Props Interface. 
- **Forms**: `react-hook-form` + `zod`.

---

## 🔐 Security & Guardrails
- **Secrets**: **CẤM** commit `.env`. Dùng `app.core.config` để truy cập config.
- **CSRF**: Các request POST/PUT/DELETE bắt buộc phải có header `X-CSRF-Token`.
- **Rank System**: 0=Guest, 1-2=Member, 3-4=Moderator, 5=Admin.
  - Backend: Dùng `Depends(validate_csrf)` và `Depends(get_current_active_user)`.
- **Database**: ID của `refresh_tokens` phải là `Integer AUTO_INCREMENT`.

---

## 🤖 Quy trình cho AI Agent (Workflows)

1. **Context Discovery**: Luôn dùng `ContextScout` để tìm file `.md` trong `.opencode/context/` trước khi làm.
2. **Master Planning**: Tạo kế hoạch tại `.tmp/sessions/` trước khi code.
3. **MVI Principle**: Giữ file context ngắn gọn, tập trung vào concept, ví dụ và lỗi thường gặp.
4. **Validation**: Sau khi sửa code, chạy `pytest` (backend) hoặc `npm run lint` (frontend).

### Cấu trúc Thư mục Chính
```
/
├── backend/app/
│   ├── api/v1/     # Endpoints
│   ├── core/       # Security, Config, Database
│   ├── crud/       # DB Operations
│   ├── models/     # SQLAlchemy
│   └── schemas/    # Pydantic
└── frontend/src/
    ├── app/        # Pages & Layouts
    ├── components/ # UI Components
    ├── hooks/      # Custom Hooks
    └── lib/        # API & Utils
```

---

## 📝 Mẫu Testing
```python
@pytest.mark.asyncio
async def test_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

---
*Cập nhật lần cuối: 2026-01-18*
