# Docker Workflow

Môi trường AiCMR chạy trong Docker Compose. Tất cả lệnh thực thi từ thư mục gốc.

## Backend (FastAPI)

**Cài đặt**:
```bash
docker compose exec backend pip install -r requirements.txt
```

**Code Quality**:
```bash
docker compose exec backend black app          # Format code
docker compose exec backend ruff check app      # Lint
```

**Tests**:
```bash
docker compose exec backend pytest                          # Tất cả
docker compose exec backend pytest tests/test_main.py      # Theo file
docker compose exec backend pytest -v                      # Verbose
docker compose exec backend pytest -s                      # Show logs
docker compose exec backend pytest --cov=app --cov-report=html  # Coverage
```

**Database Migrations**:
```bash
docker compose exec backend alembic revision --autogenerate -m "description"  # Tạo
docker compose exec backend alembic upgrade head                              # Áp dụng
docker compose exec backend alembic downgrade -1                              # Rollback
```

## Frontend (Next.js)

**Cài đặt**:
```bash
docker compose exec frontend npm install
```

**Code Quality**:
```bash
docker compose exec frontend npm run lint
docker compose exec frontend npm run build      # BẮT BUỘC trước khi commit
```

**Components**:
```bash
docker compose exec frontend npx shadcn@latest add [component]
```

## Container Management

```bash
docker compose ps                          # Status
docker compose logs -f backend             # Logs backend
docker compose logs -f frontend            # Logs frontend
docker compose restart backend             # Restart
docker compose restart frontend
docker compose up -d --build               # Clean rebuild
```

## Lưu ý
- Chạy từ thư mục gốc `/home/theanhdev/code/AiCmr/`
- Đảm bảo services `db` và `redis` healthy trước khi chạy tests
- Tham khảo: `lookup/commands-quickref.md`
