# Concept: AiCMR Architecture

**Core Concept**: Full-stack AI-powered content management system with microservices architecture using Docker containerization. Supports cross-platform development (Linux, Mac, Windows).

**Key Points**:
- Frontend: Next.js 16 with TypeScript and Tailwind CSS
- Backend: FastAPI with Python and SQLAlchemy ORM
- Database: MySQL 8.0 for persistent storage
- Cache: Redis for session management and caching
- Reverse Proxy: Nginx for load balancing and SSL
- Containerization: Docker & Docker Compose for deployment

**Technology Stack**:
```
┌─────────────────────────────────────────┐
│         Nginx (Reverse Proxy)         │
│         Port: 80, 443                 │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴─────────┐
      │                  │
┌─────▼──────┐   ┌─────▼──────┐
│  Frontend   │   │  Backend   │
│  Next.js 16 │   │  FastAPI   │
│  Port: 3000 │   │  Port: 8000 │
└─────┬──────┘   └─────┬──────┘
      │                  │
      └────────┬─────────┘
               │
      ┌────────┴─────────┐
      │                  │
┌─────▼──────┐   ┌─────▼──────┐
│   MySQL    │   │   Redis    │
│  Port: 3306│   │  Port: 6379│
└────────────┘   └────────────┘
```

**Service Communication**:
- Frontend → Backend: HTTP API (REST/WebSocket)
- Backend → MySQL: TCP connection via SQLAlchemy
- Backend → Redis: TCP connection for caching/sessions
- Nginx → Frontend/Backend: Reverse proxy with load balancing
- Client → Nginx: HTTP/HTTPS with SSL termination

**Development vs Production**:
| Aspect | Development | Production |
|--------|-------------|-------------|
| Docker Compose | docker-compose.yml | docker-compose.prod.yml |
| Database | Local MySQL | Managed DB or dedicated container |
| SSL | Optional (self-signed) | Required (cert-manager/letsencrypt) |
| Hot Reload | Enabled | Disabled |
| Debug Mode | LOG_LEVEL=DEBUG | LOG_LEVEL=INFO |

**Reference**: [README.md](../../README.md)

**Related**:
- concepts/project-structure.md - Folder organization
- lookup/access-urls.md - Development & production URLs
