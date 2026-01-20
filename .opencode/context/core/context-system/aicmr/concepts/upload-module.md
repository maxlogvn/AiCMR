# Concept: Upload Module

**Core Idea**: AiCMR provides secure file upload with streaming processing, validation, and hybrid storage supporting both private (authenticated) and public (SEO-friendly) access patterns.

**Key Points**:
- Files uploaded via multipart/form-data with CSRF protection
- Streaming prevents memory issues with large files (up to 10MB default)
- Automatic filename sanitization and UUID generation
- MIME type validation using magic bytes detection
- Files stored in date-organized directories for performance

**Quick Example**:
```javascript
const formData = new FormData()
formData.append('file', selectedFile)

await api.post('/uploads', formData, {
  headers: { 'X-CSRF-Token': csrfToken }
})
```

**Reference**: docs/08-upload-module.md

**Related**: concepts/storage-architecture.md, concepts/jwt-authentication.md