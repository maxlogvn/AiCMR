# Lookup: Commands Reference

**Core Concept**: Quick reference for all AiCMR commands. Use Make commands on Linux/Mac and batch scripts on Windows for unified development workflow.

**Make Commands (Linux/Mac)**:

| Command | Description | Docker Compose Equivalent |
|---------|-------------|------------------------|
| `make help` | Show all available commands | - |
| `make up` | Start development environment | `docker-compose up -d` |
| `make down` | Stop all services | `docker-compose down` |
| `make restart` | Restart services | `docker-compose restart` |
| `make logs` | View logs (all services) | `docker-compose logs -f` |
| `make clean` | Clean up (remove volumes) | `docker-compose down -v` |
| `make build` | Rebuild containers | `docker-compose up -d --build` |
| `make prod` | Start production | `docker-compose -f docker-compose.prod.yml up -d` |

**Windows Scripts (scripts/windows/)**:

| Script | Description | Docker Compose Equivalent |
|---------|-------------|------------------------|
| `start.bat` | Start services | `docker-compose -f docker-compose.yml -f docker-compose.windows.yml up -d` |
| `stop.bat` | Stop services | `docker-compose -f docker-compose.yml -f docker-compose.windows.yml down` |
| `restart.bat` | Restart services | `docker-compose -f docker-compose.yml -f docker-compose.windows.yml restart` |
| `logs.bat` | View logs | `docker-compose -f docker-compose.yml -f docker-compose.windows.yml logs -f` |
| `health.bat` | Check health status | Runs custom health checks |
| `clean.bat` | Clean up | `docker-compose -f docker-compose.yml -f docker-compose.windows.yml down -v` |
| `build.bat` | Rebuild containers | `docker-compose -f docker-compose.yml -f docker-compose.windows.yml up -d --build` |
| `setup-hosts.bat` | Setup aicmr.local | Modifies Windows hosts file |
| `remove-hosts.bat` | Remove aicmr.local | Removes from Windows hosts file |

**Docker Compose Commands**:

**Development (Linux/Mac)**:
```bash
docker-compose up -d              # Start
docker-compose down                # Stop
docker-compose logs -f             # Logs (all)
docker-compose logs backend        # Logs (specific service)
docker-compose ps                 # Container status
docker-compose restart backend     # Restart service
```

**Development (Windows)**:
```bash
docker-compose -f docker-compose.yml -f docker-compose.windows.yml up -d
docker-compose -f docker-compose.yml -f docker-compose.windows.yml down
docker-compose -f docker-compose.yml -f docker-compose.windows.yml logs -f
```

**Production**:
```bash
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
```

**Python CLI Commands**:
```bash
python3 cli.py up                # Start services
python3 cli.py down              # Stop services
python3 cli.py logs backend      # View logs
python3 cli.py health            # Health check
python3 cli.py shell mysql       # Access shell
```

**Service Shell Access**:
```bash
# Linux/Mac
docker exec -it aicmr-backend /bin/bash
docker exec -it aicmr-mysql /bin/bash
docker exec -it aicmr-redis /bin/bash

# Windows
docker exec -it aicmr-backend-windows /bin/bash
docker exec -it aicmr-mysql-windows /bin/bash
docker exec -it aicmr-redis-windows /bin/bash
```

**Database Migrations**:
```bash
# Backend
cd backend
alembic upgrade head              # Apply migrations
alembic revision --autogenerate -m "description"  # Create migration
```

**Testing**:
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && pytest
```

**Reference**: [README.md](../../README.md)

**Related**:
- guides/quickstart-linux-mac.md - Quick start guide
- lookup/access-urls.md - Development & production URLs
