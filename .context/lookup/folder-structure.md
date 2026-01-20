# Folder Structure - Quick Reference

Cấu trúc thư mục quan trọng của dự án.

## Backend Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/                 # API Routes (versioned)
│   │       ├── auth.py         # Authentication endpoints
│   │       ├── users.py        # User endpoints
│   │       ├── uploads.py      # File upload endpoints
│   │       ├── install.py      # Installation endpoints
│   │       ├── settings_dashboard.py  # Settings endpoints
│   │       └── stats.py        # Statistics endpoints
│   ├── core/
│   │   ├── config.py           # Configuration & settings
│   │   ├── database.py         # Database connection & session
│   │   ├── security.py         # JWT, password hashing, CSRF
│   │   ├── exceptions.py       # Custom exceptions
│   │   ├── rate_limit.py       # Rate limiting logic
│   │   └── constants.py        # Constants
│   ├── crud/                   # Database operations
│   │   ├── crud_user.py        # User CRUD
│   │   ├── crud_attachment.py  # Attachment CRUD
│   │   └── crud_settings.py    # Settings CRUD
│   ├── models/                 # SQLAlchemy models
│   │   ├── base.py             # Base model
│   │   ├── user.py             # User model
│   │   ├── refresh_token.py    # Refresh token model
│   │   ├── settings.py         # Settings model
│   │   └── attachment.py       # Attachment model
│   ├── schemas/                # Pydantic schemas
│   │   ├── user.py             # User schemas
│   │   ├── token.py            # Token schemas
│   │   ├── settings.py         # Settings schemas
│   │   ├── settings_dashboard.py
│   │   └── attachment.py       # Attachment schemas
│   ├── main.py                 # FastAPI app entry point
│   └── __init__.py
├── tests/                      # Tests
│   ├── __init__.py
│   └── test_main.py
├── scripts/                    # Utility scripts
│   ├── create_test_accounts.py
│   └── reset_database.py
├── alembic/                    # Database migrations
├── requirements.txt
├── pytest.ini
├── Dockerfile
└── openapi_test.json
```

## Frontend Structure

```
frontend/
└── src/
    ├── app/                    # Next.js App Router
    │   ├── (auth)/             # Auth group layout
    │   ├── (dashboard)/        # Dashboard group layout
    │   ├── page.tsx            # Home page
    │   ├── layout.tsx          # Root layout
    │   └── globals.css
    ├── components/             # Reusable components
    │   ├── ui/                 # shadcn/ui components
    │   ├── layout/             # Layout components (Header, Sidebar...)
    │   └── features/           # Feature-specific components
    ├── hooks/                  # Custom hooks
    │   ├── useAuth.ts          # Authentication hook
    │   ├── useToast.ts         # Toast notifications
    │   └── api/                # API hooks (useUsers, useSettings...)
    ├── lib/                    # Utilities & API clients
    │   ├── api/                # API client functions
    │   ├── utils.ts            # Utility functions
    │   └── constants.ts        # App constants
    ├── types/                  # TypeScript types
    │   ├── user.ts
    │   ├── settings.ts
    │   └── index.ts
    ├── store/                  # Zustand stores
    │   ├── authStore.ts
    │   └── uiStore.ts
    └── styles/
```

## Tham Chiếu
- Architecture: `concepts/architecture.md`
- Code style backend: `concepts/code-style.md`
- Code style frontend: `concepts/code-style-frontend.md`
