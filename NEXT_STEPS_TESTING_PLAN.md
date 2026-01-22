# 🚀 NEXT STEPS - LOGOUT FIX TESTING PLAN

**Date:** Jan 23, 2026  
**Status:** ✅ Code fixes applied and committed  
**Objective:** Execute comprehensive testing and validation of logout fix

---

## 📋 QUICK OVERVIEW

### What's Been Done ✅
- Custom logout event dispatch added to `auth.ts`
- useUser hook updated to listen to logout event
- Navbar component updated to listen to logout event
- All code committed (4 commits)
- Both servers verified to start successfully

### What Needs To Be Done ⏳
1. **Quick Manual Test** (5 mins) - Verify basic logout works
2. **Full Test Suite** (30 mins) - Test all scenarios
3. **Code Review** (15 mins) - Peer review of changes
4. **Edge Case Testing** (15 mins) - Test unusual scenarios
5. **Documentation Verification** (10 mins) - Ensure docs are clear
6. **Deployment Prep** (5 mins) - Final checks before deploy

---

## ⚡ PHASE 1: QUICK MANUAL TEST (5 minutes)

### Prerequisites
- Both servers running
- Dev tools open (F12)

### Test Steps

```bash
# Terminal 1: Start backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Start frontend  
cd frontend
npm run dev

# Browser: http://localhost:3000
```

### Test Checklist

| Step | Action | Expected Result | Pass? |
|------|--------|-----------------|-------|
| 1 | Open browser DevTools (F12) | Console tab visible | ☐ |
| 2 | Login: test1@example.com / TestPassword123! | See profile page, no errors | ☐ |
| 3 | Look at Console (clear existing logs first) | Clean console ready | ☐ |
| 4 | Click "Đăng xuất" button | Watch console | ☐ |
| 5 | See console message: "[Auth] Logging out" | ✅ Message appears | ☐ |
| 6 | See console message: "[Auth] Dispatching logout event" | ✅ Message appears | ☐ |
| 7 | See console message: "[useUser] Received logout event" | ✅ Message appears | ☐ |
| 8 | See console message: "[Navbar] Received logout event" | ✅ Message appears | ☐ |
| 9 | Check DevTools → Application → Storage | localStorage EMPTY | ☐ |
| 10 | Redirected to /login page | ✅ Redirect works | ☐ |
| 11 | NO error messages in console | Clean console | ☐ |
| 12 | NO "Invalid CSRF token" errors | ✅ No CSRF errors | ☐ |

### If Quick Test Passes ✅
Proceed to Phase 2 (Full Test Suite)

### If Quick Test Fails ❌
1. Read error messages in console (red text)
2. Consult `LOGOUT_DEBUG.md` troubleshooting section
3. Check frontend was rebuilt: `npm run dev` shows "ready - started server"
4. Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
5. Check both `auth.ts`, `useUser.ts`, `Navbar.tsx` have correct code

---

## 📊 PHASE 2: FULL TEST SUITE (30 minutes)

### Test Account Setup

**Create test accounts:**
```bash
cd backend
python create_test_users.py
```

**Test Accounts:**
```
Account 1: test1@example.com / TestPassword123! (Member role)
Account 2: test2@example.com / TestPassword456! (Member role)
Admin:     admin@example.com / AdminPassword123! (Admin role)
```

### Test Scenarios

#### Test 2.1: Single Logout (Basic Flow)
**Objective:** Verify single logout works correctly

```
1. Login: test1@example.com / TestPassword123!
   ✓ See test1's profile data
   
2. Verify Navbar shows:
   ✓ Correct user name
   ✓ Logout button visible
   
3. Click "Đăng xuất" button
   ✓ Console shows 4 custom event messages
   ✓ localStorage completely empty
   ✓ Redirects to /login
   
4. Try accessing /dashboard
   ✓ Redirected to /login (no auth)
```

**Pass Criteria:** All steps complete without errors

---

#### Test 2.2: Multiple Logout/Login Cycles
**Objective:** Verify no cache corruption with repeated actions

```
CYCLE 1:
1. Login: test1@example.com
   ✓ See test1's profile
   
2. Logout
   ✓ Console messages appear
   ✓ localStorage empty
   
CYCLE 2:
3. Login: test2@example.com
   ✓ See test2's profile (NOT test1!)
   ✓ Navbar shows test2 data
   
4. Logout
   ✓ localStorage empty
   
CYCLE 3:
5. Login: admin@example.com
   ✓ See admin's profile
   ✓ Admin controls visible
   
6. Logout
   ✓ localStorage empty
```

**Pass Criteria:** Each cycle is completely isolated, no cache leakage

---

#### Test 2.3: Different User After Logout
**Objective:** Critical - verify old user data doesn't persist

```
SETUP:
- Browser DevTools open (Application tab)
- Watch localStorage and Network tab

TEST:
1. Login: test1@example.com / TestPassword123!
   ✓ Profile shows: test1@example.com
   ✓ localStorage has access_token
   
2. Logout
   ✓ [useUser] message: "clearing user cache"
   ✓ localStorage EMPTY
   ✓ Redirect to /login
   
3. Login: admin@example.com / AdminPassword123!
   ✓ Profile shows: admin@example.com (NOT test1!)
   ✓ Admin-only features visible
   ✓ NO "test1" data anywhere on page
   
4. Check Network tab
   ✓ Last request: GET /api/auth/me
   ✓ Response: admin user data
   ✓ NO cached test1 data returned
```

**Pass Criteria:** Admin profile shows correctly, zero test1 data visible

---

#### Test 2.4: Token Cleanup Verification
**Objective:** Ensure all tokens cleared from storage

```
SETUP:
- DevTools Application → Storage

TEST:
1. Login: test1@example.com
   ✓ localStorage shows:
     - access_token: present
     - refresh_token: present (if exists)
   
2. Click "Đăng xuất"
   ✓ Immediately check localStorage
   ✓ access_token: GONE
   ✓ refresh_token: GONE
   ✓ No token data remains
   
3. Try page refresh (F5)
   ✓ Redirect to /login (not authenticated)
```

**Pass Criteria:** Storage completely clean after logout

---

#### Test 2.5: Rapid Logout/Login (Stress Test)
**Objective:** Verify no race conditions

```
1. Login: test1@example.com
   
2. Click "Đăng xuất" IMMEDIATELY, then browser back button
   ✓ Should show /login (can't go back to protected page)
   ✓ NO 404 errors
   
3. Login: test2@example.com
   ✓ Shows test2 profile correctly
   
4. Rapid logout and login again
   ✓ Shows test2 profile (not mixed with other data)
```

**Pass Criteria:** No race conditions, no mixed data

---

#### Test 2.6: Browser Tab Sync (Storage Event)
**Objective:** Verify storage event works across tabs (old method still works)

```
SETUP:
- Open browser with 2 tabs

TEST:
1. Tab A: Login test1@example.com
2. Tab B: Open same app at http://localhost:3000
3. Tab B: See login page (not authenticated from tab A)
4. Tab A: Click logout
5. Tab B: Storage event fires (old behavior)
   ✓ Page recognizes logout via storage event
   
NOTE: This is the OLD method. Custom event is for same-tab.
Both should work together.
```

**Pass Criteria:** Cross-tab logout works via storage event

---

## 🔍 PHASE 3: CODE REVIEW (15 minutes)

### Review Files

#### Review 3.1: auth.ts logout method

**File:** `frontend/src/lib/auth.ts` (lines 83-91)

**Expected:**
```typescript
// Line 85-86
console.log("[Auth] Dispatching logout event");
window.dispatchEvent(new CustomEvent("auth:logout", { 
  detail: { timestamp: Date.now() } 
}));
```

**Questions:**
- [ ] Is custom event dispatched AFTER tokens cleared?
- [ ] Does detail object include timestamp?
- [ ] Is error handling correct?

---

#### Review 3.2: useUser.ts logout listener

**File:** `frontend/src/hooks/useUser.ts` (lines 26-34)

**Expected:**
```typescript
// Line 27-31
const handleLogoutEvent = () => {
  console.log("[useUser] Received logout event, clearing user cache");
  queryClient.setQueryData(["user", "me"], null);
  queryClient.removeQueries({ queryKey: ["user", "me"] });
};

window.addEventListener("auth:logout", handleLogoutEvent);
```

**Questions:**
- [ ] Is listener attached to window?
- [ ] Does it clear both setQueryData AND removeQueries?
- [ ] Is cleanup in return statement correct?

---

#### Review 3.3: Navbar.tsx logout listener

**File:** `frontend/src/components/layout/Navbar.tsx` (lines 30-38)

**Expected:**
```typescript
// Line 30-35
const handleLogoutEvent = () => {
  console.log("[Navbar] Received logout event, resetting state");
  setToken(null);
  setMobileMenuOpen(false);
};

window.addEventListener("auth:logout", handleLogoutEvent);
```

**Questions:**
- [ ] Is both token and menu state cleared?
- [ ] Is listener cleanup correct?
- [ ] Is this consistent with auth.ts dispatch?

---

### Code Review Checklist

| Aspect | Status | Notes |
|--------|--------|-------|
| All 3 files have changes | ☐ | auth.ts, useUser.ts, Navbar.tsx |
| Custom event name consistent | ☐ | "auth:logout" everywhere |
| All listeners cleaned up | ☐ | return () => { removeEventListener(...) } |
| Console logs helpful | ☐ | Clear messages for debugging |
| No breaking changes | ☐ | Old storage event still works |
| Type safety | ☐ | No TypeScript errors |
| Error handling | ☐ | Graceful error handling in place |

---

## 🎯 PHASE 4: EDGE CASE TESTING (15 minutes)

### Edge Case 4.1: Logout Without Login
```
1. Open /login page directly
2. Don't login, access localStorage
3. Manually trigger logout (if possible)
✓ No errors, graceful handling
```

### Edge Case 4.2: Multiple Logout Clicks
```
1. Login successfully
2. Click "Đăng xuất" 3 times rapidly
✓ No duplicate events
✓ Only logs once
✓ Redirects to login once
```

### Edge Case 4.3: Logout With Network Error
```
1. Open DevTools → Network → Offline
2. Login successfully (cached or bypass)
3. Try to logout
✓ Graceful error message
✓ Still attempts to clear tokens
✓ Still clears cache
```

### Edge Case 4.4: Logout After Session Expiry
```
1. Login: test1@example.com
2. Wait for token expiry (or manually clear localStorage)
3. Click logout
✓ No 401 errors
✓ Still clears state
✓ Redirects to login
```

---

## 📚 PHASE 5: DOCUMENTATION VERIFICATION (10 minutes)

### Verify Documentation Files Exist

- [ ] `LOGOUT_FIX_SUMMARY.md` - Complete overview
- [ ] `LOGOUT_DEBUG.md` - Debugging guide
- [ ] `VERIFICATION_RESULTS.md` - Manual test steps
- [ ] `TROUBLESHOOT_LOGOUT.md` - Common issues
- [ ] `LOGIN_LOGOUT_SESSION_FIX.md` - Technical deep-dive

### Check Documentation Clarity

| Doc | Checklist |
|-----|-----------|
| LOGOUT_FIX_SUMMARY.md | ☐ Quick overview clear? ☐ Problem stated? ☐ Solution explained? |
| LOGOUT_DEBUG.md | ☐ Debugging steps clear? ☐ Expected outputs shown? |
| VERIFICATION_RESULTS.md | ☐ Test instructions clear? ☐ All scenarios covered? |
| TROUBLESHOOT_LOGOUT.md | ☐ Common issues listed? ☐ Solutions provided? |

---

## ✅ PHASE 6: DEPLOYMENT PREP (5 minutes)

### Pre-Deployment Checklist

| Check | Status | Notes |
|-------|--------|-------|
| All code committed | ☐ | git log shows 4 commits |
| No uncommitted changes | ☐ | git status = clean |
| All tests passing | ☐ | Quick + full test suites pass |
| Build succeeds (or acceptable errors) | ☐ | npm run build completes |
| Documentation complete | ☐ | All docs written and reviewed |
| No security issues | ☐ | Token handling secure |
| No breaking changes | ☐ | Backward compatible |
| Rollback plan exists | ☐ | Can revert if needed |

---

## 📊 TESTING PROGRESS TRACKER

### Phase Completion Status

```
Phase 1: Quick Manual Test (5 min)
├─ Status: [ ] Not started [ ] In Progress [✅] Completed [ ] Failed
├─ Time taken: ___ minutes
└─ Notes: ___________

Phase 2: Full Test Suite (30 min)
├─ Status: [ ] Not started [ ] In Progress [ ] Completed [ ] Failed
├─ Tests passed: ___/6
└─ Notes: ___________

Phase 3: Code Review (15 min)
├─ Status: [ ] Not started [ ] In Progress [ ] Completed [ ] Failed
├─ Issues found: ___
└─ Notes: ___________

Phase 4: Edge Case Testing (15 min)
├─ Status: [ ] Not started [ ] In Progress [ ] Completed [ ] Failed
├─ Cases passed: ___/4
└─ Notes: ___________

Phase 5: Documentation (10 min)
├─ Status: [ ] Not started [ ] In Progress [ ] Completed [ ] Failed
├─ Issues found: ___
└─ Notes: ___________

Phase 6: Deployment Prep (5 min)
├─ Status: [ ] Not started [ ] In Progress [ ] Completed [ ] Failed
└─ Notes: ___________
```

---

## 🚨 TROUBLESHOOTING QUICK REFERENCE

### Problem: Console messages not showing
**Solutions:**
1. Check frontend rebuilt: `npm run dev` output
2. Hard refresh: Ctrl+Shift+R
3. Clear browser cache
4. Verify code in auth.ts lines 85-86

### Problem: Redirect to /login not working
**Solutions:**
1. Check network response in DevTools
2. Verify `/login` page exists
3. Check routing configuration
4. Verify logout endpoint returns 200

### Problem: Different user data showing after logout
**Solutions:**
1. Verify React Query cache cleared: `queryClient.removeQueries()`
2. Check localStorage is empty
3. Check Network tab for cached responses
4. Try hard refresh after logout/login

### Problem: Storage event not triggering
**Solutions:**
1. Check `window.addEventListener("storage", ...)` in useUser
2. Verify localStorage actually changed
3. Check cross-tab behavior (different browser windows)
4. Use custom event for same-tab (should work)

### Problem: Navbar not updating
**Solutions:**
1. Check custom event listener in Navbar.tsx
2. Verify `setToken(null)` is called
3. Check state hook initialization
4. Verify event bubbles (not prevented elsewhere)

---

## 📞 NEXT SESSION CONTEXT

**If pausing and resuming later:**

1. **Quick context check:**
   ```bash
   git log --oneline -5  # See recent commits
   git status             # Check working state
   cat LOGOUT_FIX_SUMMARY.md  # Read summary
   ```

2. **Resume testing:**
   - Check which phase was completed
   - Pick up from next phase
   - Use progress tracker above

3. **Key files to remember:**
   - `frontend/src/lib/auth.ts` (line 85 - dispatch event)
   - `frontend/src/hooks/useUser.ts` (line 27 - listen event)
   - `frontend/src/components/layout/Navbar.tsx` (line 30 - listen event)

---

## 🎓 SUCCESS CRITERIA (All Must Pass)

✅ **Phase 1 - Quick Test:** All 12 checklist items ✓
✅ **Phase 2 - Full Suite:** All 6 test scenarios pass
✅ **Phase 3 - Code Review:** All code looks correct  
✅ **Phase 4 - Edge Cases:** All 4 cases handled gracefully
✅ **Phase 5 - Documentation:** All docs clear and complete
✅ **Phase 6 - Deployment:** All pre-checks pass

---

## 🚀 ESTIMATED TIMELINE

| Phase | Time | Status |
|-------|------|--------|
| Phase 1: Quick Test | 5 min | Ready to start |
| Phase 2: Full Suite | 30 min | Depends on Phase 1 ✓ |
| Phase 3: Code Review | 15 min | Depends on Phase 2 ✓ |
| Phase 4: Edge Cases | 15 min | Depends on Phase 3 ✓ |
| Phase 5: Documentation | 10 min | Ongoing |
| Phase 6: Deployment | 5 min | Final check |
| **TOTAL** | **80 minutes** | **Ready to execute** |

---

## ✨ FINAL NOTES

**This is a critical fix for:**
- ✅ Preventing user data leakage between logins
- ✅ Fixing same-tab logout issue
- ✅ Improving security posture
- ✅ Maintaining user trust

**Success = User data properly cleared on logout, no cross-contamination between users**

---

**Created:** Jan 23, 2026  
**Last Updated:** Jan 23, 2026  
**Status:** Ready for Phase 1 testing  
**Next Action:** Start Phase 1 - Quick Manual Test
