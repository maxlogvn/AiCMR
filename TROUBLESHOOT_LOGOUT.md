# 🔧 Troubleshooting - Logout & Login Issues

## ❌ Vấn Đề: Thấy User Cũ Sau Logout/Login

**Triệu chứng**:
- Đăng xuất tài khoản A
- Đăng nhập tài khoản B
- Nhưng hồ sơ vẫn hiển thị tài khoản A

**Nguyên Nhân** (đã được sửa):
1. React Query cache chưa được xóa khi logout
2. localStorage tokens không được xóa hoàn toàn
3. API interceptor state chưa reset

**Giải Pháp** (đã apply):
- useUser hook sẽ listen storage change events
- Khi token bị remove, tự động xóa React Query cache
- Auth logout sẽ reset CSRF cache và API state

---

## ❌ Vấn Đề: "Invalid Email" Error

**Triệu Chứng**:
- Nhập email: admin@example.com
- Lỗi: "Invalid email"

**Nguyên Nhân**:
- EmailStr validation từ Pydantic
- Có thể email format không đúng

**Giải Pháp**:
1. Kiểm tra email chính xác: `admin@example.com`
2. Đảm bảo không có space ở trước/sau
3. Kiểm tra backend logs:
   ```bash
   # Backend logs sẽ hiển thị:
   [INFO] Attempting login for email: admin@example.com
   ```

**Debug Steps**:
1. Mở DevTools → Console
2. Xem có lỗi gì không
3. Network tab → POST /auth/login
4. Xem response error detail

---

## 🧪 Testing Checklist - Logout Fix

### Test 1: Basic Logout → Login Same User

```
1. Login: test1@example.com / TestPassword123!
2. Check console for:
   ✅ "[Auth] Tokens to logout: { hasAccessToken: true, hasRefreshToken: true }"
3. Click Logout
4. Check console for:
   ✅ "[Auth] Notifying backend of logout"
   ✅ "[Auth] Backend logout notification successful"
   ✅ "[CSRF] Token cache reset for new session"
   ✅ "[API] Interceptor state reset for new session"
   ✅ "[Auth] Tokens after clear: { accessToken: null, refreshToken: null }"
5. Login: test1@example.com / TestPassword123!
6. Verify: Hồ sơ hiển thị test1 (không có lỗi)
```

### Test 2: Logout → Login Different User (CRITICAL)

```
1. Login: test1@example.com / TestPassword123!
2. Go to: /user/profile
3. Note: Profile email is test1@example.com
4. Open DevTools → Console
5. Click Logout
6. Check logs:
   ✅ "[Auth] Clearing tokens from localStorage"
   ✅ "[Auth] Tokens after clear: { accessToken: null, refreshToken: null }"
7. Check DevTools → Application → Storage
   ✅ localStorage: KHÔNG có "access_token"
   ✅ localStorage: KHÔNG có "refresh_token"
8. Login: admin@example.com / AdminPassword123!
9. Wait for redirect to /dashboard
10. Verify:
    ✅ Dashboard hiển thị admin's data
    ✅ KHÔNG thấy test1's data
    ✅ KHÔNG có "Invalid email" error
    ✅ KHÔNG có CSRF error
```

### Test 3: Check React Query Cache Clear

```
1. Login: test1@example.com
2. Open DevTools → Application → Local Storage
3. Login: test2@example.com
4. DevTools → Network
5. Reload page (F5)
6. Check requests:
   ✅ /users/me should fetch fresh data
   ✅ Response should be test2's profile
   ✅ NOT cached from test1
```

---

## 📋 Debug Info to Collect

Nếu vấn đề vẫn tiếp diễn, hãy cung cấp:

### 1. Backend Logs
```bash
# Chạy backend với debug logging
python -m uvicorn app.main:app --reload --port 8000 --log-level debug

# Cần xem:
# - [INFO] Attempting login for email: ...
# - [INFO] User ... logged out successfully
# - Có lỗi authentication không?
```

### 2. Frontend Console Logs
- Mở DevTools → Console
- Xóa tất cả logs (Ctrl+L)
- Thực hiện test sequence
- Chụp screenshot tất cả logs
- Gửi cho tôi

**Logs cần xem**:
```
[Auth] Logging out
[Auth] Tokens to logout: ...
[Auth] Notifying backend of logout
[Auth] Backend logout notification successful
[CSRF] Token cache reset for new session
[API] Interceptor state reset for new session
[Auth] Tokens after clear: { accessToken: null, refreshToken: null }
[Auth] Attempting login for: admin@example.com
[Auth] Login successful, storing tokens
```

### 3. Browser DevTools Data
- Screenshot Application → Storage (before/after logout)
- Screenshot Network → logout request (status 200?)
- Screenshot Network → login request (headers correct?)

### 4. Error Messages
- Full error text từ toast notification
- Response body từ Network tab
- Error trong console

---

## ✅ Verification Commands

### 1. Verify Fix Applied
```bash
bash VERIFY_SESSION_FIX.sh
```

Output phải có tất cả ✅:
```
✓ Checking frontend/src/lib/auth.ts imports...
  ✅ Reset functions imported
✓ Checking resetCsrfToken() call in logout...
  ✅ resetCsrfToken() called in logout
✓ Checking resetApiState() call in logout...
  ✅ resetApiState() called in logout
...
```

### 2. Create Fresh Test Accounts
```bash
cd backend
python create_test_users.py
```

Verify output:
```
✅ Created user: test1@example.com
✅ Created user: test2@example.com
✅ Created user: admin@example.com
```

### 3. Test Clean Restart
```bash
# Kill all processes (Ctrl+C)
# Clear browser cache
# Close browser completely
# Restart browser
# Run backend & frontend
# Try test sequence again
```

---

## 🐛 Common Issues & Fixes

### Issue: React Query Cache Not Clearing

**Symptoms**:
- Logout → Login → Still see old user data

**Fix**:
- useUser hook now has storage event listener
- Should auto-clear on token removal
- If not working:
  1. Check browser console for errors
  2. Check if storage event is firing
  3. Hard refresh (Ctrl+F5)

### Issue: Tokens Not Clearing from localStorage

**Symptoms**:
- DevTools → Application → localStorage still has tokens after logout

**Fix**:
- Auth logout has verification:
  ```
  [Auth] Tokens after clear: { accessToken: null, refreshToken: null }
  ```
- If not null, logout didn't work
- Check console for errors

### Issue: CSRF Token Still Cached

**Symptoms**:
- "Invalid CSRF token" error after logout/login

**Fix**:
- Check console for:
  ```
  [CSRF] Token cache reset for new session
  ```
- If not present, resetCsrfToken() not called
- Verify fix is applied: `bash VERIFY_SESSION_FIX.sh`

### Issue: Backend Not Receiving Logout

**Symptoms**:
- Console says logout successful
- But backend didn't actually invalidate token
- Can still use old token after logout

**Fix**:
- Check backend logs:
  ```
  [INFO] User ... logged out successfully
  ```
- Check if "Notifying backend of logout" appears in console
- Verify backend has: `await db.commit()` in logout endpoint

---

## 🚀 Quick Fix Summary

Latest changes applied:

1. **useUser.ts**: Added storage event listener + cache invalidation
2. **auth.ts**: Added detailed logging + token verification
3. **login page**: Add refresh cache comment
4. **Commit**: b6dfdc8

All changes are **backward compatible** (no breaking changes).

---

## 📞 If Still Having Issues

1. **Verify fixes applied**:
   ```bash
   bash VERIFY_SESSION_FIX.sh
   ```

2. **Collect debug info** (from section above)

3. **Try clean restart**:
   - Close browser
   - Kill backend/frontend
   - Clear browser cache
   - Delete node_modules cache (optional)
   - Restart everything

4. **Check git commits**:
   ```bash
   git log --oneline -5
   ```
   Should show: `b6dfdc8 - fix: Clear React Query cache on logout`

5. **Manual test**:
   - test1@example.com → Logout → admin@example.com
   - Check all console logs
   - Check DevTools storage
   - Report what you see

---

**Last Updated**: January 23, 2026

