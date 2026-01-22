# Session State Management

## Core Concept

Managing authentication session state across frontend components with proper cleanup to prevent data leakage between user sessions. Involves CSRF token caching, Axios interceptor state, and browser cache control.

## Key Points

- **CSRF token caching** - Tokens cached in promises, must reset between sessions
- **Axios interceptor state** - Request/response interceptors maintain internal state
- **Browser cache persistence** - Authenticated responses cached, need cache control headers
- **LocalStorage cleanup** - Tokens must be cleared from browser storage
- **Backend session tracking** - Server-side token revocation and database persistence

## Session State Components

### Frontend State
- **CSRF token promise** - Cached for request efficiency
- **Axios interceptor flags** - `isRefreshing`, authorization headers
- **LocalStorage tokens** - Access and refresh tokens
- **Component state** - User data, authentication status

### Backend State  
- **Database tokens** - Refresh tokens with revocation status
- **Session tracking** - User sessions and device management
- **CSRF validation** - Server-side token validation

## Minimal Example

```typescript
// Complete session cleanup
async function logout() {
  // Step 1: Reset API state FIRST
  resetCsrfToken();        // Clear cached promise
  resetApiState();         // Reset interceptor state
  
  // Step 2: Clear browser storage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  
  // Step 3: Notify backend (best effort)
  await api.post("/auth/logout", { refresh_token });
}

// Reset functions
function resetCsrfToken() {
  csrfTokenPromise = null;
}

function resetApiState() {
  isRefreshing = false;
  delete api.defaults.headers.common['Authorization'];
}
```

## Common Issues

- **Data bleeding between users** - Old user's cached data shown to new user
- **CSRF token reuse** - Same token used across different user sessions  
- **Interceptor confusion** - Auth state persists between logout/login cycles
- **Browser cache persistence** - Authenticated responses served from cache

## Implementation Patterns

1. **3-phase logout** - Reset API state → Clear tokens → Notify backend
2. **Cache control headers** - Prevent browser caching of authenticated requests
3. **Event-driven cleanup** - Custom events for cross-component state sync
4. **Database persistence** - Ensure backend token revocation is committed

## Reference

- Source: LOGIN_LOGOUT_SESSION_FIX.md
- Related: development/guides/implementing-logout.md
- Related: development/errors/auth-errors.md