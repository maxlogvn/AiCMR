# Lookup: Upload Configuration

Core concept:
Các cấu hình chính điều khiển hành vi upload: allowed extensions, max size, upload dir, chunk size.

Config keys (defaults):
- `upload_allowed_extensions`: `jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,txt`
- `upload_max_size_mb`: `10` (MB)
- `UPLOAD_DIR`: `storage/uploads`
- `CHUNK_SIZE`: `1048576` (1MB)

Quick example (.env):
```
UPLOAD_DIR=storage/uploads
UPLOAD_MAX_SIZE_MB=10
UPLOAD_ALLOWED_EXTENSIONS=jpg,jpeg,png,pdf
CHUNK_SIZE=1048576
```

Reference: docs/08-upload-module.md
