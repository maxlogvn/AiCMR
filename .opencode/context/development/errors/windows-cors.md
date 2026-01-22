# Error: Windows CORS Errors

**Symptom**:
```
Error: Access to fetch has been blocked by CORS policy
Browser console shows CORS violations
API requests fail from frontend
```

**Cause**: Frontend origin not in `ALLOWED_ORIGINS` list. Windows uses `localhost:3000` while Linux might use `aicmr.local`, requiring different origins.

**Solution**:

### 1. Update ALLOWED_ORIGINS in Backend Config
```python
# backend/app/core/config.py
from pydantic import BaseModel, field_validator

class Config(BaseModel):
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://aicmr.local",
        "https://aicmr.local",
        "http://127.0.0.1:3000",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: str | list) -> list:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
```

### 2. Set ALLOWED_ORIGINS in .env
```bash
# In .env (Windows)
ALLOWED_ORIGINS=http://localhost:3000,http://aicmr.local,https://aicmr.local,http://127.0.0.1:3000

# Or as list (if using YAML)
ALLOWED_ORIGINS=["http://localhost:3000", "http://aicmr.local"]
```

### 3. Common Origins to Include
| Origin | When to Use |
|--------|-------------|
| `http://localhost:3000` | Windows development |
| `http://127.0.0.1:3000` | Alternative localhost |
| `http://aicmr.local` | Hosts file setup |
| `https://aicmr.local` | HTTPS setup |
| `http://localhost:8000` | Direct API access |

**Verification**:
```bash
# Check CORS configuration
curl -H "Origin: http://localhost:3000" \
     -I http://localhost:8000/api/endpoint

# Response should include:
# Access-Control-Allow-Origin: http://localhost:3000
```

**Troubleshooting**:
1. Check browser console for specific origin error
2. Verify `ALLOWED_ORIGINS` includes frontend URL
3. Ensure backend CORS middleware is enabled
4. Restart backend after .env changes
5. Clear browser cache

**Prevention**:
- Include all development origins in ALLOWED_ORIGINS
- Use environment-specific .env files
- Test CORS configuration early in setup
- Document allowed origins for team

**Frequency**: Common during initial Windows setup or frontend URL changes

**Reference**: [WINDOWS_MIGRATION_FIXES_SUMMARY.md](../../WINDOWS_MIGRATION_FIXES_SUMMARY.md)

**Related**:
- errors/windows-db-connection.md - Database connection issues
- lookup/windows-env-vars.md - Environment variable checklist
