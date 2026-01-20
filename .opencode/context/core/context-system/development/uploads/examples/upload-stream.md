# Example: Streaming Upload (Minimal)

Core concept:
Ví dụ nhỏ minh họa cách đọc file theo chunk (1MB) và ghi vào disk bất đồng bộ.

Code:
```python
CHUNK_SIZE = 1024 * 1024
actual_size = 0
async with aiofiles.open(file_full_path, "wb") as f:
    while chunk := await file.read(CHUNK_SIZE):
        if actual_size + len(chunk) > max_size_bytes:
            raise HTTPException(detail="File quá lớn")
        await f.write(chunk)
        actual_size += len(chunk)
```

Notes:
- Không load toàn bộ file vào RAM.
- Thích hợp cho file lớn; UI có thể hiển thị tiến độ.
