# Guide: Upload Flow (Streaming + Proxy)

Core concept:
Quy trình upload sử dụng streaming chunks để ghi file an toàn, lưu metadata vào bảng `attachments`, và trả về URL proxy để truy xuất có kiểm soát.

Key steps:
- Client-side: kiểm tra extension và kích thước trước khi gửi (max default 10MB).
- Server-side validation: kiểm tra `rank` (1+), CSRF token, magic-bytes và kích thước tổng.
- Path generation: lưu `storage/uploads/YYYY/MM/DD/` và filename = `{uuid}_{slug}.{ext}`.
- Streaming: ghi từng chunk (1MB) và abort nếu vượt giới hạn.
- Response: Tạo record trong DB và trả về `url: /backend/api/v1/uploads/file/{id}`.

Minimal flow example:
```python
# validate headers (auth, csrf)
path = generate_path(date.today())
async with aiofiles.open(path, "wb") as f:
    while chunk := await file.read(CHUNK_SIZE):
        await f.write(chunk)
create_attachment_record(...)
return {"url": f"/backend/api/v1/uploads/file/{id}"}
```

Related: concepts/upload-overview.md, examples/upload-stream.md
