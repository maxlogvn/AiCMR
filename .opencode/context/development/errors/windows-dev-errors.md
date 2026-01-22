# Windows Development Errors

**Tổng quan**: Các lỗi phổ biến khi chạy AiCMR development environment trên Windows và cách khắc phục.

---

## 1. Docker Desktop Not Running

**Symptom**:
```
Error: Cannot connect to the Docker daemon
```

**Cause**: Docker Desktop chưa được khởi động.

**Solution**:
```powershell
# 1. Start Docker Desktop
# Mở Docker Desktop từ Start menu
# Đợi status hiển thị "Docker Desktop is running"

# 2. Kiểm tra Docker service
Get-Service docker
Start-Service docker

# 3. Restart nếu cần
# Right-click Docker Desktop icon → Quit Docker Desktop
# Mở lại từ Start menu
```

**Prevention**: Đảm bảo Docker Desktop chạy khi bắt đầu development.

---

## 2. Port Conflicts

**Symptom**:
```
Error: Bind for 0.0.0.0:3000 failed: port is already allocated
```

**Cause**: Port đã được sử dụng bởi process khác.

**Solution**:
```powershell
# 1. Tìm process đang dùng port
netstat -ano | findstr :3000

# 2. Kill process (thay thế <PID>)
taskkill /PID <PID> /F

# 3. Hoặc đổi port trong docker-compose.windows.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

**Prevention**: Kill các process dev cũ trước khi start.

---

## 3. Database Connection Failed

**Symptom**:
```
Error: Can't connect to MySQL server on 'host.docker.internal'
```

**Cause**: `DATABASE_URL` sai hoặc MySQL container chưa chạy.

**Solution**:
```powershell
# 1. Verify DATABASE_URL
grep DATABASE_URL .env
# Expected: mysql+aiomysql://user:pass@host.docker.internal:3306/db

# 2. Kiểm tra MySQL container
docker-compose -f docker-compose.windows.yml ps mysql
docker-compose -f docker-compose.windows.yml logs mysql --tail=50

# 3. Test connection từ container
docker-compose -f docker-compose.windows.yml exec mysql mysqladmin ping
```

**Prevention**: Đảm bảo DATABASE_URL dùng `host.docker.internal`.

---

## 4. File Watcher Not Working

**Symptom**:
- Code changes không được reflect trong browser
- Hot reload không hoạt động

**Cause**: `CHOKIDAR_USEPOLLING` không được enable.

**Solution**:
```powershell
# 1. Verify CHOKIDAR_USEPOLLING
grep CHOKIDAR_USEPOLLING .env
# Expected: CHOKIDAR_USEPOLLING=true

# 2. Restart frontend container
docker-compose -f docker-compose.windows.yml restart frontend

# 3. Check logs
docker-compose -f docker-compose.windows.yml logs frontend --tail=50 | grep -i watch
```

**Prevention**: Luôn set `CHOKIDAR_USEPOLLING=true` trong .env.

---

## 5. CORS Errors

**Symptom**:
```
Error: Access to fetch has been blocked by CORS policy
```

**Cause**: Frontend origin không nằm trong `ALLOWED_ORIGINS`.

**Solution**:
```powershell
# 1. Verify ALLOWED_ORIGINS
grep ALLOWED_ORIGINS .env
# Expected: http://localhost:3000,http://aicmr.local,https://aicmr.local

# 2. Restart backend
docker-compose -f docker-compose.windows.yml restart backend

# 3. Clear browser cache
# DevTools → Network → Disable cache
```

**Prevention**: Ensure `ALLOWED_ORIGINS` bao gồm tất cả frontend URLs.

---

## 6. Volume Mount Issues

**Symptom**:
- Changes không được persist
- Data bị mất sau restart

**Cause**: File sharing trong Docker Desktop không được enable.

**Solution**:
```powershell
# 1. Check Docker Desktop file sharing
# Docker Desktop → Settings → Resources → File Sharing
# Ensure: D:\code\AiCMR

# 2. Verify volume mounts
docker-compose -f docker-compose.windows.yml config | grep -A 10 volumes

# 3. Rebuild containers
scripts\windows\clean.bat
scripts\windows\build.bat
scripts\windows\start.bat
```

**Prevention**: Configure file sharing ngay sau khi cài Docker Desktop.

---

## Quick Diagnosis Checklist

```powershell
# 1. Check Docker status
docker ps

# 2. Check container status
docker-compose -f docker-compose.windows.yml ps

# 3. Run health check
scripts\windows\health.bat

# 4. Check environment variables
grep -E "DATABASE_URL|ALLOWED_ORIGINS|CHOKIDAR" .env

# 5. Check logs
scripts\windows\logs.bat
```

---

## Liên Quan

- **Guide**: [windows-setup.md](.opencode/context/development/guides/windows-setup.md)
- **Example**: [windows-docker-config.md](.opencode/context/development/examples/windows-docker-config.md)
- **Commands**: [windows-commands.md](.opencode/context/development/lookup/windows-commands.md)
