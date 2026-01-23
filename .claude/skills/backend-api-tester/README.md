# Backend API Tester Skill - Quick Reference

**🚀 Use this skill when:** Testing backend APIs comprehensively

---

## 🎯 Triggers

Load this skill when user says:
- "test api", "kiểm tra api", "test endpoint"
- "verify backend", "check api hoạt động"
- "debug api", "api lỗi", "tại sao fail"
- "test toàn bộ backend", "comprehensive test"

---

## ⚡ Quick Test Templates

### Template 1: Single Endpoint Test

```python
import asyncio
import httpx

async def test_create_post():
    """Test POST /api/v1/posts/me"""
    async with httpx.AsyncClient() as client:
        # Login
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "Admin123456!"}
        )
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Get CSRF
        resp = await client.get("http://localhost:8000/api/v1/csrf-token")
        csrf = resp.json()["csrf_token"]
        headers["X-CSRF-Token"] = csrf

        # Create
        resp = await client.post(
            "http://localhost:8000/api/v1/posts/me",
            json={
                "title": "Test",
                "slug": "test-post",
                "content": "Test",
                "excerpt": "T",
                "status": "draft"
            },
            headers=headers
        )

        # Verify
        assert resp.status_code == 201  # ✅ Check 201
        assert resp.json()["title"] == "Test"
        print("✅ Test passed!")

asyncio.run(test_create_post())
```

### Template 2: CRUD Test Suite

```python
async def test_post_crud():
    """Test full CRUD"""
    async with httpx.AsyncClient() as client:
        # Login
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "Admin123456!"}
        )
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Get CSRF
        resp = await client.get("http://localhost:8000/api/v1/csrf-token")
        headers["X-CSRF-Token"] = resp.json()["csrf_token"]

        # CREATE
        resp = await client.post(
            "http://localhost:8000/api/v1/posts/me",
            json={"title": "CRUD Test", "slug": "crud-test", "content": "Test", "excerpt": "T", "status": "draft"},
            headers=headers
        )
        assert resp.status_code == 201
        post_id = resp.json()["id"]
        print(f"✅ Created: {post_id}")

        # READ
        resp = await client.get(f"http://localhost:8000/api/v1/posts/me/{post_id}", headers=headers)
        assert resp.status_code == 200
        print(f"✅ Read: {resp.json()['title']}")

        # UPDATE
        resp = await client.patch(
            f"http://localhost:8000/api/v1/posts/me/{post_id}",
            json={"title": "Updated"},
            headers=headers
        )
        assert resp.status_code == 200
        print(f"✅ Updated: {resp.json()['title']}")

        # DELETE
        resp = await client.delete(f"http://localhost:8000/api/v1/posts/me/{post_id}", headers=headers)
        assert resp.status_code == 200
        print("✅ Deleted")

asyncio.run(test_post_crud())
```

### Template 3: Batch Test Multiple APIs

```python
async def test_all_create_apis():
    """Test all CREATE endpoints return 201"""
    async with httpx.AsyncClient() as client:
        # Login as admin
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "Admin123456!"}
        )
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Get CSRF
        resp = await client.get("http://localhost:8000/api/v1/csrf-token")
        headers["X-CSRF-Token"] = resp.json()["csrf_token"]

        # Test all CREATE endpoints
        tests = [
            ("POST /api/v1/categories/", "POST", "http://localhost:8000/api/v1/categories/",
             {"name": "Test", "slug": "test-cat", "description": "Test"}),
            ("POST /api/v1/tags/", "POST", "http://localhost:8000/api/v1/tags/",
             {"name": "Test", "slug": "test-tag", "color": "#FF0000"}),
            ("POST /api/v1/posts/me", "POST", "http://localhost:8000/api/v1/posts/me",
             {"title": "Test", "slug": "test-post", "content": "Test", "excerpt": "T", "status": "draft"}),
        ]

        for name, method, url, data in tests:
            resp = await client.request(method, url, json=data, headers=headers)
            status = "✅" if resp.status_code == 201 else "❌"
            print(f"{status} {name}: {resp.status_code}")

asyncio.run(test_all_create_apis())
```

---

## 🔴 Common Test Scenarios

### Scenario 1: Success Case
```python
# Test happy path - everything works
response = await client.post("/api/v1/posts", json={...})
assert response.status_code == 201
assert response.json()["id"] > 0
```

### Scenario 2: Authentication Required
```python
# Test without auth
response = await client.post("/api/v1/posts", json={...})
assert response.status_code == 401  # Unauthorized
```

### Scenario 3: Authorization Required
```python
# Test regular user accessing admin endpoint
response = await client.post("/api/v1/categories", json={...}, headers=user_headers)
assert response.status_code == 403  # Forbidden
```

### Scenario 4: Not Found
```python
response = await client.get("/api/v1/posts/99999")
assert response.status_code == 404
```

### Scenario 5: Validation Error
```python
response = await client.post("/api/v1/posts", json={"invalid": "data"})
assert response.status_code == 422  # Validation error
```

---

## ✅ Assertion Quick Ref

### Status Codes
```python
# Single code
assert response.status_code == 200

# Multiple acceptable codes
assert response.status_code in [200, 201]

# Success range
assert 200 <= response.status_code < 300
```

### Response Data
```python
# Check JSON
data = response.json()
assert "id" in data
assert data["title"] == "Expected"

# Check list
assert isinstance(data["items"], list)
assert len(data["items"]) > 0
```

### Headers
```python
# Content type
assert "application/json" in response.headers["content-type"]

# Auth header
assert "authorization" in response.headers
```

---

## 🐛 Debug Failed Tests

### Enable Verbose Output
```bash
pytest -v tests/test_api.py        # Verbose
pytest -s tests/test_api.py        # Show prints
pytest -l tests/test_api.py        # Show locals
pytest --vv tests/test_api.py      # Very verbose
```

### Debug Specific Test
```bash
pytest tests/test_api.py::test_create_post
pytest --pdb tests/test_api.py::test_create_post
pytest -x tests/test_api.py        # Stop on first fail
```

### Print Debug Info
```python
response = await client.get("/api/v1/posts")
print(f"Status: {response.status_code}")
print(f"Headers: {dict(response.headers)}")
print(f"Body: {response.text}")
```

---

## 📦 Test Scripts

### Smoke Test (Quick Health Check)
```python
async def smoke_test():
    """Quick backend health check"""
    async with httpx.AsyncClient() as client:
        # Health check
        resp = await client.get("http://localhost:8000/health", timeout=2)
        assert resp.status_code == 200

        # Login
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "Admin123456!"}
        )
        assert resp.status_code == 200

        print("✅ Smoke test passed")

asyncio.run(smoke_test())
```

---

## 🎯 Test Checklist

### Test Coverage
- [ ] Success case (200/201)
- [ ] Authentication (401)
- [ ] Authorization (403)
- [ ] Not found (404)
- [ ] Validation error (422)
- [ ] Conflict (409)
- [ ] Pagination (if applicable)

### Test Quality
- [ ] Descriptive test names
- [ ] AAA pattern (Arrange-Act-Assert)
- [ ] One assertion per test
- [ ] No hardcoded values
- [ ] Tests are independent
- [ ] Tests cleanup after themselves

### Before Commit
- [ ] All tests pass: `pytest -v`
- [ ] Coverage acceptable: `pytest --cov`
- [ ] Tests run fast (< 30s)
- [ ] No flaky tests

---

## 🚀 Running Tests

```bash
# Run all tests
pytest

# Verbose output
pytest -v

# Specific file
pytest tests/test_posts.py

# Specific test
pytest tests/test_posts.py::test_create_post

# With coverage
pytest --cov=app --cov-report=html

# Stop on first failure
pytest -x

# Show print statements
pytest -s

# By mark
pytest -m integration
pytest -m "not slow"
```

---

## 🔗 Related Skills

- **backend-api-builder** - Build APIs correctly
- **commander-management** - System management

---

**🎯 Remember:** Good tests catch bugs early, document behavior, and enable safe refactoring!

For complete guide, see [skill.md](./skill.md)
