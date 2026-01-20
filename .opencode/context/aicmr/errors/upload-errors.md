# Errors: Upload Errors

**Core Idea**: Common upload failure scenarios in AiCMR including file validation errors, size limits, permission issues, and storage problems with specific error messages and resolution steps.

**Key Points**:
- "File quá lớn": Exceeds max_size_mb setting (default 10MB) - reduce file size or increase limit
- "Định dạng file không được phép": File extension not in allowed list - check allowed_extensions setting
- "Unauthorized": Insufficient rank (need rank 1+) or invalid/missing JWT token - authenticate first
- "File not found": Invalid file ID or file deleted - verify file exists and user has access
- "Magic bytes mismatch": File content doesn't match extension - potential security threat

**Quick Example**:
```json
// File too large error
{"detail": "File quá lớn"}

// Invalid format error  
{"detail": "Định dạng file .exe không được phép"}

// Resolution: Check settings
SELECT value FROM settings WHERE key = 'upload_max_size_mb';
```

**Reference**: docs/08-upload-module.md

**Related**: concepts/upload-module.md, concepts/storage-architecture.md