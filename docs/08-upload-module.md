# 08. Module Upload Tập tin (Upload Module)

Tài liệu này chi tiết về cách hoạt động, cấu hình và sử dụng Module Upload trong hệ thống AiCMR.

## Tổng quan
Module Upload cung cấp khả năng lưu trữ tập tin (hình ảnh, tài liệu y tế) một cách an toàn và hiệu quả. Hệ thống sử dụng lưu trữ cục bộ (Local Storage) với cơ chế chia sẻ Bind Mount giữa các container.

## Cấu hình (Settings)
Cấu hình upload được quản lý linh hoạt thông qua Database (bảng `settings`) hoặc file cấu hình `backend/app/core/config.py`.

- `upload_allowed_extensions`: Danh sách các định dạng được phép (mặc định: `jpg, jpeg, png, pdf, docx`).
- `upload_max_size_mb`: Dung lượng tối đa cho mỗi tập tin (mặc định: `10MB`).
- `UPLOAD_DIR`: Thư mục cơ sở để lưu trữ (mặc định: `static/uploads`).

## Cơ chế Lưu trữ

### Cấu trúc Thư mục
Tập tin được tổ chức theo thời gian để tránh tình trạng quá tải số lượng file trong một thư mục:
`static/uploads/YYYY/MM/DD/`

Ví dụ: `static/uploads/2026/01/19/550e8400-e29b-41d4-a716-446655440000_photo.jpg`

### Tên Tập tin
Hệ thống tự động thêm tiền tố **UUID** vào tên gốc của tập tin để:
1. Đảm bảo tính duy nhất (không bị trùng lặp).
2. Tránh các vấn đề về ký tự đặc biệt trong đường dẫn URL.

## Quy trình Xử lý Backend
1. **Validation**: Kiểm tra Rank người dùng, CSRF Token, định dạng và dung lượng file.
2. **Path Generation**: Tạo thư mục theo ngày hiện tại nếu chưa tồn tại.
3. **Async Write**: Sử dụng `aiofiles` để ghi nội dung file vào đĩa một cách bất đồng bộ.
4. **Database Record**: Lưu thông tin vào bảng `attachments` bao gồm đường dẫn tương đối.
5. **Response**: Trả về thông tin file kèm theo URL truy cập trực tiếp.

## Cách sử dụng (API)

### Tải lên Tập tin
- **Endpoint**: `POST /backend/api/v1/uploads/`
- **Body**: `multipart/form-data` với key `file`.
- **Headers**: Yêu cầu `Authorization` (Bearer Token) và `X-CSRF-Token`.

### Truy cập Tập tin từ Frontend
Do cơ chế Bind Mount đã giải thích ở [Tài liệu Kiến trúc](./02-architecture.md), các tập tin sau khi tải lên có thể được truy cập trực tiếp qua domain chính của Frontend:

URL mẫu: `http://aicmr.local/uploads/2026/01/19/uuid_filename.png`

## Bảo mật
- **Phân quyền**: Người dùng Rank 1+ mới được phép tải lên.
- **Quyền sở hữu**: Chỉ người tải lên hoặc Admin (Rank 5) mới có quyền xóa file. Moderator (Rank 3+) có thể xem metadata nhưng không thể xóa của người khác.
- **CSRF**: Tất cả các thao tác thay đổi dữ liệu (POST, DELETE) đều được bảo vệ bởi CSRF Token.
