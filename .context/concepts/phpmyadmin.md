# phpMyAdmin Setup

Công cụ quản lý MySQL database qua web interface.

## Truy Cập

- **URL**: http://aicmr.local/phpmyadmin

## Xác Nhập

**Credentials mặc định** (xem trong `.env`):
- Username: Từ `MYSQL_USER` trong docker-compose.yml hoặc .env
- Password: Từ `MYSQL_PASSWORD` trong docker-compose.yml hoặc .env
- Host: `db`
- Port: `3306`

**Lưu ý**: Sử dụng `mysql_native_password` authentication plugin để tương thích tốt nhất với phpMyAdmin.

## Cấu Hình Authentication

**MySQL Connection** (để tránh lỗi):
```sql
-- Thay đổi user plugin sang mysql_native_password
ALTER USER 'aicmr_user'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
```

## Quản Lý Tables

**Common Operations**:
- **Browse**: Xem dữ liệu trong tables
- **Structure**: Xem schema của tables
- **SQL**: Chạy SQL queries trực tiếp
- **Export/Import**: Backup/restore database

## Tham Khảo

- Database schema: `.context/concepts/database-schema.md`
- Troubleshooting: `.context/errors/common-errors.md`
- MySQL docs: https://www.phpmyadmin.net/docs/

## Lưu Ý Quan Trọng

- **Development only**: Disable trong production
- **Backup**: Thường xuyên export database trước khi thay đổi
- **Direct SQL**: Cẩn thận với DROP, DELETE, TRUNCATE
