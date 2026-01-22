# Lookup: Windows Environment Variables Checklist

**Core Concept**: Quick reference for Windows-specific environment variables. Use this checklist when setting up or troubleshooting Windows development environment.

**Critical Variables**:

| Variable | Value (Windows) | Purpose | Required |
|----------|----------------|---------|----------|
| `DATABASE_URL` | `mysql+aiomysql://user:pass@host.docker.internal:3306/db` | DB connection | ✅ Critical |
| `CHOKIDAR_USEPOLLING` | `true` | File watching | ✅ Required |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://aicmr.local,...` | CORS config | ✅ Required |
| `LOG_LEVEL` | `DEBUG` | Debug output | ⚠️ Recommended |

**Full .env Template (Windows)**:
```bash
# === Database ===
DB_NAME=aicmr
DB_USER=aicmr_user
DB_PASSWORD=your_secure_password_24chars_minimum
DATABASE_URL=mysql+aiomysql://aicmr_user:your_secure_password_24chars_minimum@host.docker.internal:3306/aicmr

# === Backend ===
SECRET_KEY=generate_32_char_random_string
INSTALL_SECRET=generate_32_char_random_string
LOG_LEVEL=DEBUG

# === Frontend ===
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# === Windows-Specific ===
CHOKIDAR_USEPOLLING=true
ALLOWED_ORIGINS=http://localhost:3000,http://aicmr.local,https://aicmr.local,http://127.0.0.1:3000

# === Optional: Redis ===
REDIS_URL=redis://host.docker.internal:6379
```

**Variable Explanations**:

### DATABASE_URL
```bash
# Windows uses host.docker.internal
DATABASE_URL=mysql+aiomysql://${DB_USER}:${DB_PASSWORD}@host.docker.internal:3306/${DB_NAME}

# Linux uses container names
DATABASE_URL=mysql+aiomysql://${DB_USER}:${DB_PASSWORD}@mysql:3306/${DB_NAME}
```

### CHOKIDAR_USEPOLLING
```bash
# Required for Next.js hot reload on Windows
CHOKIDAR_USEPOLLING=true
```
**Trade-offs**: Increases CPU usage slightly

### ALLOWED_ORIGINS
```bash
# Comma-separated list of allowed frontend origins
ALLOWED_ORIGINS=http://localhost:3000,http://aicmr.local,https://aicmr.local,http://127.0.0.1:3000
```
**Include**: All URLs frontend might be accessed from

### LOG_LEVEL
```bash
# Debug mode for troubleshooting
LOG_LEVEL=DEBUG

# Production
LOG_LEVEL=INFO
```

**Generate Secure Secrets**:
```bash
# SECRET_KEY
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"

# INSTALL_SECRET
python -c "import secrets; print('INSTALL_SECRET=' + secrets.token_urlsafe(32))"

# DB Password
# Use password manager or online generator (24+ chars)
```

**Common Issues**:

| Symptom | Likely Cause | Fix |
|----------|--------------|-----|
| Can't connect to DB | Wrong `DATABASE_URL` | Use `host.docker.internal` |
| No hot reload | Missing `CHOKIDAR_USEPOLLING` | Set to `true` |
| CORS errors | Missing origin in `ALLOWED_ORIGINS` | Add frontend URL |
| No debug logs | `LOG_LEVEL` not set | Set to `DEBUG` |

**Verification**:
```bash
# Check all variables set
cat .env | grep -E "DATABASE_URL|CHOKIDAR|ALLOWED_ORIGINS|LOG_LEVEL"

# Test health check
python3 cli.py health
```

**Reference**: [WINDOWS_MIGRATION_FIXES_SUMMARY.md](../../WINDOWS_MIGRATION_FIXES_SUMMARY.md)

**Related**:
- errors/windows-db-connection.md - Database connection issues
- errors/windows-cors.md - CORS configuration
- guides/windows-setup.md - Windows setup guide
