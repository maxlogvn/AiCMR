# Authentication Errors

## CSRF Token Cache Persistence

**Symptom:**
```
Error: Invalid CSRF token
// Different user login after logout fails
```

**Cause:** CSRF token cached in promise variable not reset between user sessions. New user gets old user's cached CSRF token.

**Solution:**
1. Reset CSRF token cache on logout
2. Fetch fresh CSRF token for each session
3. Clear cached promise before token requests

**Code:**
```typescript
// ❌ Before - Token cached indefinitely
let csrfTokenPromise: Promise<string> | null = getCsrfToken();

// ✅ After - Reset cache on logout
export function resetCsrfToken() {
  csrfTokenPromise = null;
}

// Call during logout
async logout() {
  resetCsrfToken();  // Clear cached token
  localStorage.clear();
}
```

**Prevention:** Always reset API state before clearing user tokens.

## Session Data Contamination

**Symptom:**
- Login as User A, logout, login as User B
- User B sees User A's profile data
- API responses show wrong user information

**Cause:** Browser serves cached authenticated responses from previous user session.

**Solution:**
Add cache control headers to prevent response caching:
```typescript
api.interceptors.request.use((config) => {
  config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
  config.headers["Pragma"] = "no-cache";
  config.headers["Expires"] = "0";
  return config;
});
```

## Axios Interceptor State Persistence

**Symptom:**
- Token refresh logic confused after logout/login
- Authorization headers from previous session persist
- `isRefreshing` flag stuck in wrong state

**Solution:**
```typescript
export function resetApiState() {
  isRefreshing = false;
  delete api.defaults.headers.common['Authorization'];
}

// Call during logout before clearing tokens
```

## Storage Event Same-Tab Issue

**Symptom:**
- Logout in current tab doesn't update other components
- Components still show logged-in state

**Cause:** Storage events only fire cross-tab, not in same tab where change occurred.

**Solution:** Use custom events for same-tab communication
```typescript
// Dispatch after logout
window.dispatchEvent(new CustomEvent("auth:logout"));

// Listen in components
window.addEventListener("auth:logout", handleLogout);
```

**Frequency:** Very common in SPA logout flows
**Reference:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

## Related

- development/concepts/session-state-management.md
- development/guides/implementing-logout.md
- development/examples/session-cleanup-example.md