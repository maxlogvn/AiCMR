# Concept: Storage Architecture

**Core Idea**: AiCMR implements hybrid storage with private file system for sensitive data and public access for SEO-friendly content, using Nginx proxy and JWT authentication for secure file serving.

**Key Points**:
- Private storage in storage/uploads/ directory with proxy access via API
- Public files served directly for performance and SEO benefits
- Files organized by date in YYYY/MM/DD/ subdirectories
- JWT tokens required for private file access, optional for public
- Streaming upload prevents memory exhaustion with large files

**Quick Example**:
```bash
# Private file access
GET /backend/api/v1/uploads/file/123?token=jwt_token

# Public file access  
GET /media/123/filename.jpg
```

**Reference**: docs/02-architecture.md

**Related**: concepts/upload-module.md, concepts/jwt-authentication.md