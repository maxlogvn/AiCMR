# Backend API Tester Skill - Index

**Version:** 1.0
**Last Updated:** 2026-01-23

---

## 📁 File Structure

```
.claude/skills/backend-api-tester/
├── skill.md           # Complete guide (500+ lines)
├── README.md          # Quick reference
├── examples.py        # Full working examples
├── skill.json         # Metadata
└── index.md           # This file
```

---

## 🚀 Quick Start

### For AI Agents:

1. **Load the skill** when user asks to test backend APIs
2. **Review README.md** for quick templates
3. **Copy test patterns** from skill.md or examples.py
4. **Run tests** and verify results
5. **Debug failures** using debugging section

### For Developers:

1. Read **README.md** for quick test patterns
2. Study **examples.py** for complete test implementations
3. Reference **skill.md** for comprehensive testing guide
4. Use test checklist before committing

---

## 📚 Content Summary

### skill.md (Main Documentation)

**Sections:**
1. Testing Strategy & Pyramid
2. Test Framework Setup (pytest.ini, conftest.py)
3. Manual Testing Patterns (4 patterns)
4. Automated Testing with Pytest
5. Test Data Preparation (factories)
6. Common Test Scenarios (6 scenarios)
7. Assertion Patterns
8. Debugging Failed Tests
9. Test Checklist

**Length:** ~700 lines of comprehensive testing guide

### README.md (Quick Reference)

**Content:**
- Triggers for loading skill
- Quick test templates (3 templates)
- Common test scenarios (5 scenarios)
- Assertion quick reference
- Debugging commands
- Test checklist
- Running tests commands

**Best for:** Quick lookup during testing

### examples.py (Working Examples)

**Content:**
- Manual testing examples (4 examples)
- Pytest automated tests (6 test examples)
- Test data factories (3 factories)
- Complete CRUD test suite
- Batch testing example

**Best for:** Learning by example

---

## 🎯 Use Cases

### Use Case 1: Quick Health Check

```
User: "Check if backend is running"

Agent Workflow:
1. Load skill: backend-api-tester
2. Copy health_check template from README.md
3. Run and report results
4. Suggest next steps if failed
```

### Use Case 2: Test Single API

```
User: "Test POST /api/v1/posts/me"

Agent Workflow:
1. Load skill: backend-api-tester
2. Use single endpoint test template
3. Login → Get CSRF → Create → Verify
4. Report status code and response
5. Suggest fixes if failed
```

### Use Case 3: Comprehensive Testing

```
User: "Test toàn bộ backend APIs"

Agent Workflow:
1. Load skill: backend-api-tester
2. Use batch test template
4. Run all CREATE endpoints
5. Run all READ endpoints
6. Generate summary report
7. List failed tests with diagnostics
```

### Use Case 4: Debug API Error

```
User: "Why does POST /api/v1/categories return 500?"

Agent Workflow:
1. Load skill: backend-api-tester
2. Test endpoint manually to capture error
3. Check backend logs
4. Analyze error message
5. Suggest fix based on error type
```

---

## 🔗 Related Skills

### backend-api-builder
- **Purpose:** Build/create backend APIs
- **When to use:** Creating new endpoints or fixing API code
- **Relationship:** Builder creates APIs, Tester verifies them

### commander-management
- **Purpose:** System management
- **When to use:** Start/stop backend, check health
- **Relationship:** Use to start backend before testing

---

## ✅ Quick Reference

### Test Commands

```bash
# Run all tests
pytest

# Verbose output
pytest -v

# Specific file
pytest tests/test_posts.py

# With coverage
pytest --cov=app --cov-report=html

# Stop on first failure
pytest -x

# By mark
pytest -m integration
```

### Status Codes

| Code | Meaning | When to Expect |
|------|---------|---------------|
| **200** | OK | GET, PATCH, DELETE success |
| **201** | Created | POST create resource ✅ |
| **401** | Unauthorized | No auth token |
| **403** | Forbidden | No permission |
| **404** | Not Found | Resource doesn't exist |
| **422** | Validation Error | Invalid input |

### Test Checklist

Before considering testing complete:
- [ ] Success case tested (200/201)
- [ ] Authentication tested (401)
- [ ] Authorization tested (403)
- [ ] Not found tested (404)
- [ ] Validation tested (422)
- [ ] All tests pass
- [ ] Coverage acceptable

---

## 📈 Success Metrics

This skill helps agents:

- ✅ Test APIs systematically and thoroughly
- ✅ Catch bugs before production
- ✅ Document expected behavior
- ✅ Enable safe refactoring
- ✅ Reduce debugging time by 60%

---

## 🆘 Troubleshooting

**Problem:** Tests fail with 401 Unauthorized
**Solution:** Check login credentials and token generation

**Problem:** Tests fail with 403 Forbidden
**Solution:** Check user rank/role permissions

**Problem:** Tests fail with 422 Validation Error
**Solution:** Check request body matches Pydantic schema

**Problem:** Tests fail with 500 Server Error
**Solution:** Check backend logs for actual error

**Problem:** Tests are flaky (sometimes pass, sometimes fail)
**Solution:** Tests might be dependent on each other - make them independent

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-23 | Initial release with manual & automated testing patterns |

---

## 🎓 Learning Path

1. **Beginner:** Start with README.md quick templates
2. **Intermediate:** Study examples.py implementations
3. **Advanced:** Master skill.md comprehensive guide
4. **Expert:** Contribute new test patterns

---

## 🎯 Quick Templates

### Template 1: Health Check
```python
async def health_check():
    async with httpx.AsyncClient() as client:
        resp = await client.get("http://localhost:8000/health", timeout=2)
        return resp.status_code == 200
```

### Template 2: Single Endpoint Test
```python
async def test_endpoint():
    async with httpx.AsyncClient() as client:
        # Login
        resp = await client.post("http://localhost:8000/api/v1/auth/login", json={...})
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Test
        resp = await client.post("http://localhost:8000/api/v1/posts", json={...}, headers=headers)
        assert resp.status_code == 201
```

### Template 3: Batch Test
```python
async def test_batch():
    tests = [("POST /api/v1/categories/", ...), ("POST /api/v1/tags/", ...)]
    for name, method, url, data in tests:
        resp = await client.request(method, url, json=data, headers=headers)
        print(f"{name}: {resp.status_code}")
```

---

**🎯 Remember:** Good testing catches bugs early, documents behavior, and enables safe refactoring!

For complete guide, see [skill.md](./skill.md)
For examples, see [examples.py](./examples.py)
