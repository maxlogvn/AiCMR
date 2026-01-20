# Concept: Rate Limiting

**Core Idea**: AiCMR uses Redis-backed rate limiting with SlowAPI to prevent abuse, applying different limits for authentication endpoints and general API usage based on IP address.

**Key Points**:
- Login attempts limited to 5 per minute per IP
- Registration limited to 3 per minute per IP
- CSRF token requests limited to 30 per minute per IP
- Redis stores counters with automatic expiration
- Exceeded limits return 429 Too Many Requests with retry-after header

**Quick Example**:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/login")
@limiter.limit("5/minute")
async def login():
    # Login logic
```

**Reference**: docs/05-authentication.md

**Related**: concepts/jwt-authentication.md