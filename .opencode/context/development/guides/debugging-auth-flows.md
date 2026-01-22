# Debugging Authentication Flows

## Overview

Step-by-step debugging procedures for login, logout, and session management issues in authentication flows.

## When to Use

- Logout not clearing user data properly
- Login fails after logout
- Session state inconsistencies
- CSRF token errors between users
- Cache persistence issues

## Quick Debugging Steps

### Step 1: Console Log Verification
**Action:** Check browser console for auth events
**Validation:** Look for custom event messages
```javascript
// Expected messages during logout:
"[Auth] Logging out"
"[CSRF] Token cache reset for new session" 
"[API] Interceptor state reset for new session"
"[Auth] Backend logout notification successful"
```

### Step 2: LocalStorage Check
**Action:** Inspect localStorage state
**Validation:** Tokens should be cleared after logout
```javascript
// DevTools → Application → localStorage
// After logout, should be empty:
access_token: (removed)
refresh_token: (removed)
```

### Step 3: Network Tab Analysis
**Action:** Monitor API requests during auth flow
**Validation:** Check for proper headers and responses
- CSRF requests get fresh tokens
- No 401/403 errors on valid requests
- Cache-Control headers present

### Step 4: Component State Verification
**Action:** Test different user login sequence
**Validation:** Profile data updates correctly
```
1. Login as user A → Note profile data
2. Logout → Check console messages
3. Login as user B → Verify shows user B data (not A)
```

## Common Issues

- **Issue:** Console messages not appearing
  **Solution:** Verify event listeners are properly registered
  
- **Issue:** localStorage not clearing
  **Solution:** Check if logout function is actually called

- **Issue:** Different user shows old data  
  **Solution:** Verify React Query cache is cleared on logout event

## Success Criteria

- [ ] Console shows all expected logout messages
- [ ] localStorage completely empty after logout
- [ ] No CSRF token errors
- [ ] Different user login shows correct data
- [ ] No authentication errors in network tab

## Reference

- Source: LOGOUT_FIX_SUMMARY.md
- Related: development/errors/browser-events-errors.md
- Related: development/examples/custom-event-pattern.md