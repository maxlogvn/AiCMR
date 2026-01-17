# Hướng Dẫn Sử Dụng Các Gói Thư Viện Đã Tích Hợp

Tài liệu này hướng dẫn cách sử dụng các thư viện đã được cài đặt và cấu hình trong dự án AiCMR.

## 1. Ghi Log với Loguru

Thay vì dùng `print()` hoặc thư viện `logging` mặc định, hãy sử dụng `loguru` để có log đẹp và dễ quản lý hơn.

- **Cách dùng:**
  ```python
  from loguru import logger

  logger.info("Đây là thông báo thông thường")
  logger.error("Đây là thông báo lỗi")
  logger.debug("Dùng để debug dữ liệu: {}", some_variable)
  ```
- **Cấu hình:** Đã được thiết lập trong [main.py](file:///home/AiCMR/backend/app/main.py). Log sẽ được ghi ra Console và lưu vào file `backend/logs/app.log`.

## 2. Phân Trang với FastAPI Pagination

Dùng để tự động hóa việc phân trang cho các endpoint trả về danh sách.

- **Cách dùng trong Router:**
  ```python
  from fastapi_pagination import Page, paginate
  
  @router.get("/items", response_model=Page[ItemSchema])
  async def get_items():
      items = await database.fetch_all() # Hoặc query SQLAlchemy
      return paginate(items)
  ```
- **Cấu hình:** Đã gọi `add_pagination(app)` trong [main.py](file:///home/AiCMR/backend/app/main.py).

## 3. Caching với FastAPI Cache2

Dùng để lưu kết quả response vào Redis nhằm tăng tốc độ cho các API tải nặng.

- **Cách dùng:**
  ```python
  from fastapi_cache.decorator import cache

  @router.get("/expensive-data")
  @cache(expire=60) # Cache trong 60 giây
  async def get_data():
      return {"data": "Dữ liệu tính toán nặng"}
  ```
- **Cấu hình:** Đã khởi tạo trong [main.py](file:///home/AiCMR/backend/app/main.py) kết nối tới `REDIS_URL` trong settings.

## 4. Xác Thực với FastAPI Users

Thư viện này cung cấp sẵn các logic cho hệ thống User.

- **Tình trạng:** Đã cài đặt trong [requirements.txt](file:///home/AiCMR/backend/requirements.txt).
- **Tiếp theo:** Bạn có thể tham khảo [tài liệu FastAPI Users](https://fastapi-users.github.io/fastapi-users/) để thay thế các phần `TODO` trong [auth.py](file:///home/AiCMR/backend/app/api/v1/auth.py).

## 5. Kiểm Thử với Pytest

Mọi code mới nên có bài test tương ứng trong thư mục `tests/`.

- **Cách chạy test:**
  ```bash
  cd backend
  pytest
  ```
- **Ví dụ:** Xem file [test_main.py](file:///home/AiCMR/backend/tests/test_main.py) để biết cách viết bài test không đồng bộ (async test).

## 6. Quản Lý Cấu Hình (Settings)

Mọi biến môi trường hoặc cấu hình mới phải được thêm vào class `Settings` trong [config.py](file:///home/AiCMR/backend/app/core/config.py).

- **Cách dùng:**
  ```python
  from app.core.config import get_settings
  settings = get_settings()
  print(settings.REDIS_URL)
  ```

---
*Ghi chú: Luôn cập nhật [requirements.txt](file:///home/AiCMR/backend/requirements.txt) nếu bạn cài đặt thêm gói mới.*
