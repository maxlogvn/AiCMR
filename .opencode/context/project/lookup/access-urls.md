# Lookup: Access URLs

**Core Concept**: Reference for all AiCMR service URLs in development and production environments. Use these URLs to access application services.

**Development Environment**:

| Service | URL | Description |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Next.js web application |
| **Backend API** | http://localhost:8000 | FastAPI REST API |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs (Swagger UI) |
| **Nginx Proxy** | http://localhost | Reverse proxy (optional) |
| **phpMyAdmin** | http://localhost:8080 | MySQL database management (Windows) |

**Development with Custom Domain** (hosts file configured):

| Service | URL | Description |
|----------|-----|-------------|
| **Frontend** | http://aicmr.local | Next.js with custom domain |
| **Backend API** | http://aicmr.local/backend | Backend via proxy |
| **API Documentation** | http://aicmr.local/backend/docs | API docs via proxy |
| **Nginx Proxy** | http://aicmr.local | Main proxy endpoint |

**Production Environment**:

| Service | URL | Description |
|----------|-----|-------------|
| **Frontend** | https://yourdomain.com | Production web application |
| **Backend API** | https://api.yourdomain.com | Production API |
| **API Documentation** | https://api.yourdomain.com/docs | API docs in production |
| **WebSocket** | wss://api.yourdomain.com/ws | Real-time communication |

**Database Connection URLs**:

**Development (Linux/Mac)**:
```
mysql+aiomysql://aicmr_user:password@mysql:3306/aicmr
```

**Development (Windows)**:
```
mysql+aiomysql://aicmr_user:password@host.docker.internal:3306/aicmr
```

**Production**:
```
mysql+aiomysql://aicmr_user:password@your-db-host:3306/aicmr_prod
```

**Redis Connection URLs**:

**Development**:
```
redis://localhost:6379/0
redis://redis:6379/0  (container-to-container)
```

**Production**:
```
redis://your-redis-host:6379/0
```

**WebSocket URLs**:

**Development**:
```
ws://localhost:8000/ws
wss://aicmr.local/ws  (with SSL)
```

**Production**:
```
wss://api.yourdomain.com/ws
```

**API Base URLs Configuration**:

**Development (.env)**:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:8000
WS_URL=ws://localhost:8000/ws
```

**Production (.env)**:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com
WS_URL=wss://api.yourdomain.com/ws
```

**Environment Variables for Windows**:
```bash
# If using custom domain (aicmr.local)
NEXT_PUBLIC_API_URL=http://aicmr.local/backend
NEXT_PUBLIC_APP_URL=http://aicmr.local

# If using localhost
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Checking Services**:

```bash
# Check if frontend is accessible
curl http://localhost:3000

# Check if backend is accessible
curl http://localhost:8000/docs

# Check if nginx proxy is accessible
curl http://localhost

# Check phpMyAdmin
curl http://localhost:8080  # Windows only
```

**Troubleshooting**:

| Issue | Possible Cause | Fix |
|-------|----------------|-----|
| Can't access localhost | Service not running | Check `docker-compose ps` |
| aicmr.local not working | Hosts file not configured | Run `setup-hosts.bat` (Windows) |
| HTTPS not working | SSL certificates missing | Generate SSL certs in nginx/ssl/ |
| phpMyAdmin inaccessible | phpMyAdmin not started | Check Docker containers |

**Reference**: [README.md](../../README.md)

**Related**:
- concepts/architecture.md - System architecture overview
- guides/quickstart-linux-mac.md - Setup guide
- lookup/commands-reference.md - Commands to start/stop services
