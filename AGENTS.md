# AGENTS.md - Hướng dẫn cho AI Coding Agents

> **LƯU Ý QUAN TRỌNG**: File này cung cấp các quy tắc và tiêu chuẩn cốt lõi cho AI. Agent **BẮT BUỘC** phải tuân thủ các quy trình này để đảm bảo tính nhất quán và an toàn cho codebase. Chi tiết hơn xem tại [**docs/**](./docs/README.md).

## 🚀 Tổng quan công nghệ
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy 2.0 (Async), Pydantic v2.
- **Database**: MySQL 8.0, Redis (Caching/FastAPI-Cache2).
- **Libraries**: shadcn/ui, Zustand, Framer Motion, Sonner, Loguru, Pytest.

---

## 🛠 Lệnh Build/Lint/Test

### 🐍 Backend (FastAPI)
- **Cài đặt**: `pip install -r requirements.txt`
- **Dev Server**: `uvicorn app.main:app --reload`
- **Chạy Tests**: 
  - Tất cả: `pytest`
  - Một file: `pytest tests/test_auth.py`
  - Một test cụ thể: `pytest tests/test_auth.py::test_login_success`
  - Với Coverage: `pytest --cov=app --cov-report=term-missing`
- **Migrations (Alembic)**:
  - Tạo: `alembic revision --autogenerate -m "description"`
  - Áp dụng: `alembic upgrade head`

### ⚛️ Frontend (Next.js)
- **Cài đặt**: `npm install`
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **shadcn/ui**: `npx shadcn@latest add [component]`

---

## 📐 Quy chuẩn Code (Code Style)

### 🔹 Backend (FastAPI)
- **Imports**: Theo thứ tự: (1) Standard Lib, (2) Third-party, (3) Local (`app.xxx`).
- **Types**: **BẮT BUỘC** Type Hints cho mọi function/variable. Dùng `Optional`, `List`, `Dict` từ `typing`.
- **Naming**: 
  - Class: `PascalCase` (ví dụ: `UserService`).
  - Function/Var: `snake_case` (ví dụ: `get_user_by_id`).
  - Constants: `UPPER_SNAKE_CASE`.
- **Error Handling**: 
  - Luôn sử dụng `HTTPException` với status code phù hợp từ `fastapi.status`.
  - Logging lỗi bằng `loguru.logger.error` kèm context. Cấm dùng `print()`.
- **Async**: Sử dụng `async def` và `await` cho mọi thao tác I/O (Database, API, Cache).

### 🔹 Frontend (Next.js)
- **Components**: Functional Components + Props Interface. Ưu tiên Server Components.
- **Styling**: Tailwind CSS 4. Sử dụng tiện ích `cn()` từ `@/lib/utils` để gộp class.
- **State**: 
  - Server State: `@tanstack/react-query`.
  - Client State: `zustand` (định nghĩa store trong `src/store/`).
- **Icons**: Sử dụng `lucide-react`.
- **Notifications**: Sử dụng `sonner` (`toast.success`, `toast.error`).
- **Formatting**: Ưu tiên sử dụng `prettier` và `eslint` theo cấu hình dự án.

---

## 🔐 Security & Guardrails
- **Secrets**: **KHÔNG BAO GIỜ** commit `.env`. Truy cập qua `app.core.config.get_settings()`.
- **Authentication**: Luôn kiểm tra `rank` của user (0-5) để phân quyền.
- **Validation**: 
  - Backend: Sử dụng Pydantic `field_validator` để kiểm tra dữ liệu (mật khẩu mạnh, email hợp lệ).
  - Frontend: Sử dụng `zod` schema kết hợp với `react-hook-form`.
- **CSRF**: Các request thay đổi dữ liệu (POST/PUT/DELETE) bắt buộc phải có `X-CSRF-Token`.

---

## 🤖 Quy trình cho AI Agent (Workflows)

1. **Phân tích (Analyze)**: Sử dụng `ContextScout` để tìm context liên quan (`.opencode/context/`).
2. **Lập kế hoạch (Plan)**: Tạo Todo list rõ ràng. Nếu task phức tạp (>3 file), sử dụng `TaskManager`.
3. **Thực thi (Execute)**:
   - Đọc file trước khi sửa.
   - Viết code sạch, dễ hiểu, tuân thủ convention hiện có.
   - Thêm logging/toast phù hợp.
4. **Kiểm chứng (Validate)**: 
   - Chạy `pytest` (backend) hoặc `npm run lint` (frontend) sau khi sửa.
   - Tự rà soát (Self-review) lại các thay đổi.
5. **Dọn dẹp (Cleanup)**: Xóa các file session tạm thời sau khi hoàn thành và được người dùng xác nhận.

### Cấu trúc Thư mục Chính
```
/
├── backend/app/
│   ├── api/v1/     # Endpoints (routes)
│   ├── core/       # Security, Config, Exceptions, Constants
│   ├── crud/       # Database operations (CRUD)
│   ├── models/     # SQLAlchemy models
│   └── schemas/    # Pydantic models (Input/Output)
└── frontend/src/
    ├── app/        # Pages, Layouts, Providers
    ├── components/ # ui/ (shadcn), auth/, layout/
    ├── hooks/      # Custom React hooks
    ├── lib/        # API clients, utils
    └── store/      # Zustand stores
```

---

## ⚠️ Lỗi Thường Gặp & Giải Pháp

### 🐍 Backend
- **"RuntimeError: Task <...> got Future <...> attached to a different loop"**:
  - *Nguyên nhân*: Sử dụng thư viện không hỗ trợ async trong async function.
  - *Giải pháp*: Luôn sử dụng các thư viện `async` (ví dụ: `httpx` thay vì `requests`).
- **"Pydantic Validation Error"**:
  - *Nguyên nhân*: Schema Input/Output không khớp với dữ liệu thực tế.
  - *Giải pháp*: Kiểm tra kỹ `response_model` trong router và kiểu dữ liệu trả về từ CRUD.
- **"Database IntegrityError"**:
  - *Nguyên nhân*: Vi phạm ràng buộc Unique (Email/Username).
  - *Giải pháp*: Luôn kiểm tra tồn tại trước khi tạo hoặc dùng `try-except IntegrityError`.

### ⚛️ Frontend
- **"Hydration failed"**:
  - *Nguyên nhân*: Nội dung Render trên Server khác với Client (thường do `localStorage` hoặc `window`).
  - *Giải pháp*: Sử dụng `useEffect` để chỉ thực thi các logic Client sau khi mount.
- **"Query not found"**:
  - *Nguyên nhân*: Component nằm ngoài `QueryClientProvider`.
  - *Giải pháp*: Đảm bảo các Page/Component được bọc bởi `ClientProvider` trong `layout.tsx`.

---
*Cập nhật lần cuối: 2026-01-18 bởi Antigravity*
