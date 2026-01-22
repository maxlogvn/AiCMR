# 🎬 QUICK START - PHASE 1 EXECUTION

**Duration:** 5 minutes  
**Objective:** Verify logout fix works in real environment

---

## ⚡ 30-Second Setup

### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
✓ Should say: "Uvicorn running on http://127.0.0.1:8000"

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✓ Should say: "ready - started server on 0.0.0.0:3000"

### Browser
```
1. Open: http://localhost:3000
2. Press F12 (Open DevTools)
3. Go to Console tab
```

---

## 🧪 TEST EXECUTION

### Step 1: Login
```
Email: test1@example.com
Password: TestPassword123!
Click: Login button
```

**Expected:** See dashboard/profile page

---

### Step 2: Prepare Console
```
1. In DevTools Console tab
2. Type: console.clear()
3. Press Enter
```

**Why:** Remove old logs, see logout messages clearly

---

### Step 3: Logout
```
1. Look for "Đăng xuất" button (Vietnamese for "Logout")
   Usually in top-right navbar
2. Click it
3. Watch the Console tab
```

**Expected Console Messages (in order):**
```
[Auth] Logging out
[Auth] Dispatching logout event
[useUser] Received logout event, clearing user cache
[Navbar] Received logout event, resetting state
```

---

### Step 4: Verify Storage
```
1. DevTools → Application tab (or Storage)
2. Left sidebar → Local Storage
3. Click http://localhost:3000
```

**Expected:**
- `access_token`: **EMPTY** (or not visible)
- `refresh_token`: **EMPTY** (or not visible)
- No token data anywhere

---

### Step 5: Check Page State
```
1. You should be on /login page
2. No error messages
3. No red text in console
4. Login form visible
```

**Expected:** Clean redirect to login page

---

## ✅ QUICK PASS/FAIL CHECKLIST

| Item | Expected | Your Result |
|------|----------|-------------|
| Backend starts | "Uvicorn running on..." | ☐ Yes ☐ No |
| Frontend starts | "ready - started server" | ☐ Yes ☐ No |
| Can login | Profile page displays | ☐ Yes ☐ No |
| Console msg 1 | "[Auth] Logging out" | ☐ Yes ☐ No |
| Console msg 2 | "[Auth] Dispatching logout event" | ☐ Yes ☐ No |
| Console msg 3 | "[useUser] Received logout event..." | ☐ Yes ☐ No |
| Console msg 4 | "[Navbar] Received logout event..." | ☐ Yes ☐ No |
| Storage empty | No tokens in localStorage | ☐ Yes ☐ No |
| Redirect works | Redirected to /login | ☐ Yes ☐ No |
| No errors | Clean console (no red text) | ☐ Yes ☐ No |

---

## 🎯 SCORING

- **10/10 checks pass:** ✅ **TEST PASSED** → Go to Phase 2
- **8-9 pass:** ⚠️ **MOSTLY PASS** → Check step 5
- **<8 pass:** ❌ **TEST FAILED** → Read troubleshooting below

---

## 🚨 QUICK TROUBLESHOOTING

### Problem: Can't see console messages
**Fix:** Press F12 again to refresh DevTools, or:
```bash
# Rebuild frontend
cd frontend
npm run dev  # Ctrl+C to stop, run again
```

### Problem: Storage still has tokens
**Fix:** Check if logout was called properly:
1. Watch for all 4 console messages
2. If missing msg 2-4: Frontend code changes not applied
3. If missing msg 1: Logout button not working

### Problem: Stuck on dashboard page
**Fix:** 
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check console for error messages

### Problem: Login failed
**Fix:** 
1. Check backend running (terminal 1)
2. Check network in DevTools (red failed requests?)
3. Check test user exists: `python backend/create_test_users.py`

---

## 📊 SAMPLE CONSOLE OUTPUT (What Success Looks Like)

```
[Auth] Logging out
[Auth] Tokens after clear: { accessToken: null, refreshToken: null }
[Auth] Dispatching logout event
[useUser] Received logout event, clearing user cache
[Navbar] Received logout event, resetting state
[LogoutPage] Logout successful, redirecting to login

GET /login 200
```

**Note:** Message order may vary slightly, but all 4 main messages should appear.

---

## 🚀 WHAT HAPPENS IF IT WORKS

Excellent! You've confirmed:
- ✅ Custom event dispatch works
- ✅ useUser hook listening works  
- ✅ Navbar update works
- ✅ Storage clearing works
- ✅ Redirect works

**Next:** Read `NEXT_STEPS_TESTING_PLAN.md` Phase 2 for full test suite

---

## 🔗 RELATED DOCS

- **Full Testing Plan:** `NEXT_STEPS_TESTING_PLAN.md`
- **Detailed Summary:** `LOGOUT_FIX_SUMMARY.md`
- **Troubleshooting:** `LOGOUT_DEBUG.md`
- **Code Changes:** See commits `f4850b5`, `e864673`

---

**Estimated Time:** 5 minutes  
**Complexity:** Very Low  
**Risk:** None (read-only test)

Ready? Let's go! 🚀
