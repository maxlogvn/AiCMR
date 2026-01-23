# Commander Management Skill - AiCMR

**Version:** 2.0 (Optimized)
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
    │   │   ├─ Database operations?
    │   │   │   └─ → ./commander shell backend
    │   │   │       → alembic upgrade head
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
| `rebuild` | - | Rebuild & restart all containers | "rebuild", "build lại", "cài đặt lại" |

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
```

### Category 5: Utility Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |

---

## 🔄 Standard Workflow

### Workflow: Starting System

```
USER: "Khởi động hệ thống"
    ↓
AGENT:
    1. Load skill: commander-management
    2. Execute: ./commander up
    3. Wait for completion (monitor output)
    4. Analyze result:
       - ✅ "System ready!" → SUCCESS
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
    1. Load skill: commander-management
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
    1. Load skill: commander-management
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

### Workflow: Viewing Logs

```
USER: "Xem logs" or "Lỗi gì đó?"
    ↓
AGENT:
    1. Load skill: commander-management
    2. Ask: "Logs của service nào? (backend/frontend/mysql/all)"
    3. Execute appropriate command:
       - ./commander logs [service]
    4. Analyze logs:
       ├─ Look for ERROR keywords
       ├─ Look for Exception/Traceback
       ├─ Check timestamps (recent errors?)
       └─ Identify error patterns
    5. Report relevant findings:
       - Show last 20-50 lines
       - Highlight errors in RED
       - Summarize root cause
    6. Suggest fixes based on errors
```

### Workflow: Database Operations

```
USER: "Chạy migration" or "Update database"
    ↓
AGENT:
    1. Load skill: commander-management
    2. Execute: ./commander shell backend
    3. In shell, run:
       - alembic upgrade head
       - OR python manage.py migrate
    4. Monitor output for errors
    5. Report success/failure
    6. If failure:
       - Check database logs: ./commander logs mysql
       - Verify database connection
       - Suggest manual intervention
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
# Look for: "Restart: 5 (5 seconds ago)"

# Step 2: View recent logs
./commander logs [service]

# Step 3: Analyze crash pattern
# - Same error every time? → Fix code/config
# - Random errors? → Resource issue
# - Database error? → Check DB connection

# Step 4: Stop container to prevent crash loop
./commander down

# Step 5: Fix issue (code/config change)

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
# Step 1: Check all containers healthy
./commander health

# Step 2: Check MySQL logs
./commander logs mysql
# Look for: "Access denied", "Connection refused"

# Step 3: Check backend logs
./commander logs backend
# Look for: "sqlalchemy.exc.OperationalError"

# Step 4: Access MySQL shell
./commander shell mysql
# In shell:
mysql -u root -p
SHOW DATABASES;
SELECT user, host FROM mysql.user;
EXIT;

# Step 5: Verify .env DB credentials
# Step 6: Restart if config changed
./commander restart
```

### Scenario 4: Out of Memory

**Symptoms:**
- Container OOMKilled
- System slow
- Services randomly crash

**Workflow:**
```bash
# Step 1: Check resource usage
./commander status
# Look for: MEM usage

# Step 2: Check system memory
docker stats --no-stream

# Step 3: Identify memory hog
# Look for: Unusual high memory usage

# Step 4: Options:
# a) Restart containers
./commander restart

# b) Reduce container limits (in docker-compose.yml)
# c) Stop unused services
# d) Add more RAM to system
```

### Scenario 5: After Code Changes

**Workflow:**
```bash
# Step 1: Stop containers (optional)
./commander down

# Step 2: Rebuild with new code
./commander rebuild

# Step 3: Wait for rebuild complete
# Monitor output for build errors

# Step 4: Health check
./commander health

# Step 5: Verify specific functionality
# - Test API: curl http://localhost:8000/health
# - Test frontend: Open http://localhost:3000
# - Check logs: ./commander logs

# Step 6: Report status
```

### Scenario 6: Complete System Failure

**Symptoms:**
- Nothing works
- All containers down
- Can't access anything

**Emergency Procedure:**
```bash
# Step 1: Stop everything
./commander down

# Step 2: Remove orphaned containers
docker ps -a
docker rm -f $(docker ps -aq)

# Step 3: Check Docker daemon
docker info

# Step 4: Restart Docker (if needed)
# Windows: Restart Docker Desktop
# Linux: sudo systemctl restart docker

# Step 5: Check disk space
df -h

# Step 6: Clean up if needed
docker system prune -a

# Step 7: Fresh start
./commander up

# Step 8: If still fails → Check logs
./commander logs
```

---

## 🔧 Troubleshooting Guide

### Problem Category 1: Container Issues

#### Problem: Container won't start
**Symptoms:**
```
Error: Container exited with code 1
```

**Diagnosis:**
```bash
./commander logs [service]
```

**Common Causes:**
1. **Port already in use**
   - Solution: Stop conflicting service
   - Check: `netstat -ano | findstr :8000` (Windows)
   - Or: `lsof -i :8000` (Linux/Mac)

2. **Volume mount error**
   - Solution: Check volume exists
   - Check: `docker volume ls`

3. **Config file error**
   - Solution: Check .env file syntax
   - Check: `cat .env`

4. **Image build failed**
   - Solution: `./commander rebuild`

#### Problem: Container keeps restarting
**Diagnosis:**
```bash
./commander logs [service] | tail -50
```

**Common Causes:**
1. **Application crash**
   - Check logs for Python/Node exception
   - Fix code/config
   - Restart

2. **Health check failing**
   - Check health check configuration
   - Temporarily disable to debug

3. **Dependency not ready**
   - Check database is up
   - Wait longer before starting
   - Add `depends_on` with `condition: service_healthy`

#### Problem: Container extremely slow
**Diagnosis:**
```bash
./commander status
# Check CPU/MEM usage
```

**Solutions:**
1. **Resource limit reached**
   - Check Docker resource limits
   - Increase allocated RAM/CPU

2. **Database query slow**
   - Check: `./commander logs mysql`
   - Optimize queries
   - Add indexes

3. **Cache cold**
   - Wait for cache to warm up
   - Check Redis: `./commander logs redis`

---

### Problem Category 2: Networking Issues

#### Problem: Can't access backend (localhost:8000)
**Diagnosis:**
```bash
# Step 1: Check backend running
./commander status
# Look for: aicmr-backend "Up"

# Step 2: Check backend logs
./commander logs backend
# Look for: "Uvicorn running on http://0.0.0.0:8000"

# Step 3: Check port binding
docker port aicmr-backend

# Step 4: Test from inside container
./commander shell backend
# In shell: curl http://localhost:8000/health
```

**Common Causes:**
1. **Port mapping wrong**
   - Check docker-compose.yml
   - Should be: `"8000:8000"`

2. **Wrong interface**
   - Using 127.0.0.1 instead of 0.0.0.0
   - Fix: Bind to 0.0.0.0 in config

3. **Firewall blocking**
   - Check Windows Firewall
   - Allow port 8000

#### Problem: Can't access frontend (localhost:3000)
**Similar to backend issue, but for frontend**
```bash
# Check frontend status
./commander status

# Check frontend logs
./commander logs frontend
# Look for: "ready - started server on"
```

---

### Problem Category 3: Database Issues

#### Problem: Can't connect to database
**Symptoms:**
```
sqlalchemy.exc.OperationalError: (mysql.connector.errors.DatabaseError) 2003 (HY000): Can't connect to MySQL server
```

**Diagnosis:**
```bash
# Step 1: Check MySQL container
./commander status
# Look for: aicmr-mysql "Up"

# Step 2: Check MySQL logs
./commander logs mysql
# Look for: "ready for connections" OR "ERROR"

# Step 3: Test MySQL connection
./commander shell mysql
# In shell:
mysql -u aicmr_user -p
# Enter password from .env
```

**Common Causes:**
1. **Wrong credentials**
   - Check .env DB_USER, DB_PASSWORD
   - Verify MySQL user exists

2. **Database not ready**
   - Wait for MySQL to fully start
   - Check logs for "ready for connections"

3. **Wrong host**
   - Windows: host.docker.internal
   - Linux/Mac: mysql (container name)
   - Check .env DB_HOST

#### Problem: Database migration failed
**Diagnosis:**
```bash
# Check alembic logs
./commander logs backend | grep -i alembic

# Check current migration state
./commander shell backend
# In shell:
alembic current
alembic history
```

**Solutions:**
1. **Missing migration file**
   - Create migration: `alembic revision --autogenerate -m "description"`
   - Apply: `alembic upgrade head`

2. **Migration conflict**
   - Downgrade: `alembic downgrade -1`
   - Fix conflict
   - Upgrade: `alembic upgrade head`

3. **Database out of sync**
   - Stamp head: `alembic stamp head`
   - Re-run: `alembic upgrade head`

---

### Problem Category 4: Build Issues

#### Problem: Build failed during `./commander rebuild`
**Symptoms:**
```
ERROR [builder] FAILED to build
```

**Diagnosis:**
```bash
# Check build logs
./commander logs

# Look for specific error in output
# Usually near "ERROR" keyword
```

**Common Causes:**
1. **Syntax error in code**
   - Check logs for Python/Node syntax error
   - Fix code
   - Rebuild: `./commander rebuild`

2. **Missing dependency**
   - Check requirements.txt or package.json
   - Add missing dependency
   - Rebuild

3. **Network timeout**
   - Check internet connection
   - Docker can't download packages
   - Retry rebuild

4. **Out of disk space**
   - Check: `df -h`
   - Clean up: `docker system prune -a`
   - Retry

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
# If error → Restart Docker Desktop/daemon

# 5. Fresh start
./commander up

# 6. If still fails → Check system logs
# Windows: Event Viewer
# Linux: journalctl -xe
```

### Emergency 2: Database Corruption

**When:** Database won't start, data corrupted

**Procedure:**
```bash
# ⚠️ WARNING: May cause data loss!
# Only attempt if backup available

# 1. Stop all services
./commander down

# 2. Access MySQL data directory
# Windows: \\wsl$\docker-desktop-data\data\aicmr_mysql
# Linux: /var/lib/docker/volumes/aicmr_mysql/_data

# 3. Backup current data (if possible)
cp -r /var/lib/docker/volumes/aicmr_mysql/_data /backup/mysql

# 4. Remove corrupted volume
docker volume rm aicmr_mysql

# 5. Start services (will create fresh DB)
./commander up

# 6. Run migrations
./commander shell backend
alembic upgrade head

# 7. Restore from backup if needed
# Or recreate data from scratch
```

### Emergency 3: Disk Space Full

**When:** Can't write logs, containers crash

**Procedure:**
```bash
# 1. Check disk space
df -h

# 2. Clean Docker unused data
docker system prune -a

# 3. Remove old logs
# Backend logs
docker logs aicmr-backend --tail 0 > /dev/null
# Repeat for other containers

# 4. Remove Docker volumes (unused)
docker volume prune

# 5. Restart services
./commander restart
```

### Emergency 4: Port Conflicts

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
   - Don't start if already started

4. **Monitor execution**
   - Watch output for errors
   - Wait for completion
   - Don't assume success

5. **Report clearly**
   - Summarize what happened
   - Highlight errors if any
   - Suggest next actions

6. **Ask when unsure**
   - Better to ask than guess wrong
   - Clarify ambiguous requests
   - Confirm destructive actions

#### DON'Ts ❌

1. **Don't use docker compose directly**
   - Always use commander
   - Commander abstracts complexity

2. **Don't skip diagnostics**
   - Check status before restarting
   - View logs before declaring failure
   - Diagnose before fixing

3. **Don't make assumptions**
   - Verify container state
   - Check error messages
   - Don't guess root cause

4. **Don't be destructive**
   - Ask before deleting data
   - Confirm before `down`
   - Warn about consequences

5. **Don't overwhelm user**
   - Summarize long outputs
   - Show only relevant logs
   - One action at a time

### For Developers

#### DO's ✅

1. **Use commander for all operations**
   - Daily start/stop
   - Deployments
   - Debugging

2. **Check health before major changes**
   - Run `./commander health`
   - Verify all services OK
   - Backup before rebuild

3. **Monitor logs regularly**
   - `./commander logs` during development
   - Check for warnings (not just errors)
   - Spot issues early

4. **Clean up periodically**
   - `docker system prune -a`
   - Remove old images
   - Free disk space

5. **Document custom commands**
   - Add to commander if used often
   - Share with team

#### DON'Ts ❌

1. **Don't bypass commander**
   - Use docker compose only if necessary
   - Commander provides standardization

2. **Don't ignore warnings**
   - Warnings → Future errors
   - Fix early

3. **Don't modify running containers**
   - Stop first, then change
   - Restart to apply

4. **Don't forget to backup**
   - Before rebuild
   - Before migrations
   - Before major changes

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

### Before Making Changes

- [ ] Backup database (if needed)
- [ ] Commit code changes
- [ ] Document what will change
- [ ] Rollback plan ready

### After Making Changes

- [ ] Rebuild successful
- [ ] All containers healthy
- [ ] Test critical functionality
- [ ] Check logs for errors
- [ ] Monitor for 5 minutes

### Troubleshooting

- [ ] Identify symptoms clearly
- [ ] Check status first
- [ ] Run diagnostics
- [ ] View relevant logs
- [ ] Document findings
- [ ] Test proposed fix
- [ ] Verify resolution

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

Logs:
  logs        - View all service logs
  logs [svc]  - View specific service logs

Access:
  shell [svc] - Open shell in service

Services: backend, frontend, mysql, redis, nginx

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

## 📚 Related Resources

### Internal Skills
- **backend-api-builder** - Build backend APIs
- **backend-api-tester** - Test backend APIs
- **git-commit-push** - Commit changes

### Documentation
- **scripts/README.md** - Commander full documentation
- **docker-compose.yml** - Container definitions
- **CLAUDE.md** - Project overview

### External Resources
- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- MySQL Reference: https://dev.mysql.com/doc/

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-21 | Initial version |
| 2.0 | 2026-01-23 | **OPTIMIZED** - Better structure, advanced scenarios, emergency procedures |

---

**Maintained by:** Claude Code AI
**Last Updated:** 2026-01-23
**Status:** Production Ready ✅

---

**🎯 Remember: This skill is the GATEKEEPER for all system operations. When in doubt, load it first!**
