# Module Auth & User

## Tổng quan

Module Authentication và User Management đã được triển khai theo phương pháp Custom Implementation để tối ưu quyền kiểm soát và phù hợp với hệ thống Rank đặc thù của dự án AiCMR.

## Kiến trúc

### Backend
- **Framework**: FastAPI + SQLAlchemy (Async)
- **Security**: JWT Stateless Authentication + Bcrypt Password Hashing
- **Database**: MySQL 8.0

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query
- **Form Validation**: React Hook Form + Zod

## Hệ thống Rank (0-5)

| Rank | Tên | Quyền hạn |
| :--- | :--- | :--- |
| **0** | Guest | Mặc định khi đăng ký. Xem/sửa profile cá nhân. |
| **1-2** | Member | Thành viên chính thức. |
| **3-4** | Moderator | Có quyền xem thông tin người dùng khác. |
| **5** | Admin | Toàn quyền: List users, cập nhật rank, xóa người dùng. |

## Backend Implementation

### Database Model (`app/models/user.py`)
```python
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    rank = Column(Integer, default=0, index=True)
    is_active = Column(Boolean, default=True)
```

### Security Features
- **Password Hashing**: `passlib[bcrypt]` với version `bcrypt==3.2.0` để đảm bảo ổn định
- **JWT Token**: Chứa `sub` (user_id) và `rank`. Sử dụng `timezone-aware datetime` (Python 3.12+ compatible).
- **RBAC**: Dependency `require_min_rank(min_rank)` để bảo vệ các API theo cấp độ

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Đăng ký tài khoản mới (rank luôn mặc định = 0 để bảo mật)
- `POST /api/v1/auth/login` - Xác thực và trả về JWT token

#### User Management
- `GET /api/v1/users/me` - Lấy thông tin user hiện tại
- `PATCH /api/v1/users/me` - Update thông tin bản thân (Sử dụng `UserUpdateMe`, không cho phép đổi rank)
- `PATCH /api/v1/users/me/password` - Đổi mật khẩu
- `GET /api/v1/users/` - List users (Admin only, rank >= 5, hỗ trợ **Phân trang**)
- `GET /api/v1/users/{id}` - Xem user (Moderator+ hoặc chính mình)
- `PATCH /api/v1/users/{id}` - Update user (Admin only, rank == 5)
- `DELETE /api/v1/users/{id}` - Xóa user (Admin only, rank == 5)

### CRUD Layer (`app/crud/crud_user.py`)
- `get_by_email`, `get_by_username`, `get_by_id`
- `create`, `update`, `update_password`, `authenticate`
- `get_all_users`, `count_users`, `delete`

## Frontend Implementation

### Core Utilities
- **`src/lib/api.ts`**: Axios client với interceptor tự động đính kèm Token
- **`src/lib/auth.ts`**: AuthService quản lý login/logout và lưu trữ token
- **`src/app/providers.tsx`**: QueryClientProvider cho TanStack Query

### UI Components
- **`Toast`**: Thông báo trạng thái (Success/Error)
- **`AuthGuard`**: Bảo vệ các trang dashboard/profile, tự động redirect về login nếu chưa xác thực

### Pages
- **`/`**: Trang chủ giới thiệu hệ thống
- **`/login`**: Form đăng nhập với validation
- **`/register`**: Form đăng ký
- **`/profile`**: Dashboard cá nhân hiển thị thông tin và rank

### Features
- **Token Storage**: Lưu trong localStorage với automatic attachment
- **Form Validation**: Client-side validation với Zod schemas
- **Responsive Design**: Tailwind CSS với dark mode support
- **Data Caching**: TanStack Query cho optimized API calls

## Security Considerations

1. **Password Hashing**: Mật khẩu được mã hóa bằng bcrypt
2. **JWT Tokens**: Có expiration time, không lưu trên server (stateless)
3. **RBAC Middleware**: Kiểm tra rank trước khi truy cập protected resources
4. **Input Validation**: Pydantic schemas trên backend, Zod trên frontend

## Environment Variables

Yêu cầu trong file `.env`:
```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=mysql+aiomysql://user:password@localhost/dbname
REDIS_URL=redis://localhost:6379/0
```

## Quick Start

### Development Mode
```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

### Docker
```bash
docker compose up -d --build
```

## Testing Accounts

- **User**: `test@example.com` / `testpassword123` (Rank 0)
- **Admin**: `admin@example.com` / `AdminPassword123` (Rank 5)

## Future Enhancements

- [ ] Forgot password endpoint với email gửi token
- [ ] Reset password endpoint
- [ ] Email verification
- [ ] Refresh token mechanism
- [ ] Settings page (change password UI)
- [ ] Admin page (users list với pagination và actions)
- [ ] E2E tests
- [ ] Responsive design improvements
