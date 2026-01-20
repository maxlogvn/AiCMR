# Concept: Upload Module (Tổng quan)

Core concept:
Module Upload cung cấp lưu trữ tập tin an toàn với cơ chế streaming (chunked) và proxy download để bảo vệ private files đồng thời hỗ trợ public assets cho SEO.

Key points:
- Hybrid storage: public (SEO) vs private (nhạy cảm). Public dùng `/media/{id}/{slug}`, private dùng proxy `/backend/api/v1/uploads/file/{id}`.
- Streaming upload theo CHUNK_SIZE (1MB) để tránh load toàn bộ file vào RAM.
- Filename sanitized: slugify + UUID để tránh collision và path traversal.
- Magic-bytes detection (python-magic) để phát hiện file giả mạo.
- Các quyền truy cập phụ thuộc vào `rank` và token (Header Authorization hoặc ?token).

Minimal example (pseudo-Python):
```python
CHUNK_SIZE = 1024 * 1024
async with aiofiles.open(path, "wb") as f:
    while chunk := await file.read(CHUNK_SIZE):
        await f.write(chunk)
```

Reference: docs/08-upload-module.md
