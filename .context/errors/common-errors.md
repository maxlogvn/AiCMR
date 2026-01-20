# Common Errors & Solutions

Lỗi phổ biến và cách khắc phục.

## 401 Unauthorized

**Symptoms**:
- API responses: `{"detail": "Could not validate credentials"}`
- Auto-redirect to login page

**Causes**:
- Token expired
- Invalid token format
- Token not found in localStorage

**Solutions**:
```bash
# 1. Logout and login again
# Frontend tự động refresh token qua Axios interceptor

# 2. Kiểm tra token trong localStorage
localStorage.getItem('access_token')

# 3. Xóa localStorage và login lại
localStorage.clear()
```

**Tham khảo**: `concepts/security.md`, `guides/debugging.md`

## 403 Forbidden

**Symptoms**:
- API responses: `{"detail": "Insufficient permissions"}`
- Cannot access admin/moderator endpoints

**Causes**:
- Missing CSRF token
- Rank insufficient (Guest trying to access Member content)
- CSRF token expired

**Solutions**:
```bash
# 1. Kiểm tra CSRF token
# Frontend headers phải bao gồm:
X-CSRF-Token: [token]

# 2. Test với higher rank account
# Tham khảo: lookup/test-accounts.md
```

**Tham khảo**: `concepts/security.md`, `lookup/test-accounts.md`

## Hydration Failed

**Symptoms**:
- Console error: `Hydration failed because the initial UI does not match`
- Page flickers

**Causes**:
- Server-rendered HTML không khớp client-side render
- Dynamic data rendered on client without useEffect

**Solutions**:
```typescript
// ❌ KHÔNG render dynamic data directly
function Component() {
  const [date, setDate] = useState(new Date());
  return <div>{date.toLocaleString()}</div>;
}

// ✅ Dùng useEffect
function Component() {
  const [date, setDate] = useState(null);
  useEffect(() => {
    setDate(new Date());
  }, []);
  if (!date) return null;  // Avoid hydration mismatch
  return <div>{date.toLocaleString()}</div>;
}
```

**Tham khảo**: `guides/debugging.md`

## Test Failures

**Symptoms**:
- Tests fail randomly or consistently
- `pytest` exits with errors

**Causes**:
- Database or Redis not running
- Migration not applied
- Test data not clean

**Solutions**:
```bash
# 1. Check services
docker compose ps

# 2. Ensure db and redis healthy
docker compose restart db
docker compose restart redis

# 3. Apply migrations
docker compose exec backend alembic upgrade head

# 4. Run tests verbose
docker compose exec backend pytest -v -s

# 5. Run specific test
docker compose exec backend pytest tests/test_main.py::test_specific
```

**Tham khảo**: `guides/debugging.md`, `examples/test-example.md`

## Database Connection Lost

**Symptoms**:
- `psycopg2.OperationalError: could not connect to server`
- Timeouts when querying database

**Solutions**:
```bash
# 1. Restart database
docker compose restart db

# 2. Check logs
docker compose logs -f db

# 3. Test connection
docker compose exec backend python -c "from app.core.database import engine; print('OK')"

# 4. Clean rebuild (if persists)
docker compose down -v
docker compose up -d --build
```

## Build Failed

**Symptoms**:
- `npm ERR!` or `pip install` errors
- Docker build fails

**Solutions**:
```bash
# 1. Clear node_modules/pip cache
docker compose exec frontend rm -rf node_modules
docker compose exec backend pip cache purge

# 2. Rebuild service
docker compose up -d --build [service]

# 3. Clean rebuild (nuclear option)
docker compose down -v
docker compose up -d --build

# 4. Check logs
docker compose logs -f [service]
```

**Tham khảo**: `guides/debugging.md`, `lookup/commands-quickref.md`

## Other Tips

- Luôn check `docker compose ps` trước khi debug
- Xem logs: `docker compose logs -f [service]`
- Test với accounts khác: `lookup/test-accounts.md`
- Docker commands: `lookup/commands-quickref.md`
