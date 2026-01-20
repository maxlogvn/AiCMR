# Architecture - FastAPI + Next.js

Kiến trúc của dự án AiCMR: Medical Records Management System tích hợp AI.

## Stack Công Nghệ

**Backend**:
- Python 3.11+
- FastAPI (API framework)
- SQLAlchemy 2.0 (ORM)
- Alembic (Database migrations)
- PostgreSQL (Database)
- Redis (Caching & Rate limiting)

**Frontend**:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- shadcn/ui (UI Components)
- @tanstack/react-query (Server state)
- Zustand (Client state)

## Thư Mục Quan Trọng

**Backend** (`/backend/app/`):
- `api/v1/` - API Routes theo version
- `crud/` - Database logic
- `models/` - SQLAlchemy models
- `schemas/` - Pydantic validation schemas
- `core/` - Config, security, utilities

**Frontend** (`/frontend/src/`):
- `app/` - App Router (Pages & Layouts)
- `components/` - Reusable components (ui, layout, features)
- `hooks/` - Business logic & API hooks
- `lib/` - API clients, constants, utilities
- `types/` - TypeScript interfaces/types
- `store/` - Zustand state management

## Workflow

**Development**:
```bash
# Từ thư mục gốc
docker compose up -d              # Start services
docker compose exec backend pytest  # Run tests
docker compose exec frontend npm run build  # Build frontend
```

**Database Migrations**:
```bash
docker compose exec backend alembic revision --autogenerate -m "description"
docker compose exec backend alembic upgrade head
```

## Kiến Trúc Lớp

**Backend**:
1. API Layer (`api/v1/`) - Endpoints
2. Service Layer (nếu cần) - Business logic
3. CRUD Layer (`crud/`) - Database operations
4. Model Layer (`models/`) - Data models

**Frontend**:
1. Pages (`app/`) - Route handlers
2. Components (`components/`) - UI building blocks
3. Hooks (`hooks/`) - Reusable logic
4. API Clients (`lib/`) - Backend communication

## Tham Chiếu
- Folder structure chi tiết: `lookup/folder-structure.md`
- Code style backend: `concepts/code-style.md`
- Code style frontend: `concepts/code-style-frontend.md`
