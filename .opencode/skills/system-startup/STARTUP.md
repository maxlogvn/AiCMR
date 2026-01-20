# 🚀 Quick Startup Guide - AiCMR

## ⚡ Khởi động nhanh (mới)

### Cách 1: Khởi động + Health Check
```bash
./start.sh up        # Khởi động containers
./start.sh health    # Health check nhanh (5s)
```

### Cách 2: Kiểm tra status
```bash
./start.sh ps        # Xem trạng thái tất cả containers
```

**💡 Mẹo:** Không cần xem logs sau khi khởi động trừ khi gặp lỗi!

## Khởi động (chi tiết)

### Khởi động tất cả (không build)
```bash
./start.sh
```

### Khởi động + build (nếu có code thay đổi)
```bash
./start.sh up
```

### Dừng tất cả
```bash
./start.sh down
```

### Xem logs

**Logs tất cả:**
```bash
./start.sh logs
```

**Logs 1 service:**
```bash
./start.sh logs backend
./start.sh logs frontend
./start.sh logs db
```

### Status containers

```bash
./start.sh status
# hoặc
./start.sh ps
```

### Access URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost/ |
| **Backend API** | http://localhost/backend/ |
| **API Docs** | http://localhost/backend/docs |
| **phpMyAdmin** | http://localhost/phpmyadmin/ |

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

**Run migrations (alembic):**
```bash
./start.sh migration
```

**Tạo migration file mới:**
```bash
./start.sh migration-create "mô tả thay đổi"
```

### Truy cập cài đặt (Installation)

**Mở trang cài đặt:**
```bash
./start.sh install
```

### Rebuild & Restart

**Rebuild containers:**
```bash
./start.sh rebuild
```

### Restart

**Restart containers (không rebuild):**
```bash
./start.sh restart
```

---

## 📋 Tất cả Commands

| Command | Mô tả |
|---------|---------|
| `./start.sh up` | Khởi động + build |
| `./start.sh down` | Dừng tất cả |
| `./start.sh restart` | Restart containers |
| `./start.sh rebuild` | Rebuild + restart |
| `./start.sh health` | Health check nhanh (5s) |
| `./start.sh health 10` | Health check (10s) |
| `./start.sh ps` | Container status |
| `./start.sh logs` | Logs tất cả (chỉ khi lỗi) |
| `./start.sh logs <service>` | Logs 1 service |
| `./start.sh install` | Mở trang cài đặt |
| `./start.sh shell <service>` | Vào shell service |
| `./start.sh migration` | Run migrations |
| `./start.sh migration-create \"msg\"` | Tạo migration |

---

## 🔧 Troubleshooting

### Container không khởi động

**Kiểm tra status:**
```bash
./start.sh ps
./start.sh health
```

**Nếu có lỗi, kiểm tra logs:**
```bash
./start.sh logs
```

**Xóa toàn bộ containers:**
```bash
docker compose down -v
# Sau đó khởi động lại:
./start.sh up
```

### Database connection error

**Kiểm tra MySQL status:**
```bash
./start.sh ps
./start.sh health
```

**Nếu MySQL không healthy, xem logs:**
```bash
./start.sh logs db
```

### Port conflicts

**Nếu port 80/3306 đã dùng:**
```bash
# Kiểm tra port đang dùng
sudo lsof -i :80
sudo lsof -i :3306

# Dừng service đang dùng port
sudo systemctl stop nginx  # hoặc apache2
```

### Build errors

**Rebuild containers:**
```bash
./start.sh rebuild
```

---

## 📖 Hướng dẫn chi tiết

Xem `docs/01-getting-started.md` để biết chi tiết:
- Cấu hình biến môi trường (`.env`)
- Luồng cài đặt ban đầu
- Database migrations
- Development commands

---

**Created:** 2026-01-20
**Version:** 1.0
