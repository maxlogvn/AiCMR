# Upload Module Overview

**Core Concept**: Hybrid storage system balancing privacy and SEO. Public files accessible without auth (for logo, public images), private files require JWT (for medical records).

**Key Points**:
- **Public Storage** (Mặc định): Logo, favicon, ảnh bài viết → `/media/{id}/{slug}` - Không cần Token
- **Private Storage** (Nhạy cảm): Hồ sơ bệnh án, kết quả xét nghiệm → `/backend/api/v1/uploads/file/{id}` - Bắt buộc JWT Token
- **Streaming Upload**: 1MB chunks để tránh OOM với file lớn
- **Magic Bytes Detection**: Phát hiện file giả mạo (ví dụ: .exe đổi thành .jpg)
- **File Structure**: `storage/uploads/YYYY/MM/DD/uuid_filename.ext` - UUID để tránh trùng lặp

**Reference**: /guides/upload-usage.md

**Related**:
- 02-architecture.md (storage architecture)
- 06-api-reference.md (upload endpoints)
- errors/upload-errors.md (common upload issues)
