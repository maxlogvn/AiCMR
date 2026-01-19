# AGENTS.md - Hướng dẫn Phát triển cho AI Coding Agents

Dự án AiCMR là một hệ thống quản lý hồ sơ y tế tích hợp AI. Tài liệu này cung cấp các tiêu chuẩn kỹ thuật, lệnh vận hành và quy chuẩn code để các AI Agent có thể làm việc nhất quán trong môi trường Docker.

---

## 🛠 1. Lệnh Vận hành (Docker Only)

Tất cả các lệnh phải được thực thi thông qua Docker Compose từ thư mục gốc.

### 🐍 Backend (FastAPI)
- **Cài đặt thư viện**: `docker compose exec backend pip install -r requirements.txt`
- **Formatting**: `docker compose exec backend black app`
- **Kiểm tra lỗi (Lint)**: `docker compose exec backend ruff check app`
- **Chạy Tests**:
  - Toàn bộ: `docker compose exec backend pytest`
  - Theo file: `docker compose exec backend pytest tests/test_main.py`
  - Theo test case: `docker compose exec backend pytest tests/test_main.py::test_read_main`
  - Chế độ verbose: `docker compose exec backend pytest -v`
  - Chế độ log: `docker compose exec backend pytest -s`
  - Chế độ coverage: `docker compose exec backend pytest --cov=app --cov-report=html`
- **Database Migrations (Alembic)**:
  - Tạo: `docker compose exec backend alembic revision --autogenerate -m "description"`
  - Áp dụng: `docker compose exec backend alembic upgrade head`
  - Rollback: `docker compose exec backend alembic downgrade -1`
- **Docker Container Management**:
  - Xem status: `docker compose ps`
  - Restart service: `docker compose restart backend` hoặc `docker compose restart frontend`
  - Xem logs: `docker compose logs -f backend` hoặc `docker compose logs -f frontend`
  - Clean rebuild: `docker compose up -d --build`

### ⚛️ Frontend (Next.js)
- **Cài đặt thư viện**: `docker compose exec frontend npm install`
- **Kiểm tra lỗi (Lint)**: `docker compose exec frontend npm run lint`
- **Thêm UI Component**: `docker compose exec frontend npx shadcn@latest add [component]`
- **Kiểm tra Build**: `docker compose exec frontend npm run build` (BẮT BUỘC trước khi commit)
- **Docker Container Management**:
  - Xem status: `docker compose ps`
  - Xem logs: `docker compose logs -f frontend`

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
  - Catch errors cụ thể, không catch chung.
- **Database**: Sử dụng `Depends(get_db)`. Logic DB tập trung tại `app/crud/`.
- **Imports**: 1. Standard library | 2. Third-party | 3. Local. Sắp xếp alphabet.
- **Docstrings**: Sử dụng Google style cho public functions/classes.

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
- **TypeScript**: **BẮT BUỘC** types cho mọi component, prop, và function.

---

## 🔐 3. Bảo mật & Bảo vệ (Guardrails)

### 🔹 3.1 Cơ chế Lưu trữ (Storage Strategy)
Hệ thống áp dụng cơ chế lưu trữ hỗn hợp với **ƯU TIÊN TUYỆT ĐỐI CHO PUBLIC** để tối ưu SEO:

1. **Mặc định là Public (Ưu tiên)**:
   - Áp dụng cho: Logo, Favicon, ảnh bài viết, ảnh giao diện, tài liệu hướng dẫn công khai, và **tất cả các file không chứa thông tin nhạy cảm**.
   - Đặc điểm: URL thân thiện SEO (`/media/{id}/{slug}`), không yêu cầu Token, cho phép Bot tìm kiếm lập chỉ mục.
   - Thực thi: Khi upload, **BẮT BUỘC** set tham số `is_public=true`.

2. **Private (Chỉ khi thực sự nhạy cảm)**:
   - Áp dụng cho: Hồ sơ bệnh án chi tiết, kết quả xét nghiệm cá nhân, ảnh bộ phận cơ thể nhạy cảm của bệnh nhân.
   - Đặc điểm: URL kỹ thuật (`/backend/api/v1/uploads/file/{id}`), bắt buộc có Token, chặn Bot tìm kiếm.
   - Thực thi: Chỉ set `is_public=false` khi có yêu cầu bảo mật đặc biệt.

### 🔹 3.2 Quy tắc chung
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
- `backend/app/core/`: Core configuration, security, utilities.
- `backend/tests/`: Unit và integration tests.
- `frontend/src/app/`: App Router (Pages & Layouts).
- `frontend/src/components/`: Reusable components (ui, layout, features).
- `frontend/src/hooks/`: Business logic & API hooks.
- `frontend/src/lib/`: API clients, constants, utilities.
- `frontend/src/types/`: TypeScript interfaces/types.
- `frontend/src/store/`: Zustand state management.

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
- **Database connection**: Restart database nếu connection lost: `docker compose restart db`
- **Redis connection**: Restart Redis nếu connection lost: `docker compose restart redis`
- **Build failed**: Clean rebuild: `docker compose up -d --build`

---

*Cập nhật: 20/01/2026*
