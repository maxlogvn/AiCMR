# Thiết Lập Windows Development Environment

**Tổng quan**: Cài đặt và cấu hình môi trường development trên Windows với Docker Desktop.

**Điểm khác biệt chính với Linux**:
- Database host: `host.docker.internal:3306`
- File watching: Yêu cầu `CHOKIDAR_USEPOLLING=true`
- CORS origins: Phải cấu hình rõ ràng

---

## 1. Cài Đặt

```powershell
# Docker Desktop 4.0+ - Download từ docker.com
# Git - Download từ git-scm.com
git config --global core.autocrlf input
```

---

## 2. Cấu Hình Docker Desktop

```powershell
Docker Desktop → Settings → General → Use WSL 2 based engine ✓
Docker Desktop → Settings → Resources → Memory: 8GB+, Disk: 50GB+
Docker Desktop → Settings → Resources → File Sharing → Add: D:\code\AiCMR
```

---

## 3. Cấu Hình Environment Variables

```bash
# Copy template
copy .env.windows.example .env

# Database (Windows-specific)
DATABASE_URL=mysql+aiomysql://user:pass@host.docker.internal:3306/db

# File watching
CHOKIDAR_USEPOLLING=true

# CORS origins
ALLOWED_ORIGINS=http://localhost:3000,http://aicmr.local,https://aicmr.local

# Generate secrets
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
```

---

## 4. Khởi Động

```powershell
# Update hosts file (run as Admin)
scripts\windows\setup-hosts.bat

# Start services
scripts\windows\start.bat

# Health check
scripts\windows\health.bat
```

---

## Liên Quan

- **Example**: [windows-docker-config.md](.opencode/context/development/examples/windows-docker-config.md)
- **Errors**: [windows-dev-errors.md](.opencode/context/development/errors/windows-dev-errors.md)
- **Commands**: [windows-commands.md](.opencode/context/development/lookup/windows-commands.md)

### 1. Copy Environment Template
```bash
cp .env.example .env
```

### 2. Set Database URL (CRITICAL)
```bash
# Windows-specific database connection
DATABASE_URL=mysql+aiomysql://${DB_USER}:${DB_PASSWORD}@host.docker.internal:3306/${DB_NAME}
```

**Why**: Docker networking on Windows uses `host.docker.internal` instead of container names for host access.

### 3. Enable File Watching
```bash
CHOKIDAR_USEPOLLING=true
```

**Why**: Docker file watching on Windows requires polling mode for Next.js hot reload.

### 4. Configure CORS Origins
```bash
ALLOWED_ORIGINS=http://localhost:3000,http://aicmr.local,https://aicmr.local,http://127.0.0.1:3000
```

**Why**: Frontend origin must be allowed for API requests.

### 5. Set Logging Level
```bash
LOG_LEVEL=DEBUG
```

**Why**: Debug logs help troubleshoot Windows-specific issues.

### 6. Generate Secure Secrets
```bash
# Generate SECRET_KEY
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"

# Generate INSTALL_SECRET
python -c "import secrets; print('INSTALL_SECRET=' + secrets.token_urlsafe(32))"
```

### 7. Complete .env Example
```bash
# Database
DB_NAME=aicmr
DB_USER=aicmr_user
DB_PASSWORD=your_secure_password_24chars
DATABASE_URL=mysql+aiomysql://aicmr_user:your_secure_password_24chars@host.docker.internal:3306/aicmr

# Backend
SECRET_KEY=your_secure_secret_32_chars_min
INSTALL_SECRET=your_install_secret_32_chars

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Windows-specific
CHOKIDAR_USEPOLLING=true
LOG_LEVEL=DEBUG
ALLOWED_ORIGINS=http://localhost:3000,http://aicmr.local,https://aicmr.local,http://127.0.0.1:3000
```

**Verification**:
```bash
# Check environment variables
grep DATABASE_URL .env
grep CHOKIDAR .env

# Test health
python3 cli.py health
```

**Troubleshooting**:
- If database fails: Check `DATABASE_URL` uses `host.docker.internal`
- If hot reload fails: Ensure `CHOKIDAR_USEPOLLING=true`
- If CORS errors: Verify `ALLOWED_ORIGINS` includes frontend URL
- If no debug logs: Check `LOG_LEVEL=DEBUG`

**Reference**: [WINDOWS_MIGRATION_FIXES_SUMMARY.md](../../WINDOWS_MIGRATION_FIXES_SUMMARY.md)

**Related**:
- errors/windows-db-connection.md - Database connection issues
- errors/windows-cors.md - CORS configuration
- lookup/windows-env-vars.md - Environment variable checklist
