# 🚀 System Startup Skill - Tối ưu hóa Hiệu năng

## 📝 Tổng quan các thay đổi

**Mục tiêu:** Tối ưu hiệu năng startup, giảm thời gian chờ logs không cần thiết

### ✅ Các cải tiến

1. **Loại bỏ bước logs mặc định**
   - Trước đây: Luôn chạy `./start.sh logs` sau khi khởi động
   - Hiện tại: Chỉ chạy logs khi gặp lỗi

2. **Thêm Health Check nhanh**
   ```bash
   ./start.sh health      # Health check trong 5s
   ./start.sh health 10   # Health check trong 10s
   ```

3. **Cải thiện thông báo**
   - Thông báo lỗi chi tiết hơn
   - Gợi ý hành động phù hợp
   - Phân biệt rõ giữa startup bình thường và troubleshooting

4. **Cập nhật workflow cho agents**
   - Không còn tự động xem logs
   - Chỉ logs khi có lỗi hoặc user yêu cầu

---

## 🚀 Cách sử dụng tối ưu

### Khởi động nhanh (không logs)

```bash
# Khởi động + build
./start.sh up

# Health check nhanh (thay vì logs)
./start.sh health

# Xem status chi tiết
./start.sh ps
```

**Kết quả:** Startup nhanh hơn ~10-20s vì không phải chờ logs

### Chỉ khi gặp lỗi

```bash
# Xem logs tất cả
./start.sh logs

# Xem logs 1 service
./start.sh logs backend
./start.sh logs db
```

---

## 📊 So sánh hiệu năng

| Phương pháp | Thời gian | Khi nào dùng |
|------------|-----------|--------------|
| **Mới:** up + health | ~30-40s | Mọi lần startup |
| **Cũ:** up + logs | ~40-60s | Luôn luôn |
| **Troubleshoot:** up + logs | ~40-60s | Chỉ khi lỗi |

**Tiết kiệm:** ~10-20s mỗi lần khởi động

---

## 🔄 Workflow mới cho Agents

### Startup bình thường

```bash
1. ./start.sh up
2. ./start.sh health
3. ./start.sh ps
4. Báo cáo kết quả
```

**KHÔNG** chạy logs trừ khi có lỗi!

### Troubleshooting

```bash
1. ./start.sh ps
2. ./start.sh logs
3. Xác định lỗi
4. Fix và reboot
```

---

## 📝 Command Reference

### Startup/Shutdown
```bash
./start.sh up        # Khởi động + build
./start.sh down      # Dừng tất cả
./start.sh restart   # Restart containers
./start.sh rebuild   # Rebuild + restart
```

### Health & Status
```bash
./start.sh health      # Health check 5s
./start.sh health 10   # Health check 10s
./start.sh ps          # Container status
```

### Logs (chỉ khi lỗi)
```bash
./start.sh logs              # Logs tất cả
./start.sh logs backend      # Logs backend
./start.sh logs db           # Logs MySQL
./start.sh logs frontend     # Logs frontend
```

### Development
```bash
./start.sh shell backend     # Shell backend
./start.sh shell frontend    # Shell frontend
./start.sh shell db          # Shell MySQL
./start.sh shell redis       # Shell Redis
```

### Database
```bash
./start.sh migration              # Run migrations
./start.sh migration-create "msg" # Tạo migration
```

### Access
```bash
./start.sh install    # Mở trang cài đặt
./start.sh help       # Xem tất cả lệnh
```

---

## 💡 Mẹo sử dụng

### 1. Startup nhanh nhất
```bash
./start.sh up && ./start.sh health
```

### 2. Kiểm tra nhanh
```bash
./start.sh ps | grep Up
```

### 3. Debug một service
```bash
./start.sh logs -f backend  # -f = follow
```

### 4. Alias cho productivity
```bash
# Thêm vào ~/.bashrc
alias aicmr-up='cd ~/code/AiCmr && ./start.sh up && ./start.sh health'
alias aicmr-down='cd ~/code/AiCmr && ./start.sh down'
alias aicmr-ps='cd ~/code/AiCmr && ./start.sh ps'
alias aicmr-logs='cd ~/code/AiCmr && ./start.sh logs'
alias aicmr-shell='cd ~/code/AiCmr && ./start.sh shell backend'
```

---

## 🎯 Quy tắc vàng

1. **KHÔNG** chạy logs sau khi khởi động bình thường
2. **DÙNG** health check để verify nhanh
3. **CHỈ** logs khi có lỗi hoặc troubleshooting
4. **LUÔN** dùng ps để xem status tổng quan

---

## 📈 Kết quả đo lường

### Trước tối ưu
- Mỗi lần startup: ~40-60s
- Luôn phải đợi logs
- Phải scan logs để tìm lỗi

### Sau tối ưu
- Mỗi lần startup: ~30-40s
- Health check 5s trả kết quả
- Status hiển thị rõ ràng

**Cải thiện:** ~25% thời gian startup

---

## 🔍 Troubleshooting

### Health check fail?
```bash
# Kiểm tra chi tiết
./start.sh ps

# Xem logs để debug
./start.sh logs
```

### Container không healthy?
```bash
# Restart thử
./start.sh restart

# Nếu vẫn lỗi, rebuild
./start.sh rebuild
```

### Port conflicts?
```bash
# Check port
sudo lsof -i :80
sudo lsof -i :3306

# Stop service xung đột
sudo systemctl stop nginx
```

---

## 📚 Tài liệu liên quan

- **[SKILL.md](SKILL.md)** - Skill documentation chính
- **[STARTUP.md](STARTUP.md)** - Hướng dẫn startup chi tiết
- **[start.sh](start.sh)** - Script khởi động

---

**Version:** 2.0 (Tối ưu hiệu năng)
**Updated:** 2026-01-20
**Author:** Development Team
