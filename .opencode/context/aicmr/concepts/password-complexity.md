# Concept: Password Complexity

**Core Idea**: AiCMR enforces strong password requirements combining length, character variety, and common password rejection to ensure account security across registration and password changes.

**Key Points**:
- Minimum 8 characters in length
- Must include uppercase and lowercase letters
- Must include at least one number and one special character (!@#$%^&*)
- Cannot be common passwords like "password123"
- Validated on registration, password change, and reset operations

**Quick Example**:
```python
import re

def validate_password(password: str) -> bool:
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[!@#$%^&*()]', password):
        return False
    return True
```

**Reference**: docs/05-authentication.md

**Related**: concepts/jwt-authentication.md