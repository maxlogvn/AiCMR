# Concept: Docker Architecture

**Core Idea**: AiCMR uses Docker for containerized deployment, running multiple services (backend, frontend, database, cache, proxy) in isolated containers managed by docker-compose for consistent development and production environments.

**Key Points**:
- Backend service runs FastAPI application in container on port 8000
- Frontend service runs Next.js application in container on port 3000  
- Database service provides MySQL instance for data persistence
- Redis service handles caching and session management
- Nginx service acts as reverse proxy and load balancer on ports 80/443

**Quick Example**:
```bash
docker compose up -d --build
```

**Reference**: docs/01-getting-started.md

**Related**: concepts/storage-architecture.md