# Lookup: API Reference

**Core Idea**: Complete reference for AiCMR REST API endpoints with authentication requirements, HTTP methods, rate limits, and response formats for all system functionality.

**Key Points**:
- Authentication: POST /auth/login (5/min), POST /auth/refresh (10/min), POST /auth/logout
- User Management: GET /users/me, PATCH /users/me, GET /users (rank 5 only)
- Upload: POST /uploads (rank 1+), GET /uploads/file/{id} (authenticated)
- Installation: GET /install/status, POST /install/setup (requires INSTALL_SECRET)
- System: GET /health, GET /metrics (internal)

**Quick Example**:
```bash
# Get user profile
curl -H "Authorization: Bearer <token>" \
     http://aicmr.local/backend/api/v1/users/me

# Upload file
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "X-CSRF-Token: <csrf>" \
     -F "file=@document.pdf" \
     http://aicmr.local/backend/api/v1/uploads
```

**Reference**: docs/06-api-reference.md

**Related**: guides/api-usage.md