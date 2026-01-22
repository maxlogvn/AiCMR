# 📋 AiCMR Test Accounts

## Quick Reference

| Role | Email | Password | Rank | Purpose |
|------|-------|----------|------|---------|
| **Admin** | admin@aicmr.local | Admin@123456 | 5 | Full system access, user management |
| **Moderator** | moderator@aicmr.local | Moderator@123456 | 3 | Content moderation, user info access |
| **Member** | member@aicmr.local | Member@123456 | 1 | Basic member features |
| **Test User** | testuser@example.com | Test@123456 | 0 | Basic testing, profile viewing |

---

## Rank System Explanation

```
Rank 5  │ ADMIN          │ Full system access, manage users, change ranks
        │                │ Can: View dashboard, manage categories, posts, users
Rank 4  │ ADMIN JUNIOR   │ Advanced admin features (not fully defined yet)
        │                │ Can: Similar to ADMIN
Rank 3  │ MODERATOR      │ Content moderation, see other users
        │                │ Can: View posts, user profiles, moderate content
Rank 2  │ MEMBER +       │ Enhanced member features (reserved)
        │                │ Can: Create posts, view others' profiles
Rank 1  │ MEMBER         │ Basic member features
        │                │ Can: Create posts, edit own profile
Rank 0  │ GUEST          │ View only own profile
        │                │ Can: View own profile, limited access
```

---

## Test Accounts Details

### 1️⃣ **ADMIN Account** - Full System Access
```
Email:    admin@aicmr.local
Password: Admin@123456
Rank:     5 (Admin)
Status:   Active ✅

Access:
  ✅ View Dashboard (/dashboard)
  ✅ Manage Users (/dashboard/users)
  ✅ Manage Categories (/dashboard/categories)
  ✅ Manage Posts (/dashboard/posts)
  ✅ View all user profiles
  ✅ Change user ranks
  ✅ Deactivate users
  ✅ All features available

Testing:
  - Dashboard layouts and permissions
  - User management flows
  - Admin-only endpoints
  - Category management
```

### 2️⃣ **MODERATOR Account** - Content Moderation
```
Email:    moderator@aicmr.local
Password: Moderator@123456
Rank:     3 (Moderator)
Status:   Active ✅

Access:
  ✅ View other user profiles (/user/[id])
  ✅ View all posts
  ✅ Cannot access Dashboard (/dashboard) ❌
  ✅ View user list (limited)
  ❌ Cannot manage users
  ❌ Cannot change ranks
  
Testing:
  - Profile viewing for other users
  - Post viewing and filtering
  - Moderator-specific features
  - Permission boundaries
```

### 3️⃣ **MEMBER Account** - Basic Features
```
Email:    member@aicmr.local
Password: Member@123456
Rank:     1 (Member)
Status:   Active ✅

Access:
  ✅ View own profile (/user/profile)
  ✅ Edit own profile
  ✅ Create posts
  ✅ View own posts (/user/posts)
  ✅ View public posts
  ❌ Cannot view other users (/user/[id]) ❌
  ❌ Cannot access Dashboard
  
Testing:
  - Member profile operations
  - Post creation flow
  - Member-level permissions
  - Cannot access admin/moderator features
```

### 4️⃣ **TEST USER Account** - Guest Access
```
Email:    testuser@example.com
Password: Test@123456
Rank:     0 (Guest)
Status:   Active ✅

Access:
  ✅ View own profile (/user/profile)
  ✅ Limited edit capabilities
  ❌ Cannot create posts
  ❌ Cannot view other users
  ❌ Cannot access Dashboard
  
Testing:
  - Guest/basic user experience
  - Profile view only
  - Public content access
  - Verify permission denials work
```

---

## Testing Scenarios

### Scenario 1: Login Flow Testing
```bash
1. Go to /login
2. Enter admin@aicmr.local / Admin@123456
3. Should redirect to /user/profile
4. Should see "Dashboard" link in navbar (rank >= 3)
5. Click logout, verify redirect to /login
6. Verify tokens cleared from localStorage
```

### Scenario 2: Permission Testing
```bash
Admin:
  1. Login as admin@aicmr.local
  2. Navigate to /dashboard - should work ✅
  3. Navigate to /dashboard/users - should work ✅
  4. Click on user to edit - should work ✅
  
Member:
  1. Login as member@aicmr.local
  2. Navigate to /dashboard - should redirect ❌
  3. Navigate to /user/profile - should work ✅
  4. Try /user/[other-user-id] - should redirect ❌
```

### Scenario 3: Profile Testing
```bash
Admin:
  1. Login as admin@aicmr.local
  2. Navigate to /user/profile - see own profile ✅
  3. Navigate to /user/member - see member profile ✅
  
Member:
  1. Login as member@aicmr.local
  2. Navigate to /user/profile - see own profile ✅
  3. Navigate to /user/admin - should redirect ❌
```

### Scenario 4: Logout Testing
```bash
All accounts:
  1. Login with any account
  2. Click "Đăng xuất" button (Navbar or Sidebar)
  3. Should show loading spinner briefly
  4. Should redirect to /login
  5. Check localStorage - should be empty:
     - access_token should be gone
     - refresh_token should be gone
  6. Try accessing protected page - redirect to login ✅
```

---

## Password Requirements

All test accounts follow the password policy:
- **Minimum Length**: 8 characters
- **Requirements**: 
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (optional for these test accounts)

Examples of valid passwords:
- `Admin@123456` ✅
- `Test@2024Secure` ✅
- `Password123!` ✅

---

## How to Create New Test Accounts

### Via Database (Direct)
```bash
# SSH into database container
docker exec -it aicmr-db psql -U aicmr_user -d aicmr_db

# Check existing users
SELECT id, email, username, rank, is_active FROM users;

# Insert new user (requires password hash)
```

### Via API (Registration)
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@aicmr.local",
    "username": "newuser",
    "password": "NewUser@123456"
  }'
```

### Via Installation Page
```bash
1. If system not installed yet
2. Go to /install
3. Create first admin account
4. Then manually create other accounts via API
```

---

## API Testing Examples

### Login Test
```bash
# Test login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aicmr.local",
    "password": "Admin@123456"
  }'

# Response:
# {
#   "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#   "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
#   "token_type": "bearer"
# }
```

### Protected Endpoint Test
```bash
# Use access_token from login
curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer <access_token>"

# Should return:
# {
#   "id": 1,
#   "email": "admin@aicmr.local",
#   "username": "admin",
#   "rank": 5,
#   "is_active": true,
#   ...
# }
```

### Logout Test
```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "<refresh_token>"
  }'

# Response:
# {
#   "message": "Logged out successfully"
# }
```

---

## Browser DevTools Testing

### Check Tokens
```javascript
// In browser console
localStorage.getItem('access_token')      // Should exist after login
localStorage.getItem('refresh_token')     // Should exist after login

// After logout
localStorage.getItem('access_token')      // Should be null
localStorage.getItem('refresh_token')     // Should be null
```

### Check JWT Content
```javascript
// Decode JWT (without verification, just for inspection)
const jwt = localStorage.getItem('access_token');
const payload = JSON.parse(atob(jwt.split('.')[1]));
console.log(payload);
// Should show: { sub: "user_id", rank: 5, iat: ..., exp: ... }
```

---

## Troubleshooting

### Account Not Working
```
1. Check if account exists in database
2. Check is_active flag
3. Verify password is correct
4. Check rank is appropriate for feature
5. Try creating new account via API
```

### Cannot Access Dashboard
```
1. Check your rank (should be >= 3 for dashboard access)
2. Login with admin account instead
3. Check if endpoint exists (/dashboard should work for admin)
```

### Logout Not Working
```
1. Check browser console for errors
2. Verify tokens are cleared from localStorage
3. Check if redirect to /login is happening
4. Check network tab for logout API call
(Already fixed in latest version ✅)
```

### Token Expired
```
1. Try refresh token endpoint
2. Or logout and login again
3. Tokens expire after 24 hours (configurable)
```

---

## Notes

- ⚠️ These are **test accounts only** - use for development/testing only
- 🔐 Change passwords before deploying to production
- 🗑️ Delete test accounts before going live
- 📊 Monitor API logs for unusual activity
- 🔄 Rotate passwords regularly
- 🛡️ Use strong passwords in production
- ✅ All passwords follow the system's password policy
