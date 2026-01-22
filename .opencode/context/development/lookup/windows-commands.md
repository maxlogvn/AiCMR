# Windows Commands Quick Reference

**Tổng quan**: Commands thường dùng khi phát triển AiCMR trên Windows.

---

## Docker & Compose

```powershell
# Containers
docker ps -a                    # View all containers
docker logs <container> -f      # Follow logs
docker exec -it <container> sh  # Execute in container

# Compose
docker-compose -f docker-compose.windows.yml up -d     # Start
docker-compose -f docker-compose.windows.yml down       # Stop
docker-compose -f docker-compose.windows.yml restart   # Restart
docker-compose -f docker-compose.windows.yml build     # Rebuild
docker-compose -f docker-compose.windows.yml ps        # Status
docker-compose -f docker-compose.windows.yml logs backend # View logs
```

---

## Scripts (Use These)

```powershell
scripts\windows\start.bat       # Start all services
scripts\windows\stop.bat        # Stop all services
scripts\windows\restart.bat     # Restart all services
scripts\windows\clean.bat       # Stop & remove containers
scripts\windows\build.bat       # Rebuild containers
scripts\windows\health.bat      # Health check
scripts\windows\logs.bat        # View logs
scripts\windows\setup-hosts.bat # Setup hosts (run as Admin)
```

---

## Network & Ports

```powershell
netstat -ano | findstr :3000   # Find process using port
taskkill /PID <PID> /F         # Kill process
```

---

## Git

```powershell
git status                     # Check status
git pull                       # Pull changes
git add . && git commit -m "message" && git push  # Commit
git config --global core.autocrlf input  # Line endings for Windows
```

---

## Environment Variables

```powershell
grep DATABASE_URL .env         # Check DATABASE_URL
grep ALLOWED_ORIGINS .env      # Check ALLOWED_ORIGINS
grep CHOKIDAR_USEPOLLING .env  # Check CHOKIDAR
code .env                      # Edit .env file

# Generate secrets
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
```

---

## PowerShell

```powershell
Get-Service docker             # Check Docker service
Start-Service docker           # Start Docker service
winget install <package>       # Install package
```

---

## MySQL & Redis

```powershell
# MySQL
docker-compose -f docker-compose.windows.yml exec mysql mysqladmin ping
docker-compose -f docker-compose.windows.yml exec mysql mysql -u root -p

# Redis
docker-compose -f docker-compose.windows.yml exec redis redis-cli ping
```

---

## Cleanup

```powershell
docker system df               # Disk usage
docker system prune -a --volumes  # Clean up (⚠️ use caution)
```

---

## Troubleshooting

```powershell
docker ps
docker-compose -f docker-compose.windows.yml ps
scripts\windows\health.bat
grep -E "DATABASE_URL|ALLOWED_ORIGINS|CHOKIDAR" .env
```

---

## Liên Quan

- **Guide**: [windows-setup.md](.opencode/context/development/guides/windows-setup.md)
- **Errors**: [windows-dev-errors.md](.opencode/context/development/errors/windows-dev-errors.md)

