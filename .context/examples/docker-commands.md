# Docker Commands Examples

Các lệnh Docker cụ thể cho các tác vụ phổ biến.

## Setup Mới

```bash
# Clone repository
cd /home/theanhdev/code/AiCmr

# Start tất cả services
docker compose up -d

# Kiểm tra status
docker compose ps

# Xem logs
docker compose logs -f
```

## Backend Tasks

```bash
# Cài đặt package mới
docker compose exec backend pip install -r requirements.txt

# Format code
docker compose exec backend black app

# Lint code
docker compose exec backend ruff check app

# Run all tests
docker compose exec backend pytest

# Run specific test file
docker compose exec backend pytest tests/test_main.py

# Run specific test case
docker compose exec backend pytest tests/test_main.py::test_read_main

# Verbose mode
docker compose exec backend pytest -v

# Show output
docker compose exec backend pytest -s

# Coverage report
docker compose exec backend pytest --cov=app --cov-report=html
```

## Database Migrations

```bash
# Tạo migration mới
docker compose exec backend alembic revision --autogenerate -m "add_user_settings"

# Áp dụng migrations
docker compose exec backend alembic upgrade head

# Rollback 1 migration
docker compose exec backend alembic downgrade -1

# Kiểm tra current version
docker compose exec backend alembic current
```

## Frontend Tasks

```bash
# Cài đặt package mới
docker compose exec frontend npm install

# Lint code
docker compose exec frontend npm run lint

# Build (BẮT BUỘC trước khi commit)
docker compose exec frontend npm run build

# Thêm shadcn component
docker compose exec frontend npx shadcn@latest add button
docker compose exec frontend npx shadcn@latest add card
```

## Troubleshooting

```bash
# Restart backend
docker compose restart backend

# Restart frontend
docker compose restart frontend

# Restart database
docker compose restart db

# Restart Redis
docker compose restart redis

# Clean rebuild (xóa images và rebuild)
docker compose up -d --build

# Xem logs realtime
docker compose logs -f backend
docker compose logs -f frontend
```

## Test Accounts (Password: `User@123456`)
- Admin: `admin_test@aicmr.com`
- Mod: `mod@aicmr.com`
- Member: `member@aicmr.com`
- Guest: `guest@aicmr.com`

Tham khảo: `lookup/test-accounts.md`, `errors/common-errors.md`
