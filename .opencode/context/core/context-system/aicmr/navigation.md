# AiCMR Context Navigation

**Purpose**: Quản lý hệ thống AiCMR (Backend FastAPI, Frontend Next.js, Commander CLI).

---

## Quick Navigation

### Concepts (Core Ideas)
| File | Mô Tả | Priority |
|------|---------|----------|
| [architecture.md](concepts/architecture.md) | Kiến trúc tổng quan (Docker, Nginx, DB) | Critical |
| [authentication.md](concepts/authentication.md) | JWT, Rank, CSRF, Rate Limiting | Critical |
| [upload-overview.md](concepts/upload-overview.md) | Hybrid storage (Public/Private) | Medium |
| [docker-architecture.md](concepts/docker-architecture.md) | Containers & orchestration | High |
| [database-schema.md](concepts/database-schema.md) | MySQL data models & relationships | High |
| [jwt-authentication.md](concepts/jwt-authentication.md) | Token-based stateless auth | Critical |
| [rank-system.md](concepts/rank-system.md) | User permission hierarchy (0-5) | Critical |
| [csrf-protection.md](concepts/csrf-protection.md) | Cross-site request forgery prevention | High |
| [rate-limiting.md](concepts/rate-limiting.md) | API abuse prevention with Redis | High |
| [storage-architecture.md](concepts/storage-architecture.md) | Hybrid file storage system | High |
| [password-complexity.md](concepts/password-complexity.md) | Password security requirements | Medium |
| [monitoring.md](concepts/monitoring.md) | Prometheus metrics & logging | Medium |

### Guides (How-To)
| File | Mô Tả | Priority |
|------|---------|----------|
| [getting-started.md](guides/getting-started.md) | Cài đặt, Docker, .env setup | Critical |
| [backend-development.md](guides/backend-development.md) | Backend conventions, Loguru, Caching | Critical |
| [frontend-development.md](guides/frontend-development.md) | Next.js, shadcn/ui, Zustand | Critical |
| [opencode-cli.md](guides/opencode-cli.md) | Sử dụng Opencode CLI (slash commands) | Medium |
| [api-usage.md](guides/api-usage.md) | REST API integration guide | High |
| [upload-usage.md](guides/upload-usage.md) | Upload, download, delete files | Medium |
| [commander-usage.md](guides/commander-usage.md) | Commander CLI usage guide | Critical |

### Lookup (Quick Reference)
| File | Mô Tả | Priority |
|------|---------|----------|
| [api-reference.md](lookup/api-reference.md) | API endpoints, schemas, rate limits | High |
| [commands.md](lookup/commands.md) | Development commands | Medium |
| [commander-commands.md](lookup/commander-commands.md) | Commander commands + aliases | High |

### Errors
| File | Mô Tả | Priority |
|------|---------|----------|
| [upload-errors.md](errors/upload-errors.md) | Common upload issues | Medium |

---

## Loading Strategy

**Để bắt đầu project:**
1. concepts/getting-started.md
2. concepts/architecture.md
3. guides/getting-started.md

**Để phát triển Backend:**
1. concepts/authentication.md
2. guides/backend-development.md
3. lookup/api-reference.md

**Để phát triển Frontend:**
1. guides/frontend-development.md
2. concepts/authentication.md
3. lookup/api-reference.md

**Để quản lý hệ thống:**
1. guides/commander-usage.md
2. lookup/commander-commands.md
3. ../.opencode/skills/commander-management/SKILL.md

**Để làm việc với Uploads:**
1. concepts/upload-overview.md
2. guides/upload-usage.md
3. errors/upload-errors.md

---

## Last Updated
2026-01-21
