# Rank-Based Authorization System

## Core Concept

Hierarchical permission system using numeric ranks where higher numbers grant access to all lower-level operations. Each user has a single rank determining their system permissions.

## Key Points

- **Numeric hierarchy** - Guest(0) < Member(1) < Moderator(3) < Admin(5)
- **Inclusive permissions** - Higher ranks can access all lower rank endpoints
- **JWT integration** - Rank included in access tokens for request validation  
- **Endpoint protection** - `require_min_rank()` dependency injection
- **Database indexed** - Rank field optimized for fast permission checks

## Rank Levels

| Rank | Role | Value | Permissions |
|------|------|-------|-------------|
| GUEST | Guest | 0 | Read public content only |
| MEMBER | Member | 1 | Create posts, comments |
| MODERATOR | Moderator | 3 | Manage content, view stats |
| ADMIN | Admin | 5 | User management, system config |

## Minimal Example

```python
# Endpoint protection
@router.get("/stats/overview")
async def get_stats(current_user: User = Depends(require_min_rank(3))):
    # Only rank 3+ (Moderator, Admin) can access
    return stats_data

# JWT token includes rank
{
  "sub": "user@example.com",
  "rank": 3,  # Moderator level
  "exp": 1234567890
}
```

## Implementation Details

- **Registration default** - New users get rank 1 (Member)
- **Rank updates** - Only admins can modify user ranks
- **Error messages** - Clear rank requirement communication
- **Security** - No rank escalation via API endpoints

## Common Patterns

- **Content moderation** - Rank 3+ for managing posts
- **User administration** - Rank 5 for user operations  
- **Analytics access** - Rank 3+ for viewing statistics

## Reference

- Source: TEST_ACCOUNTS.md
- Related: development/lookup/test-accounts-reference.md
- Related: development/examples/rank-testing-examples.md