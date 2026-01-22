# Test Accounts Reference

## Admin Account (Rank 5)
```
Email: admin@test.com
Password: Admin123456
User ID: 7
Permissions: All system operations
```

**Test Commands:**
```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123456"}'

# Test admin endpoint
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/v1/users/
```

## Moderator Account (Rank 3)
```
Email: moderator@test.com  
Password: Moderator123456
User ID: 8
Permissions: Content moderation, stats access
```

**Blocked from:** User management (requires rank 5)

## Member Account (Rank 1)
```
Email: member@test.com
Password: Member123456  
User ID: 9
Permissions: Create posts, basic operations
```

**Blocked from:** Stats overview, user management

## Guest Account (Rank 0)
```
Email: guest@test.com
Password: Guest123456
User ID: 10  
Note: Currently rank 1 due to registration default
```

## Legacy Accounts

### System Admin
```
Email: admin@example.com
Username: admin
User ID: 1
Rank: 5
```

### Simple Test User  
```
Email: simple@test.com
Password: 123456
User ID: 5
Rank: 1
```

## Permission Matrix

| Endpoint | Guest(0) | Member(1) | Moderator(3) | Admin(5) |
|----------|----------|-----------|--------------|----------|
| GET /posts/ | ✅ | ✅ | ✅ | ✅ |
| POST /posts/me | ❌ | ✅ | ✅ | ✅ |  
| GET /stats/overview | ❌ | ❌ | ✅ | ✅ |
| GET /users/ | ❌ | ❌ | ❌ | ✅ |

## Quick Testing

**Same Rank Test:**
```bash
1. Login as member@test.com
2. Access /posts/ → Should succeed
3. Access /stats/overview → Should fail with rank requirement error
```

**Different Rank Test:**
```bash  
1. Login as admin@test.com
2. Access /users/ → Should succeed
3. Login as moderator@test.com  
4. Access /users/ → Should fail
```

## Reference

- Source: TEST_ACCOUNTS.md
- Related: development/concepts/rank-system.md
- Related: development/examples/rank-testing-examples.md