# Windows Development Tips

**Tổng quan**: Best practices để phát triển AiCMR hiệu quả trên Windows.

---

## Shell & Terminal

```powershell
# PowerShell 7+ (better than PS 5.1)
winget install Microsoft.PowerShell

# Windows Terminal (multi-tab support)
winget install Microsoft.WindowsTerminal

# Set PowerShell 7 as default
# Terminal → Settings → Default Profile → PowerShell
```

---

## Docker Configuration

```powershell
# Enable WSL2 backend (recommended)
Docker Desktop → Settings → General → Use WSL 2 based engine ✓

# Monitor resources
docker stats              # Resource usage
docker system df          # Disk usage
docker ps -s              # Container sizes

# Regular cleanup (weekly)
docker system prune -a --volumes  # ⚠️ Use caution with --volumes
```

---

## Git & Line Endings

```powershell
# Configure for Windows
git config --global core.autocrlf input

# Enable pre-commit hooks
cd backend
pip install pre-commit
pre-commit install
```

---

## Scripts (Use Instead of Manual Commands)

```powershell
scripts\windows\start.bat      # Start all services
scripts\windows\stop.bat       # Stop all services
scripts\windows\restart.bat    # Restart all services
scripts\windows\clean.bat      # Stop & remove containers
scripts\windows\build.bat      # Rebuild containers
scripts\windows\health.bat     # Health check
scripts\windows\logs.bat       # View logs
scripts\windows\setup-hosts.bat  # Setup hosts (run as Admin)
```

---

## Best Practices

- ❌ Never commit `.env` file
- ✅ Use `.env.example` as template
- ✅ Rotate secrets regularly in production
- ✅ Enable Developer Mode (Settings → Update & Security → For developers)
- ✅ Test single service instead of all: `docker-compose -f docker-compose.windows.yml restart backend`
- ✅ View logs: `docker-compose -f docker-compose.windows.yml logs backend --tail=100 -f`
- ✅ Keep Docker Desktop updated: Help → Check for Updates

---

## Volume Mounts

```yaml
# Prevent override local node_modules
volumes:
  - ./backend:/app
  - /app/node_modules  # Don't override
```

---

## Liên Quan

- **Guide**: [windows-setup.md](.opencode/context/development/guides/windows-setup.md)
- **Errors**: [windows-dev-errors.md](.opencode/context/development/errors/windows-dev-errors.md)
- **Commands**: [windows-commands.md](.opencode/context/development/lookup/windows-commands.md)
