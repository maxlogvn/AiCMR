# Error: Windows Database Connection Failed

**Symptom**:
```
Error: Can't connect to MySQL server on 'mysql:3306'
Backend fails to connect to database container
```

**Cause**: Docker networking on Windows requires `host.docker.internal` to access host services. Container names resolved differently on Windows vs Linux.

**Solution**:

### 1. Update DATABASE_URL
```bash
# In .env (Windows)
DATABASE_URL=mysql+aiomysql://${DB_USER}:${DB_PASSWORD}@host.docker.internal:3306/${DB_NAME}
```

### 2. Docker Compose Override
```yaml
# docker-compose.windows.yml
services:
  backend:
    environment:
      - DATABASE_URL=mysql+aiomysql://user:pass@host.docker.internal:3306/db
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

### 3. Alternative: Use container names
```yaml
# If MySQL is also in Docker, use service name
services:
  backend:
    environment:
      - DATABASE_URL=mysql+aiomysql://user:pass@mysql:3306/db

  mysql:
    # ... MySQL config
```

**Verification**:
```bash
# Check MySQL container
docker-compose ps mysql

# Test connection
python3 cli.py health

# Check logs
docker-compose logs backend | grep "database"
```

**Prevention**:
- Use `host.docker.internal` for host connections on Windows
- Use service names for container-to-container connections
- Add `extra_hosts` to Windows compose override
- Test connection after configuration changes

**Frequency**: Common when migrating from Linux to Windows

**Reference**: [WINDOWS_MIGRATION_FIXES_SUMMARY.md](../../WINDOWS_MIGRATION_FIXES_SUMMARY.md)

**Related**:
- errors/windows-cors.md - CORS configuration issues
- lookup/windows-docker-overrides.md - Docker override checklist
- lookup/windows-env-vars.md - Environment variable checklist
