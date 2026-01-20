# Debugging Guide

Xử lý lỗi và troubleshooting phổ biến trong môi trường Docker.

## 401 Unauthorized

**Nguyên nhân**: Token hết hạn hoặc không hợp lệ

**Giải pháp**:
- Frontend tự động refresh token qua Axios interceptor
- Kiểm tra token trong localStorage
- Logout và login lại

**Tham khảo**: `concepts/security.md`

## 403 Forbidden

**Nguyên nhân**:
- Thiếu CSRF Token
- Rank không đủ quyền
- API không được phép truy cập

**Giải pháp**:
```javascript
// Frontend: Thêm CSRF token
axios.post('/api/v1/users', data, {
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
})
```

- Kiểm tra rank: `0: Guest`, `1: Member`, `3: Moderator`, `5: Admin`
- Tham khảo: `concepts/security.md`, `lookup/test-accounts.md`

## Hydration Failed

**Nguyên nhân**: Render dữ liệu phía client không khớp với server

**Giải pháp**:
- Tránh render dữ liệu động ở client
- Sử dụng `useEffect` để load data sau khi mounted
- Kiểm tra Next.js Server Components vs Client Components

## Tests Failed

**Nguyên nhân**:
- Database hoặc Redis không chạy
- Test data không sạch
- Migration chưa áp dụng

**Giải pháp**:
```bash
# Kiểm tra services
docker compose ps

# Đảm bảo db và redis healthy
docker compose logs db
docker compose logs redis

# Restart nếu cần
docker compose restart db
docker compose restart redis

# Áp dụng migrations
docker compose exec backend alembic upgrade head

# Run tests lại
docker compose exec backend pytest -v
```

## Database Connection Lost

**Giải pháp**:
```bash
# Restart database
docker compose restart db

# Kiểm tra logs
docker compose logs -f db

# Test connection
docker compose exec backend python -c "from app.core.database import engine; print('OK')"
```

## Redis Connection Lost

**Giải pháp**:
```bash
# Restart Redis
docker compose restart redis

# Kiểm tra logs
docker compose logs -f redis

# Test connection
docker compose exec backend python -c "from app.core.redis import redis_client; print('OK')"
```

## Build Failed

**Giải pháp**:
```bash
# Clean rebuild
docker compose down
docker compose up -d --build

# Hoặc chỉ rebuild service cụ thể
docker compose up -d --build backend
docker compose up -d --build frontend
```

## Lưu ý Quan Trọng

- Luôn check `docker compose ps` trước khi debug
- Xem logs: `docker compose logs -f [service]`
- Tham khảo: `errors/common-errors.md`
- Test accounts: `lookup/test-accounts.md`
