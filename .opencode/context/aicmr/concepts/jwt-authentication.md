# Concept: JWT Authentication

**Core Idea**: AiCMR uses stateless JWT authentication with access and refresh tokens, implementing token rotation for security and CSRF protection to prevent cross-site request forgery attacks.

**Key Points**:
- Access tokens expire in 15 minutes for short-lived sessions
- Refresh tokens expire in 7 days and rotate on use to prevent replay attacks
- Tokens stored in httpOnly cookies for XSS protection
- CSRF tokens required for state-changing operations (POST/PUT/DELETE)
- Stateless design eliminates server-side session storage needs

**Quick Example**:
```javascript
// Access token in Authorization header
const headers = { 'Authorization': 'Bearer ' + accessToken }

// CSRF token for POST requests
const csrfHeaders = { 'X-CSRF-Token': csrfToken }
```

**Reference**: docs/05-authentication.md

**Related**: concepts/csrf-protection.md, concepts/rate-limiting.md