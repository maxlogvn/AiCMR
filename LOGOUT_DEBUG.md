# 🔧 LOGOUT DEBUG GUIDE - Hướng dẫn kiểm tra logout

**Cập nhật:** Jan 23, 2026  
**Status:** ✅ Vừa fix custom logout event  
**Liên quan commit:** `f4850b5`, `e864673`

---

## 🎯 Vấn đề Ban Đầu

```
❌ Bạn bấm logout rồi ra trang chủ nhưng vẫn login tài khoản cũ
```

---

## ✅ Các Fix Vừa Áp Dụng

### Fix 1: Custom Logout Event (auth.ts)
**Vấn đề:** Storage event chỉ trigger khi storage thay đổi từ tab KHÁC, không phải tab hiện tại

**Giải pháp:**
```typescript
// TRƯỚC: Chỉ clear localStorage
localStorage.removeItem("access_token");
localStorage.removeItem("refresh_token");

// SAU: Dispatch custom event
window.dispatchEvent(new CustomEvent("auth:logout", { detail: { timestamp: Date.now() } }));
```

### Fix 2: useUser Listen to Custom Event (useUser.ts)
**Vấn đề:** useUser chỉ listen storage event, không biết logout từ cùng tab

**Giải pháp:**
```typescript
// Listen to both storage event (cross-tab) và custom logout event (same-tab)
window.addEventListener("auth:logout", handleLogoutEvent);
```

### Fix 3: Navbar Listen to Custom Event (Navbar.tsx)
**Vấn đề:** Navbar không update state khi logout, vẫn hiển thị logout button

**Giải pháp:**
```typescript
// Navbar now listens to auth:logout event
window.addEventListener("auth:logout", () => {
  setToken(null);
  setMobileMenuOpen(false);
});
```

---

## 🧪 Các Bước Kiểm Tra Logout

### Bước 1: Mở DevTools Console
```
F12 → Console tab
```

### Bước 2: Login vào hệ thống
```
1. Truy cập: http://localhost:3000
2. Bấm "Đăng nhập"
3. Email: test1@example.com
4. Password: TestPassword123!
5. Bấm "Đăng nhập"
6. Wait for dashboard/home page
```

### Bước 3: Xem Console Messages
Sau login thành công, bạn sẽ thấy trong console:
```
[Auth] Login successful, storing tokens
[CSRF] Token fetched successfully
[useUser] Token removed cleared user cache (có thể không xuất hiện ngay)
```

### Bước 4: Kiểm Tra localStorage
```
DevTools → Application → Storage → localStorage
✓ Sẽ thấy 2 keys: access_token, refresh_token
```

### Bước 5: Bấm Logout Button
Có 2 cách logout:

**Cách 1: Button Logout trên Navbar (Recommended)**
```
1. Tìm button "Đăng xuất" trên navbar (phía trên bên phải)
2. Bấm nó
3. Watch console
```

**Cách 2: Logout Page**
```
1. Truy cập: http://localhost:3000/logout
2. Page sẽ tự động gọi logout
3. Watch console
```

### Bước 6: Console Messages - CẦN CÓ CÁC MESSAGE SAU

**Từ auth.ts:**
```
[Auth] Logging out
[Auth] Tokens to logout: { hasAccessToken: true, hasRefreshToken: true }
[Auth] Notifying backend of logout
[Auth] Backend logout notification successful
[Auth] Resetting CSRF and API state
[CSRF] Token cache reset for new session
[API] Interceptor state reset for new session
[Auth] API state reset complete
[Auth] Clearing tokens from localStorage
[Auth] Tokens after clear: { accessToken: null, refreshToken: null }
[Auth] Dispatching logout event  ← ✅ MỎIE: Vừa thêm
```

**Từ useUser.ts:**
```
[useUser] Received logout event, clearing user cache  ← ✅ NEW: Vừa thêm
```

**Từ Navbar.tsx:**
```
[Navbar] Received logout event, resetting state  ← ✅ NEW: Vừa thêm
```

**Từ logout page (nếu dùng /logout):**
```
[LogoutPage] Starting logout process
[LogoutPage] Logout successful, redirecting to login
```

### Bước 7: Kiểm Tra localStorage Sau Logout
```
DevTools → Application → Storage → localStorage
✓ access_token: (SHOULD BE GONE/EMPTY)
✓ refresh_token: (SHOULD BE GONE/EMPTY)
```

### Bước 8: Kiểm Tra Redirect
```
✓ Trang phải chuyển sang /login
✓ Thấy login form
✓ Không có error message
```

---

## ✅ SUCCESS INDICATORS

Logout hoạt động đúng nếu bạn thấy:

- ✅ Console hiển thị TẤT CẢ 3 dòng "[Auth] Dispatching logout event", "[useUser] Received logout event", "[Navbar] Received logout event"
- ✅ localStorage completely empty (không có access_token, refresh_token)
- ✅ Trang redirect tới /login
- ✅ Không có error message
- ✅ Sau khi refresh trang, vẫn ở login page (không auto-login)

---

## ❌ TROUBLESHOOTING

### Vấn đề 1: Console KHÔNG hiển thị logout messages

**Nguyên nhân:** Logout function không được gọi

**Kiểm tra:**
1. Navbar component có mount không? (F12 → Elements tab, search "Navbar")
2. handleLogout function có được trigger không? 
3. authService.logout() có return success không?

**Giải pháp:**
```javascript
// Trong console, test logout thủ công:
import { authService } from "@/lib/auth";
authService.logout().then(r => console.log('Result:', r));
```

### Vấn đề 2: Console hiển thị messages nhưng localStorage KHÔNG clear

**Nguyên nhân:** Có vấn đề với localStorage.removeItem

**Kiểm tra:**
1. Xem message "[Auth] Tokens after clear" có hiển thị `{ accessToken: null, refreshToken: null }` không?
2. Kiểm tra localStorage trực tiếp:
   ```javascript
   console.log('access_token:', localStorage.getItem('access_token'));
   console.log('refresh_token:', localStorage.getItem('refresh_token'));
   ```

**Giải pháp:**
```javascript
// Thủ công clear localStorage:
localStorage.clear();
// Rồi refresh trang
```

### Vấn đề 3: Console messages OK nhưng trang KHÔNG redirect

**Nguyên nhân:** Router.push() không hoạt động hoặc có navigation guard

**Kiểm tra:**
1. URL có thay đổi sang /login không?
2. Có console error về navigation không?
3. PublicOnlyGuard component có chặn không?

**Giải pháp:**
- Xem PublicOnlyGuard component (frontend/src/components/auth/)

### Vấn đề 4: Thấy logout messages nhưng [Navbar] message KHÔNG hiển thị

**Nguyên nhân:** Navbar component chưa mount hoặc custom event listener chưa được attach

**Kiểm tra:**
1. Navbar có render không?
2. Window object có addEventListener method không?

**Giải pháp:**
- Refresh trang
- Đóng/mở DevTools
- Clear browser cache

### Vấn đề 5: Logout thành công nhưng khi BACK/REFRESH, vẫn login

**Nguyên nhân:** Backend still has valid token (database commit failed)

**Kiểm tra:**
1. Backend có log "User X logged out successfully" không?
2. Database có update revoked = True không?

**Giải pháp:**
```bash
# Check backend logs
tail -f backend.log | grep logout

# Or test token revocation directly
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
```

---

## 🔍 ADVANCED DEBUGGING

### Test 1: Direct authService.logout() Call
```javascript
// Copy-paste into DevTools Console:
(async () => {
  const result = await authService.logout();
  console.log('Logout result:', result);
  console.log('Token after:', localStorage.getItem('access_token'));
})();
```

### Test 2: Check Custom Event is Dispatching
```javascript
// Add listener before logout
window.addEventListener('auth:logout', () => {
  console.log('✓ auth:logout event received!');
});

// Then perform logout
```

### Test 3: Check API Call to Backend
```
DevTools → Network tab
1. Filter by "logout"
2. Should see POST request to /backend/api/v1/auth/logout
3. Response should be 200 OK
4. Response body: {"message": "Logged out successfully"}
```

### Test 4: Verify CSRF Token Reset
```javascript
// Check CSRF token is cleared:
import { getCsrfToken } from "@/lib/api";

// Before logout, get CSRF token
const token1 = await getCsrfToken();
console.log('Token 1:', token1);

// After logout + Login again, get new CSRF token
const token2 = await getCsrfToken();
console.log('Token 2:', token2);

// token1 should be DIFFERENT from token2
```

### Test 5: Check Authorization Header Removed
```
DevTools → Network tab
1. After logout, make ANY request
2. Request headers should NOT have "Authorization: Bearer ..."
3. Should be removed by resetApiState()
```

---

## 📊 FULL TEST SEQUENCE

### Test Sequence 1: Same User Logout & Login
```
1. Login: test1@example.com / TestPassword123!
   → See test1's profile
2. Logout
   → Watch all console messages
   → Check localStorage empty
   → Redirect to /login
3. Login again: test1@example.com / TestPassword123!
   → Should work without CSRF errors
   → See test1's profile again
```

### Test Sequence 2: Different User Logout & Login (THE CRITICAL ONE)
```
1. Login: test1@example.com / TestPassword123!
   → See test1's profile
   → Note email: "test1@example.com"
2. Logout
   → All messages + localStorage clear
3. Login: admin@example.com / AdminPassword123!
   → MUST see admin's profile
   → MUST see email: "admin@example.com" (NOT test1!)
   → NO "Invalid CSRF token" errors
```

### Test Sequence 3: Multiple Logout/Login Cycles
```
1. Login test1 → Logout → Login test2 → Logout → Login admin
2. Each cycle must work without errors
3. Profile must show correct user
4. NO state contamination
```

---

## 🎓 KEY FILES TO UNDERSTAND

| File | What It Does | What Changed |
|------|-------------|---------------|
| `frontend/src/lib/auth.ts` | Logout logic | Dispatch custom event (line 85) |
| `frontend/src/hooks/useUser.ts` | User cache | Listen to custom event (lines 16-20) |
| `frontend/src/components/layout/Navbar.tsx` | Navigation | Listen to custom event (lines 18-22) |
| `frontend/src/app/logout/page.tsx` | Logout page | No changes (already working) |
| `backend/app/api/v1/auth.py` | Backend logout | Already has db.commit() |

---

## 📞 NEXT STEPS

### If Logout is Working ✅
1. Test all 3 test sequences above
2. No custom event messages = still need debugging
3. Move to code review phase

### If Logout Still Not Working ❌
1. Follow troubleshooting steps above
2. Collect debug info:
   - Screenshot of console
   - Screenshot of Network tab
   - Screenshot of localStorage
   - URL at each step
3. Check if you need to rebuild frontend:
   ```bash
   cd frontend
   npm run build
   # or for development
   npm run dev
   ```

---

## 🚀 DEPLOYMENT NOTES

Before deploying to production:
1. Test all logout scenarios
2. Verify custom events are working
3. Check backend token revocation is persisted
4. Test with multiple users/concurrent sessions
5. Monitor error logs for any issues

---

**Document:** Logout Debug Guide
**Last Updated:** Jan 23, 2026
**Status:** Ready for testing
**New Commits:** f4850b5, e864673

