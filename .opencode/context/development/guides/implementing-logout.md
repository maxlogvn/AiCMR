# Implementing Frontend Logout

## Overview

Complete logout implementation with proper session cleanup to prevent data contamination between users and ensure fresh authentication state.

## When to Use

- Implementing user logout functionality
- Fixing session state persistence issues
- Preventing user data bleeding between sessions
- Resolving CSRF token caching problems

## Prerequisites

- Axios interceptors configured
- CSRF token management in place  
- LocalStorage token storage
- Backend logout endpoint available

## Implementation Steps

### Step 1: Create Reset Functions
**Action:** Export state reset functions from API module
```typescript
// api.ts
export function resetCsrfToken() {
  csrfTokenPromise = null;
  console.log("[CSRF] Token cache reset for new session");
}

export function resetApiState() {
  isRefreshing = false;
  delete api.defaults.headers.common['Authorization'];
  console.log("[API] Interceptor state reset for new session");
}
```

### Step 2: Implement 3-Phase Logout  
**Action:** Create comprehensive logout method
```typescript
// auth.ts
import { resetCsrfToken, resetApiState } from "./api";

async logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const refreshToken = this.getRefreshToken();
    
    // Phase 1: Reset API state BEFORE clearing tokens
    resetCsrfToken();
    resetApiState();
    
    // Phase 2: Clear tokens from storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    // Phase 3: Notify backend (best effort)
    if (refreshToken) {
      await api.post("/auth/logout", { refresh_token: refreshToken });
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Step 3: Add Cache Control Headers
**Action:** Prevent browser caching of authenticated requests
```typescript
// api.ts interceptor
api.interceptors.request.use(async (config) => {
  // Prevent caching
  config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
  config.headers["Pragma"] = "no-cache";
  config.headers["Expires"] = "0";
  
  return config;
});
```

### Step 4: Update Component Logout Handler
**Action:** Use proper logout service in components
```typescript
// Navbar.tsx
const handleLogout = async () => {
  setIsLoading(true);
  try {
    await authService.logout();
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    router.push("/login"); // Force redirect anyway
  } finally {
    setIsLoading(false);
  }
};
```

## Validation Steps

1. **Console logs appear** - Check for reset function messages
2. **LocalStorage cleared** - Tokens removed after logout  
3. **Fresh CSRF tokens** - New tokens fetched for different user
4. **No cached data** - Different user sees their own data
5. **Backend notified** - Logout endpoint called successfully

## Success Criteria

- [ ] Reset functions called before token clearing
- [ ] LocalStorage completely empty after logout  
- [ ] Console shows state reset messages
- [ ] Different user login works without errors
- [ ] No CSRF token reuse between sessions
- [ ] Cache control headers prevent stale data

## Common Gotchas

- **Order matters** - Reset API state BEFORE clearing tokens
- **Async cleanup** - Don't wait for backend notification to complete
- **Error handling** - Force redirect even if logout API fails
- **Cache headers** - Must be on all authenticated requests

## Reference

- Source: LOGIN_LOGOUT_SESSION_FIX.md, SESSION_FIX_COMPLETE.md
- Related: development/concepts/session-state-management.md
- Related: development/errors/auth-errors.md