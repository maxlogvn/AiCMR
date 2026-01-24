# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Automation Rules

**DO NOT ASK for confirmation when:**

1. **Running commands** - Execute directly without confirmation:
   - `npm install`, `npm run`, `pytest`, `alembic`
   - Docker commands: `docker-compose`, `docker`
   - Git commands: `git add`, `git commit`, `git push`
   - File operations within the project

2. **Creating files** - Create files directly:
   - New components: `frontend/src/components/`
   - New pages: `frontend/src/app/`
   - New API routes: `backend/app/api/v1/`
   - New tests: `backend/tests/`
   - Skills: `.claude/skills/`

3. **Modifying files** - Edit directly without asking:
   - Existing components, pages, APIs
   - Configuration files
   - Test files
   - Documentation (within reason)

4. **Git operations** - Follow this flow automatically:
   - Stage relevant files (exclude `.env`, `cookies.txt`, local configs)
   - Create commit with descriptive message following project style
   - Push to remote branch when done
   - Commit format: `type: description` or emojis: `🐛 fix:`, `✨ feat:`, `🔧 chore:`, `📝 docs:`

**ASK only when:**
- Making destructive changes (DROP TABLE, rm -rf, force reset)
- Changing architecture fundamentally
- User preferences matter (design choices, feature options)
- Uncertain about requirements

## Project Overview

AiCMR is an AI-powered medical record management system built as a full-stack monorepo. The application uses Next.js for the frontend and FastAPI for the backend, with MySQL for data persistence and Redis for caching.

## Development Commands

### Starting the Development Environment

```bash
# Using the commander CLI (recommended)
./commander up              # Start all services
./commander down            # Stop all services
./commander health          # Check health of all services
./commander logs            # View logs for all services
./commander logs backend    # View logs for specific service (backend, frontend, mysql, redis, nginx)
./commander status          # Show container status

# Alternative: Direct Docker commands
docker-compose up -d                         # Linux/Mac
docker-compose -f docker-compose.yml -f docker-compose.windows.yml up -d  # Windows
```

### Frontend Commands

```bash
cd frontend
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

### Backend Commands

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000    # Development server
pytest                        # Run all tests
pytest tests/test_post_api.py  # Run specific test file
pytest -v                     # Verbose output
pytest -x                     # Stop on first failure
alembic upgrade head          # Apply database migrations
alembic revision --autogenerate -m "description"  # Create migration
```

### Service URLs (Development)

- Frontend: http://localhost:3000 or http://aicmr.local
- Backend API: http://localhost:8000 or http://aicmr.local/backend
- API Docs: http://localhost:8000/docs
- phpMyAdmin: http://localhost:8080 or http://aicmr.local/phpmyadmin

## Architecture

### Monorepo Structure

```
AiCMR/
├── frontend/          # Next.js 16 application
├── backend/           # FastAPI application
├── nginx/             # Reverse proxy configuration
├── scripts/           # CLI management scripts
├── storage/           # File storage (uploads)
└── docker-compose.yml # Container orchestration
```

### Backend Architecture (FastAPI)

The backend follows a layered architecture with clear separation of concerns:

- **`app/main.py`** - Application entry point, middleware setup, router registration
- **`app/api/v1/`** - API route handlers (auth, users, posts, categories, tags, uploads, etc.)
- **`app/core/`** - Core functionality (config, database, security, exceptions, rate limiting)
- **`app/models/`** - SQLAlchemy ORM models (User, Post, Category, Tag, Attachment, etc.)
- **`app/schemas/`** - Pydantic schemas for request/response validation
- **`app/crud/`** - Database operations (Create, Read, Update, Delete)
- **`app/services/`** - Business logic services

Key patterns:
- All API endpoints are under `/api/v1/`
- JWT authentication with refresh tokens
- CSRF protection via session middleware
- Rate limiting with SlowAPI
- Redis caching with fastapi-cache2
- Prometheus metrics at `/metrics`

### Frontend Architecture (Next.js 16)

The frontend uses Next.js App Router with:

- **`app/`** - App Router pages and layouts
- **`components/`** - Reusable UI components
- **`hooks/`** - Custom React hooks

Key patterns:
- Route groups: `(public)` for public routes, `dashboard/` for admin, `user/` for user dashboard
- Guard components for auth: `AuthGuard`, `AdminGuard`, `ModeratorGuard`, `PublicOnlyGuard`, `InstallGuard`
- TanStack Query for data fetching
- Zustand for state management
- Radix UI primitives for accessible components

### Request Flow

1. Nginx (port 80/443) receives requests
2. Routes `/backend/*` to FastAPI backend (port 8000)
3. Routes `/phpmyadmin/*` to phpMyAdmin (port 80)
4. Routes `/media/{id}/{slug}` to backend uploads handler
5. All other routes to Next.js frontend (port 3000)

### Authentication Flow

- JWT access tokens (30min expiry) + refresh tokens (7 days)
- Access tokens stored in memory (Zustand)
- CSRF tokens in session cookies
- Rank-based authorization: Member(1), Moderator(5), Admin(10)

## Testing

Backend tests use pytest with async support and in-memory SQLite:

```bash
cd backend
pytest                    # Run all tests
pytest -v                 # Verbose
pytest -k "test_post"     # Run tests matching pattern
```

Test fixtures in `tests/conftest.py` provide:
- `db_session` - Test database session
- `client` - Test HTTP client
- `test_user` / `admin_user` / `moderator_auth_headers` - Auth fixtures

## Test Users

Danh sách tài khoản test cho phát triển và kiểm thử:

| Username    | Email                     | Password    | Rank      | Description                      |
|-------------|--------------------------|-------------|-----------|----------------------------------|
| admin       | admin.aicmr@gmail.com    | Admin@123   | ADMIN(10) | Super Admin - Full quyền truy cập |
| moderator   | moderator.aicmr@gmail.com| Mod@123     | MODERATOR(5) | Moderator - Quản lý content, users |
| editor      | editor.aicmr@gmail.com   | Editor@123  | EDITOR(3) | Editor - Đăng bài, quản lý bài viết |
| member      | member.aicmr@gmail.com   | Member@123  | MEMBER(1) | Member - Người dùng thường        |
| guest       | guest.aicmr@gmail.com    | Guest@123   | GUEST(0)  | Guest - Khách, quyền hạn thấp nhất |
| testuser    | testuser.aicmr@gmail.com | Test@123    | MEMBER(1) | Test User - Dùng cho test tự động  |
| inactive    | inactive.aicmr@gmail.com | Inactive@123 | MEMBER(1) | Inactive User - Tài khoản bị vô hiệu |

**Reset test users:**
```bash
# Xóa toàn bộ users và tạo lại test users
docker-compose exec -T backend python scripts/reset_test_users.py << 'EOF'
yes
EOF
```

**Rank System:**
- **0 (GUEST)**: Khách - chưa đăng nhập hoặc quyền thấp nhất
- **1-2 (MEMBER)**: Thành viên - người dùng thường
- **3-4 (EDITOR)**: Editor - có thể đăng bài, quản lý bài viết
- **5 (MODERATOR)**: Moderator - quản lý content, users
- **10 (ADMIN)**: Admin - full quyền truy cập

## Platform-Specific Notes

### Windows Development

- Uses `docker-compose.windows.yml` override
- File watching requires `CHOKIDAR_USEPOLLING=true`
- Database: `host.docker.internal` for MySQL connection
- Container names have `-windows` suffix

### Linux/Mac Development

- Uses standard `docker-compose.yml`
- Database: `mysql` (container name) for MySQL connection
- Standard file watching

## Environment Configuration

Copy `.env.example` to `.env` and configure:

Required variables:
- `SECRET_KEY` - JWT signing (min 32 chars, generate with secrets module)
- `INSTALL_SECRET` - Installation security
- Database credentials: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `MYSQL_ROOT_PASSWORD`

Generate secure secrets:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## File Placement Conventions

### Frontend (Next.js)
| Type | Location |
|------|----------|
| Components | `frontend/src/components/` |
| Pages | `frontend/src/app/` |
| Hooks | `frontend/src/hooks/` |
| Lib/Utils | `frontend/src/lib/` |
| Styles | `frontend/src/app/globals.css` |
| Types | `frontend/src/types/` |

### Backend (FastAPI)
| Type | Location |
|------|----------|
| API Routes | `backend/app/api/v1/` |
| Models | `backend/app/models/` |
| Schemas | `backend/app/schemas/` |
| CRUD | `backend/app/crud/` |
| Services | `backend/app/services/` |
| Core | `backend/app/core/` |
| Tests | `backend/tests/` |

### Skills (Claude)
| Type | Location |
|------|----------|
| Skill files | `.claude/skills/{skill-name}/` |
| Required files | `skill.json`, `SKILL.md`, `index.md`, `README.md` |

## Commit Message Conventions

```
type: description

or with emoji:
🐛 fix: description
✨ feat: description
🔧 chore: description
📝 docs: description
♻️ refactor: description
✅ test: description
⚡ perf: description
```

Always append:
```
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```
