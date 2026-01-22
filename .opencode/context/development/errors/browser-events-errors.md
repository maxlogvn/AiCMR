# Browser Events Errors

## Storage Event Same-Tab Limitation

**Symptom:**
```
localStorage.setItem("token", "new-value");
// storage event listener NOT triggered in same tab
```

**Cause:** Storage events only fire when localStorage/sessionStorage changes from another tab or window, not the current tab.

**Solution:**
1. Use custom events for same-tab communication
2. Dispatch custom event after localStorage changes
3. Listen to both storage (cross-tab) and custom (same-tab) events

**Code:**
```javascript
// ❌ Before - Only cross-tab
window.addEventListener("storage", handleChange);

// ✅ After - Both same-tab and cross-tab
window.addEventListener("storage", handleChange);
window.addEventListener("auth:logout", handleChange);

// Dispatch custom event after localStorage change
localStorage.removeItem("token");
window.dispatchEvent(new CustomEvent("auth:logout"));
```

**Prevention:** Always pair localStorage changes with custom events for same-tab reactivity.

## Event Listener Memory Leaks

**Symptom:**
```
Component re-renders cause duplicate event listeners
Performance degrades over time
```

**Cause:** Adding event listeners without removing them on cleanup.

**Solution:**
```javascript
useEffect(() => {
  const handler = () => { /* logic */ };
  window.addEventListener("auth:logout", handler);
  
  // ✅ Critical: cleanup listener
  return () => window.removeEventListener("auth:logout", handler);
}, []);
```

## Cross-Tab State Sync Issues

**Symptom:**
- Tab A logs out, Tab B still shows logged in
- Inconsistent state across browser tabs

**Solution:**
- Listen to storage events for cross-tab sync
- Use custom events for same-tab immediate updates
- Implement both patterns together

**Frequency:** Common in SPA applications
**Reference:** https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event

## Related

- development/examples/custom-event-pattern.md
- development/concepts/session-state-management.md
- development/guides/debugging-auth-flows.md