# 05. Xác thực và Phân quyền (Authentication)

Hệ thống xác thực của AiCMR được xây dựng tùy chỉnh (Custom Implementation) để đảm bảo tính linh hoạt và bảo mật cao.

## Hệ thống Rank (Cấp bậc)
Quyền hạn trong hệ thống được quyết định bởi giá trị `rank` của người dùng:

| Rank | Tên | Quyền hạn |
| :--- | :--- | :--- |
| **0** | Guest | Mặc định. Xem và sửa hồ sơ cá nhân. |
| **1-2** | Member | Thành viên chính thức với các quyền hạn cơ bản. |
| **3-4** | Moderator | Điều phối viên, có quyền xem thông tin người dùng khác. |
| **5** | Admin | Quản trị viên tối cao. Quản lý user, thay đổi rank, xóa dữ liệu. |

## Cơ chế Xác thực (JWT)
Hệ thống sử dụng JWT (JSON Web Token) Stateless:
- **Access Token**: Thời hạn ngắn (15 phút), dùng để truy cập API.
- **Refresh Token**: Thời hạn dài (7 ngày), dùng để lấy Access Token mới.
- **Rotation**: Mỗi khi Refresh Token được sử dụng, một cặp token mới sẽ được cấp và token cũ sẽ bị thu hồi để ngăn chặn tấn công replay.

## Bảo mật CSRF (Cross-Site Request Forgery)
Để chống lại các cuộc tấn công giả mạo request:
1. Frontend gọi `/api/v1/auth/csrf-token` để lấy token.
2. Token được lưu trong session (Redis) và trả về cho Frontend.
3. Các request POST/PUT/DELETE bắt buộc phải đính kèm header `X-CSRF-Token`.

## Giới hạn băng thông (Rate Limiting)
Sử dụng `slowapi` với Redis để giới hạn tần suất request từ một IP:
- `Login`: 5 lần/phút.
- `Register`: 3 lần/phút.
- `Forgot Password`: 3 lần/phút.
- `CSRF Token`: 30 lần/phút.

## Luồng Đăng xuất (Logout)
Khi người dùng đăng xuất:
1. Gửi request tới `/api/v1/auth/logout`.
2. Backend thu hồi (revoke) Refresh Token trong cơ sở dữ liệu.
3. Frontend xóa sạch token trong `localStorage`.
