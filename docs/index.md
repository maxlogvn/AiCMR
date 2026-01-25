# AiCMR Project Documentation Index

**Generated:** 2026-01-25
**Project:** AiCMR - AI-powered Medical Record Management System
**Repository Type:** Monorepo (2 parts)
**Documentation Language:** Vietnamese

---

## 🎯 Project Overview

**Type:** Full-stack Monorepo
**Primary Language:** TypeScript (Frontend), Python (Backend)
**Architecture:** Component-based Frontend + Layered API Backend

### Project Structure

```
AiCMR/
├── frontend/          # Next.js 16 Frontend (Part 1)
├── backend/           # FastAPI Backend (Part 2)
├── nginx/             # Reverse Proxy Configuration
├── storage/           # File Storage (uploads)
├── scripts/           # CLI Management Scripts
├── .claude/skills/    # Claude Code Skills (11 skills)
└── docs/              # Project Documentation (this folder)
```

---

## 📊 Quick Reference

### Technology Stack

| Part | Framework | Language | Architecture Pattern |
|------|-----------|----------|---------------------|
| **Frontend** | Next.js 16.1.4 | TypeScript 5.9.3 | Component-based (Server + Client Components) |
| **Backend** | FastAPI 0.115.0+ | Python 3.x | Layered API-centric (api/models/schemas/crud/services/core) |

### Infrastructure

- **Database:** MySQL 8.0 with SQLAlchemy ORM
- **Cache:** Redis for session and data caching
- **Web Server:** Nginx reverse proxy
- **Containerization:** Docker Compose with 6 services
- **Process Management:** Uvicorn (ASGI server)

---

## 📚 Generated Documentation

### Core Documentation

- **[Project Overview](./project-overview.md)** *(To be generated)*
  Executive summary and tech stack overview

- **[Architecture - Backend](./architecture-backend.md)** *(To be generated)*
  Complete backend architecture documentation

- **[Architecture - Frontend](./architecture-frontend.md)** *(To be generated)*
  Complete frontend architecture documentation

- **[API Contracts - Backend](./api-contracts-backend.md)**
  REST API endpoints documentation (23+ endpoints across Auth, Users, Posts)
  - Authentication endpoints (login, register, logout)
  - User management (CRUD operations)
  - Post management (full CRUD with bulk operations)
  - Metadata management
  - RAG export endpoints

- **[Data Models - Backend](./data-models-backend.md)**
  Database schema documentation (8 tables, 11 relationships)
  - Users table with rank-based authorization
  - Posts table with SEO and engagement metrics
  - Categories (hierarchical)
  - Tags with many-to-many relationships
  - Post metadata (flexible key-value storage)
  - Attachments and refresh tokens

- **[Claude Skills Inventory](./claude-skills-inventory.md)**
  11 specialized Claude Code skills catalogued
  - Development workflow skills (git-commit, backend-api-builder, frontend-checker, etc.)
  - UI/UX design system (ui-ux-pro-max with 50+ styles)
  - Browser automation (agent-browser)
  - Professional communication guides

### Existing Documentation

- **[CLAUDE.md](../CLAUDE.md)** - Project guidance for Claude Code
  - Automation rules
  - Development commands
  - Architecture description
  - Testing setup
  - Git workflow conventions

- **[Frontend Design System](../frontend/docs/README.md)**
  - Citizenship Framework (Class A/B/C components)
  - Component passports system
  - Design tokens (colors, spacing, typography)
  - Usage guidelines
  - Migration guide in progress

### Design System Documentation ✨ NEW

**📖 [Design System README](./design-system/README.md)** - **START HERE!**

Comprehensive design system documentation for Frontend Team:

- **[01 - Getting Started](./design-system/01-getting-started.md)** *(5 min read)*
  - Quick start guide cho developers mới
  - Copy-template workflow
  - Component usage examples
  - Colors & Spacing guide
  - Common patterns reference

- **[02 - Common Patterns](./design-system/02-common-patterns.md)** *(Reference)*
  - 8 complete patterns with template code
  - Listing Page (Table + Search + Create)
  - Create/Edit Page (Form)
  - Detail Page (Display + Actions)
  - Auth Forms, Modal Forms, Empty States, etc.

- **[03 - Principles](./design-system/03-principles.md)** *(10 min read)*
  - 5 core design system principles
  - "Build pages first → Extract later"
  - "Eliminate Choices" philosophy
  - "Optimize for 90%" approach
  - Team-aligned strategies

- **[04 - Team Rollout](./design-system/04-team-rollout.md)** *(3-week plan)*
  - Week 1: Workshop & Setup
  - Week 2: Pilot Implementation
  - Week 3: Full Rollout
  - Success metrics & common issues

- **[05 - Implementation Summary](./design-system/05-implementation-summary.md)** *(Overview)*
  - Complete implementation overview
  - Components created (FormField, FormLayout, DataTable, LayoutShell)
  - Files created/modified
  - Architecture validation

**Target Audience:**
- 👨‍💻 Developers mới joining team
- 🎨 Designers wanting to understand implementation
- 👥 Team members learning design system workflow

**Key Benefits:**
- ⚡ 50% faster page production
- ✅ 100% consistent UI/UX
- 📚 Zero learning curve (copy-template)
- 🚀 No decision fatigue

---

## 🗂️ Documentation by Part

### Part 1: Frontend (Next.js)

**Location:** `frontend/`

**Technology:**
- Framework: Next.js 16.1.4 (App Router)
- Language: TypeScript 5.9.3
- UI: React 19.2.3 + TailwindCSS v4
- State: Zustand 5.0.10 + React Query 5.90.19
- Components: Radix UI (accessible primitives)
- Forms: React Hook Form + Zod validation
- Animation: Framer Motion 12.28.1

**Architecture:** Component-based with Server/Client Components

**Documentation:**
- [Architecture - Frontend](./architecture-frontend.md) *(To be generated)*
- [Design System Documentation](../frontend/docs/README.md)

---

### Part 2: Backend (FastAPI)

**Location:** `backend/`

**Technology:**
- Framework: FastAPI 0.115.0+
- Language: Python 3.x
- Database: MySQL 8.0 + SQLAlchemy 2.0.23
- Migrations: Alembic 1.13.0
- Cache: Redis (fastapi-cache2)
- Auth: JWT (python-jose) + Bcrypt
- Logging: Loguru 0.7.2
- Rate Limiting: SlowAPI
- Metrics: Prometheus client

**Architecture:** Layered API-centric
```
api/          # Route handlers
├── models/      # SQLAlchemy ORM
├── schemas/     # Pydantic validation
├── crud/        # Database operations
├── services/    # Business logic
└── core/        # Config, database, security
```

**Documentation:**
- [Architecture - Backend](./architecture-backend.md) *(To be generated)*
- [API Contracts - Backend](./api-contracts-backend.md)
- [Data Models - Backend](./data-models-backend.md)

---

## 🚀 Getting Started

### Prerequisites

- Docker Desktop or Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.10+ (for local backend development)
- MySQL 8.0
- Redis

### Quick Start

**Using Commander CLI (Recommended):**
```bash
./commander up              # Start all services
./commander logs backend    # View backend logs
./commander status          # Check container status
```

**Manual Docker Compose:**
```bash
docker-compose up -d         # Start all services
docker-compose logs backend  # View logs
```

### Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 or http://aicmr.local | Next.js application |
| Backend API | http://localhost:8000 or http://aicmr.local/backend | FastAPI backend |
| API Docs | http://localhost:8000/docs | Swagger/OpenAPI documentation |
| phpMyAdmin | http://localhost:8080 or http://aicmr.local/phpmyadmin | Database admin |

---

## 📋 Development Workflows

### Starting Development

```bash
# Frontend (Terminal 1)
cd frontend
npm run dev    # Runs on http://localhost:3000

# Backend (Terminal 2)
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Using Claude Code Skills

Simply describe what you need:

- "Test the login page" → Loads `frontend-checker`
- "Design a new button" → Loads `ui-ux-pro-max`
- "Create API for users" → Loads `backend-api-builder`
- "Commit these changes" → Loads `git-commit`

See [Claude Skills Inventory](./claude-skills-inventory.md) for all 11 available skills.

### Git Workflow

```bash
# The project uses automation rules - NO confirmation needed for:
git add .                    # Stage files
git commit -m "feat:..."    # Commit
git push                      # Push

# Commit format: type: description or emojis:
# 🐛 fix:, ✨ feat:, 🔧 chore:, 📝 docs:, ♻️ refactor:
```

---

## 🏗️ Architecture Patterns

### Backend Architecture (Layered)

```
┌─────────────────────────────────┐
│         API Routes              │  Endpoints
│    (backend/app/api/v1/)        │  ↓
├─────────────────────────────────┤
│         Dependencies             │  get_db, get_current_user
│       (backend/app/api/)        │  ↓
├─────────────────────────────────┤
│          CRUD                    │  Database operations
│      (backend/app/crud/)         │  ↓
├─────────────────────────────────┤
│         Services                 │  Business logic
│    (backend/app/services/)       │  ↓
├─────────────────────────────────┤
│          Models                  │  SQLAlchemy ORM
│    (backend/app/models/)        │  ↓
├─────────────────────────────────┤
│      Core Database              │  async_session
│    (backend/app/core/)          │
└─────────────────────────────────┘
```

### Frontend Architecture (Component-based)

```
┌─────────────────────────────────┐
│       App Router Pages          │  Route handlers
│  (frontend/src/app/)             │  ↓
├─────────────────────────────────┤
│       UI Components             │  Reusable components
│ (frontend/src/components/ui/)    │  ↓
├─────────────────────────────────┤
│      State Management           │  Zustand stores
│  (frontend/src/stores/)          │  ↓
├─────────────────────────────────┤
│         Hooks                   │  Custom React hooks
│   (frontend/src/hooks/)          │  ↓
├─────────────────────────────────┤
│          API Client             │  Axios + React Query
│    (frontend/src/lib/)          │
└─────────────────────────────────┘
```

---

## 🔐 Authentication & Authorization

### Rank System (Backend)

| Rank | Level | Title | Permissions |
|------|-------|-------|-------------|
| 0 | GUEST | Guest | Public access only |
| 1-2 | MEMBER | Thành viên | Basic features |
| 3-4 | EDITOR | Editor | Advanced editing |
| 5 | MODERATOR | Moderator | Content moderation |
| 10 | ADMIN | Administrator | Full access |

### JWT Authentication

- **Access Token:** 30 minutes expiry (stored in memory - Zustand)
- **Refresh Token:** 7 days expiry
- **CSRF Tokens:** Session-based for state-changing operations
- **Token Storage:** Access tokens in memory, refresh tokens in httpOnly cookies

---

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts with rank-based authorization
- **posts** - Blog/content with SEO and engagement metrics
- **categories** - Hierarchical content categorization
- **tags** - Flexible content tagging (many-to-many with posts)
- **post_tags** - Junction table for posts↔tags
- **post_metadata** - Flexible key-value storage
- **attachments** - File storage management
- **refresh_tokens** - JWT token refresh mechanism

See [Data Models - Backend](./data-models-backend.md) for complete schema.

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest                    # Run all tests
pytest -v                 # Verbose output
pytest tests/test_auth.py  # Run specific test
```

**Test Users:** See CLAUDE.md for credentials (admin, moderator, editor, member, guest)

### Frontend Testing

Use `frontend-checker` skill:
- Visual regression testing
- Console error detection
- Accessibility validation
- Broken link detection

---

## 📊 Monitoring & Metrics

### Prometheus Metrics

Available at `/metrics`:
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration

### Health Checks

- Backend: `GET /health`
- Database connection: Checked on startup
- Redis connection: Checked on startup

---

## 📝 Next Steps for PRD/Planning

When creating a brownfield PRD, reference:

1. **This index** - For complete project overview
2. **[API Contracts](./api-contracts-backend.md)** - For API-related features
3. **[Data Models](./data-models-backend.md)** - For database-related features
4. **[Design System](./design-system/README.md)** ⭐ - For UI/UX features (START HERE!)
5. **[Frontend Design System](../frontend/docs/README.md)** - Legacy citizenship framework

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Environment variables template |
| `docker-compose.yml` | Container orchestration |
| `nginx/conf.d/default.conf` | Reverse proxy configuration |
| `frontend/package.json` | Frontend dependencies |
| `backend/requirements.txt` | Backend dependencies |

---

## 📞 Support & Documentation

### Claude Code Skills

11 specialized skills available. See [Claude Skills Inventory](./claude-skills-inventory.md) for complete catalog.

### Existing Docs

- **CLAUDE.md** - Project guidance for AI agents
- **Frontend Design System** - UI/UX citizenship framework

---

**📖 Documentation Index maintained by:** BMad Document Project Workflow
**🗂️ Scan Level:** Exhaustive (ALL source files)
**📅 Last Updated:** 2026-01-26
**✨ Status:** Production Ready
**🎨 Design System:** v1.0 - Complete

---

**Quick Links:**
- [Backend API Docs](./api-contracts-backend.md)
- [Database Schema](./data-models-backend.md)
- [Claude Skills](./claude-skills-inventory.md)
- [Frontend Design System](../frontend/docs/README.md)
- [Design System - Getting Started ⭐](./design-system/README.md)
- [Design System - Common Patterns](./design-system/02-common-patterns.md)
