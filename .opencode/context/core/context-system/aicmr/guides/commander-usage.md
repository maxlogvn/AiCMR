# Commander CLI Usage Guide

**Core Idea**: Single tool để quản lý AiCMR system (start, stop, health check, logs, migrations) với pre-flight checks và auto-migration.

**Key Points**:
- **Configuration**: Đặt `CLI_NAME` trong `.env` (mặc định: `commander`)
- **Pre-flight Checks**: Auto-checks Docker, ports, disk space trước khi start
- **Auto-migration**: Chạy migrations sau khi database healthy (silent fail nếu chưa setup)
- **Hot-reload**: Code changes không cần rebuild (chỉ restart khi develop)
- **Safety**: Approval gate cho destructive operations (không bao giờ auto-delete)

**Quick Example**:
```bash
# Configure .env
echo "CLI_NAME=commander" >> .env

# Use commands
./commander start           # Khởi động
./commander health          # Health check
./commander logs backend      # Xem logs
./commander migrate         # Run migrations
```

**Reference**: /lookup/commander-commands.md

**Related**:
- ../.opencode/skills/commander-management/SKILL.md (full documentation)
- scripts/ (CLI source code)
- AGENTS.md (development rules)
