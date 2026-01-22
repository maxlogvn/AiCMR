# Guide: Windows Environment Setup

**Core Concept**: Configure environment variables for Windows development. Key differences from Linux include database host, file watching, and CORS origins.

**Key Points**:
- Use `host.docker.internal` for database
- Enable `CHOKIDAR_USEPOLLING` for hot reload
- Configure `ALLOWED_ORIGINS` for CORS
- Set `LOG_LEVEL` for debugging
- Use `DATABASE_URL` instead of individual DB vars

**Step-by-Step Setup**:

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
