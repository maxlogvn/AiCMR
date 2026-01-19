# 08. Module Upload Tập tin (Upload Module)

Tài liệu này chi tiết về cách hoạt động, cấu hình và sử dụng Module Upload trong hệ thống AiCMR.

## Tổng quan
Module Upload cung cấp khả năng lưu trữ tập tin (hình ảnh, tài liệu y tế) một cách an toàn và hiệu quả. Hệ thống sử dụng lưu trữ riêng tư (Private Storage) với cơ chế streaming để tối ưu hóa RAM và bảo vệ dữ liệu.

## Cấu hình (Settings)
Cấu hình upload được quản lý linh hoạt thông qua Database (bảng `settings`) hoặc file cấu hình `backend/app/core/config.py`.

- `upload_allowed_extensions`: Danh sách các định dạng được phép (mặc định: `jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,txt`).
- `upload_max_size_mb`: Dung lượng tối đa cho mỗi tập tin (mặc định: `10MB`).
- `UPLOAD_DIR`: Thư mục cơ sở để lưu trữ (mặc định: `storage/uploads`).
- `CHUNK_SIZE`: Kích thước khối dữ liệu để streaming (mặc định: `1MB`).

## Kiến trúc Mới (Architecture Update)

### Private Storage & Proxy Download
Từ phiên bản cập nhật, hệ thống đã chuyển sang kiến trúc bảo mật cao hơn:

1. **Private Storage**: Tập tin được lưu trong `storage/uploads/` (không truy cập trực tiếp từ web).
2. **Proxy Download**: Truy cập file qua endpoint `/backend/api/v1/uploads/file/{id}`.
3. **Access Control**: Chỉ chủ sở hữu hoặc Rank >= 3 mới được xem file.
4. **Streaming Upload**: Đọc/ghi file theo chunk 1MB để tối ưu RAM.

### Các Tính Năng Bảo Mới

| Tính năng | Trước | Sau | Lợi ích |
|-----------|-------|-----|---------|
| Lưu trữ | public/uploads (public) | storage/uploads (private) | Không truy cập trực tiếp URL |
| Upload | Tải toàn bộ vào RAM | Streaming 1MB chunks | Không tràn RAM với file lớn |
| Kiểm tra | Chỉ extension | Extension + Magic Bytes | Phát hiện file giả mạo |
| Tên file | Giữ nguyên | Slugify + UUID | Tránh lỗi ký tự đặc biệt |
| Download | Truy cập trực tiếp | Proxy với phân quyền | Bảo vệ tuyệt đối |

## Cơ chế Lưu trữ

### Cấu trúc Thư mục
Tập tin được tổ chức theo thời gian để tránh tình trạng quá tải số lượng file trong một thư mục:
`storage/uploads/YYYY/MM/DD/`

Ví dụ: `storage/uploads/2026/01/19/550e8400-e29b-41d4-a716-446655440000_photo.jpg`

**Lưu ý**:
- Thư mục `storage/uploads/` được mount từ host vào container backend.
- Các thư mục con được tạo tự động theo ngày (YYYY/MM/DD).
- File được lưu trong private storage, không thể truy cập trực tiếp qua URL.

### Tên Tập tin
Hệ thống tự động:
1. **Thêm UUID**: Đảm bảo tính duy nhất (không bị trùng lặp).
2. **Slugify**: Chuyển tên file sang dạng slug an toàn (không dấu cách, không ký tự đặc biệt).
3. **Giữ extension**: Giữ nguyên phần mở rộng file.

Ví dụ:
- Gốc: `Ảnh profile #1.jpg`
- Sau xử lý: `550e8400-e29b-41d4-a716-446655440000_anh-profile-1.jpg`

### Streaming Upload
Để tối ưu hóa bộ nhớ và xử lý file lớn:

```python
# Đọc file theo chunk 1MB
CHUNK_SIZE = 1024 * 1024

async with aiofiles.open(file_full_path, "wb") as f:
    while chunk := await file.read(CHUNK_SIZE):
        # Kiểm tra kích thước
        if actual_size + len(chunk) > max_size_bytes:
            raise HTTPException(detail="File quá lớn")
        # Ghi chunk vào đĩa
        await f.write(chunk)
        actual_size += len(chunk)
```

**Lợi ích**:
- Không load toàn bộ file vào RAM.
- Có thể xử lý file GB mà không gây OOM (Out of Memory).
- Progress tracking chính xác cho UI.

## Quy trình Xử lý Backend

### Upload Flow (Streaming)

1. **Validation (Client)**: Frontend kiểm tra định dạng và kích thước file trước khi gửi.
2. **Validation (Server)**:
   - Kiểm tra Rank người dùng (Rank 1+ mới được upload).
   - Verify CSRF Token.
   - Kiểm tra định dạng file từ extension.
   - Kiểm tra dung lượng từ header (nếu có).
3. **Path Generation**: Tạo thư mục theo ngày hiện tại (`storage/uploads/YYYY/MM/DD/`).
4. **Filename Sanitization**:
   - Dùng `python-slugify` để chuyển tên file thành slug an toàn.
   - Thêm UUID vào đầu để đảm bảo tính duy nhất.
5. **Streaming Upload**:
   - Đọc file theo chunk 1MB (`CHUNK_SIZE = 1024 * 1024`).
   - Ghi từng chunk vào đĩa.
   - Theo dõi tổng dung lượng để phát hiện file vượt giới hạn.
6. **Magic Bytes Detection**:
   - Dùng `python-magic` để kiểm tra nội dung thực sự của file.
   - Phát hiện file giả mạo (ví dụ: `.exe` đổi thành `.jpg`).
7. **Database Record**: Lưu thông tin vào bảng `attachments` với:
   - `filename`: Tên gốc của file.
   - `file_path`: Đường dẫn tương đối (`storage/uploads/YYYY/MM/DD/uuid_filename.ext`).
   - `content_type`: MIME type được phát hiện.
   - `file_size`: Kích thước thực tế (bytes).
   - `user_id`: ID người upload.
8. **Response**: Trả về thông tin file với URL proxy `/backend/api/v1/uploads/file/{id}`.

### Download Flow (Proxy)

1. **Authentication**: Kiểm tra token của người dùng.
2. **Authorization**:
   - Kiểm tra quyền: Chủ sở hữu file OR Rank >= 3.
   - Nếu không có quyền → trả về 403 Forbidden.
3. **File Lookup**:
   - Lấy thông tin file từ database (table `attachments`).
   - Nếu không tồn tại → trả về 404 Not Found.
4. **Stream File**:
   - Đọc file từ `storage/uploads/` đường dẫn.
   - Sử dụng `FileResponse` để stream nội dung.
   - Set correct MIME type và filename.
5. **Cache Headers**: FastAPI tự động thêm ETag, Cache-Control.

### Delete Flow

1. **Authentication**: Kiểm tra token.
2. **Authorization**:
   - Chủ sở hữu file OR Rank 5 (Admin).
   - Nếu không có quyền → 403 Forbidden.
3. **Delete Physical File**: Xóa file khỏi `storage/uploads/`.
4. **Delete Database Record**: Xóa row khỏi bảng `attachments`.
5. **Response**: Trả về success message.

## Cách sử dụng (API)

### Upload Tập tin
- **Endpoint**: `POST /backend/api/v1/uploads/`
- **Body**: `multipart/form-data` với key `file`.
- **Headers**: Yêu cầu `Authorization` (Bearer Token) và `X-CSRF-Token`.
- **Response**:
  ```json
  {
    "id": 15,
    "filename": "photo.jpg",
    "file_path": "storage/uploads/2026/01/19/uuid_photo.jpg",
    "content_type": "image/jpeg",
    "file_size": 102400,
    "user_id": 16,
    "created_at": "2026-01-19T00:16:33",
    "url": "/backend/api/v1/uploads/file/15"
  }
  ```

### Truy cập Tập tin (Proxy Download)
- **Endpoint**: `GET /backend/api/v1/uploads/file/{id}`
- **Headers**: Yêu cầu `Authorization` (Bearer Token).
- **Authorization**: Chỉ chủ sở hữu file hoặc Rank >= 3 mới được truy cập.
- **Response**: Binary content của file với đúng MIME type.

**Ví dụ Frontend:**
```typescript
// Get proxy URL
const fileUrl = uploadsApi.getFileUrl(attachmentId); // "/backend/api/v1/uploads/file/15"

// Use in Image component
<Image src={fileUrl} alt="Photo" />
```

### Lấy Metadata
- **Endpoint**: `GET /backend/api/v1/uploads/{id}/`
- **Headers**: `Authorization` (Bearer Token).
- **Response**: JSON metadata của attachment (không bao gồm content).

### Xóa Tập tin
- **Endpoint**: `DELETE /backend/api/v1/uploads/{id}/`
- **Headers**: `Authorization` (Bearer Token) và `X-CSRF-Token`.
- **Authorization**: Chỉ chủ sở hữu file hoặc Rank 5 (Admin) mới được xóa.
- **Response**: `{"message": "Xóa file thành công"}`.

## Bảo mật

### Authentication & Authorization
- **Upload**: Rank 1+ mới được phép upload.
- **Download**: Chỉ chủ sở hữu hoặc Rank >= 3 mới được truy cập file.
- **Delete**: Chỉ chủ sở hữu hoặc Rank 5 (Admin) mới được xóa file.

### Content Security
- **Extension Validation**: Kiểm tra đuôi file trước khi upload.
- **Magic Bytes Detection**: Dùng `python-magic` để kiểm tra nội dung thực sự.
  - Phát hiện file giả mạo (ví dụ: `.exe` đổi thành `.jpg`).
  - Phát hiện file bị hỏng hoặc corrupted.
- **Filename Sanitization**: Dùng `python-slugify` để:
  - Loại bỏ ký tự nguy hiểm (../../, etc).
  - Chuyển sang dạng slug an toàn.
  - Tránh lỗi encoding trên hệ thống Linux.

### Access Control
- **Private Storage**: File được lưu trong `storage/uploads/` (không truy cập trực tiếp).
- **Proxy Endpoint**: Mọi truy cập phải qua `/backend/api/v1/uploads/file/{id}`.
- **JWT Authentication**: Yêu cầu access token hợp lệ.
- **CSRF Protection**: POST, PUT, DELETE yêu cầu `X-CSRF-Token` header.

### Rate Limiting & DoS Prevention
- **File Size Limit**: Giới hạn kích thước file (default: 10MB).
- **Chunk Size**: 1MB chunks để tránh chiếm dụng RAM quá nhiều.
- **Concurrent Uploads**: Có thể implement rate limiting nếu cần.

### Example Security Check
```python
# Backend validation
magic_mime = magic.from_file(file_path)
if magic_mime == 'application/x-dosexec':
    raise HTTPException("Phát hiện executable file!")
```

## Troubleshooting

### File Upload Failed (400 Bad Request)

**Lỗi**: `Định dạng file .xyz không được phép`
- **Giải pháp**: Kiểm tra cài đặt `upload_allowed_extensions` trong settings.
- **Lệnh**: `SELECT value FROM settings WHERE key = 'upload_allowed_extensions';`

**Lỗi**: `File quá lớn`
- **Giải pháp**: Kiểm tra `upload_max_size_mb` trong settings.
- **Lưu ý**: Client-side validation chạy trước, nhưng server cũng kiểm tra.

### File Not Found (404) on Display

**Lỗi**: Console show 404 for images
- **Nguyên nhân**: File cũ dùng đường dẫn `/uploads/...` nhưng mới dùng `storage/uploads/`
- **Giải pháp**: Re-upload file hoặc migrate dữ liệu cũ.

### Magic Bytes Detection Issues

**Lỗi**: `text/plain` cho file image
- **Nguyên nhân**: `libmagic` không được cài đặt đúng trên hệ thống.
- **Kiểm tra**:
  ```bash
  docker compose exec backend python -c "import magic; print(magic.from_file('/path/to/file'))"
  ```
- **Giải pháp**: Đảm bảo `python-magic` được cài trong `requirements.txt`.

## Migration Guide (Dữ liệu cũ)

Nếu bạn có file cũ trong `/public/uploads/` hoặc `/static/uploads/`:

```bash
# 1. Backup cũ data
cp -r public/uploads public/uploads.backup

# 2. Di chuyển file cũ sang storage
mkdir -p storage/uploads/old
mv public/uploads/* storage/uploads/old/

# 3. Cập nhật database (lần lượt)
# UPDATE attachments SET file_path = REPLACE(file_path, 'public/uploads', 'storage/uploads/old');

# 4. Test và xóa backup khi ok
# rm -rf public/uploads.backup
```

## Frontend Usage Example

```typescript
import { uploadsApi } from '@/lib/api';
import FileUpload from '@/components/ui/FileUpload';

// Upload component
<FileUpload
  onSuccess={(attachment) => {
    console.log('Upload thành công:', attachment.url);
    // attachment.url = "/backend/api/v1/uploads/file/15"
  }}
  maxSizeMB={10}
  allowedExtensions={['jpg', 'png', 'pdf']}
/>

// Manual upload
const handleManualUpload = async (file: File) => {
  const response = await uploadsApi.uploadFile(file, (progress) => {
    console.log(`Upload: ${progress}%`);
  });
  const fileUrl = uploadsApi.getFileUrl(response.data.id);
  // Sử dụng fileUrl trong <Image>, <a>, v.v.
};
```
