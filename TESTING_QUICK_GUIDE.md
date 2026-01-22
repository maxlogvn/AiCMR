# 🧪 Quick Testing Guide

## Copy-Paste Test Credentials

### Account 1: Admin (Full Access)
```
Email:    admin@aicmr.local
Password: Admin@123456
```

### Account 2: Moderator (Content Moderation)
```
Email:    moderator@aicmr.local
Password: Moderator@123456
```

### Account 3: Member (Basic Features)
```
Email:    member@aicmr.local
Password: Member@123456
```

### Account 4: Guest (Limited Access)
```
Email:    testuser@example.com
Password: Test@123456
```

---

## Test URLs

| Purpose | URL |
|---------|-----|
| Login Page | http://localhost:3000/login |
| Profile Page | http://localhost:3000/user/profile |
| Dashboard (Admin only) | http://localhost:3000/dashboard |
| API Docs | http://localhost:8000/docs |
| API ReDoc | http://localhost:8000/redoc |

---

## One-Minute Test: Logout Works

```
1. Go to http://localhost:3000/login
2. Enter: admin@aicmr.local / Admin@123456
3. Click Login
4. Wait for redirect to profile page
5. Look for "Đăng xuất" button (top right or sidebar)
6. Click "Đăng xuất"
7. Should redirect to /login immediately ✅
8. Open DevTools (F12) → Application → localStorage
9. Should be EMPTY (no tokens) ✅
```

---

## Test API Logout (curl)

```bash
# 1. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aicmr.local",
    "password": "Admin@123456"
  }' | jq .

# Copy the access_token and refresh_token from response

# 2. Use token to call protected endpoint
curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer <paste_access_token_here>"

# 3. Logout
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer <paste_access_token_here>" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "<paste_refresh_token_here>"}'
```

---

## Test Permission Boundaries

### Admin Access
```
1. Login: admin@aicmr.local / Admin@123456
2. Navigate to: http://localhost:3000/dashboard
3. Should WORK ✅
4. You should see admin menu/features
```

### Member Access
```
1. Login: member@aicmr.local / Member@123456
2. Navigate to: http://localhost:3000/dashboard
3. Should REDIRECT or ERROR ❌
4. Navigate to: http://localhost:3000/user/profile
5. Should WORK ✅
```

### Verify Permissions Match Rank
```
Admin (Rank 5):
  ✅ /user/profile
  ✅ /dashboard
  ✅ /dashboard/users
  ✅ /dashboard/categories
  ✅ /dashboard/posts

Moderator (Rank 3):
  ✅ /user/profile
  ✅ Can view other user profiles (/user/[id])
  ❌ /dashboard

Member (Rank 1):
  ✅ /user/profile
  ❌ Cannot view other user profiles
  ❌ /dashboard

Guest (Rank 0):
  ✅ /user/profile (own only)
  ❌ Cannot view other user profiles
  ❌ /dashboard
```

---

## Browser Console Tests

```javascript
// Check if user is logged in
localStorage.getItem('access_token')
// Should return a JWT token string

// Decode token to see rank
const jwt = localStorage.getItem('access_token');
const payload = JSON.parse(atob(jwt.split('.')[1]));
console.log('Rank:', payload.rank);
// Should show: 5, 3, 1, or 0

// After logout, tokens should be gone
localStorage.getItem('access_token')
// Should return null
```

---

## Expected Behavior

### Successful Login
```
✅ Redirect to /user/profile
✅ Navbar shows user account menu
✅ Access token in localStorage
✅ Refresh token in localStorage
✅ Can access protected pages
```

### Successful Logout
```
✅ Redirect to /login page
✅ localStorage is EMPTY
✅ Cannot access /user/profile (redirects to /login)
✅ Cannot access /dashboard (redirects to /login)
```

### Permission Denied
```
✅ User tries /dashboard as member
✅ Gets redirected or sees error
✅ Rank check works correctly
```

---

## Troubleshooting

### Login doesn't work
- Check backend is running: http://localhost:8000/docs
- Check credentials are exactly correct
- Check database has the account

### Logout doesn't work
- Check browser console for errors (F12)
- Check Network tab to see if logout API was called
- Clear localStorage manually and try again

### Can't access dashboard
- Check if you're logged in as admin (rank 5)
- Try admin@aicmr.local / Admin@123456
- Check rank in JWT (see console test above)

### Tokens not cleared
- Check localStorage in DevTools (F12 → Application)
- Should be EMPTY after logout
- If not empty, manually clear: `localStorage.clear()`

---

## Files to Reference

- 📄 `TEST_ACCOUNTS.md` - Full documentation
- 🔧 `quick_test_reference.sh` - Quick reference
- 🐍 `backend/scripts/create_test_accounts.py` - Setup script
- 🔓 `frontend/src/app/logout/page.tsx` - Logout implementation
- 📱 `frontend/src/components/layout/Navbar.tsx` - Navbar logout button

---

## Summary

- 4 test accounts ready to use
- All permissions documented
- Logout now works correctly ✅
- Ready for development and testing 🚀
