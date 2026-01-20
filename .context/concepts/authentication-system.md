# Authentication System

Hệ thống xác thực và phân quyền của AiCMR.

## Hệ Thống Rank (0-5)

| Rank | Tên | Quyền hạn |
|------|-----|-----------|
| 0 | Guest | Xem/sửa hồ sơ cá nhân |
| 1-2 | Member | Quyền cơ bản |
| 3-4 | Moderator | Xem info người dùng khác |
| 5 | Admin | Quản lý users, thay đổi rank |

## Cơ Chế JWT

**Access Token**:
- Thời hạn: 15 phút
- Dùng để: Truy cập API
- Header: `Authorization: Bearer <token>`

**Refresh Token**:
- Thời hạn: 7 ngày
- Dùng để: Lấy Access Token mới
- Rotation: Mỗi lần dùng → cặp token mới + thu hồi token cũ

## CSRF Protection

```bash
# 1. Lấy CSRF token
GET /api/v1/auth/csrf-token

# 2. Gửi với POST/PUT/DELETE
X-CSRF-Token: <token>
```

## Rate Limiting

| Endpoint | Giới hạn |
|----------|----------|
| `/auth/login` | 5/phút |
| `/auth/register` | 3/phút |
| `/auth/forgot-password` | 3/phút |
| `/auth/csrf-token` | 30/phút |

## Password Complexity

- Độ dài: **Tối thiểu 8 ký tự**
- Thành phần: Chữ hoa, chữ thường, số, ký tự đặc biệt (`!@#$%^&*()`)
- Không trùng mật khẩu phổ biến

## Logout Flow

1. Gửi `POST /api/v1/auth/logout`
2. Backend thu hồi Refresh Token
3. Frontend xóa tokens trong localStorage

## Test Accounts (Password: `User@123456`)
- Admin: `admin_test@aicmr.com` (Rank 5)
- Mod: `mod@aicmr.com` (Rank 3)
- Member: `member@aicmr.com` (Rank 1)
- Guest: `guest@aicmr.com` (Rank 0)

## Tham Chiếu
- Security: `concepts/security.md`
- API reference: `lookup/api-endpoints.md`
- Test accounts: `lookup/test-accounts.md`
