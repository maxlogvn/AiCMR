# Upload Module Usage Guide

**Core Idea**: Upload, download, delete files với proper authentication và CSRF protection.

**Key Points**:
- **Client Component**: Sử dụng `<FileUpload>` component hoặc `uploadsApi.uploadFile()`
- **Public Files**: Truy cập trực tiếp qua URL `/media/{id}/{slug}` - Hỗ trợ SEO
- **Private Files**: Dùng `uploadsApi.getFileUrl(id)` để có URL với `?token=` cho `<img>` tags
- **Server Validation**: Kiểm tra size (10MB), extension, magic bytes trước khi lưu
- **Authorization**: Upload (Rank 1+), Download Private (Chủ sở hữu OR Rank >= 3), Delete (Chủ sở hữu OR Rank 5)

**Quick Example**:
```typescript
import { uploadsApi } from '@/lib/api';

// Upload
const response = await uploadsApi.uploadFile(file, (p) => console.log(p + '%'));
const fileUrl = uploadsApi.getFileUrl(response.data.id); // "/backend/api/v1/uploads/file/15?token=..."

// Use in component
<Image src={fileUrl} alt="Photo" />
```

**Reference**: /concepts/upload-overview.md

**Related**:
- errors/upload-errors.md (common upload issues)
- 06-api-reference.md (API endpoints)
- 05-authentication.md (JWT token management)
