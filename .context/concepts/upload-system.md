# Upload System

Hệ thống upload tập tin với Private Storage và Streaming.

## Cấu Hình

```python
# backend/app/core/config.py
upload_allowed_extensions = "jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,txt"
upload_max_size_mb = 10
UPLOAD_DIR = "storage/uploads"
CHUNK_SIZE = 1024 * 1024  # 1MB chunks
```

## Cấu Trúc Storage

```
storage/uploads/YYYY/MM/DD/
└── uuid_filename.ext
```

Ví dụ: `storage/uploads/2026/01/19/550e8400-e29b-41d4-a716-446655440000_photo.jpg`

## Tính Năng Bảo Mật

| Tính năng | Mô tả |
|-----------|-------|
| Private Storage | File trong `storage/uploads/` (không truy cập trực tiếp) |
| Streaming Upload | Đọc/ghi theo chunk 1MB → không OOM |
| Magic Bytes Detection | Kiểm tra nội dung thực (phát hiện file giả mạo) |
| Filename Sanitization | UUID + Slugify → tên file an toàn |
| Proxy Download | Truy cập qua `/backend/api/v1/uploads/file/{id}` |
| Authentication | Header hoặc Query `?token=...` |

## Upload Flow

1. Validation client (extension, size)
2. Validation server (rank, CSRF, magic bytes)
3. Tạo path: `storage/uploads/YYYY/MM/DD/`
4. Streaming upload 1MB chunks
5. Lưu vào table `attachments`
6. Return URL: `/backend/api/v1/uploads/file/{id}`

## Download Flow

1. Check token (Header hoặc Query)
2. Check quyền: Owner OR Rank >= 3
3. Stream file từ `storage/uploads/`
4. Set đúng MIME type

## API Endpoints

```bash
POST   /api/v1/uploads/                   # Upload (Rank 1+)
GET    /api/v1/uploads/file/{id}          # Download (Owner or Rank 3+)
GET    /api/v1/uploads/p/{id}/{slug}      # Public SEO
GET    /api/v1/uploads/{id}               # Metadata
DELETE /api/v1/uploads/{id}               # Xóa (Owner or Rank 5)
```

## Frontend Usage

```typescript
import { uploadsApi } from '@/lib/api';

// Upload
const response = await uploadsApi.uploadFile(file);

// Get URL với token
const fileUrl = uploadsApi.getFileUrl(response.data.id);
// → "/backend/api/v1/uploads/file/15?token=..."

// Sử dụng
<img src={fileUrl} alt="Photo" />
```

## Tham Chiếu
- Authentication: `concepts/authentication-system.md`
- API endpoints: `lookup/api-endpoints.md`
- Backend guide: `concepts/code-style.md`
