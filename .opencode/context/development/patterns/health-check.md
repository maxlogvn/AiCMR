# Pattern: Health Check Implementation

**Core Concept**: Automated health checks for all services using HTTP requests and database pings. Provides quick system status without manual inspection.

**Key Points**:
- HTTP checks for API endpoints (Backend, Frontend, Nginx)
- Database connection checks (MySQL ping)
- Cache availability checks (Redis PING)
- Unified health report output
- Quick diagnostic tool

**Health Check Functions**:
```python
# MySQL check
async def check_mysql() -> bool:
    try:
        conn = await aiomysql.connect(...)
        await conn.ping()
        return True
    except:
        return False

# Redis check
async def check_redis() -> bool:
    try:
        redis = await aioredis.from_url(...)
        await redis.ping()
        return True
    except:
        return False

# HTTP check
async def check_http(url: str) -> bool:
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except:
        return False
```

**Services Checked**:
| Service | Check Method | Endpoint |
|----------|--------------|-----------|
| MySQL | Connection ping | TCP 3306 |
| Redis | PING command | TCP 6379 |
| Backend | HTTP GET | http://localhost:8000/health |
| Frontend | HTTP GET | http://localhost:3000 |
| Nginx | HTTP GET | http://localhost/ |

**Usage**:
```bash
python3 cli.py health

# Output:
🏥 System Health Check
✅ MySQL: Connected
✅ Redis: PONG
✅ Backend: 200 OK
✅ Frontend: 200 OK
✅ Nginx: 200 OK

Overall Status: ✅ All systems operational
```

**Implementation Tips**:
- Use asyncio for concurrent checks
- Set timeout limits (5s recommended)
- Return boolean + error message
- Color-coded output for readability
- Include recent logs for failed services

**Reference**: [PYTHON_SCRIPTS_SUMMARY.md](../../PYTHON_SCRIPTS_SUMMARY.md)

**Related**:
- concepts/python-cli.md - Python CLI architecture
- patterns/docker-wrapper.md - Docker operations wrapper
