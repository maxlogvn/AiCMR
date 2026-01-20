# AGENTS.md - Hướng dẫn cho AI Coding Agents

Quản trọng và best practices để AI Agents làm việc hiệu quả trong dự án AiCMR.

## 🎯 Quản Trọng AI Agents

1. **Truy cập Context**: Luôn đọc `.context/` trước khi code
2. **Quy chuẩn Code**: Tuân theo Python/TypeScript standards
3. **Docker Only**: Tất cả lệnh phải chạy qua Docker Compose
4. **Approval Gates**: Luôn yêu cầu phê duyệt trước khi xóa/deploy

---

## 🛠 Quick Commands Reference

### Backend (FastAPI)
```bash
# Cài đặt thư viện
docker compose exec backend pip install -r requirements.txt

# Formatting
docker compose exec backend black app

# Lint
docker compose exec backend ruff check app

# Tests
docker compose exec backend pytest

# Migrations
docker compose exec backend alembic upgrade head
```

### Frontend (Next.js)
```bash
# Cài đặt thư viện
docker compose exec frontend npm install

# Lint
docker compose exec frontend npm run lint

# Build (BẮT BUỘC trước khi commit)
docker compose exec frontend npm run build

# Thêm shadcn component
docker compose exec frontend npx shadcn@latest add [component]
```

### Docker Management
```bash
# Status
docker compose ps

# Logs
docker compose logs -f [backend|frontend]

# Restart
docker compose restart [backend|frontend|db|redis]

# Clean rebuild
docker compose up -d --build
```

---

## 📐 Code Style Quick Ref

**Backend (Python)**:
- Class: `PascalCase`
- Function/Variable: `snake_case`
- API Endpoint: `kebab-case`
- Type hints: BẮT BUỘC
- Async cho I/O

**Frontend (TypeScript)**:
- Component File: `PascalCase.tsx`
- Hook/Util: `camelCase.ts`
- Props: `NameProps`
- Server Components mặc định
- `"use client"` khi cần state/hooks

---

## 🔐 Security Rules

1. **Secrets**: KHÔNG commit `.env` hoặc hardcode
2. **Rank System**: Check quyền (0: Guest → 5: Admin)
3. **CSRF**: POST/PUT/PATCH/DELETE cần `X-CSRF-Token`
4. **Storage**: Ưu tiên `is_public=true` (SEO) - Chỉ `is_public=false` cho dữ liệu nhạy cảm

---

## 👤 Test Accounts (Password: `User@123456`)

- Admin: `admin_test@aicmr.com` (Rank 5)
- Mod: `mod@aicmr.com` (Rank 3)
- Member: `member@aicmr.com` (Rank 1)
- Guest: `guest@aicmr.com` (Rank 0)

---

## 📚 Context Access

Để hiểu sâu:
- Docker workflow: `.context/concepts/docker-workflow.md`
- Code style: `.context/concepts/code-style.md` & `.context/concepts/code-style-frontend.md`
- Security: `.context/concepts/security.md` & `.context/concepts/authentication-system.md`
- Troubleshooting: `.context/errors/common-errors.md`

Full context: [/.context/](./.context/)

---

## ⚠️ Common Issues

- **401**: Refresh token tự động
- **403**: Check CSRF token hoặc Rank
- **Tests**: Đảm bảo `db` và `redis` healthy
- **DB connection**: `docker compose restart db`
- **Redis connection**: `docker compose restart redis`

---

*Chi tiết: [.context/](./.context/) - 25 files chi tiết*
