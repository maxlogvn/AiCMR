# Environment Variables

Biến môi trường cần thiết để cấu hình hệ thống AiCMR.

## File `.env` tại thư mục gốc

### Security
```bash
SECRET_KEY=your-secret-key-at-least-32-chars  # Khóa JWT (BẮT BUỘC >= 32 ký tự production)
DEBUG=false                                   # Dev mode: dùng secret-key mặc định
INSTALL_SECRET=your-random-install-secret     # Khóa bảo mật bước cài đặt
```

### Database & Redis
```bash
DATABASE_URL=mysql+aiomysql://user:password@db/aicmr
REDIS_URL=redis://redis:6379/0
```

### App Settings
```bash
ALLOWED_ORIGINS=http://aicmr.local
REDIS_CACHE_TTL=300                           # Cache TTL (giây)
```

## Cấu Trúc

- **File `.env`**: Tạo tại thư mục gốc dự án (`/home/theanhdev/code/AiCmr/`)
- **Mô-đun**: Đọc bởi `backend/app/core/config.py`
- **Docker**: Mount vào containers thông qua `docker-compose.yml`

## Quan trọng

**SECRET_KEY**:
- Production: PHẢI >= 32 ký tự
- Development: `DEBUG=true` dùng key mặc định
- Mất key = tất cả JWT tokens vô hiệu

**INSTALL_SECRET**:
- Chỉ dùng 1 lần trong bước cài đặt
- Endpoint `/install/setup` sẽ bị khóa sau khi cài xong
- KHÔNG share với người ngoài

## Tham Chiếu
- Getting Started: `concepts/getting-started.md`
- Architecture: `concepts/architecture.md`
- Docker workflow: `concepts/docker-workflow.md`
