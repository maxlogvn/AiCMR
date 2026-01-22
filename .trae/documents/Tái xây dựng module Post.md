## Kế hoạch tái xây dựng module Post

### Giai đoạn 1: Sửa CRUD Layer (crud_post.py)
1. Sửa `get_user_posts()`: Thay `Post.user` → `Post.author`, `Post.cover_image` → `Post.thumbnail_image`, `Post.user_id` → `Post.author_id`
2. Sửa `get_published_posts()`: Thay `Post.user` → `Post.author`, `Post.cover_image` → `Post.thumbnail_image`

### Giai đoạn 2: Tái cấu trúc Schemas (post.py)
1. Tách `PostBase` thành `PostBaseCommon` (không có tags)
2. `PostBase` cho PostResponse với `tags: Optional[List[TagResponse]]`
3. `PostCreate` và `PostUpdate` kế thừa từ `PostBaseCommon` với `tags: Optional[List[int]]`
4. `PostResponse` kế thừa từ `PostBase`

### Giai đoạn 3: Đồng bộ Frontend Types (post.ts)
1. Đảm bảo type `Post` có đầy đủ các trường tương ứng với backend
2. Thêm `cover_image_id` nếu thiếu (mapping với backend)

### Giai đoạn 4: Kiểm tra API Endpoints
1. Đảm bảo tất cả endpoints sử dụng đúng schemas
2. Xác nhận CRUD functions được gọi đúng trong posts.py