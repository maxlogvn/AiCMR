# 06. Tài liệu API (API Reference)

Tất cả các API đều có tiền tố: `/backend/api/v1`

## 1. Authentication (`/auth`)

| Method | Endpoint | Mô tả | Auth | Rate Limit |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/register` | Đăng ký tài khoản | No | 3/min |
| POST | `/login` | Đăng nhập nhận JWT | No | 5/min |
| POST | `/refresh` | Làm mới Access Token | No | 10/min |
| POST | `/logout` | Đăng xuất | Bearer | 10/min |
| GET | `/csrf-token` | Lấy CSRF Token | No | 30/min |
| POST | `/forgot-password` | Yêu cầu khôi phục MK | No | 3/min |
| POST | `/reset-password` | Đổi mật khẩu mới | No | 3/min |

## 2. User Management (`/users`)

| Method | Endpoint | Mô tả | Rank |
| :--- | :--- | :--- | :--- |
| GET | `/me` | Thông tin cá nhân | 0+ |
| PATCH | `/me` | Cập nhật hồ sơ | 0+ |
| PATCH | `/me/password` | Đổi mật khẩu | 0+ |
| GET | `/` | Danh sách User (Phân trang) | 5 (Admin) |
| GET | `/{id}` | Chi tiết User | 3+ (Mod) |
| PATCH | `/{id}` | Cập nhật User | 5 (Admin) |
| DELETE | `/{id}` | Xóa User | 5 (Admin) |

## 3. Installation (`/install`)

| Method | Endpoint | Mô tả | Ghi chú |
| :--- | :--- | :--- | :--- |
| GET | `/status` | Kiểm tra trạng thái cài đặt | Trả về `installed: bool` |
| POST | `/setup` | Thiết lập hệ thống ban đầu | Cần `INSTALL_SECRET` |

## 4. Upload Management (`/uploads`)

Mọi request upload/delete yêu cầu `X-CSRF-Token` và tài khoản đã đăng nhập.

| Method | Endpoint | Mô tả | Rank |
| :--- | :--- | :--- | :--- |
| POST | `/` | Tải tập tin lên hệ thống (Query `is_public=true/false`) | 1+ |
| GET | `/file/{id}` | Tải/Xem file Private (Cần Token) | 1+ (Cá nhân), 3+ (Tất cả) |
| GET | `/p/{id}/{slug}` | Xem file Public (SEO Friendly, Không Token) | No Auth |
| GET | `/{id}` | Lấy thông tin metadata file | 1+ (Cá nhân), 3+ (Tất cả) |
| DELETE | `/{id}` | Xóa tập tin | 1+ (Cá nhân), 5 (Admin) |

## 5. System & Monitoring

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/metrics` | Prometheus metrics (Nội bộ) |
| GET | `/health` | Kiểm tra sức khỏe hệ thống |

## Quy chuẩn Phản hồi
- **Thành công**: Trả về dữ liệu JSON hoặc cấu hình phân trang `{ items: [], total: x, page: y, size: z }`.
- **Lỗi**: Trả về định dạng:
  ```json
  {
    "detail": "Thông báo lỗi cụ thể"
  }
  ```
- **Caching**: Các endpoint GET như `/users/me` hoặc `/install/status` được cache trong 300 giây.
