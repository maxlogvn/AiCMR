# 🚀 START HERE - Hướng Dẫn Bắt Đầu Test Logout Fix

## ⚡ Hướng Dẫn Nhanh (5 Phút)

### 1. Tạo Test Accounts
```bash
cd backend
python create_test_users.py
```

### 2. Khởi động Backend (Terminal 1)
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Khởi động Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### 4. Mở Trình Duyệt
- Đi tới: http://localhost:3000
- Đăng nhập: test1@example.com / TestPassword123!
- Click "Đăng xuất"
- Đăng nhập: test2@example.com / TestPassword456!
- ✅ **Thành công nếu không có lỗi CSRF!**

---

## 👥 Test Accounts

| Email | Password | Role |
|-------|----------|------|
| test1@example.com | TestPassword123! | User |
| test2@example.com | TestPassword456! | User |
| admin@example.com | AdminPassword123! | Admin |

---

## 🔧 Vấn Đề Được Sửa

**Trước**: Đăng nhập → Đăng xuất → Đăng nhập tài khoản khác = ❌ Lỗi CSRF token

**Sau**: Đăng nhập → Đăng xuất → Đăng nhập tài khoản khác = ✅ Thành công!

---

## ✅ Kiểm Tra Xem Fix Hoạt động Không

### 1. Kiểm tra Console (F12 → Console)
Sau khi đăng xuất, bạn sẽ thấy:
```
[Auth] Logging out
[Auth] Notifying backend of logout
[Auth] Backend logout notification successful
[CSRF] Token cache reset for new session
[API] Interceptor state reset for new session
```

### 2. Kiểm tra Storage (F12 → Application)
- Trước logout: `access_token` và `refresh_token` có trong localStorage
- Sau logout: Cả hai token **KHÔNG CÓ**

### 3. Kiểm tra Network (F12 → Network)
- Logout request có status **200**
- Response headers có:
  ```
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  ```

---

## 📚 Tài Liệu Chi Tiết

| File | Mục Đích |
|------|----------|
| `TEST_ACCOUNTS_GUIDE.md` | 10 kỳ kiểm tra chi tiết |
| `LOGIN_LOGOUT_SESSION_FIX.md` | Giải thích nguyên nhân & cách sửa |
| `VERIFY_SESSION_FIX.sh` | Kiểm tra implementation tự động |
| `SESSION_FIX_COMPLETE.md` | Tóm tắt hoàn chỉnh |

---

## 🐛 Troubleshooting

### Lỗi: "Invalid CSRF token"
- Xóa browser cache (Ctrl+Shift+Delete)
- Kiểm tra console có "[CSRF] Token cache reset" không

### Lỗi: Không thể tạo test users
- Đảm bảo database đã được tạo
- Chạy backend migration trước: `python -m alembic upgrade head`

### Logout không hoạt động
- Kiểm tra backend logs
- Chạy: `bash VERIFY_SESSION_FIX.sh`

---

## 📞 Nếu Cần Giúp

1. Xem `TEST_ACCOUNTS_GUIDE.md` (10 kỳ kiểm tra chi tiết)
2. Chạy `bash VERIFY_SESSION_FIX.sh` (Kiểm tra implementation)
3. Xem `LOGIN_LOGOUT_SESSION_FIX.md` (Giải thích chi tiết)

---

**Bắt đầu ngay với:**
```bash
cd backend && python create_test_users.py
```

✨ Enjoy testing!
