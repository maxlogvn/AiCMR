# Errors: Upload Troubleshooting

Core concept:
Tổng hợp các lỗi phổ biến khi upload và cách khắc phục nhanh.

Common issues & fixes:
- `File quá lớn` (400): Kiểm tra `upload_max_size_mb`; client-side validation trước khi gửi.
- `Định dạng file .xyz không được phép` (400): Kiểm tra `upload_allowed_extensions` và magic-bytes detection.
- `Unauthorized / 401` khi hiển thị ảnh: Thẻ `<img>` không gửi header Authorization → dùng `?token=` hoặc proxy URL từ uploadsApi.
- `File Not Found / 404` trên frontend: Kiểm tra migration paths từ `/uploads/` sang `storage/uploads/`.
- `Magic bytes detection mismatch`: Kiểm tra `libmagic` đã cài trong container.

Quick fixes:
- Re-upload nếu path cũ.
- Use `uploadsApi.getFileUrl(id)` to include token for client-side rendering.
- Check server logs and ensure `python-magic` is installed.

Reference: docs/08-upload-module.md
