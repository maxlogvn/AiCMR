# Docker Controller Skill - AiCMR

**Version:** 3.0 (Platform-Agnostic)
**Purpose:** Hướng dẫn AI agents quản lý hệ thống AiCMR thông qua commander CLI một cách hiệu quả và tối ưu.

---

## 🎯 Mission Statement

**Skill này là GATEKEEPER cho mọi tác vụ hệ thống.**

⚠️ **RULE THỨ NHẤT:** KHI NGƯỜI DÙNG YÊU CẦU BẤT CỨ TÁC VỤ HỆ THỐNG → LOAD SKILL NÀY TRƯỚC → EXECUTE COMMANDER → KHÔNG TỰ SỬA DỤNG DOCKER COMPOSE TRỰC TIẾP

---

## 🚨 Why This Skill Exists

### Problem
AI agents thường:
- ❌ Sử dụng `docker compose` trực tiếp → KHÔNG ĐÚNG
- ❌ Ghi nhớ các lệnh docker phức tạp → KHÓ MAINTAIN
- ❌ Không biết commander có lệnh gì → INEFFICIENT
- ❌ Không biết troubleshooting workflow → GÂY LỖI NẶNG NỀ

### Solution
Skill này cung cấp:
- ✅ **Standardized workflow** cho mọi system tasks
- ✅ **Command reference** đầy đủ với examples
- ✅ **Decision trees** rõ ràng
- ✅ **Troubleshooting guides** chi tiết
- ✅ **Best practices** đã proven
- ✅ **Platform-agnostic** configuration

---

## 📋 Table of Contents

1. [Quick Decision Tree](#quick-decision-tree)
2. [Command Reference](#command-reference)
3. [Standard Workflow](#standard-workflow)
4. [Advanced Scenarios](#advanced-scenarios)
5. [Troubleshooting Guide](#troubleshooting-guide)
6. [Emergency Procedures](#emergency-procedures)
7. [Best Practices](#best-practices)
8. [Checklist](#checklist)

---

## 🌳 Quick Decision Tree

```
User Request
    │
    ├─ Is it about containers/system?
    │   ├─ YES → Load this skill
    │   │        ↓
    │   │   What does user want?
    │   │   │
    │   │   ├─ Start/launch system?
    │   │   │   └─ → ./commander up
    │   │   │
    │   │   ├─ Stop system?
    │   │   │   └─ → ./commander down
    │   │   │
    │   │   ├─ Restart system?
    │   │   │   └─ → ./commander restart
    │   │   │
    │   │   ├─ Rebuild after code changes?
    │   │   │   └─ → ./commander rebuild
    │   │   │
    │   │   ├─ Check health?
    │   │   │   ├─ Quick check? → ./commander health
    │   │   │   └─ Detailed? → ./commander status
    │   │   │
    │   │   ├─ Diagnose problems?
    │   │   │   └─ → ./commander diagnose
    │   │   │
    │   │   ├─ View logs?
    │   │   │   ├─ All services? → ./commander logs
    │   │   │   └─ Specific? → ./commander logs [service]
    │   │   │
    │   │   ├─ Access shell?
    │   │   │   └─ → ./commander shell [service]
    │   │   │
    │   │   └─ Not sure?
    │   │       └─ → ./commander help
    │   │
    │   └─ NO → Use other appropriate skill
    │
    └─ Execute commander
        ↓
    Analyze output
        ↓
    Report results
        ↓
    Suggest next action (if needed)
```

---

## 📚 Command Reference

### Category 1: Lifecycle Commands

| Command | Aliases | Description | When to Use |
|---------|---------|-------------|-------------|
| `up` | start, launch | Build & start all containers | "khởi động", "bật server", "start" |
| `down` | stop, shutdown | Stop & remove all containers | "dừng hệ thống", "tắt", "stop" |
| `restart` | - | Restart all containers | "restart", "khởi động lại" |
| `rebuild` | - | Rebuild & restart all containers | "rebuild", "build lại", "sau khi sửa code" |

**Quick Examples:**
```bash
./commander up       # Build + start
./commander down     # Stop + remove
./commander rebuild  # Rebuild + restart
```

### Category 2: Status & Health Commands

| Command | Aliases | Description | Output |
|---------|---------|-------------|--------|
| `health` | check, quick-check | Quick health check (5s) | ✅/❌ per service |
| `status` | ps, list | Detailed container status | CPU, MEM, Uptime |
| `diagnose` | diag, check-error | Full system diagnostics | Network, volumes, env |
| `version` | - | Show CLI version info | Platform, Docker info |

**Quick Examples:**
```bash
./commander health    # Quick check
./commander status    # Detailed status
./commander diagnose  # Full diagnostics
```

### Category 3: Logs Commands

| Command | Description | Output |
|---------|-------------|--------|
| `logs` | Logs all services | All service logs |
| `logs <service>` | Logs specific service | Single service logs |

**Available Services:**
- `backend` - FastAPI backend
- `frontend` - Next.js frontend
- `mysql` - MySQL database
- `redis` - Redis cache
- `nginx` - Reverse proxy
- `phpmyadmin` - phpMyAdmin

**Quick Examples:**
```bash
./commander logs              # All logs
./commander logs backend      # Backend logs only
./commander logs mysql        # Database logs only
```

### Category 4: Access Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `shell <service>` | Open shell in service | Debugging, manual commands |

**Available Services:** backend, frontend, mysql, redis, nginx

**Quick Examples:**
```bash
./commander shell backend     # Backend shell (Python)
./commander shell mysql       # Database shell (MySQL)
./commander shell frontend    # Frontend shell (Node.js)
./commander shell redis       # Redis CLI
```

### Category 5: Utility Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `install` | Show installation instructions |

---

## 🔄 Standard Workflow

### Workflow: Starting System

```
USER: "Khởi động hệ thống"
    ↓
AGENT:
    1. Load skill: docker-controller
    2. Execute: ./commander up
    3. Wait for completion (monitor output)
    4. Analyze result:
       - ✅ "Started successfully!" → SUCCESS
       - ❌ Errors found → Troubleshoot
    5. Report to user with summary
    6. Suggest next action:
       - "Test API at http://localhost:8000/health"
       - "Check frontend at http://localhost:3000"
       - "View logs: ./commander logs"
```

### Workflow: Checking Health

```
USER: "Kiểm tra health" or "Hệ thống có ổn không?"
    ↓
AGENT:
    1. Load skill: docker-controller
    2. Execute: ./commander health
    3. Analyze output:
       ├─ All ✅ → Report healthy
       ├─ Some ❌ → Identify failed services
       └─ Mixed → Report partial status
    4. If unhealthy:
       a. Execute: ./commander diagnose
       b. Execute: ./commander status
       c. Check failed service logs
       d. Report root cause
       e. Suggest fixes
    5. Always suggest next action
```

### Workflow: Debugging Issues

```
USER: "Backend không hoạt động" or "Có lỗi gì không?"
    ↓
AGENT:
    1. Load skill: docker-controller
    2. Check status: ./commander status
    3. Identify problematic container(s)
    4. Get diagnostics: ./commander diagnose
    5. View specific logs: ./commander logs [service]
    6. Analyze error patterns:
       ├─ Connection refused → Port conflict
       ├─ Permission denied → Volume mount issue
       ├─ Out of memory → Resource limit
       └─ Database error → Check DB logs
    7. Report findings with diagnosis
    8. Suggest specific fixes
    9. Offer to execute fix (if safe)
```

### Workflow: After Code Changes

```
USER: "Tôi vừa sửa code"
    ↓
AGENT:
    1. Ask: "Bạn muốn rebuild hệ thống không?"
    2. If yes:
       a. Execute: ./commander down
       b. Execute: ./commander rebuild
       c. Wait for rebuild complete
       d. Execute: ./commander health
    3. Report status
    4. Verify functionality
```

---

## 🎯 Advanced Scenarios

### Scenario 1: System Won't Start

**Symptoms:**
- `./commander up` fails
- Containers exit immediately
- Port conflicts

**Workflow:**
```bash
# Step 1: Diagnose
./commander diagnose

# Step 2: Check what's running
./commander status

# Step 3: Check for port conflicts
# Look for: "port is already allocated"
./commander logs

# Step 4: Fix based on diagnosis
# - Port conflict → Stop conflicting service
# - Volume issue → Check disk space
# - Image issue → ./commander rebuild

# Step 5: Try again
./commander up
```

### Scenario 2: Container Keeps Restarting

**Symptoms:**
- Container status: "Restarting"
- Health check fails
- Logs show crash loop

**Workflow:**
```bash
# Step 1: Check restart count
./commander status

# Step 2: View recent logs
./commander logs [service]

# Step 3: Analyze crash pattern
# - Same error every time? → Fix code/config
# - Random errors? → Resource issue
# - Database error? → Check DB connection

# Step 4: Stop container
./commander down

# Step 5: Fix issue

# Step 6: Restart
./commander up
```

### Scenario 3: Database Connection Issues

**Symptoms:**
- Backend shows "Can't connect to database"
- MySQL container healthy but can't connect
- Connection timeout errors

**Workflow:**
```bash
# Step 1: Check all containers
./commander health

# Step 2: Check MySQL logs
./commander logs mysql

# Step 3: Access MySQL shell
./commander shell mysql
# In shell: check connection

# Step 4: Verify .env DB credentials
# Step 5: Restart if needed
./commander restart
```

---

## 🔧 Troubleshooting Guide

### Problem Category 1: Container Issues

#### Problem: Container won't start
**Symptoms:** `Container exited with code 1`

**Diagnosis:**
```bash
./commander logs [service]
```

**Common Causes:**
1. **Port already in use**
   - Solution: Stop conflicting service
2. **Volume mount error**
   - Solution: Check volume exists
3. **Config file error**
   - Solution: Check .env file syntax
4. **Image build failed**
   - Solution: `./commander rebuild`

#### Problem: Container keeps restarting
**Diagnosis:**
```bash
./commander logs [service] | tail -50
```

**Common Causes:**
1. **Application crash** - Fix code/config
2. **Health check failing** - Check health configuration
3. **Dependency not ready** - Check database is up

### Problem Category 2: Networking Issues

#### Problem: Can't access backend (localhost:8000)
**Diagnosis:**
```bash
./commander status
./commander logs backend
docker port aicmr-backend
```

**Common Causes:**
1. Port mapping wrong - Should be `"8000:8000"`
2. Wrong interface - Bind to 0.0.0.0
3. Firewall blocking - Allow port 8000

---

## 🚨 Emergency Procedures

### Emergency 1: Complete System Crash

**When:** All containers down, nothing works

**Procedure:**
```bash
# 1. Stop everything
./commander down

# 2. Force remove all containers
docker rm -f $(docker ps -aq) 2>/dev/null

# 3. Clean Docker system
docker system prune -a --volumes

# 4. Verify Docker daemon
docker info

# 5. Fresh start
./commander up

# 6. If still fails → Check logs
./commander logs
```

### Emergency 2: Port Conflicts

**When:** "port is already allocated"

**Procedure:**
```bash
# 1. Find process using port
# Windows:
netstat -ano | findstr :8000
# Linux/Mac:
lsof -i :8000

# 2. Kill conflicting process
# Windows:
taskkill /PID <pid> /F
# Linux/Mac:
kill -9 <pid>

# 3. Restart services
./commander restart
```

---

## ✅ Best Practices

### For AI Agents

#### DO's ✅

1. **ALWAYS load this skill first**
   - For ANY system-related request
   - No exceptions

2. **Follow the workflow**
   - Understand request
   - Map to commander command
   - Execute commander
   - Analyze output
   - Report results

3. **Check before acting**
   - Verify current state
   - Don't restart if already running

4. **Monitor execution**
   - Watch output for errors
   - Wait for completion

#### DON'Ts ❌

1. **Don't use docker compose directly**
   - Always use commander

2. **Don't skip diagnostics**
   - Check status before restarting
   - View logs before declaring failure

3. **Don't make assumptions**
   - Verify container state
   - Check error messages

---

## 📋 Checklist

### Before Starting System

- [ ] Disk space available (>5GB free)
- [ ] Docker daemon running
- [ ] No port conflicts (8000, 3000, 3306, 6379)
- [ ] .env file configured
- [ ] Network connection available

### After Starting System

- [ ] All containers "Up" status
- [ ] Health check passed
- [ ] Backend accessible at http://localhost:8000/health
- [ ] Frontend accessible at http://localhost:3000
- [ ] No errors in logs

---

## 🔗 Quick Reference Card

```
SYSTEM MANAGEMENT COMMANDS

Lifecycle:
  up          - Start all containers
  down        - Stop all containers
  rebuild     - Rebuild & restart
  restart     - Restart containers

Status:
  health      - Quick health check
  status      - Detailed container status
  diagnose    - Full system diagnostics
  version     - Show CLI version

Logs:
  logs        - View all service logs
  logs [svc]  - View specific service logs

Access:
  shell [svc] - Open shell in service

Services: backend, frontend, mysql, redis, nginx, phpmyadmin

Container Names (unified across platforms):
  aicmr-mysql
  aicmr-backend
  aicmr-frontend
  aicmr-redis
  aicmr-nginx
  aicmr-phpmyadmin

EXAMPLES:
  ./commander up
  ./commander logs backend
  ./commander shell mysql
  ./commander health

TROUBLESHOOTING:
  1. ./commander status    - Check what's running
  2. ./commander diagnose  - Find issues
  3. ./commander logs [svc] - View errors
  4. ./commander rebuild   - Fix most issues

EMERGENCY:
  ./commander down
  docker system prune -a
  ./commander up
```

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-21 | Initial version |
| 2.0 | 2026-01-23 | Added advanced scenarios, emergency procedures |
| **3.0** | **2026-01-25** | **Platform-agnostic - single docker-compose.yml, unified container names** |

---

**Maintained by:** Claude Code AI
**Last Updated:** 2026-01-25
**Status:** Production Ready ✅

---

**🎯 Remember: This skill is the GATEKEEPER for all system operations. When in doubt, load it first!**
