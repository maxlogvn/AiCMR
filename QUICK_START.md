# 🚀 QUICK START - 5 MINUTE SETUP

## Start the Application

### Terminal 1 - Backend
```bash
cd backend
python create_test_users.py          # Create test accounts
python -m uvicorn app.main:app --reload --port 8000
```

### Terminal 2 - Frontend  
```bash
cd frontend
npm run dev
```

### Browser
```
Open: http://localhost:3000
Press F12 to open DevTools Console
```

---

## ✅ Critical Test (5 minutes)

**The most important test - reproduces the original bug fix:**

### Test: Different User Login (Bug Fix Verification)

1. **Login as first user:**
   - Email: `test1@example.com`
   - Password: `TestPassword123!`
   - ✓ Wait for dashboard to load
   - ✓ Note the profile shows "test1@example.com"

2. **Logout:**
   - Click the Logout button
   - ✓ Watch console (should see reset messages)
   - ✓ Check Application tab: tokens removed from localStorage

3. **Login as different user:**
   - Email: `admin@example.com`
   - Password: `AdminPassword123!`
   - ✓ Should see dashboard for admin

4. **Verify the fix worked:**
   - ✓ Profile shows "admin@example.com" (NOT test1!)
   - ✓ NO "Invalid CSRF token" errors
   - ✓ NO "Invalid email" errors
   - ✓ Console shows debug logs without errors

**If this test passes, the core bug is fixed! ✅**

---

## 📊 Console Logs to Expect

During **Logout**, you should see:
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
```

During **Next Login**, you should see:
```
[Auth] Attempting login for: admin@example.com
[CSRF] Token fetched successfully
[Auth] Login successful, storing tokens
```

---

## 🧪 Test Accounts

| Email | Password | Role |
|-------|----------|------|
| test1@example.com | TestPassword123! | MEMBER |
| test2@example.com | TestPassword456! | MEMBER |
| admin@example.com | AdminPassword123! | ADMIN |

---

## 📋 Verification Checklist

Run this anytime to verify implementation:
```bash
bash VERIFY_SESSION_FIX.sh
```

Expected output:
```
✅ Reset functions imported
✅ resetCsrfToken() called in logout
✅ resetApiState() called in logout
✅ resetCsrfToken() exported
✅ resetApiState() exported
✅ Cache-Control headers configured
✅ Database commit added for token revocation

✅ Implementation Status: VERIFIED
```

---

## 🎯 What This Fixes

### Before (Bug ❌)
1. User1 logs in → sees User1's data
2. User1 logs out
3. User2 logs in → **sees User1's data!** ❌
4. Error: "Invalid CSRF token"

### After (Fixed ✅)
1. User1 logs in → sees User1's data
2. User1 logs out
3. User2 logs in → **sees User2's data** ✅
4. No CSRF errors ✅

---

## 📚 Need More Info?

- **Quick overview:** Read `START_HERE.md`
- **Full test guide:** Read `TEST_ACCOUNTS_GUIDE.md`
- **Technical details:** Read `LOGIN_LOGOUT_SESSION_FIX.md`
- **Troubleshooting:** Read `TROUBLESHOOT_LOGOUT.md`
- **All next steps:** Read `NEXT_STEPS.md`

---

## ⏱️ Timing

- **Setup:** 2 minutes
- **Critical test:** 3-5 minutes
- **Full manual testing:** 30-60 minutes
- **Code review:** 15-30 minutes

**Total to verify fix is ready: ~1 hour**

---

## 🚨 If Something Goes Wrong

1. **See old user's data after login?**
   - Run `bash VERIFY_SESSION_FIX.sh`
   - Read `TROUBLESHOOT_LOGOUT.md` - "Old user data showing"

2. **"Invalid CSRF token" error?**
   - Check DevTools console for reset messages
   - Run `bash VERIFY_SESSION_FIX.sh`
   - Read `TROUBLESHOOT_LOGOUT.md` - "CSRF token errors"

3. **Tokens not clearing from localStorage?**
   - Open DevTools → Application → Storage → localStorage
   - Logout and check if tokens removed
   - Read `TROUBLESHOOT_LOGOUT.md` - "Tokens not clearing"

4. **Can't create test users?**
   - Check backend is running
   - Run: `python backend/create_test_users.py`
   - Check database connection

---

## ✅ Success Indicators

You'll know the fix works when:
- ✅ Can login/logout without errors
- ✅ Can switch between different users
- ✅ New user sees their own data (not previous user's)
- ✅ Console logs show all 6 logout steps
- ✅ localStorage completely empty after logout
- ✅ No CSRF or "Invalid email" errors

---

**Ready? Let's go! Start with Terminal 1 above. → Follow the Critical Test.**

