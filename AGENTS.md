# AGENTS.md - Hướng dẫn cho AI Coding Agents

## Tổng quan dự án
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy 2.0 (Async), Pydantic v2.
- **Database**: MySQL 8.0, Redis (Caching).
- **Infrastructure**: Docker Compose, Nginx (Reverse Proxy).

## Lệnh Build/Lint/Test

### Backend (FastAPI)
Các lệnh chạy từ thư mục `backend/`:
- **Chạy Dev Server**: `uvicorn app.main:app --reload`
- **Chạy tất cả Test**: `pytest`
- **Chạy một File Test**: `pytest tests/test_main.py`
- **Chạy một Test cụ thể**: `pytest tests/test_main.py::test_root`
- **Kiểm tra Coverage**: `pytest --cov=app`
- **Tạo Migration**: `alembic revision --autogenerate -m "description"`
- **Cập nhật Database**: `alembic upgrade head`

### Frontend (Next.js)
Các lệnh chạy từ thư mục `frontend/`:
- **Chạy Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

### Docker Compose
Chạy từ thư mục gốc:
- **Khởi động toàn bộ**: `docker compose up -d --build`
- **Xem logs Backend**: `docker compose logs -f backend`
- **Dừng dịch vụ**: `docker compose down`

---

## Hướng dẫn Code Style (Backend)

### Thứ tự Import
1. Thư viện chuẩn (Standard library).
2. Thư viện bên thứ ba (Third-party).
3. Local modules (Dùng absolute import `app.xxx`).

### Type Hints & Documentation
- **BẮT BUỘC** sử dụng Type Hints cho tất cả các function và variable.
- Docstrings: Sử dụng tiếng Việt. Mô tả ngắn gọn mục đích, Args, và Returns.

### Naming Conventions
- **Classes**: `PascalCase`
- **Functions/Variables**: `snake_case`
- **Constants**: `UPPER_SNAKE_CASE`

### Error Handling & Logging
- Sử dụng `loguru` để ghi log thay vì `print()` hay `logging`.
  - `logger.info("Message")`, `logger.error("Error context: {}", e)`
- Database sessions: Sử dụng dependency injection `db: AsyncSession = Depends(get_db)`.
- Kết nối Redis: Được cấu hình trong `app/main.py` qua `FastAPICache`.

### Cấu trúc API & Models
- Models đặt trong `app/models/`, Schemas trong `app/schemas/`.
- Routers đặt trong `app/api/v1/`, sử dụng prefix và tags rõ ràng.
- Phân trang: Sử dụng `fastapi_pagination`. Trả về `Page[Schema]` và dùng `paginate(data)`.
- **Sync Models**: Khi cập nhật Database Model, hãy kiểm tra và cập nhật Pydantic Schema tương ứng (Response, Create, Update).

---

## Hướng dẫn Code Style (Frontend)

### Thứ tự Import
1. React/Next.js core hooks và components.
2. Thư viện bên thứ ba (lucide-react, axios, ...).
3. Components nội bộ (Sử dụng alias `@/components/...`).
4. Hooks, Types, Utils nội bộ.

### Components & Props
- Ưu tiên Functional Components.
- Định nghĩa interface cho Props: `interface ComponentNameProps { ... }`.
- Sử dụng Client Components (`"use client"`) chỉ khi cần tương tác người dùng hoặc dùng hooks.

### Tailwind CSS & Styling
- Sử dụng Tailwind CSS 4 utility classes.
- Responsive: Sử dụng các prefix `sm:`, `md:`, `lg:`.
- Dark mode: Luôn cân nhắc hỗ trợ giao diện tối qua class `dark:`.

### State & Data Fetching
- Sử dụng **TanStack Query (React Query)** cho tất cả các request lấy dữ liệu.
- Axios: Sử dụng instance đã cấu hình trong `src/lib/api.ts` (có interceptors cho Auth).
- Forms: Sử dụng `react-hook-form` kết hợp với `zod` để validation.

### Các Pattern Hook & Component
- **Custom Hooks**: Tách logic fetch dữ liệu ra các file trong `src/hooks/` (ví dụ: `useUser.ts`).
- **API Services**: Logic gọi API đặt trong `src/services/` hoặc dùng trực tiếp Axios instance trong hooks.
- **Interfaces**: Luôn định nghĩa TypeScript interface cho API response trong `src/types/`.

---

## Quy tắc đặc thù cho Agents
- **Path Aliases**: Frontend dùng `@/*` trỏ về `./src/*`. KHÔNG dùng relative path sâu (`../../`).
- **Secret Handling**: KHÔNG BAO GIỜ commit `.env` hoặc hardcode mật khẩu/API keys.
- **Atomic Design**: Tổ chức components theo mức độ phức tạp:
    - `ui/`: Các component cơ bản (Button, Input).
    - `features/`: Các component gắn liền với logic nghiệp vụ (AuthForm, UserProfile).
    - `layouts/`: Các component bao ngoài (MainLayout, AuthLayout).
- **Hệ thống Rank**: Dự án sử dụng hệ thống Rank (0-5).
  - 0: Guest, 1-2: Member, 3-4: Moderator, 5: Admin.
  - Sử dụng dependency `require_min_rank(rank)` trong Backend để bảo vệ route.
- **Sync Models**: Khi cập nhật Database Model, hãy kiểm tra và cập nhật Pydantic Schema tương ứng (Response, Create, Update).

## Cấu trúc Thư mục Chi tiết (Backend)
- `app/api/v1/`: Chứa các endpoint API. Chia theo domain (auth.py, users.py).
- `app/core/`: Chứa cấu hình hệ thống (config.py, security.py, database.py).
- `app/crud/`: Chứa logic thao tác trực tiếp với Database (Create, Read, Update, Delete).
- `app/models/`: Định nghĩa các bảng Database bằng SQLAlchemy.
- `app/schemas/`: Định nghĩa Pydantic models cho request/response validation.

## Quy trình Migration (Alembic)
Khi thay đổi Model trong `app/models/`:
1. Chạy lệnh tạo revision: `docker compose exec backend alembic revision --autogenerate -m "thông báo thay đổi"`
2. Kiểm tra file revision vừa tạo trong `backend/alembic/versions/`.
3. Áp dụng thay đổi vào Database: `docker compose exec backend alembic upgrade head`

## Mẫu Testing (Backend)
Sử dụng `httpx.AsyncClient` để test các endpoint async:
```python
@pytest.mark.asyncio
async def test_api_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
```

## Các lỗi thường gặp cần tránh
1. **Sync vs Async**: Luôn dùng `await` cho DB operations và API calls.
2. **Missing Imports**: Kiểm tra `app/models/__init__.py` khi thêm model mới để Alembic nhận diện.
3. **Hydration Error**: Đảm bảo sử dụng `"use client"` đúng chỗ trong Next.js khi dùng hooks.

## Ghi chú bổ sung
- Cấu hình Nginx nằm trong `nginx/conf.d/default.conf`.
- Tên miền cục bộ: `aicmr.local` (Cần trỏ file hosts: `127.0.0.1 aicmr.local`).
- phpMyAdmin: Truy cập qua `http://aicmr.local/phpmyadmin` (username: `root`, password: từ `.env`).
- API Docs: Truy cập `http://aicmr.local/backend/docs`.

