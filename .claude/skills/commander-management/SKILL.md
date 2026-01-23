---
name: commander-management
description: |
  QUẢN LÝ HỆ THỐNG AICMR - PREFER THIS SKILL CHO TẤT CẢ TÁC VỤ HỆ THỐNG
  
  ✅ LUÔN SỬ DỤNG SKILL NÀY KHI:
  - Khởi động/dừng/restart hệ thống
  - Health check, status, diagnostics
  - Xem logs, truy cập shell
  - Database migrations
  
  ❌ KHÔNG TỰ CHỮNG MINH THỰC HIỆN - USE COMMANDER CLI
  
  Keywords: system, server, container, docker, health, status, logs, migrate, shell, database
  
  triggers:
    - "dừng hệ thống"
    - "khởi động hệ thống"
    - "restart server"
    - "health check"
    - "container status"
    - "xem logs"
    - "vào shell"
    - "database migrate"
  
  priority: HIGH
  category: system-management
  required_for:
    - docker operations
    - system monitoring
    - database operations
---

# 🎯 Commander Management Skill

**Skill này giúp AI agents hiểu và sử dụng các lệnh commander để quản lý hệ thống AiCMR.**

⚠️ **Important Note**: File `commander.bat` và `commander.ps1` đã bị xóa. Chỉ còn file `./commander` (bash script) để sử dụng.

---

## 🚨 PRIORITY USAGE GUIDE

**PRIORITY: HIGH - ALWAYS USE THIS SKILL FOR SYSTEM TASKS**

Khi người dùng yêu cầu:
- ✅ "dừng hệ thống", "khởi động", "restart" → LOAD THIS SKILL FIRST
- ✅ "kiểm tra", "health", "status" → LOAD THIS SKILL FIRST  
- ✅ "xem logs", "vào shell" → LOAD THIS SKILL FIRST
- ✅ "migrate", "database" → LOAD THIS SKILL FIRST

**Workflow bắt buộc:**
1. LOAD SKILL: `skill(name="commander-management")`
2. READ SKILL instructions
3. EXECUTE commander command
4. DON'T auto-use docker-compose directly

---

## ⚡ QUICK DECISION TREE

User nói → Action
──────────────────────────────────────────────────────
"dừng hệ thống" → `./commander down`
"khởi động" → `./commander up`
"restart" → `./commander restart`
"health" → `./commander health`
"status" → `./commander status`
"logs" → `./commander logs [service]`
"shell" → `./commander shell <service>`

🚨 Luôn LOAD skill trước khi thực hiện bất kỳ lệnh nào!

---

## 🤖 AGENT INSTRUCTIONS - MANDATORY

### Before ANY action:
1. ✅ CHECK: Có liên quan đến system/server/container?
2. ✅ IF YES: `skill(name="commander-management")`
3. ✅ READ: Xem mapping lệnh → commander command
4. ✅ EXECUTE: Chạy lệnh commander
5. ✅ REPORT: Báo cáo kết quả

### NEVER:
- ❌ DON'T use `docker compose` directly
- ❌ DON'T use `docker ps/logs/exec` directly
- ❌ DON'T auto-infer without loading skill

### Example Conversation:
```
User: "Dừng hệ thống"

Agent (BAD):
→ docker compose down  ❌

Agent (GOOD):
→ skill(name="commander-management")  ✅
→ Read: "dừng hệ thống" → `./commander down`
→ Execute: ./commander down
→ Report: ✅ Containers stopped
```

---

## ❌ ĐỪNG LÀM GÌ - COMMON MISTAKES

### DON'T:
- ❌ `docker compose up` → Dùng `./commander up`
- ❌ `docker compose down` → Dùng `./commander down`
- ❌ `docker ps` → Dùng `./commander status`
- ❌ `docker logs` → Dùng `./commander logs`
- ❌ `docker exec -it` → Dùng `./commander shell`

### DO:
- ✅ Luôn load skill trước
- ✅ Dùng commander CLI cho mọi thao tác
- ✅ Commander tự wrapper docker compose

## 📋 Tóm tắt

Commander là CLI tool để quản lý hệ thống AiCMR, bao gồm:
- ✅ Quản lý containers (up, down, restart, rebuild)
- ✅ Health check và diagnostics
- ✅ Xem logs và truy cập shell
- ✅ Database migrations

## 🎯 Mục tiêu của Skill

Giúp AI agents thực hiện các tác vụ sau:

1. **Khởi động hệ thống**
   - Build và start tất cả containers
   - Auto-check và auto-migration

2. **Dừng hệ thống**
   - Stop tất cả containers

3. **Health check**
   - Kiểm tra nhanh trạng thái hệ thống (5s hoặc 10s)
   - Kiểm tra chi tiết container status

4. **Chẩn đoán vấn đề**
   - Diagnose chi tiết các lỗi hệ thống

5. **Xem logs**
   - Logs tất cả services
   - Logs từng service cụ thể (backend, frontend, db, redis)

6. **Truy cập shell**
   - Vào shell của service (backend, frontend, db, redis)

7. **Database migrations**
   - Chạy migrations
   - Tạo migration mới

## 🚀 Cách sử dụng lệnh commander

### Mapping Lệnh Tự nhiên → Lệnh Commander

| Người dùng nói | Lệnh commander chạy (dùng ./commander) |
|----------------|---------------------|
| "khởi động hệ thống", "bật server", "start" | `./commander up` |
| "dừng hệ thống", "tắt server", "stop" | `./commander down` |
| "kiểm tra health", "health check", "trạng thái" | `./commander health` |
| "xem container status", "container status", "status" | `./commander status` |
| "chẩn đoán", "diagnose", "kiểm tra lỗi" | `./commander diagnose` |
| "xem logs", "logs", "log" | `./commander logs` |
| "xem logs backend", "logs backend" | `./commander logs backend` |
| "vào shell backend", "shell backend" | `./commander shell backend` |
| "vào shell mysql", "shell mysql" | `./commander shell mysql` |
| "xem tất cả lệnh", "help", "tìm hiểu lệnh" | `./commander help` |

## 📋 Chi tiết các lệnh

### 1. Khởi động hệ thống

**Lệnh**: `./commander up`

**Mô tả**:
- Build và start tất cả containers
- Auto-check health
- Auto-migration

**Aliases**: `start`, `up`

**Khi dùng**:
- Người dùng nói: "khởi động hệ thống", "bật server", "start", "bật lên"

**Ví dụ**:
```bash
# Người dùng nói: "Khởi động hệ thống"
./commander up

# Output:
# ✅ Building containers...
# ✅ Starting containers...
# ✅ Health check passed...
# ✅ Migrations completed...
# ✅ System ready!
```

### 2. Dừng hệ thống

**Lệnh**: `./commander down`

**Mô tả**:
- Stop và remove tất cả containers

**Aliases**: `stop`, `down`

**Khi dùng**:
- Người dùng nói: "dừng hệ thống", "tắt server", "stop", "tắt"

**Ví dụ**:
```bash
# Người dùng nói: "Dừng hệ thống"
./commander down

# Output:
# 🛑 Stopping containers...
# 🛑 Containers stopped successfully.
```

### 3. Health check nhanh

**Lệnh**: `./commander health`

**Mô tả**:
- Kiểm tra nhanh trạng thái hệ thống (5s hoặc 10s)
- Check các services có hoạt động không

**Aliases**: `health`, `check-health`

**Khi dùng**:
- Người dùng nói: "kiểm tra health", "health check", "trạng thái nhanh", "check health"

**Ví dụ**:
```bash
# Người dùng nói: "Kiểm tra health"
./commander health

# Output:
# 🏥 System Health Check
# ✅ Backend: Healthy
# ✅ Frontend: Healthy
# ✅ Database: Healthy
# ✅ Redis: Healthy
#
# Overall Status: ✅ All systems operational
```

### 4. Container status

**Lệnh**: `./commander status`

**Mô tả**:
- Chi tiết status của từng container
- CPU, memory usage, uptime

**Aliases**: `status`, `ps`

**Khi dùng**:
- Người dùng nói: "xem container status", "container status", "status", "xem trạng thái"

**Ví dụ**:
```bash
# Người dùng nói: "Xem container status"
./commander status

# Output:
# 📊 Container Status
#
# NAME           STATUS    PORTS                   CPU     MEM
# aicmr-backend  Up 2h     0.0.0.0:8000->8000/tcp   2%     512MB
# aicmr-frontend Up 2h     0.0.0.0:3000->3000/tcp   1%     256MB
# aicmr-db       Up 2h     0.0.0.0:3306->3306/tcp   0.5%   1GB
# aicmr-redis    Up 2h     0.0.0.0:6379->6379/tcp   0.2%   64MB
```

### 5. Chẩn đoán vấn đề

**Lệnh**: `./commander diagnose`

**Mô tả**:
- Chẩn đoán chi tiết các lỗi hệ thống
- Check network, volumes, environment

**Aliases**: `diagnose`, `diag`, `check-error`

**Khi dùng**:
- Người dùng nói: "chẩn đoán", "diagnose", "kiểm tra lỗi", "có lỗi gì", "đi chẩn đoán"

**Ví dụ**:
```bash
# Người dùng nói: "Chẩn đoán hệ thống"
./commander diagnose

# Output:
# 🔍 System Diagnostics
#
# Network: ✅ OK
# Volumes: ✅ OK
# Environment: ✅ OK
# Containers: ✅ OK
#
# No issues found.
```

### 6. Xem logs

**Lệnh**: `./commander logs [service]`

**Mô tả**:
- Logs tất cả services hoặc 1 service cụ thể
- Follow logs theo thời gian thực

**Aliases**: `logs`, `log`

**Khi dùng**:
- Người dùng nói: "xem logs", "logs", "log", "kiểm tra log", "lỗi thì xem log"

**Services có thể xem logs**:
- `backend` - Backend API logs
- `frontend` - Frontend logs
- `mysql` - Database logs
- `redis` - Redis logs
- `nginx` - Nginx proxy logs

**Ví dụ**:
```bash
# Người dùng nói: "Xem logs"
./commander logs

# Người dùng nói: "Xem logs backend"
./commander logs backend

# Output:
# 📋 Logs: backend
#
# [2026-01-21 10:00:00] INFO  Starting server on port 8000...
# [2026-01-21 10:00:01] INFO  Connected to database...
# [2026-01-21 10:00:02] INFO  Server ready!
```

### 7. Truy cập shell

**Lệnh**: `./commander shell <service>`

**Mô tả**:
- Vào shell của service (backend, frontend, db, redis)

**Aliases**: `shell`, `sh`

**Khi dùng**:
- Người dùng nói: "vào shell backend", "shell backend", "vào backend shell", "truy cập shell"
- Người dùng nói: "vào shell mysql", "shell mysql", "vào database shell"

**Services có thể truy cập**:
- `backend` - FastAPI backend container
- `frontend` - Next.js frontend container
- `mysql` - MySQL database container
- `redis` - Redis cache container
- `nginx` - Nginx proxy container

**Ví dụ**:
```bash
# Người dùng nói: "Vào shell backend"
./commander shell backend

# Output:
# 🐚 Entering backend shell...
#
# root@aicmr-backend:/app#

# Người dùng nói: "Vào shell mysql"
./commander shell mysql

# Output:
# 🐚 Entering mysql shell...
#
# root@aicmr-mysql:/app#
```

### 8. Database migrations

Lệnh database migrations hiện chưa có trong commander CLI. Nếu cần chạy migrations, hãy vào shell của backend hoặc database service.

**Aliases**: `migrate`, `migration`

**Khi dùng**:
- Người dùng nói: "chạy migration", "migrate", "chạy db migrate"

**Ví dụ**:
```bash
# Người dùng nói: "Chạy migration"
./commander shell backend
# Trong shell: alembic upgrade head hoặc python manage.py migrate
```

### 9. Tạo migration mới

Lệnh tạo migration hiện chưa có trong commander CLI. Nếu cần tạo migration mới, hãy vào shell của backend service.

**Khi dùng**:
- Người dùng nói: "tạo migration mới", "tạo migrate"

**Ví dụ**:
```bash
# Người dùng nói: "Tạo migration cho messages"
./commander shell backend
# Trong shell: alembic revision --autogenerate -m "messages"
# Hoặc: python manage.py makemigrations messages
```

### 10. Help

**Lệnh**: `./commander help`

**Mô tả**:
- Xem tất cả lệnh có sẵn
- Hiển thị mô tả và usage

**Aliases**: `help`, `--help`, `-h`

**Khi dùng**:
- Người dùng nói: "help", "xem tất cả lệnh", "tìm hiểu lệnh", "có lệnh gì"

**Ví dụ**:
```bash
# Người dùng nói: "Help"
./commander help

# Output:
# 📚 Commander - AiCMR CLI
#
# Usage: ./commander [command]
#
# Serve Commands:
#   up               Khởi động + build
#   down             Dừng tất cả
#   restart          Restart containers
#   rebuild          Rebuild + restart
#
# Server Commands:
#   health           Health check nhanh
#   status           Container status
#   diagnose         Chẩn đoán vấn đề
#
# Logs Commands:
#   logs             Logs tất cả services
#   logs <service>   Logs 1 service
#
# Development Commands:
#   shell <service>  Truy cập shell
#
# Database Commands:
#   (Hiện chưa có trong CLI - dùng shell)
#
# Other Commands:
#   help             Xem tất cả lệnh
```

## 🤖 AI Agent Workflow

Khi người dùng yêu cầu một tác vụ liên quan đến hệ thống, AI agent sẽ:

### Step 1: Hiểu yêu cầu

Phân tích câu của người dùng và map đến lệnh commander phù hợp.

**Ví dụ**:
```
Người dùng: "Khởi động hệ thống"
→ Nhận ra: up
→ Chạy: ./commander up

Người dùng: "Có lỗi gì không?"
→ Nhận ra: diagnose
→ Chạy: ./commander diagnose
```

### Step 2: Chạy lệnh commander

```bash
# Ví dụ: Khởi động hệ thống
./commander up

# Ví dụ: Health check
./commander health

# Ví dụ: Xem logs backend
./commander logs backend
```

### Step 3: Phân tích output

Đọc output từ lệnh commander và đưa ra kết luận cho người dùng.

**Ví dụ output analysis**:
```
✅ "All systems operational" → Hệ thống hoạt động bình thường
❌ "Backend not responding" → Cần check logs backend
⚠️ "Database connection timeout" → Cần check database và connection
```

### Step 4: Đề xuất hành động tiếp theo

Dựa trên kết quả, đề xuất hành động tiếp theo cho người dùng.

**Ví dụ**:
```
✅ Health check passed → Hệ thống OK, không cần làm gì
❌ Backend lỗi → Đề xuất: "Vào shell backend check logs?"
⚠️ Database timeout → Đề xuất: "Check db logs và connection?"
```

## 📋 Quyết định khi nào xem logs

**Chỉ xem logs khi**:
- ❌ Hệ thống báo lỗi
- ❌ Health check thất bại
- ❌ Container status abnormal
- ❌ Người dùng yêu cầu kiểm tra lỗi

**KHÔNG xem logs khi**:
- ✅ Hệ thống hoạt động bình thường
- ✅ Health check passed
- ✅ Status tất cả containers OK

## 🔍 Troubleshooting

### Lỗi: Lệnh commander không tìm thấy

**Nguyên nhân**:
- File `commander` không tồn tại
- File không có execute permission

**Giải pháp**:
```bash
# Kiểm tra file tồn tại
ls -l commander

# Thêm execute permission nếu cần
chmod +x commander
```

### Lỗi: Containers không start

**Giải pháp**:
```bash
# Diagnose
./commander diagnose

# Xem logs
./commander logs <service>

# Rebuild
./commander rebuild
```

### Lỗi: Health check thất bại

**Giải pháp**:
```bash
# Check status
./commander status

# Diagnose
./commander diagnose

# Xem logs service lỗi
./commander logs <service>
```

### Lỗi: Migration fail

**Giải pháp**:
```bash
# Xem logs database
./commander logs mysql

# Vào shell backend
./commander shell backend

# Kiểm tra migrations
# Thử migrate lại trong shell
# alembic upgrade head
```

## 📝 Best Practices

### Dành cho AI Agents

1. **Luôn hiểu đúng yêu cầu của người dùng**
   - Phân tích ngữ cảnh câu
   - Map đúng lệnh commander
   - Nếu không chắc, hỏi lại người dùng

2. **Chạy lệnh từng bước**
   - Không chạy nhiều lệnh cùng lúc
   - Đợi kết quả từng lệnh
   - Phân tích output trước khi tiếp tục

3. **Chỉ xem logs khi cần thiết**
   - Không auto-view logs khi không có lỗi
   - Chỉ xem logs khi hệ thống báo lỗi
   - Focus vào service có lỗi

4. **Luôn báo cáo kết quả**
   - Tóm tắt ngắn gọn
   - Đưa ra hành động đề xuất
   - Không output quá dài

5. **Sử dụng đúng alias**
    - Nếu người dùng nói "stop", dùng `./commander down`
    - Nếu người dùng nói "status", dùng `./commander status`
    - Lưu ý các alias của từng lệnh

### Dành cho Developers

1. **Backup trước khi rebuild**
    ```bash
    # Backup database
    ./commander shell mysql
    # Trong shell: mysqldump...

    # Rebuild
    ./commander rebuild
    ```

2. **Kiểm tra health sau khi change**
    ```bash
    # Sau khi change config
    ./commander rebuild
    ./commander health
    ./commander status
    ```

3. **Logs chỉ khi lỗi**
   ```bash
   # Không auto-view logs
   # Chỉ khi có lỗi
   ./commander logs backend  # Chỉ khi backend lỗi
   ```

4. **Use shell cho debugging**
   ```bash
   # Vào shell để debug
   ./commander shell backend
   # Trong shell: ls, cat, ps, netstat...
   ```

## 🎯 Ví dụ thực tế

### Ví dụ 1: Khởi động hệ thống mới

```
Người dùng: "Khởi động hệ thống"

AI Agent:
→ Phân tích: up
→ Chạy: ./commander up
→ Output: ✅ System ready!
→ Báo cáo: "✅ Hệ thống đã khởi động thành công!"
```

### Ví dụ 2: Kiểm tra lỗi

```
Người dùng: "Hệ thống có lỗi không?"

AI Agent:
→ Phân tích: diagnose
→ Chạy: ./commander diagnose
→ Output: ✅ No issues found
→ Báo cáo: "✅ Hệ thống hoạt động bình thường, không có lỗi!"
```

### Ví dụ 3: Backend lỗi

```
Người dùng: "Backend không hoạt động"

AI Agent:
→ Phân tích: status để check
→ Chạy: ./commander status
→ Output: aicmr-backend Down
→ Báo cáo: "❌ Backend đang Down. Để tôi kiểm tra logs..."
→ Chạy: ./commander logs backend
→ Output: [ERROR] Database connection failed
→ Báo cáo: "❌ Backend lỗi do không kết nối được database. Đề xuất: check database status?"
```

### Ví dụ 4: Xem logs backend

```
Người dùng: "Xem logs backend"

AI Agent:
→ Phân tích: logs backend
→ Chạy: ./commander logs backend
→ Output: 50 dòng logs gần nhất
→ Báo cáo: "📋 Logs backend (50 dòng gần nhất): [show logs]"
```

## 📚 Tài liệu liên quan

- **CLI Configuration**: `cli-configuration-skill` - Cấu hình CLI
- **Task Management**: `task-management` - Quản lý task
- **Full Documentation**: `scripts/README.md` - Reference đầy đủ

## 🔗 Architecture

```
Data Flow:

User Request
    ↓
AI Agent (Skill)
    ↓
Parse & Map to Commander Command
    ↓
Execute ./commander <command>
    ↓
Analyze Output
    ↓
Report & Recommend Next Action
```

Key Components:
1. **User Input** - Yêu cầu tự nhiên tiếng Việt
2. **AI Agent** - Phân tích và map lệnh
3. **Commander** - Execute lệnh CLI
4. **Output Analysis** - Phân tích kết quả
5. **Report** - Báo cáo và đề xuất

---

**Version**: 1.0 (Commander Management Skill for AI)
**Updated**: 2026-01-21
