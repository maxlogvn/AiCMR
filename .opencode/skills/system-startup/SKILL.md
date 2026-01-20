---
name: system-startup
description: "AiCMR System Startup - Quick commands for starting containers, checking logs, and managing the development environment"
---

# 🚀 AiCMR System Startup

## What I do

I guide agents on how to start, stop, monitor, and troubleshoot the AiCMR system. I provide quick access to:

- **Container management** - Start, stop, restart, rebuild containers
- **Log viewing** - View logs for specific services or all services
- **Status checking** - Check if containers are running
- **Shell access** - Open interactive shell in backend, frontend, database, or Redis
- **Database migrations** - Run or create Alembic migrations
- **Installation access** - Open the initial setup page
- **Troubleshooting** - Quick fixes for common issues

## When to Use

Use this skill when:
- User says "khởi động hệ thống", "start system", "chạy dự án"
- User asks to check logs, status, or troubleshoot containers
- User needs to restart or rebuild containers
- User wants to run database migrations
- User needs to access container shells for debugging

## Prerequisites

- Docker and Docker Compose must be installed
- `.env` file must exist in project root
- Containers must be created with `docker compose up` first time

---

## Quick Commands

### Startup (Khởi động)

**Khởi động tất cả containers (không rebuild):**
```bash
start.sh
```

**Khởi động + rebuild (nếu có code thay đổi):**
```bash
start.sh up
```

### Shutdown (Dừng)

**Dừng tất cả containers:**
```bash
start.sh down
```

### Health & Status (Ưu tiên dùng)

**Health check nhanh (5s):**
```bash
./start.sh health
```

**Health check tùy chỉnh:**
```bash
./start.sh health 10  # 10 giây
```

**Kiểm tra container status:**
```bash
./start.sh ps
```

### Logs (Chỉ khi có lỗi)

**Xem logs tất cả:**
```bash
./start.sh logs
```

**Xem logs 1 service:**
```bash
./start.sh logs backend
./start.sh logs frontend
./start.sh logs db
```

### Container Management

**Restart containers:**
```bash
./start.sh restart
```

**Rebuild & restart:**
```bash
./start.sh rebuild
```

### Development Tools

**Vào shell backend:**
```bash
./start.sh shell backend
```

**Vào shell frontend:**
```bash
./start.sh shell frontend
```

**Vào shell MySQL:**
```bash
./start.sh shell db
```

**Vào shell Redis:**
```bash
./start.sh shell redis
```

### Database Migrations

**Run migrations (Alembic):**
```bash
./start.sh migration
```

**Tạo migration file mới:**
```bash
./start.sh migration-create "Mô tả thay đổi"
```

### Access

**Mở trang cài đặt (Installation):**
```bash
./start.sh install
```

---

## Access URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost/ |
| **Backend API** | http://localhost/backend/ |
| **API Docs** | http://localhost/backend/docs |
| **phpMyAdmin** | http://localhost/phpmyadmin/ |
| **Installation** | http://localhost/install |

---

## Startup Flow

### Lần đầu tiên (Initial Setup)

1. **Kiểm tra .env**
   ```bash
   # File .env phải tồn tại
   ls -la .env
   ```

2. **Khởi động containers**
   ```bash
   ./start.sh up
   # Chờ thông báo thành công (khoảng 30-60s)
   ```

3. **Truy cập cài đặt**
   ```bash
   ./start.sh install
   # Hoặc mở http://localhost/install
   ```

4. **Hoàn tất setup**
   - Nhập `INSTALL_SECRET` từ .env
   - Tạo tài khoản Admin (Rank 5)
   - Cấu hình thông tin site

5. **(Chỉ khi gặp lỗi) Kiểm tra logs**
   ```bash
   ./start.sh logs
   ```

### Khôi phục (Recovery)

**Nếu có lỗi hoặc container không khởi động:**
1. Kiểm tra status: `./start.sh ps`
2. Nếu cần: `./start.sh down` rồi `./start.sh up`
3. (Nếu vẫn lỗi) Kiểm tra logs: `./start.sh logs`

**Nếu database có vấn đề:**
1. Rebuild: `./start.sh rebuild`
2. Check MySQL logs: `./start.sh logs db`

---

## Troubleshooting

### Container không khởi động

**Kiểm tra logs:**
```bash
./start.sh logs
```

**Xóa volumes và rebuild:**
```bash
./start.sh down
docker compose down -v  # Xóa volumes
./start.sh up
```

### Port conflicts

**Kiểm tra port đang dùng:**
```bash
sudo lsof -i :80
sudo lsof -i :3306
```

**Dừng service đang dùng:**
```bash
sudo systemctl stop nginx  # hoặc apache2
```

### Database connection errors

**Kiểm tra MySQL status:**
```bash
./start.sh ps
```

**Xem MySQL logs:**
```bash
./start.sh logs db
```

**Rebuild containers:**
```bash
./start.sh rebuild
```

### Build errors

**Xóa cache và rebuild:**
```bash
./start.sh down
docker compose build --no-cache
docker compose up -d
```

---

## File Structure

```
AiCMR/
├── start.sh                 # 🚀 Quick startup script
├── STARTUP.md              # 📖 Startup guide
├── README.md               # 📋 Project documentation
├── docker-compose.yml       # 🐳 Docker services
└── .opencode/
    └── skills/
        └── system-startup/  # 🚀 This skill
            └── SKILL.md
```

---

## Important Notes

### Environment Variables

File `.env` cần có các biến:
- `SECRET_KEY` (≥ 32 ký tự trong production)
- `DEBUG=true/false`
- `INSTALL_SECRET` (cho cài đặt lần đầu)
- `DATABASE_URL`
- `REDIS_URL`

### Service Dependencies

Containers khởi động theo thứ tự:
1. MySQL (database)
2. Redis (cache)
3. Backend (FastAPI)
4. Frontend (Next.js)
5. Nginx (reverse proxy)

### First-time Installation

Sau khi khởi động lần đầu:
1. Truy cập `http://localhost/install`
2. Nhập `INSTALL_SECRET`
3. Tạo Admin account
4. Endpoint `/install/setup` sẽ tự động khóa

---

## Quick Reference

### Khởi động nhanh (Tối ưu)

```bash
# Mẹo: alias trong ~/.bashrc
alias aicmr-up='cd ~/code/AiCmr && ./start.sh up && ./start.sh health'
alias aicmr-down='cd ~/code/AiCmr && ./start.sh down'
alias aicmr-ps='cd ~/code/AiCmr && ./start.sh ps'
alias aicmr-logs='cd ~/code/AiCmr && ./start.sh logs'
alias aicmr-shell='cd ~/code/AiCmr && ./start.sh shell backend'
```

### Kiểm tra nhanh

```bash
# Health check (5s)
./start.sh health

# Container status
./start.sh ps

# Filter only running containers
docker ps | grep aicmr
```

### Cleanup

```bash
# Dừng + xóa volumes
./start.sh down
docker compose down -v

# Prune unused images
docker system prune -a
```

---

## Example Usage

**Agent Workflow:**

User: "Khởi động hệ thống"

Agent:
1. Check if `.env` exists
2. Run: `./start.sh up`
3. Verify status: `./start.sh ps`
4. Report: "✅ Đã khởi động thành công! Truy cập http://localhost/"
   - **Chỉ khi có lỗi mới chạy logs để debug**

User: "Tôi muốn xem logs của backend"

Agent:
```bash
./start.sh logs backend
```

User: "Cần rebuild containers vì có code thay đổi"

Agent:
```bash
./start.sh rebuild
```

User: "Chạy migration cho database"

Agent:
```bash
./start.sh migration
```

---

## 💡 Performance Tips

### Quy tắc hiệu quả

1. **Health Check优先**
   - Dùng `./start.sh health` thay vì `./start.sh logs`
   - Kết quả trong 5s vs logs mất 10-20s

2. **Chỉ logs khi lỗi**
   - Startup bình thường: KHÔNG cần logs
   - Có lỗi: Mới chạy logs để debug

3. **Sử dụng ps cho overview**
   - `./start.sh ps` xem tất cả status
   - Rõ ràng hơn logs

### Workflow tối ưu

**Startup:**
```bash
./start.sh up && ./start.sh health
```

**Verify:**
```bash
./start.sh ps
```

**Troubleshoot (chỉ khi cần):**
```bash
./start.sh logs
```

### Tiết kiệm thời gian

| Tác vụ | Cách cũ | Cách mới | Tiết kiệm |
|--------|---------|----------|-----------|
| Startup + verify | up + logs | up + health | ~10-20s |
| Check status | logs | ps/health | ~5-10s |
| Troubleshoot | logs (quét tay) | logs (có hướng dẫn) | N/A |

---

## Related Documentation

- **[STARTUP.md](STARTUP.md)** - Detailed startup guide
- **[README.md](README.md)** - Project documentation
- **[docs/01-getting-started.md](../../docs/01-getting-started.md)** - Getting started guide

---

**System Startup Skill** - Guide agents to manage AiCMR containers efficiently!
