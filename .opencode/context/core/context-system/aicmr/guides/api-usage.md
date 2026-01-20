# Guide: API Usage

**Core Idea**: Interact with AiCMR REST API using JWT authentication, CSRF protection, and proper error handling, with all endpoints prefixed by /backend/api/v1 and requiring appropriate rank levels for access.

**Key Points**:
1. Obtain JWT tokens through /auth/login endpoint
2. Include Authorization header for authenticated requests
3. Add X-CSRF-Token header for POST/PUT/DELETE operations
4. Handle pagination for list endpoints using page and size parameters
5. Check rank requirements (0-5) for admin-only endpoints

**Quick Example**:
```javascript
// Login to get tokens
const loginResponse = await fetch('/backend/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
const { access_token } = await loginResponse.json()

// Use token for authenticated requests
const usersResponse = await fetch('/backend/api/v1/users', {
  headers: { 'Authorization': `Bearer ${access_token}` }
})
```

**Reference**: docs/06-api-reference.md

**Related**: concepts/jwt-authentication.md, concepts/rank-system.md