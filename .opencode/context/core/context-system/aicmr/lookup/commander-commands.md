# Commander Commands Reference

**Purpose**: Quick lookup của tất cả commander commands với aliases.

| Category | Command | Aliases | Mô Tả |
|-----------|-----------|-----------|---------|
| **Serve** | `serve-up` | `start`, `up` | Khởi động + build tất cả containers |
| | `serve-down` | `stop`, `down` | Dừng tất cả containers |
| | `serve-restart` | `restart` | Restart tất cả containers |
| | `serve-rebuild` | `rebuild` | Rebuild + restart |
| **Server** | `server-health` | `health` | Health check (5s hoặc 10s) |
| | `server-status` | `status`, `ps` | Chi tiết status từng container |
| | `diagnose` | `diag` | Chẩn đoán vấn đề chi tiết |
| **Logs** | `logs` | - | Logs tất cả services |
| | `logs <svc>` | - | Logs 1 service (backend, frontend, db, redis, nginx) |
| **Shell** | `shell <svc>` | - | Vào shell container (backend, frontend, db, redis) |
| **Database** | `db-migrate` | `migrate`, `migration` | Chạy database migrations |
| | `db-create "name"` | - | Tạo migration mới |
| **Other** | `install` | - | Mở trang cài đặt |
| | `help` | `-h`, `--help` | Xem tất cả lệnh |

**Reference**: /guides/commander-usage.md

**Related**:
- docs/09-commander-cli.md (full guide)
- ../.opencode/skills/commander-management/SKILL.md (full documentation)
