# Custom Event Pattern for Same-Tab Communication

## Core Concept

Custom events solve the storage event limitation where localStorage changes don't trigger events in the same tab. Dispatch custom events after state changes to notify components immediately.

## Key Points

- **Storage events only fire cross-tab** - Not triggered when localStorage changes in same tab
- **Custom events fire immediately** - Dispatch and listen in same tab for instant updates
- **Event data payload** - Include relevant data (timestamp, user info) in event detail
- **Multiple listeners supported** - Components can independently listen to same event
- **Cleanup required** - Remove event listeners on component unmount

## Minimal Example

```typescript
// Dispatch custom event after logout
window.dispatchEvent(new CustomEvent("auth:logout", { 
  detail: { timestamp: Date.now() } 
}));

// Listen for custom event
useEffect(() => {
  const handleLogout = () => {
    // Clear React Query cache, update state
    queryClient.clear();
    setUser(null);
  };
  
  window.addEventListener("auth:logout", handleLogout);
  return () => window.removeEventListener("auth:logout", handleLogout);
}, []);
```

## Common Use Cases

- **Authentication state changes** - Login, logout, token refresh
- **Cross-component notifications** - Shopping cart updates, theme changes
- **Real-time updates** - New messages, status changes

## Implementation Pattern

1. Define event name constants (`auth:logout`, `cart:updated`)
2. Dispatch after state changes with relevant payload
3. Listen in components that need to react
4. Clean up listeners on unmount

## Reference

- Source: LOGOUT_FIX_SUMMARY.md
- Related: development/guides/debugging-auth-flows.md
- Related: development/concepts/session-state-management.md