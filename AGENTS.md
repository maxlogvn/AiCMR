# AGENTS.md - Hướng dẫn cho AI Coding Agents

## Tổng quan dự án
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy 2.0 (Async), Pydantic v2.
- **Database**: MySQL 8.0, Redis (Caching).
- **Infrastructure**: Docker Compose, Nginx (Reverse Proxy).

## Lệnh Build/Lint/Test

### Backend (FastAPI)
Chạy từ `backend/` hoặc qua Docker:
- **Dev Server**: `uvicorn app.main:app --reload`
- **Tất cả Test**: `pytest`
- **Một File Test**: `pytest tests/test_main.py`
- **Một Test cụ thể**: `pytest tests/test_main.py::test_root`
- **Test với Coverage**: `pytest --cov=app --cov-report=term-missing`
- **Tạo Migration**: `alembic revision --autogenerate -m "desc"`
- **Áp dụng Migration**: `alembic upgrade head`
- **Docker Test**: `docker compose exec backend pytest tests/test_main.py::test_root`

### Frontend (Next.js)
Chạy từ `frontend/`:
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

### Docker Compose
Chạy từ thư mục gốc:
- **Khởi động**: `docker compose up -d --build`
- **Logs Backend**: `docker compose logs -f backend`
- **Dừng**: `docker compose down`

---

## Code Style - Backend

### Thứ tự Import
1. Thư viện chuẩn (Standard library)
2. Thư viện bên thứ ba (Third-party)
3. Local modules (absolute import: `app.xxx`)

### Type Hints & Docstrings
- **BẮT BUỘC** dùng Type Hints cho tất cả function/variable
- Docstrings: Tiếng Việt, mô tả ngắn gọn mục đích/Args/Returns
```python
async def get_user(db: AsyncSession, user_id: int) -> Optional[User]:
    """Lấy thông tin user theo ID"""
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()
```

### Naming Conventions
- Classes: `PascalCase`
- Functions/Variables: `snake_case`
- Constants: `UPPER_SNAKE_CASE`

### Error Handling & Logging
- Dùng `loguru` thay vì `print()`/`logging`: `logger.info("Message")`, `logger.error("Error: {}", e)`
- Database sessions: `db: AsyncSession = Depends(get_db)`
- Redis: Cấu hình trong `app/main.py` qua `FastAPICache`

### API & Models Structure
- Models: `app/models/`, Schemas: `app/schemas/`
- Routers: `app/api/v1/` với prefix và tags rõ ràng
- Phân trang: `fastapi_pagination.Page[Schema]` + `paginate(data)`
- **Sync Models**: Cập nhật Database Model → Cập nhật Pydantic Schema tương ứng

### Pydantic v2 Patterns
```python
class UserCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    email: EmailStr
    rank: int = Field(default=1, ge=0, le=5)

class UserResponse(UserBase):
    id: int
    created_at: datetime
```

---

## Code Style - Frontend

### Thứ tự Import
1. React/Next.js core hooks và components
2. Thư viện bên thứ ba (lucide-react, axios, ...)
3. Components nội bộ (alias `@/components/...`)
4. Hooks, Types, Utils nội bộ

### Components & Props
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({ children, variant, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
```
- Functional Components với interface Props
- `"use client"` chỉ khi cần hooks/tương tác người dùng

### Tailwind CSS & Styling
- Utility classes với prefix responsive: `sm:`, `md:`, `lg:`
- Dark mode: `dark:` prefix
- Không custom CSS, dùng Tailwind utilities

### State & Data Fetching
- **TanStack Query** cho request: `useQuery`, `useMutation`
- Axios: `src/lib/api.ts` (có auth interceptors)
- Forms: `react-hook-form` + `zod`
```typescript
const { data, isLoading } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
const mutation = useMutation({ mutationFn: updateUser });
```

### Pattern Organization
- **Hooks**: `src/hooks/useX.ts` (logic fetch data)
- **Services**: `src/lib/auth.ts` (API calls)
- **Types**: `src/types/index.ts` (TypeScript interfaces)

---

## Quy tắc đặc thù
- **Path Aliases**: `@/*` → `./src/*`, KHÔNG dùng `../../`
- **Secrets**: KHÔNG BAO GIỜ commit `.env` hoặc hardcode keys
- **Hệ thống Rank**: 0=Guest, 1-2=Member, 3-4=Moderator, 5=Admin
  - Backend: `require_min_rank(rank)` để bảo vệ route
- **Atomic Design**: `ui/` (Button), `features/` (AuthForm), `layouts/` (MainLayout)
- **Sync Models**: Cập nhật DB Model → Cập nhật Pydantic Schema

---

## Cấu trúc Backend
```
app/
├── api/v1/        # Endpoints by domain (auth.py, users.py)
├── core/          # Config (config.py, security.py, database.py)
├── crud/          # Database operations (CRUD)
├── models/        # SQLAlchemy models
└── schemas/       # Pydantic request/response models
```

## Quy trình Migration
```bash
# 1. Tạo revision
docker compose exec backend alembic revision --autogenerate -m "thông báo"

# 2. Kiểm tra file backend/alembic/versions/

# 3. Áp dụng migration
docker compose exec backend alembic upgrade head
```

## Mẫu Testing
```python
@pytest.mark.asyncio
async def test_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
```

## Lỗi thường gặp
1. **Sync vs Async**: Luôn `await` DB operations và API calls
2. **Missing Imports**: Kiểm tra `app/models/__init__.py` khi thêm model mới
3. **Hydration Error**: Dùng `"use client"` khi dùng hooks trong Next.js

## Ghi chú
- Nginx: `nginx/conf.d/default.conf`
- Domain: `aicmr.local` (add to `/etc/hosts`)
- phpMyAdmin: `http://aicmr.local/phpmyadmin`
- API Docs: `http://aicmr.local/backend/docs`

