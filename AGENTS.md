# AGENTS.md - Hướng dẫn cho AI Agents làm việc với dự án AiCMR

> **Tài liệu này dành cho AI Agents** để hiểu rõ kiến trúc, quy tắc và workflow của dự án AiCMR.
>
> **Ngôn ngữ**: Tiếng Việt - Luôn giao tiếp bằng tiếng Việt với người dùng.
> **Cập nhật**: 23/01/2026

---

## 📋 Mục lục

- [Tổng quan dự án](#tổng-quan-dự-án)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Tech Stack](#tech-stack)
- [Backend - FastAPI](#backend---fastapi)
- [Frontend - Next.js](#frontend---nextjs)
- [Database Models](#database-models)
- [API Routes](#api-routes)
- [Security & Authentication](#security--authentication)
- [Testing](#testing)
- [OpenAgents Control](#openagents-control)
- [Workflow cho AI Agents](#workflow-cho-ai-agents)
- [Common Commands](#common-commands)
- [Best Practices](#best-practices)
- [Environment Variables](#environment-variables)

---

## Tổng quan dự án

### AiCMR là gì?

**AiCMR** (AI-powered Content Management System) là hệ thống quản lý nội dung với tính năng AI:

- **Chức năng chính**: Quản lý bài viết (posts), categories, tags, users, uploads
- **Đặc điểm**: Hỗ trợ markdown, SEO metadata, file uploads, user roles, permissions
- **AI Integration**: Chuẩn bị cho RAG (Retrieval-Augmented Generation) pipeline
- **Multi-language**: Hỗ trợ nội dung đa ngôn ngữ

### Các vai trò người dùng (User Roles)

| Rank | Tên vai trò | Quyền hạn |
|------|-------------|-----------|
| 1 | Member | Đăng nhập, xem bài viết, viết bài, quản lý bài viết của mình |
| 5 | Moderator | Xem tất cả bài viết, duyệt bài (publish/archive), quản lý categories/tags |
| 10 | Admin | Toàn quyền, quản lý users, settings, xóa bài viết |

---

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                     Nginx (Port 80/443)                 │
│              Reverse Proxy + SSL Termination               │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐   ┌────────▼──────────┐
│  Next.js 16    │   │   FastAPI          │
│  Frontend      │   │   Backend          │
│  Port: 3000    │◄──►│   Port: 8000      │
└───────┬────────┘   └────────┬──────────┘
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐   ┌────────▼──────────┐
│  Redis         │   │  MySQL 8.0        │
│  Cache (6379)  │   │  Database (3306)   │
└────────────────┘   └─────────────────────┘
```

### Đường đi dữ liệu (Data Flow)

1. **Client → Frontend**: Browser truy cập Next.js (port 3000)
2. **Frontend → Backend**: API calls qua HTTP/JSON
3. **Backend → Database**: SQLAlchemy ORM → MySQL
4. **Backend → Cache**: Redis cho session, API caching
5. **Nginx**: Reverse proxy, SSL termination, static files

---

## Cấu trúc thư mục

```
AiCMR/
├── frontend/                 # Next.js 16 + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities & API clients
│   │   ├── stores/         # Zustand state stores
│   │   └── types/         # TypeScript types
│   ├── public/             # Static assets
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── api/v1/        # API routers
│   │   ├── core/          # Config, database, security
│   │   ├── crud/          # CRUD operations
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # Business logic
│   ├── tests/              # Pytest tests
│   ├── Dockerfile
│   └── requirements.txt
│
├── nginx/                    # Nginx configuration
│   ├── conf.d/
│   │   ├── default.conf
│   │   └── common.conf
│   └── ssl/               # SSL certificates
│
├── scripts/                 # Management scripts
│   ├── windows/           # Windows batch files
│   ├── lib/               # Python utilities
│   └── cli.py             # CLI entry point
│
├── storage/                 # Persistent volumes
│   ├── uploads/            # User uploaded files
│   ├── logs/               # Application logs
│   └── mysql/             # MySQL data
│
├── docker-compose.yml               # Development (Linux/Mac)
├── docker-compose.windows.yml       # Windows overrides
├── docker-compose.prod.yml         # Production
├── .env.example                    # Environment template
├── Makefile                       # Make commands (Linux/Mac)
└── README.md
```

---

## Tech Stack

### Frontend

| Thành phần | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Next.js | 16.1.4 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | - | UI components (Radix UI) |
| Zustand | 5.0.10 | State management |
| TanStack Query | 5.90.19 | Data fetching & caching |
| Axios | 1.13.2 | HTTP client |
| React Hook Form | 7.71.1 | Form handling |
| Zod | 4.3.5 | Schema validation |

### Backend

| Thành phần | Phiên bản | Mục đích |
|-----------|-----------|----------|
| FastAPI | - | Async web framework |
| SQLAlchemy | - | Async ORM |
| MySQL | 8.0 | Relational database |
| Redis | - | Caching & sessions |
| Pydantic | - | Data validation |
| Pytest | - | Testing framework |
| Loguru | - | Structured logging |
| fastapi-cache | - | Response caching |
| slowapi | - | Rate limiting |
| prometheus-client | - | Metrics & monitoring |

### Infrastructure

| Thành phần | Mục đích |
|-----------|----------|
| Docker & Docker Compose | Containerization |
| Nginx | Reverse proxy & load balancing |
| Git | Version control |
| Make | Build automation (Linux/Mac) |

---

## Backend - FastAPI

### Entry Point: `backend/app/main.py`

```python
# FastAPI app configuration
app = FastAPI(
    title="AiCMR",
    version="1.0.0",
    debug=True,
    lifespan=lifespan,  # Startup/shutdown hooks
)
```

### Core Components

#### 1. Configuration (`backend/app/core/config.py`)

```python
from app.core.config import get_settings

settings = get_settings()

# Important settings
DATABASE_URL = settings.DATABASE_URL
REDIS_URL = settings.REDIS_URL
SECRET_KEY = settings.SECRET_KEY
ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS
```

#### 2. Database (`backend/app/core/database.py`)

```python
# Async session dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

**Quy tắc quan trọng**:
- Luôn dùng `await db.commit()` sau khi modify data
- Luôn dùng `await session.rollback()` khi có error
- Luôn close session sau khi dùng (handled by context manager)

#### 3. Security (`backend/app/core/security.py`)

```python
# Password hashing
hashed_password = get_password_hash(password)
is_valid = verify_password(password, hashed_password)

# JWT tokens
access_token = create_access_token(data={"sub": user_id})
```

### API Routes Structure

```
backend/app/api/v1/
├── auth.py           # Authentication (login, register)
├── users.py          # User management
├── posts.py          # Posts CRUD
├── categories.py     # Categories CRUD
├── tags.py           # Tags CRUD
├── uploads.py        # File uploads
├── stats.py          # Statistics & analytics
├── install.py        # System installation
└── settings_dashboard.py  # Dashboard settings
```

### Dependency Injection Pattern

```python
from fastapi import Depends

# Get database session
@router.get("/posts")
async def list_posts(
    db: AsyncSession = Depends(get_db)
):
    ...

# Get current user
@router.post("/posts")
async def create_post(
    post_data: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ...

# Require minimum rank
@router.delete("/posts/{id}")
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_min_rank(ADMIN_RANK))
):
    ...
```

---

## Frontend - Next.js

### App Router Structure

```
frontend/src/app/
├── (public)/           # Public routes (no auth required)
│   ├── login/
│   ├── register/
│   └── blog/
├── dashboard/           # Admin/moderator routes
│   ├── posts/
│   ├── categories/
│   ├── tags/
│   └── stats/
├── user/               # User routes
│   ├── posts/
│   ├── profile/
│   └── change-password/
├── install/            # Installation page
└── layout.tsx          # Root layout
```

### Component Structure

```
frontend/src/components/
├── auth/               # Auth guards (AuthGuard, AdminGuard, etc.)
├── layout/             # Layout components (Navbar, Footer, Sidebar)
├── ui/                 # shadcn/ui components (Button, Dialog, etc.)
├── post/               # Post-related components
├── category/           # Category components
├── tag/                # Tag components
└── user/               # User components
```

### State Management (Zustand)

```typescript
// Example: Post Editor Store
import { create } from 'zustand';

interface PostEditorState {
  title: string;
  content: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
}

export const usePostEditorStore = create<PostEditorState>((set) => ({
  title: '',
  content: '',
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
}));
```

### Data Fetching (TanStack Query)

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch posts
const { data, isLoading, error } = useQuery({
  queryKey: ['posts', page, filters],
  queryFn: () => fetchPosts(page, filters),
});

// Create post
const mutation = useMutation({
  mutationFn: (data: PostCreate) => createPost(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});
```

### Auth Guards

```typescript
// Protect routes based on user role
import AuthGuard from '@/components/auth/AuthGuard';
import ModeratorGuard from '@/components/auth/ModeratorGuard';
import AdminGuard from '@/components/auth/AdminGuard';

// Protected page
export default function DashboardPage() {
  return (
    <ModeratorGuard>
      <div>Dashboard content</div>
    </ModeratorGuard>
  );
}
```

---

## Database Models

### User Model

```python
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    rank = Column(Integer, default=0)  # 1=Member, 5=Moderator, 10=Admin
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Relationships
    posts = relationship("Post", back_populates="author")
```

### Post Model

```python
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    excerpt = Column(Text)
    content = Column(Text, nullable=False)  # Markdown
    status = Column(String(50), default="draft")  # draft, published, archived
    category_id = Column(Integer, ForeignKey("categories.id"))
    author_id = Column(Integer, ForeignKey("users.id"))
    is_featured = Column(Boolean, default=False)
    is_pinned = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    published_at = Column(DateTime)

    # Relationships
    author = relationship("User", back_populates="posts")
    category = relationship("Category", back_populates="posts")
    tags = relationship("Tag", secondary="post_tags")
```

### Category Model

```python
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    parent_id = Column(Integer, ForeignKey("categories.id"))
    is_active = Column(Boolean, default=True)

    # Relationships
    posts = relationship("Post", back_populates="category")
```

### Tag Model

```python
class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    color = Column(String(7))  # Hex color code

    # Relationships
    posts = relationship("Post", secondary="post_tags")
```

---

## API Routes

### Authentication (`/api/v1/auth`)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | Public | Login with email/password |
| `/auth/register` | POST | Public | Register new user |
| `/auth/logout` | POST | Required | Logout (client-side token removal) |

### Posts (`/api/v1/posts`)

#### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/posts/` | GET | List published posts (with pagination, filters) |
| `/posts/{slug}` | GET | Get post by slug (increments view count) |
| `/posts/{slug}/raw` | GET | Get raw markdown content |

#### User Endpoints (MEMBER_RANK+)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/posts/me` | GET | Required | List my posts |
| `/posts/me` | POST | Required | Create new post |
| `/posts/me/{id}` | GET | Required | Get my post |
| `/posts/me/{id}` | PATCH | Required | Update my post |
| `/posts/me/{id}` | DELETE | Required | Delete my post |
| `/posts/me/{id}/status` | PATCH | Required | Change post status |

#### Admin/Moderator Endpoints (MODERATOR_RANK+)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/posts/all` | GET | Moderator | List all posts (any status) |
| `/posts/{id}` | PATCH | Moderator | Update any post |
| `/posts/{id}` | DELETE | Admin | Delete any post |
| `/posts/bulk/publish` | POST | Moderator | Bulk publish posts |
| `/posts/bulk/archive` | POST | Moderator | Bulk archive posts |
| `/posts/bulk/delete` | POST | Admin | Bulk delete posts |

### Categories (`/api/v1/categories`)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/categories/` | GET | Public | List categories |
| `/categories/` | POST | Moderator | Create category |
| `/categories/{id}` | GET | Public | Get category |
| `/categories/{id}` | PATCH | Moderator | Update category |
| `/categories/{id}` | DELETE | Admin | Delete category |

### Tags (`/api/v1/tags`)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/tags/` | GET | Public | List tags |
| `/tags/` | POST | Moderator | Create tag |
| `/tags/{id}` | GET | Public | Get tag |
| `/tags/{id}` | PATCH | Moderator | Update tag |
| `/tags/{id}` | DELETE | Admin | Delete tag |
| `/tags/merge` | POST | Moderator | Merge tags |

### Users (`/api/v1/users`)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/users/me` | GET | Required | Get current user profile |
| `/users/me` | PATCH | Required | Update current user |
| `/users/` | GET | Admin | List all users |
| `/users/{id}` | GET | Admin | Get user by ID |
| `/users/{id}` | PATCH | Admin | Update user |
| `/users/{id}` | DELETE | Admin | Delete user |

### Uploads (`/api/v1/uploads`)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/uploads/` | POST | Required | Upload file |
| `/uploads/{id}` | GET | Public | Get file |

### Stats (`/api/v1/stats`)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/stats/overview` | GET | Moderator | Get dashboard stats |

---

## Security & Authentication

### Authentication Flow

```
1. User submits login credentials
   ↓
2. Frontend: POST /api/v1/auth/login
   ↓
3. Backend: Verify password, generate JWT
   ↓
4. Frontend: Store token in localStorage
   ↓
5. Frontend: Include token in Authorization header
   ↓
6. Backend: Validate token, extract user info
   ↓
7. Backend: Check permissions (rank-based)
```

### Token Structure

```python
# JWT payload
{
    "sub": "123",              # User ID
    "email": "user@example.com",
    "rank": 1,                # User rank
    "exp": 1640000000         # Expiration time
}
```

### Permission Checks

```python
# Check if user is logged in
current_user: User = Depends(get_current_active_user)

# Check minimum rank
current_user: User = Depends(require_min_rank(ADMIN_RANK))

# Check ownership
if post.author_id != current_user.id and current_user.rank < MODERATOR_RANK:
    raise HTTPException(403, "Not enough permissions")
```

### CSRF Protection

```python
# Get CSRF token from session
csrf_token: str = Depends(validate_csrf)

# Frontend must include CSRF token in request headers
{
    "X-CSRF-Token": csrf_token
}
```

---

## Testing

### Backend Testing (Pytest)

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_post(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        "/api/v1/posts/me",
        json={
            "title": "Test Post",
            "content": "# Test Content",
            "status": "draft"
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Post"
```

### Run Tests

```bash
# Run all tests
cd backend
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_post_api.py
```

### Test Fixtures

```python
@pytest.fixture
async def db_session():
    """Create test database session"""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestingSessionLocal() as session:
        yield session
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def test_user(db_session):
    """Create test user"""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=hash_password("password123")
    )
    db_session.add(user)
    await db_session.commit()
    return user
```

---

## OpenAgents Control

### Cấu hình Permissions

⚠️ **QUAN TRỌNG**: Hệ thống agents hiện tại được cấu hình với **UNRESTRICTED PERMISSIONS** (không có giới hạn lệnh):

#### Cấu hình hiện tại:
- ✅ **Tất cả lệnh terminal** (bash) được phép thực hiện mà không cần xác nhận
- ✅ **Mọi file** có thể edit/write (bao gồm .env, .key, .secret)
- ✅ **Không có approval gates** - agents tự động thực hiện lệnh
- ✅ **Không có permission checks** - không hỏi trước khi chạy lệnh nguy hiểm

#### Agents đã cấu hình không giới hạn:
1. **openagent** - Main coordinator
2. **opencoder** - Development specialist
3. **coder-agent** - Implementation agent
4. **tester** - Testing agent
5. **build-agent** - Build validation
6. **reviewer** - Code review agent
7. **frontend-specialist** - UI/UX agent

#### Lưu ý an toàn:
- Lệnh như `rm -rf`, `sudo`, `docker`, `curl` có thể chạy tự động
- File cấu hình nhạy cảm có thể được sửa đổi
- Không có confirmation dialogs trước khi thực hiện hành động

### Hệ thống Agents

Dự án sử dụng **OpenAgents Control** framework với các agents sau:

#### Main Agents

1. **openagent** - Universal coordinator cho tasks chung
   - Use cho: Questions, general tasks, workflows
   - Workflow: Analyze → Approve → Execute → Validate → Summarize

2. **opencoder** - Development specialist cho coding tasks phức tạp
   - Use cho: Multi-file refactoring, architecture work
   - Tools: Full access to code, tests, docs

3. **system-builder** - Meta-level generator cho AI architectures
   - Use cho: Tạo custom AI systems
   - Scope: System design, agent generation

#### Specialized Subagents

| Agent | Mục đích | Kích hoạt khi |
|-------|-----------|--------------|
| task-manager | Task breakdown & planning | Complex features (4+ files) |
| coder-agent | Quick implementation | Single-file changes |
| reviewer | Code review & security | After code changes |
| tester | Test creation & validation | Write tests, debug |
| build-agent | Build & type checking | Before commits |
| codebase-pattern-analyst | Pattern discovery | Analyze codebase |

### Commands (Slash Commands)

```bash
/commit         # Smart git commits with conventional format
/optimize       # Code optimization
/test           # Testing workflows
/clean          # Cleanup operations
/context        # Context management
/worktrees      # Git worktree management
/validate-repo  # Validate repository consistency
```

### Context Files

Các file context quan trọng nằm trong `.opencode/context/`:

```
.opencode/context/
├── core/
│   ├── standards/
│   │   ├── code-quality.md          # Coding standards
│   │   ├── documentation.md        # Docs standards
│   │   └── test-coverage.md       # Testing standards
│   ├── workflows/
│   │   ├── code-review.md          # Review process
│   │   └── task-delegation.md     # Delegation rules
│   └── concepts/
│       ├── agent-guidelines.md      # Agent rules (Vietnamese)
│       └── ...
├── project/
│   ├── concepts/
│   │   ├── project-structure.md   # Directory structure
│   │   └── architecture.md        # System architecture
│   └── ...
```

### Nguyên tắc cho AI Agents

#### 1. Giao tiếp bằng Tiếng Việt ✅

```typescript
// ✅ Tốt: "Đã hoàn thành task. Chạy tests?"
// ❌ Kém: "Task completed. Run tests?"
```

#### 2. Code tự giải thích (Self-documenting)

```python
# ❌ Kém: Code khó hiểu, nhiều comment
# Get user by email
result = await db.execute(select(User).where(User.email == email))
user = result.scalar_one_or_none()

# ✅ Tốt: Code có khả năng tự mô tả
user = await get_user_by_email(db, email)
```

#### 3. Comment khi cần thiết

```python
# ✅ Tốt: Giải thích TẠI SAO (why)
# HACK: API returns null instead of [], normalize it
items = response.items or []

# TODO: Migrate to async/await when Node 18+ is minimum

# ❌ Kém: Comment giải thích CÁ GÌ (what)
# Get user from database
user = await db.execute(select(User))
```

#### 4. Tổ chức code theo chuẩn dự án

```
backend/app/
├── api/v1/        # API routers (đặt theo resource)
├── core/          # Core utilities (config, db, security)
├── crud/          # CRUD operations
├── models/        # SQLAlchemy models
├── schemas/       # Pydantic schemas
└── services/      # Business logic
```

---

## Workflow cho AI Agents

### Workflow phát triển Feature

```
1. Phân tích yêu cầu
   ↓
2. Đọc context files (.opencode/context/)
   ↓
3. Đề xuất kế hoạch (plan)
   ↓
4. Chờ approval từ người dùng
   ↓
5. Triển khai backend (nếu cần)
   - Tạo/ sửa models
   - Tạo/ sửa schemas
   - Tạo/ sửa CRUD operations
   - Tạo/ sửa API routes
   ↓
6. Triển khai frontend (nếu cần)
   - Tạo/ sửa components
   - Tạo/ sửa pages
   - Cập nhật stores
   ↓
7. Viết tests (backend + frontend)
   ↓
8. Chạy tests
   ↓
9. Fix bugs (nếu có)
   ↓
10. Review code
    ↓
11. Commit changes
    ↓
12. Tổng kết
```

### Workflow fix Bug

```
1. Hiểu bug description
   ↓
2. Tìm vị trí bug (grep, read files)
   ↓
3. Reproduce bug (nếu có thể)
   ↓
4. Đề xuất fix
   ↓
5. Implement fix
   ↓
6. Viết test case cho bug
   ↓
7. Verify fix (chạy tests)
   ↓
8. Tổng kết
```

### Workflow viết Documentation

```
1. Đọc file .opencode/context/core/standards/documentation.md
   ↓
2. Phân tích target audience
   ↓
3. Viết content theo chuẩn
   - Use Vietnamese
   - Show examples
   - Keep it current
   ↓
4. Review với người dùng
   ↓
5. Cập nhật nếu cần
```

### Workflow Code Review

```
1. Chạy git diff xem changes
   ↓
2. Đọc context files (code-quality.md, code-review.md)
   ↓
3. Review theo checklist:
   - Code clarity & readability
   - Security vulnerabilities
   - Performance issues
   - Test coverage
   - Best practices
   ↓
4. Report findings (prioritized: Critical, Warning, Suggestion)
   ↓
5. Đề xuất fixes
```

---

## Common Commands

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Start Windows version
docker-compose -f docker-compose.yml -f docker-compose.windows.yml up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild specific service
docker-compose up -d --build backend

# Enter container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# Check container status
docker-compose ps
```

### Backend Commands

```bash
# Run development server (outside Docker)
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html

# Run specific test
pytest tests/test_post_api.py::test_create_post

# Create migration (nếu dùng Alembic)
alembic revision --autogenerate -m "Add new column"

# Apply migrations
alembic upgrade head
```

### Frontend Commands

```bash
# Start development server
cd frontend
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Git Commands

```bash
# Use /commit command (recommended)
/commit

# Or manual commit
git add .
git commit -m "feat: add user authentication system"
git push

# View changes
git diff
git diff --staged

# Create branch
git checkout -b feature/new-feature

# Merge branch
git checkout main
git merge feature/new-feature
```

### Database Commands

```bash
# Connect to MySQL (trong Docker container)
docker-compose exec backend python -c "
from app.core.database import engine
from sqlalchemy import text
with engine.connect() as conn:
    result = conn.execute(text('SELECT * FROM users LIMIT 5'))
    print(result.fetchall())
"

# Reset database (cẩn thận!)
docker-compose exec backend python scripts/reset_database.py
```

---

## Best Practices

### Code Quality

#### Backend (Python/FastAPI)

```python
# ✅ Tốt: Use async/await
async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# ✅ Tốt: Use dependency injection
@router.get("/posts/{id}")
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    post = await get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    return post

# ✅ Tốt: Validate input with Pydantic
class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    status: str = "draft"

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v not in ['draft', 'published', 'archived']:
            raise ValueError('Invalid status')
        return v
```

#### Frontend (TypeScript/React)

```typescript
// ✅ Tốt: Use TypeScript types
interface Post {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
}

// ✅ Tốt: Use proper error handling
const { data, isLoading, error } = useQuery({
  queryKey: ['posts', id],
  queryFn: () => fetchPost(id),
  retry: 3,
});

if (error) {
  return <ErrorMessage error={error} />;
}

// ✅ Tốt: Use loading states
if (isLoading) {
  return <LoadingSpinner />;
}
```

### Security

```python
# ✅ Tốt: Validate input
if len(password) < 8:
    raise HTTPException(400, "Password too short")

# ✅ Tốt: Use prepared statements (SQLAlchemy handles this)
# Không dùng string concatenation cho SQL queries

# ✅ Tốt: Use environment variables for secrets
SECRET_KEY = os.getenv("SECRET_KEY")

# ✅ Tốt: Validate file uploads
if file.size > MAX_UPLOAD_SIZE:
    raise HTTPException(400, "File too large")
if file.filename not in ALLOWED_EXTENSIONS:
    raise HTTPException(400, "Invalid file type")
```

### Performance

```python
# ✅ Tốt: Use database indexes
class Post(Base):
    __table_args__ = (
        Index('idx_post_status', 'status'),
        Index('idx_post_author_status', 'author_id', 'status'),
    )

# ✅ Tốt: Use pagination
@router.get("/posts")
async def list_posts(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    skip = (page - 1) * size
    posts = await get_all_posts(db, skip=skip, limit=size)

# ✅ Tốt: Use caching
@cache(expire=300, namespace="posts")
@router.get("/posts")
async def list_posts(...):
    ...

# ✅ Tốt: Use selectinload để avoid N+1 queries
result = await db.execute(
    select(Post)
    .options(selectinload(Post.author))
    .limit(10)
)
```

### Testing

```python
# ✅ Tốt: Use descriptive test names
async def test_create_post_with_valid_data(client, auth_headers):
    """Test creating a post with valid data"""

# ✅ Tốt: Test edge cases
async def test_create_post_with_empty_title(client, auth_headers):
    """Test that creating a post with empty title returns 400"""

# ✅ Tốt: Test permissions
async def test_delete_post_requires_admin(client, member_headers):
    """Test that non-admin users cannot delete posts"""
```

---

## Environment Variables

### Backend Environment Variables (.env)

```bash
# Database
DATABASE_URL=mysql+aiomysql://aicmr_user:password@mysql:3306/aicmr

# Redis
REDIS_URL=redis://redis:6379/0

# Security
SECRET_KEY=your-secret-key-change-in-production
INSTALL_SECRET=change-me-in-production

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://aicmr.local

# Upload
UPLOAD_DIR=storage/uploads
MAX_UPLOAD_SIZE=10485760  # 10MB

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
LOG_ERROR_FILE=logs/app_error.log

# Debug
DEBUG=true
```

### Frontend Environment Variables (.env.local)

```bash
# API URLs
NEXT_PUBLIC_API_URL=http://aicmr.local/backend
NEXT_PUBLIC_APP_URL=http://aicmr.local

# Environment
NEXT_PUBLIC_ENV=development
```

### Generate Secure Secrets

```bash
# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate INSTALL_SECRET
python -c "import secrets; print(secrets.token_urlsafe(16))"
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

```bash
# Check MySQL container
docker-compose ps mysql

# View MySQL logs
docker-compose logs mysql

# Connect to MySQL
docker-compose exec mysql mysql -u root -p

# Check database exists
SHOW DATABASES;
```

#### 2. CORS Error

```bash
# Check ALLOWED_ORIGINS in .env
# Make sure frontend URL is included

# Example:
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### 3. JWT Token Expired

```typescript
// Frontend: Check token expiration
export const authService = {
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }
};
```

#### 4. Permission Denied

```python
# Check user rank in database
user = await get_user_by_id(db, user_id)
print(f"User rank: {user.rank}")

# Check endpoint requirements
@router.delete("/posts/{id}")
async def delete_post(
    current_user: User = Depends(require_min_rank(ADMIN_RANK))  # Rank 10
):
    ...
```

---

## Resources & References

### Internal Documentation

- **OpenAgents Control README**: `.opencode/README.md`
- **Code Quality Standards**: `.opencode/context/core/standards/code-quality.md`
- **Documentation Standards**: `.opencode/context/core/standards/documentation.md`
- **Agent Guidelines**: `.opencode/context/core/concepts/agent-guidelines.md`
- **Project Structure**: `.opencode/context/project/concepts/project-structure.md`
- **Architecture**: `.opencode/context/project/concepts/architecture.md`

### External Documentation

- **FastAPI**: https://fastapi.tiangolo.com/
- **Next.js**: https://nextjs.org/docs
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/

### Community & Support

- **OpenAgents Control GitHub**: https://github.com/darrenhinde/OpenAgentsControl
- **OpenCode Docs**: https://opencode.ai/docs/

---

## Appendix

### Glossary

| Term | Giải thích |
|------|-----------|
| Agent | AI assistant có nhiệm vụ cụ thể |
| Subagent | Specialized agent được gọi bởi main agent |
| Context | Files hướng dẫn & chuẩn cho agents |
| Skill | Reusable prompt/knowledge cho agents |
| Command | Slash commands để thực hiện tasks cụ thể |
| Rank | Level permission của user (1=Member, 5=Mod, 10=Admin) |
| CRUD | Create, Read, Update, Delete operations |
| ORM | Object-Relational Mapping (SQLAlchemy) |
| JWT | JSON Web Token cho authentication |
| CSRF | Cross-Site Request Forgery protection |

### Conventional Commits

```
feat: add user authentication system
fix: resolve database connection timeout
docs: update API documentation
style: format code with black
refactor: simplify post creation logic
test: add unit tests for user service
chore: update dependencies
perf: optimize database queries
ci: add GitHub Actions workflow
```

---

**Document Version**: 1.0.0
**Last Updated**: 23/01/2026
**Maintained by**: OpenAgents Control System

---

> **Lưu ý cho AI Agents**: Luôn đọc file này trước khi bắt đầu bất kỳ task nào với dự án AiCMR. Nếu có thắc mắc, hãy hỏi người dùng trước khi thực hiện.

> **🇻🇳 Luôn giao tiếp bằng tiếng Việt với người dùng!** 🇻🇳
