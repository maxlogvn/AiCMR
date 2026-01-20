# Docker Commands - Quick Reference

Các lệnh Docker cần thiết cho phát triển.

## Container Management

```bash
# Status
docker compose ps

# Logs
docker compose logs -f              # All services
docker compose logs -f backend      # Backend only
docker compose logs -f frontend     # Frontend only
docker compose logs -f db           # Database only
docker compose logs -f redis        # Redis only

# Restart
docker compose restart backend
docker compose restart frontend
docker compose restart db
docker compose restart redis

# Rebuild
docker compose up -d --build       # All services
docker compose up -d --build backend

# Stop/Start
docker compose down
docker compose up -d
```

## Backend Commands

```bash
# Install packages
docker compose exec backend pip install [package]

# Code quality
docker compose exec backend black app
docker compose exec backend ruff check app

# Tests
docker compose exec backend pytest              # All tests
docker compose exec backend pytest -v          # Verbose
docker compose exec backend pytest -s          # Show logs
docker compose exec backend pytest --cov=app --cov-report=html  # Coverage

# Database migrations
docker compose exec backend alembic revision --autogenerate -m "description"
docker compose exec backend alembic upgrade head
docker compose exec backend alembic downgrade -1
```

## Frontend Commands

```bash
# Install packages
docker compose exec frontend npm install [package]

# Code quality
docker compose exec frontend npm run lint
docker compose exec frontend npm run build    # BẮT BUỘC trước khi commit

# Add shadcn component
docker compose exec frontend npx shadcn@latest add [component]
```

## Health Check

```bash
# Check all services healthy
docker compose ps

# Check specific service
docker compose ps backend
docker compose ps db
docker compose ps redis
```

## Cleanup

```bash
# Remove containers and networks
docker compose down

# Remove containers, networks, volumes
docker compose down -v

# Remove orphan containers
docker compose up -d --remove-orphans
```

## Tham Chiếu
- Docker workflow: `concepts/docker-workflow.md`
- Debugging: `guides/debugging.md`
- Examples: `examples/docker-commands.md`
