# Local Domain Setup

Cấu hình tên miền local `aicmr.local` cho truy cập dự án.

## Cấu Hình /etc/hosts

### Linux/macOS
```bash
sudo nano /etc/hosts

# Thêm dòng sau:
127.0.0.1 aicmr.local
```

### Windows
```text
# File: C:\Windows\System32\drivers\etc\hosts

# Thêm dòng sau:
127.0.0.1 aicmr.local
```

## Truy Cập

- **Frontend**: http://aicmr.local
- **Backend API**: http://aicmr.local/backend/api/v1
- **Backend Docs**: http://aicmr.local/backend/docs
- **phpMyAdmin**: http://aicmr.local/phpmyadmin

## Kiểm Tra

```bash
# Ping để verify
ping aicmr.local

# Nên trả về: 127.0.0.1
```

## Troubleshooting

**Không truy cập được?**
- Kiểm tra `/etc/hosts` có đúng
- Clear DNS cache: `sudo systemd-resolve --flush-caches` (Linux)
- Restart browser

**HTTP Error?**
- Kiểm tra Docker: `docker compose ps`
- Restart Nginx: `docker compose restart nginx`

## Tham Khảo

- Getting started: `.context/guides/getting-started.md`
- Architecture: `.context/concepts/architecture.md`
- Docker workflow: `.context/concepts/docker-workflow.md`
