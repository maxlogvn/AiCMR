# Concept: Rank System

**Core Idea**: AiCMR uses a hierarchical rank system (0-5) to control user permissions, where higher ranks grant administrative access while lower ranks provide basic functionality.

**Key Points**:
- Rank 0: Guest - view personal profile only
- Rank 1-2: Member - basic member privileges  
- Rank 3-4: Moderator - view other users' information
- Rank 5: Admin - full system administration (user management, rank changes)
- Ranks are stored in user model and checked on every protected operation

**Quick Example**:
```python
if user.rank >= 3:
    # Allow viewing other users
    return get_all_users()
```

**Reference**: docs/05-authentication.md

**Related**: concepts/jwt-authentication.md