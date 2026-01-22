# Windows-Specific Docker Configuration

**Tổng quan**: Các cấu hình Docker đặc biệt cho môi trường Windows development trong AiCMR.

---

## Key Differences từ Linux

| Aspect | Linux | Windows |
|--------|-------|---------|
| **Database Host** | `mysql:3306` (container name) | `host.docker.internal:3306` |
| **File Watching** | Native inotify | `CHOKIDAR_USEPOLLING=true` |
| **Path Separators** | `/` | `\` (Docker tự xử lý) |
| **Line Endings** | LF | CRLF (Git xử lý) |

---

## Docker Compose Configuration

### 1. Database Connection (Windows-specific)

```yaml
# File: docker-compose.windows.yml
backend:
  environment:
    # Windows: dùng host.docker.internal
    DATABASE_URL=mysql+aiomysql://user:pass@host.docker.internal:3306/db
```

**Why**: Docker networking trên Windows không hỗ trợ container-to-container communication qua service discovery như Linux. Phải dùng `host.docker.internal` để truy cập host.

### 2. Extra Hosts (Windows-specific)

```yaml
services:
  backend:
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

**Why**: Mapping `host.docker.internal` đến host gateway để container có thể truy cập services trên host (MySQL, Redis, v.v.).

### 3. Container Naming (Windows-specific)

```yaml
services:
  backend:
    container_name: aicmr-backend-windows

  frontend:
    container_name: aicmr-frontend-windows
```

**Why**: Tránh conflict với Linux containers khi switch giữa environments.

---

## Nginx Configuration

```nginx
# File: nginx/conf.d/default-windows.conf
upstream backend_server {
    server aicmr-backend-windows:8000;
}

upstream frontend_server {
    server aicmr-frontend-windows:3000;
}
```

**Why**: Upstream servers phải match với container names trong docker-compose.windows.yml.

---

## Backend CORS Configuration

```python
# File: backend/app/core/config.py
ALLOWED_ORIGINS: list[str] = [
    "http://localhost:3000",
    "http://aicmr.local",
    "https://aicmr.local",
    "http://127.0.0.1:3000",
]

@field_validator("ALLOWED_ORIGINS", mode="before")
@classmethod
def parse_allowed_origins(cls, v: str | list) -> list:
    if isinstance(v, str):
        return [origin.strip() for origin in v.split(",") if origin.strip()]
    return v
```

**Why**: Frontend origin phải nằm trong ALLOWED_ORIGINS để CORS requests được chấp nhận.

---

## Frontend Environment Variables

```bash
# File: .env (Windows)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Windows-specific
CHOKIDAR_USEPOLLING=true  # Enable polling cho file watching
WATCHPACK_POLLING=true   # Webpack file watching
```

---

## File Watching Issues

```yaml
# Fix: Add to docker-compose.windows.yml
frontend:
  environment:
    - CHOKIDAR_USEPOLLING=true
  volumes:
    - ./frontend:/app
      - /app/node_modules  # Prevent override
```

**Why**: Docker file watching trên Windows không hoạt động với native inotify. Phải dùng polling mode.

---

## Port Mapping

```yaml
services:
  frontend:
    ports:
      - "3000:3000"

  backend:
    ports:
      - "8000:8000"

  phpmyadmin:
    ports:
      - "8080:80"
```

**Why**: Expose ports để truy cập từ host (Windows).

---

## Liên Quan

- **Guide**: [windows-setup.md](.opencode/context/development/guides/windows-setup.md)
- **Errors**: [windows-dev-errors.md](.opencode/context/development/errors/windows-dev-errors.md)
