# Commander Management Skill - Quick Reference

**🚀 Use this skill when:** Managing AiCMR system (containers, logs, health)

---

## 🎯 Quick Triggers

Load this skill when user says:
- "khởi động", "dừng", "restart", "rebuild"
- "health check", "kiểm tra", "status"
- "logs", "xem logs", "shell", "vào shell"
- "diagnose", "kiểm tra lỗi", "debug hệ thống"

---

## ⚡ Quick Commands

```bash
# Lifecycle
./commander up          # Start all containers
./commander down        # Stop all containers
./commander rebuild     # Rebuild & restart

# Status
./commander health      # Quick health check
./commander status      # Detailed container status
./commander diagnose    # Full system diagnostics

# Logs
./commander logs        # All logs
./commander logs backend # Backend logs only

# Access
./commander shell backend    # Backend shell
./commander shell mysql      # Database shell
```

---

## 🌳 Decision Tree

```
User Request
    │
    ├─ System task? → YES
    │   ↓
    │   Start/launch? → ./commander up
    │   Stop/shutdown? → ./commander down
    │   Restart? → ./commander rebuild
    │   Health check? → ./commander health
    │   View status? → ./commander status
    │   Diagnose? → ./commander diagnose
    │   View logs? → ./commander logs [service]
    │   Access shell? → ./commander shell [service]
    │   → DONE
    │
    └─ NO → Use other skill
```

---

## 🔧 Common Workflows

### Workflow 1: Start System
```
1. ./commander up
2. Wait for "System ready!"
3. Verify: curl http://localhost:8000/health
```

### Workflow 2: Debug Issue
```
1. ./commander status      # Check what's running
2. ./commander diagnose    # Find issues
3. ./commander logs [svc]  # View errors
4. Fix issue
5. ./commander rebuild     # Apply fix
```

### Workflow 3: After Code Change
```
1. ./commander down        # Stop (optional)
2. ./commander rebuild     # Rebuild with new code
3. ./commander health      # Verify all OK
```

---

## 📊 Service Reference

| Service | Purpose | Shell Access | Logs |
|---------|---------|--------------|------|
| **backend** | FastAPI API | `./commander shell backend` | `./commander logs backend` |
| **frontend** | Next.js UI | `./commander shell frontend` | `./commander logs frontend` |
| **mysql** | Database | `./commander shell mysql` | `./commander logs mysql` |
| **redis** | Cache | `./commander shell redis` | `./commander logs redis` |
| **nginx** | Proxy | `./commander shell nginx` | `./commander logs nginx` |

---

## 🚨 Quick Troubleshooting

### Container won't start
```bash
./commander logs [service]
./commander diagnose
./commander rebuild
```

### Port already in use
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Linux/Mac:
lsof -i :8000
kill -9 <pid>
```

### Can't connect to database
```bash
./commander health
./commander logs mysql
./commander shell backend
# In shell: alembic upgrade head
```

### System slow
```bash
./commander status       # Check CPU/MEM
docker stats --no-stream
./commander restart     # Restart to free memory
```

---

## ✅ Quick Checklist

### Before Starting
- [ ] Docker running
- [ ] Disk space >5GB
- [ ] No port conflicts
- [ ] .env configured

### After Starting
- [ ] All containers "Up"
- [ ] Health check passed
- [ ] Backend accessible
- [ ] Frontend accessible

### Before Rebuild
- [ ] Commit code changes
- [ ] Backup database (if needed)
- [ ] Note current state

---

## 🆘 Emergency Commands

```bash
# Complete system crash
./commander down
docker system prune -a
./commander up

# Out of memory
docker system prune -a
./commander restart
```

---

## 📝 Tips

- **ALWAYS load this skill first** for system tasks
- **Check status before restarting**
- **View logs before declaring failure**
- **Monitor output** during operations
- **Report clearly** with summaries

---

**For complete guide:** [skill.md](./skill.md)
**For examples:** [examples.py](./examples.py)

---

**🎯 Remember: Use commander CLI, NOT docker compose directly!**
