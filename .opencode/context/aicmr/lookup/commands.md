# Lookup: Commands

**Core Idea**: Essential command reference for AiCMR development including Docker operations, database migrations, testing, and deployment commands used throughout the development workflow.

**Key Points**:
- Docker: docker compose up -d (start), docker compose down (stop), docker compose logs -f (monitor)
- Backend: docker compose exec backend pytest (test), alembic upgrade head (migrate)
- Frontend: docker compose exec frontend npm install (deps), npm run dev (local dev)
- Database: docker compose exec backend alembic revision --autogenerate (generate migration)
- Git: git add ., git commit -m "message", git push

**Quick Example**:
```bash
# Full development workflow
docker compose up -d --build
docker compose exec backend alembic upgrade head
docker compose exec backend pytest
docker compose exec frontend npm install
git add .
git commit -m "Add new feature"
```

**Reference**: docs/01-getting-started.md, docs/03-backend-guide.md, docs/04-frontend-guide.md

**Related**: guides/getting-started.md, concepts/docker-architecture.md