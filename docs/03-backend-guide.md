# 03. Quy chuẩn Backend (Backend Guide)

Tài liệu này hướng dẫn các quy chuẩn lập trình và cách sử dụng các công cụ tích hợp trong Backend (FastAPI).

## Quy chuẩn Code
- **Type Hints**: Bắt buộc sử dụng cho tất cả tham số và giá trị trả về của function.
- **Async/Await**: Sử dụng async cho mọi thao tác I/O (Database, Redis, API calls).
- **Naming**:
  - Class: `PascalCase`.
  - Variable/Function: `snake_case`.
  - Constant: `UPPER_SNAKE_CASE`.
- **Docstrings**: Viết bằng tiếng Việt, mô tả ngắn gọn mục đích, tham số và giá trị trả về.

## Ghi Log (Loguru)
Sử dụng `loguru` thay cho `print` hoặc `logging` mặc định.
```python
from loguru import logger

logger.info("Thông báo")
logger.error("Lỗi: {}", e)
```
Log được lưu tại `backend/logs/app.log` với cơ chế tự động nén và xoay vòng.

## Caching (FastAPI Cache2)
Sử dụng Redis để cache các request GET tốn kém tài nguyên.
```python
from fastapi_cache.decorator import cache

@router.get("/data")
@cache(expire=300) # Cache trong 5 phút
async def get_expensive_data():
    ...
```

## Phân trang (FastAPI Pagination)
Tất cả các API trả về danh sách nên được phân trang.
```python
from fastapi_pagination import Page, paginate

@router.get("/", response_model=Page[UserSchema])
async def list_users():
    users = await crud.get_all()
    return paginate(users)
```

## Xử lý Lỗi (Custom Exceptions)
Các lỗi nghiệp vụ được quản lý tập trung trong `app/core/exceptions.py`:
- `UserNotFound`, `InvalidCredentials`, `NotEnoughPermissions`, v.v.
- Sử dụng: `raise UserNotFound()` thay vì raise trực tiếp HTTPException ở nhiều nơi.

## Database & CRUD Pattern
- **Models**: Định nghĩa trong `app/models/`.
- **Schemas**: Pydantic models trong `app/schemas/`.
- **CRUD**: Logic xử lý DB nằm trong `app/crud/`.
- **Generic CRUD**: Sử dụng các hàm dùng chung như `get_by_field` để tránh lặp code.

## Kiểm thử (Testing)
Sử dụng `pytest` để viết các bài test:
- Chạy toàn bộ test: `pytest`
- Chạy với báo cáo coverage: `pytest --cov=app`
- Test cases nằm trong thư mục `tests/`.
