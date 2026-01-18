# AGENTS.md - Hướng dẫn Phát triển cho AI Coding Agents

Dự án AiCMR là một hệ thống quản lý hồ sơ y tế tích hợp AI. Tài liệu này cung cấp các tiêu chuẩn kỹ thuật, lệnh vận hành và quy chuẩn code để các AI Agent có thể làm việc nhất quán trong môi trường Docker.

---

## 🛠 1. Lệnh Vận hành (Docker Only)

Tất cả các lệnh phải được thực thi thông qua Docker Compose từ thư mục gốc.

### 🐍 Backend (FastAPI)
- **Cài đặt thư viện**: `docker compose exec backend pip install -r requirements.txt`
- **Formatting**: `docker compose exec backend black app`
- **Kiểm tra lỗi (Lint)**: `docker compose exec backend ruff check app` (nếu có) hoặc `black --check app`
- **Chạy Tests**:
  - Toàn bộ: `docker compose exec backend pytest`
  - Theo file: `docker compose exec backend pytest tests/test_main.py`
  - Theo test case: `docker compose exec backend pytest tests/test_main.py::test_read_main`
  - Chế độ log: `docker compose exec backend pytest -s`
- **Database Migrations (Alembic)**:
  - Tạo: `docker compose exec backend alembic revision --autogenerate -m "description"`
  - Áp dụng: `docker compose exec backend alembic upgrade head`

### ⚛️ Frontend (Next.js)
- **Cài đặt thư viện**: `docker compose exec frontend npm install`
- **Kiểm tra lỗi (Lint)**: `docker compose exec frontend npm run lint`
- **Thêm UI Component**: `docker compose exec frontend npx shadcn@latest add [component]`
- **Kiểm tra Build**: `docker compose exec frontend npm run build` (BẮT BUỘC trước khi commit)

---

## 📐 2. Quy chuẩn Code (Code Style)

### 🔹 2.1 Backend (Python/FastAPI)
- **Đặt tên (Naming)**:
  - Class: `PascalCase` (e.g., `UserService`, `BaseModel`)
  - Function/Variable: `snake_case` (e.g., `get_user_by_id`)
  - File/Directory: `snake_case` (e.g., `auth_router.py`)
  - API Endpoints: `kebab-case` (e.g., `/api/v1/user-profiles`)
- **Type Hints**: **BẮT BUỘC** cho mọi tham số và giá trị trả về.
- **Async/Await**: Sử dụng cho mọi thao tác I/O (Database, Redis, HTTP).
- **Error Handling**: 
  - Sử dụng custom exceptions trong `app/core/exceptions.py`.
  - Tránh raise trực tiếp `HTTPException` trong logic CRUD.
- **Database**: Sử dụng `Depends(get_db)`. Logic DB tập trung tại `app/crud/`.
- **Import**: 1. Standard | 2. Third-party | 3. Local. Sắp xếp alphabet.

### 🔹 2.2 Frontend (TypeScript/Next.js)
- **Đặt tên (Naming)**:
  - Component File: `PascalCase.tsx`
  - UI Components: `lowercase.tsx` (chuẩn shadcn)
  - Hook/Util: `camelCase.ts` (e.g., `useAuth.ts`)
  - Props/Interface: `NameProps` (e.g., `UserCardProps`)
- **Component**: Ưu tiên Server Components. Dùng `"use client"` khi có state/hooks.
- **Styling**: Tailwind CSS 4. Dùng `cn()` utility để gộp class động.
- **State**: Server State (`@tanstack/react-query`), Client State (`zustand`).
- **Imports**: Sử dụng Alias `@/` cho `src/`. Sắp xếp: React -> Next -> Libs -> Components -> Hooks -> Types.

---

## 🔐 3. Bảo mật & Bảo vệ (Guardrails)

1. **Secrets**: Tuyệt đối KHÔNG commit file `.env` hoặc hardcode keys.
2. **Rank System**: Kiểm tra quyền truy cập (0: Guest, 1: Member, 3: Moderator, 5: Admin).
3. **CSRF**: POST/PUT/PATCH/DELETE yêu cầu header `X-CSRF-Token`.
4. **Logic Tách biệt**: AI Agent chỉ handle Logic; giao Visual/UI cho `frontend-ui-ux-engineer`.
5. **Git**: Sử dụng Conventional Commits (e.g., `feat:`, `fix:`, `refactor:`, `docs:`).

---

## 📁 4. Cấu trúc Thư mục Quan trọng

- `backend/app/api/v1/`: API Routes theo version.
- `backend/app/crud/`: Logic thao tác Database.
- `backend/app/models/`: SQLAlchemy Models.
- `backend/app/schemas/`: Pydantic Schemas (Validation).
- `frontend/src/app/`: App Router (Pages & Layouts).
- `frontend/src/components/ui/`: Base components (shadcn/ui).
- `frontend/src/hooks/`: Business logic & API hooks.
- `frontend/src/lib/`: API clients, constants, utilities.
- `frontend/src/types/`: TypeScript interfaces/types.

---

## 🔑 5. Tài khoản Thử nghiệm (Test Accounts)

Mật khẩu chung: `User@123456`
- **Admin**: `admin_test@aicmr.com` (Rank 5)
- **Moderator**: `mod@aicmr.com` (Rank 3)
- **Member**: `member@aicmr.com` (Rank 1)
- **Guest**: `guest@aicmr.com` (Rank 0)

---

## ⚠️ 6. Xử lý Lỗi & Troubleshooting

- **401 Unauthorized**: Tự động refresh token qua Axios interceptor.
- **403 Forbidden**: Thường do thiếu CSRF Token hoặc Rank thấp.
- **Hydration Failed**: Tránh render dữ liệu phía client không khớp với server.
- **Tests**: Luôn đảm bảo `docker compose ps` cho thấy các service `db` và `redis` đang healthy trước khi chạy test.

---
*Cập nhật: 19/01/2026 bởi Sisyphus Orchestrator*
