# 🧪 Test Accounts & Manual Testing Guide

## 📝 Quick Setup

### 1. Create Test Users

Run this script to create test accounts in the database:

```bash
cd backend
python create_test_users.py
```

Output:
```
✅ Created user: test1@example.com
✅ Created user: test2@example.com
✅ Created user: admin@example.com

📋 Current users in database:
  • test1@example.com       | test1           | MEMBER
  • test2@example.com       | test2           | MEMBER
  • admin@example.com       | admin           | ADMIN
```

### 2. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

Open browser: http://localhost:3000

---

## 👥 Test Accounts

### User Account 1
```
Email:    test1@example.com
Username: test1
Password: TestPassword123!
Rank:     MEMBER
```

### User Account 2
```
Email:    test2@example.com
Username: test2
Password: TestPassword456!
Rank:     MEMBER
```

### Admin Account
```
Email:    admin@example.com
Username: admin
Password: AdminPassword123!
Rank:     ADMIN
```

---

## 🧪 Manual Testing Scenarios

### Test 1: Basic Login
1. Open http://localhost:3000/login
2. Enter: test1@example.com / TestPassword123!
3. Click "Đăng nhập"
4. ✅ Should redirect to profile page
5. ✅ Should see "Hồ sơ" in navbar

### Test 2: Basic Logout
1. Login as test1@example.com
2. Navigate to Profile (/user/profile)
3. Click "Đăng xuất" button
4. ✅ Should see notification "Đăng xuất thành công"
5. ✅ Should redirect to /login page
6. ✅ Should not see "Đăng xuất" button anymore

### Test 3: Login → Logout → Login Different User (CRITICAL FIX TEST)
1. Login as test1@example.com
   - ✅ See "test1" in profile
2. Click Logout
   - ✅ See "[Auth] Logging out" in console
   - ✅ See "[CSRF] Token cache reset for new session" in console
   - ✅ See "[API] Interceptor state reset for new session" in console
3. Login as test2@example.com
   - ✅ See "test2" in profile (not test1!)
   - ✅ NO "Invalid CSRF token" error
   - ✅ Should work smoothly

### Test 4: Protected Routes
1. Login as test1@example.com
2. Go to /user/profile
3. Verify profile shows test1's email
4. Logout
5. Try to manually access /user/profile
   - ✅ Should redirect to /login
6. Login as test2@example.com
7. Go to /user/profile
   - ✅ Should show test2's email

### Test 5: Admin Panel Access
1. Login as test1@example.com (regular user)
2. Try to access /dashboard
   - ✅ Should be forbidden or redirect
3. Logout
4. Login as admin@example.com
5. Try to access /dashboard
   - ✅ Should load dashboard
   - ✅ Should see "Quản trị" in navbar

### Test 6: Invalid Credentials
1. Open /login
2. Enter: test1@example.com / WrongPassword
3. Click "Đăng nhập"
4. ✅ Should see error message
5. ✅ Should stay on login page
6. ✅ Should NOT be redirected

### Test 7: Browser DevTools Verification
1. Open DevTools (F12)
2. Go to Application → Cookies/Storage
3. Login as test1@example.com
4. Check localStorage:
   - ✅ `access_token` exists
   - ✅ `refresh_token` exists
5. Logout
   - ✅ Both tokens removed from localStorage
6. Login as test2@example.com
   - ✅ New tokens stored (different from test1's)

### Test 8: Network Tab Verification
1. Open DevTools → Network tab
2. Login and make some requests
3. Check response headers:
   - ✅ `Cache-Control: no-cache, no-store, must-revalidate`
   - ✅ `Pragma: no-cache`
4. Logout → Login different user
   - ✅ New requests have fresh cache headers

### Test 9: Console Logs During Logout
Expected console output:
```
[Navbar] Logout initiated
[Auth] Logging out
[Auth] Notifying backend of logout
[Auth] Backend logout notification successful
[CSRF] Token cache reset for new session
[API] Interceptor state reset for new session
[Auth] API state reset complete
[Navbar] Logout successful
```

### Test 10: Rapid Logout/Login
1. Login as test1@example.com
2. Click Logout (don't wait)
3. Immediately fill login form for test2@example.com
4. Submit login form
5. ✅ Should handle race condition correctly
6. ✅ Should see test2's profile (not test1's)

---

## 🔍 Debugging Checklist

### Issue: Can't login
- [ ] Backend running? (http://localhost:8000/api/v1/docs)
- [ ] Frontend running? (http://localhost:3000)
- [ ] Test users created? (Run `python create_test_users.py`)
- [ ] Check backend logs for errors
- [ ] Check browser console for errors

### Issue: Logout not working
- [ ] Check browser console for "[Auth] Logging out"
- [ ] Check if "Notifying backend of logout" appears
- [ ] Check backend logs for logout endpoint hit
- [ ] Check if tokens are removed from localStorage
- [ ] Check DevTools Network tab for logout request

### Issue: Can't login different user after logout
- [ ] Check console for "[CSRF] Token cache reset" message
- [ ] Check console for "[API] Interceptor state reset" message
- [ ] Check if "Invalid CSRF token" error appears
- [ ] Verify new CSRF token is being fetched
- [ ] Check Network tab for proper cache headers

### Issue: Seeing old user's data
- [ ] Check DevTools Application tab for cached cookies
- [ ] Check Network tab for 200 responses (should refetch)
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check if cache control headers are present

---

## 📊 Test Results Template

Copy and use this to document your testing:

```
Test Run Date: [DATE]
Tester: [NAME]
Environment: [DEV/PROD]

Test Results:
- [ ] Test 1: Basic Login ✓/✗
- [ ] Test 2: Basic Logout ✓/✗
- [ ] Test 3: Login→Logout→Login Different User ✓/✗
- [ ] Test 4: Protected Routes ✓/✗
- [ ] Test 5: Admin Panel Access ✓/✗
- [ ] Test 6: Invalid Credentials ✓/✗
- [ ] Test 7: Browser Storage ✓/✗
- [ ] Test 8: Network Headers ✓/✗
- [ ] Test 9: Console Logs ✓/✗
- [ ] Test 10: Rapid Logout/Login ✓/✗

Issues Found:
[List any issues here]

Notes:
[Any additional observations]
```

---

## 🚀 Automated Testing

Once manual tests pass, you can set up automated E2E tests:

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test frontend/login-logout-sequence-e2e.test.ts
```

See `frontend/login-logout-sequence-e2e.test.ts` for test cases.

---

## 📞 Troubleshooting

### Can't find database file
- Make sure backend migrations have run
- Check `DATABASE_URL` in `.env`

### Users already exist error
- Just run the script again, it skips existing users
- Or manually delete users from database

### Wrong password error
- Triple-check the password in the script
- Make sure you're not accidentally changing the password
- Try resetting the database and recreating users

### CSRF token errors
- This is what we fixed! Run `bash VERIFY_SESSION_FIX.sh` to verify fix
- Check console logs for "[CSRF] Token cache reset"
- Clear browser cache if persisting

---

## 📚 Related Documentation

- **Session Fix**: See `LOGIN_LOGOUT_SESSION_FIX.md`
- **Verification**: Run `bash VERIFY_SESSION_FIX.sh`
- **Auth Flow**: See `frontend/AUTH_E2E_TESTING.md`
- **API Docs**: http://localhost:8000/api/v1/docs

---

**Last Updated**: January 23, 2026
