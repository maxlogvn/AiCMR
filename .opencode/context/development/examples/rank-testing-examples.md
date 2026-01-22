# Rank Testing Examples

## Core Concept

Automated testing commands for verifying rank-based authorization works correctly across all permission levels.

## Key Points

- **Test each rank level** - Verify permissions granted and denied correctly
- **Cross-rank verification** - Higher ranks can access lower rank endpoints
- **Error message validation** - Check clear rank requirement messaging
- **JWT token inspection** - Verify rank included in access tokens
- **Database consistency** - Rank updates persist correctly

## Basic Rank Testing

### Admin (Rank 5) - Full Access
```bash
# Login and get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123456"}' \
  | jq -r '.access_token')

# Test admin-only endpoint (should succeed)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/users/

# Test lower rank endpoint (should succeed)  
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/stats/overview
```

### Moderator (Rank 3) - Limited Access
```bash
# Login as moderator
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"moderator@test.com","password":"Moderator123456"}' \
  | jq -r '.access_token')

# Test moderator endpoint (should succeed)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/stats/overview

# Test admin endpoint (should fail with rank error)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/users/
```

### Member (Rank 1) - Basic Access  
```bash
# Login as member
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"member@test.com","password":"Member123456"}' \
  | jq -r '.access_token')

# Test member endpoint (should succeed)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/posts/

# Test moderator endpoint (should fail)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/stats/overview
```

## JWT Token Inspection

```bash
# Decode JWT to verify rank
echo $TOKEN | cut -d'.' -f2 | base64 -d | jq

# Expected payload:
{
  "sub": "admin@test.com",
  "rank": 5,
  "exp": 1234567890
}
```

## Permission Boundary Testing

```bash
# Test rank 3 requirement with rank 1 user
curl -v -H "Authorization: Bearer $MEMBER_TOKEN" \
  http://localhost:8000/api/v1/stats/overview

# Expected response:
# HTTP 403 Forbidden
# {"detail": "Rank 3 required. Current rank: 1"}
```

## Automated Test Script

```bash
#!/bin/bash
# test_ranks.sh

echo "Testing rank-based authorization..."

# Test admin access (should all pass)
admin_token=$(get_token "admin@test.com" "Admin123456")
test_endpoint "$admin_token" "/users/" "PASS"
test_endpoint "$admin_token" "/stats/overview" "PASS" 

# Test moderator access (mixed results)
mod_token=$(get_token "moderator@test.com" "Moderator123456")
test_endpoint "$mod_token" "/stats/overview" "PASS"
test_endpoint "$mod_token" "/users/" "FAIL"

echo "Rank testing complete!"
```

## Reference

- Source: TEST_ACCOUNTS.md  
- Related: development/concepts/rank-system.md
- Related: development/lookup/test-accounts-reference.md