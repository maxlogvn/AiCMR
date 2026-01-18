# AGENTS.md - Hướng dẫn Phát triển cho AI Coding Agents

Dự án AiCMR là một hệ thống quản lý hồ sơ y tế tích hợp AI. Tài liệu này cung cấp các tiêu chuẩn kỹ thuật, lệnh vận hành và quy chuẩn code để các AI Agent (như Sisyphus) có thể làm việc một cách nhất quán và chính xác trong môi trường Docker.

---

## 🚀 1. Tổng quan Công nghệ (Tech Stack)

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy 2.0 (Async), Pydantic v2.
- **Database**: MySQL 8.0, Redis (FastAPI-Cache2).
- **Infrastructure**: Docker Compose, Nginx Reverse Proxy.

---

## 🛠 2. Lệnh Vận hành (Docker Only)

Tất cả các lệnh phải được thực thi thông qua Docker Compose từ thư mục gốc của dự án.

### 🐍 Backend (FastAPI)
- **Cài đặt thư viện**: `docker compose exec backend pip install -r requirements.txt`
- **Linting & Formatting**: `docker compose exec backend black app`
- **Chạy Tests**:
  - Toàn bộ: `docker compose exec backend pytest`
  - Theo file: `docker compose exec backend pytest tests/test_auth.py`
  - Theo test case cụ thể: `docker compose exec backend pytest tests/test_auth.py::test_login`
  - Chế độ log chi tiết: `docker compose exec backend pytest -s`
- **Database Migrations (Alembic)**:
  - Tạo migration: `docker compose exec backend alembic revision --autogenerate -m "mô_tả"`
  - Áp dụng migration: `docker compose exec backend alembic upgrade head`
  - Quay lại (Downgrade): `docker compose exec backend alembic downgrade -1`

### ⚛️ Frontend (Next.js)
- **Cài đặt thư viện**: `docker compose exec frontend npm install`
- **Kiểm tra lỗi (Lint)**: `docker compose exec frontend npm run lint`
- **Thêm UI Component**: `docker compose exec frontend npx shadcn@latest add [component]`
- **Kiểm tra Build**: `docker compose exec frontend npm run build` (BẮT BUỘC trước khi commit)

---

## 📐 3. Quy chuẩn Code (Code Style)

### 🔹 3.1 Backend (Python/FastAPI)
- **Đặt tên (Naming)**:
  - Class: `PascalCase` (e.g., `UserService`, `BaseModel`)
  - Function/Variable: `snake_case` (e.g., `get_user_by_id`, `current_user`)
  - File/Directory: `snake_case` (e.g., `auth_router.py`, `user_schemas/`)
  - API Endpoints: `kebab-case` (e.g., `/api/v1/user-profiles`)
- **Type Hints**: **BẮT BUỘC** sử dụng Type Hints cho mọi tham số và giá trị trả về.
- **Async/Await**: Sử dụng `async def` và `await` cho mọi thao tác I/O (DB, Redis, HTTP).
- **Error Handling**: Sử dụng `HTTPException` với status code chuẩn. Log lỗi quan trọng bằng `loguru.logger.error()`.
- **Validation**: Sử dụng Pydantic v2 `BaseModel`. Ưu tiên kiểu đặc thù như `EmailStr`.
- **Database**: Sử dụng `Depends(get_db)`. Không tự ý mở/đóng session thủ công.
- **Import**: 1. Stdlib | 2. Third-party | 3. Local app modules. Sắp xếp alphabet.

### 🔹 3.2 Frontend (TypeScript/Next.js)
- **Đặt tên (Naming)**:
  - Component File: `PascalCase.tsx`
  - UI Components: `lowercase.tsx` (chuẩn shadcn)
  - Hook/Util: `camelCase.ts` (e.g., `useAuth.ts`, `formatDate.ts`)
  - Props/Interface: `NameProps` (e.g., `UserCardProps`)
- **Component**: Ưu tiên Server Components. Chỉ dùng `"use client"` khi cần State/Effect.
- **Styling**: Tailwind CSS 4. Dùng `cn()` từ `@/lib/utils` để gộp class động.
- **State**: Server State (`@tanstack/react-query`), Client State (`zustand`).
- **Imports**: Alias `@/` cho `src/`. Sắp xếp: React -> Next -> Libs -> Components -> Hooks -> Types -> Utils.

---

## 🔐 4. Bảo mật & Quy tắc Vàng (Guardrails)

1. **Tuyệt đối KHÔNG commit file `.env`** hoặc chứa bất kỳ secrets nào.
2. **Kiểm tra Rank**: Mọi API/Page nhạy cảm phải được bảo vệ (0=Guest, 1=Member, 3=Mod, 5=Admin).
3. **CSRF Protection**: Các request POST/PUT/PATCH/DELETE phải có header `X-CSRF-Token`.
4. **Frontend Logic**: Chỉ handle logic; bàn giao thay đổi VISUAL/UI cho `frontend-ui-ux-engineer`.
5. **Git Commits**: Sử dụng **Conventional Commits** (e.g., `feat: add profile`, `fix: auth bug`).
6. **Testing**: Ưu tiên Playwright MCP cho mọi tương tác trình duyệt tại `http://aicmr.local`.

---

## 📁 5. Cấu trúc Thư mục Quan trọng

- `backend/app/api/v1/`: Định nghĩa các route API theo phiên bản.
- `backend/app/crud/`: Logic thao tác Database (SQLAlchemy).
- `backend/app/models/`: Định nghĩa các bảng dữ liệu (Models).
- `backend/app/schemas/`: Định nghĩa validation đầu vào/đầu ra (Pydantic).
- `frontend/src/app/`: Hệ thống routing và trang (App Router).
- `frontend/src/components/ui/`: Components cơ bản từ shadcn/ui.
- `frontend/src/hooks/`: Các custom hooks dùng chung và hooks logic.
- `frontend/src/lib/`: Tiện ích chung, api client, constants.
- `frontend/src/types/`: Định nghĩa các interface và type TypeScript.

---

## 🤖 6. Quy trình cho Agent (Workflows)

1. **Phân tích (Analyze)**: Sử dụng `Read`, `Grep` và `ContextScout` để hiểu mã nguồn hiện tại.
2. **Tham vấn (Oracle)**: Nếu sửa lỗi phức tạp hoặc thay đổi kiến trúc, **BẮT BUỘC** hỏi `oracle` trước.
3. **Lập kế hoạch (Plan)**: Tạo Todo list chi tiết bằng `todowrite` trước khi bắt đầu.
4. **Thực thi (Implement)**: Thực hiện từng bước, tuân thủ style và patterns hiện có.
5. **Kiểm tra (Verify)**: 
   - Chạy `npm run lint` hoặc `pytest`.
   - Sử dụng Playwright kiểm tra giao diện tại `http://aicmr.local`.
   - Sử dụng `lsp_diagnostics` để đảm bảo sạch lỗi type.
6. **Giao tiếp**: Phản hồi ngắn gọn bằng tiếng Việt, tổng hợp kết quả rõ ràng sau mỗi task.

---

## 🔑 7. Tài khoản Thử nghiệm (Test Accounts)

Mật khẩu mặc định: `User@123456`
- **Admin**: `admin_test@aicmr.com` (Rank 5)
- **Moderator**: `mod@aicmr.com` (Rank 3)
- **Member**: `member@aicmr.com` (Rank 1)
- **Guest**: `guest@aicmr.com` (Rank 0)

---

## ⚠️ 8. Lỗi thường gặp (Troubleshooting)

- **Hydration failed**: Do logic client-side chạy trong SSR. Khắc phục bằng `useEffect` hoặc `dynamic import`.
- **IntegrityError**: Trùng lặp email/username. Sử dụng `try-except` và trả về lỗi 400.
- **Pydantic ValidationError**: Dữ liệu DB không khớp Schema. Kiểm tra lại `response_model` và logic CRUD.
- **Playwright Timeout**: Đảm bảo các container Docker đang chạy và domain `aicmr.local` đã được cấu hình.

---
*Cập nhật lần cuối: 19/01/2026 bởi Sisyphus Orchestrator*
