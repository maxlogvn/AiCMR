# Session Cleanup Implementation Example

## Core Concept

Complete working example of session cleanup implementation with all necessary reset functions and proper sequencing.

## Key Points

- **Reset API state first** - Before clearing tokens to prevent race conditions
- **Multiple reset functions** - Separate concerns (CSRF vs interceptor state)
- **Cache control headers** - Prevent browser serving stale authenticated data
- **Event-driven updates** - Custom events for same-tab component updates
- **Best-effort backend notification** - Don't block logout if API fails

## Complete Implementation

### API State Reset Functions
```typescript
// frontend/src/lib/api.ts
let csrfTokenPromise: Promise<string | null> | null = null;
let isRefreshing = false;

// Reset CSRF token cache
export function resetCsrfToken() {
  csrfTokenPromise = null;
  console.log("[CSRF] Token cache reset for new session");
}

// Reset interceptor state
export function resetApiState() {
  isRefreshing = false;
  delete api.defaults.headers.common['Authorization'];
  console.log("[API] Interceptor state reset for new session");
}

// Add cache control headers
api.interceptors.request.use(async (config) => {
  // Existing CSRF logic...
  
  // Prevent browser caching
  config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
  config.headers["Pragma"] = "no-cache";
  config.headers["Expires"] = "0";
  
  return config;
});
```

### Auth Service Integration
```typescript
// frontend/src/lib/auth.ts
import api, { resetCsrfToken, resetApiState } from "./api";

class AuthService {
  async logout(): Promise<{ success: boolean; error?: string }> {
    console.log("[Auth] Logging out");
    
    try {
      const refreshToken = this.getRefreshToken();
      
      // CRITICAL: Reset API state BEFORE clearing tokens
      resetCsrfToken();
      resetApiState();
      console.log("[Auth] API state reset complete");
      
      // Clear tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      console.log("[Auth] Tokens cleared from localStorage");
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent("auth:logout", {
        detail: { timestamp: Date.now() }
      }));
      
      // Best effort backend notification
      if (refreshToken) {
        try {
          await api.post("/auth/logout", { refresh_token: refreshToken });
          console.log("[Auth] Backend logout notification successful");
        } catch (error) {
          console.warn("[Auth] Backend notification failed (non-critical):", error);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("[Auth] Logout error:", error);
      return { success: false, error: error.message };
    }
  }
}
```

### Component Event Handling
```typescript
// frontend/src/components/layout/Navbar.tsx
const handleLogout = async () => {
  setIsLoading(true);
  try {
    const result = await authService.logout();
    if (result.success) {
      router.push("/login");
    } else {
      console.error("Logout failed:", result.error);
      // Force redirect anyway
      router.push("/login");
    }
  } catch (error) {
    console.error("Logout exception:", error);
    router.push("/login");
  } finally {
    setIsLoading(false);
  }
};

// Listen for logout events (same-tab)
useEffect(() => {
  const handleLogoutEvent = () => {
    setToken(null);
    setUser(null);
  };
  
  window.addEventListener("auth:logout", handleLogoutEvent);
  return () => window.removeEventListener("auth:logout", handleLogoutEvent);
}, []);
```

### Backend Token Persistence
```python
# backend/app/api/v1/auth.py
async def logout(self, refresh_token: str) -> dict:
    # Find and revoke token
    token_record = await self.get_refresh_token(refresh_token)
    if token_record:
        token_record.revoked = True
        await db.commit()  # CRITICAL: Persist to database
    
    return {"message": "Logout successful"}
```

## Expected Console Output

**During Logout:**
```
[Auth] Logging out
[CSRF] Token cache reset for new session
[API] Interceptor state reset for new session
[Auth] API state reset complete
[Auth] Tokens cleared from localStorage
[Auth] Backend logout notification successful
```

**During Next Login:**
```
[Auth] Attempting login for: newuser@example.com
[CSRF] Fetching fresh token for new session
[Auth] Login successful, storing tokens
```

## Testing Verification

```typescript
// Test different user sequence
async function testLogoutLogin() {
  // 1. Login as user A
  await authService.login("userA@test.com", "password");
  console.log("User A profile:", await api.get("/user/profile"));
  
  // 2. Logout
  await authService.logout();
  
  // 3. Login as user B  
  await authService.login("userB@test.com", "password");
  const profile = await api.get("/user/profile");
  
  // Should show user B data, not user A
  console.log("User B profile:", profile);
}
```

## Reference

- Source: SESSION_FIX_COMPLETE.md
- Related: development/concepts/session-state-management.md
- Related: development/guides/implementing-logout.md