# Concept: CSRF Protection

**Core Idea**: AiCMR prevents cross-site request forgery using double-submit cookie pattern with CSRF tokens stored in Redis, requiring tokens for all state-changing requests.

**Key Points**:
- Frontend requests CSRF token from /api/v1/auth/csrf-token endpoint
- Token stored in Redis session with expiration
- All POST/PUT/DELETE requests must include X-CSRF-Token header
- Tokens are single-use and validated server-side before processing
- Protects against malicious sites tricking users into unwanted actions

**Quick Example**:
```javascript
// Get CSRF token
const csrfResponse = await api.get('/auth/csrf-token')
const csrfToken = csrfResponse.data.token

// Include in state-changing requests
await api.post('/users', data, {
  headers: { 'X-CSRF-Token': csrfToken }
})
```

**Reference**: docs/05-authentication.md

**Related**: concepts/jwt-authentication.md