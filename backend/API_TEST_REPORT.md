# Backend API Test Report - AiCMR

**Generated:** 2026-01-23 10:05:54

---

## 📊 Executive Summary

- **Total Endpoints Tested:** 25
- **✅ Passed:** 20 (80.0%)
- **❌ Failed:** 3 (12.0%)
- **⏭️ Skipped:** 2
- **⚠️ Errors:** 0

**Overall Success Rate:** 80.0%

## 📋 Module Summary

| Module | Total | Passed | Failed | Skipped | Errors | Success Rate |
|--------|-------|--------|--------|---------|--------|--------------|
| Auth | 5 | 5 | 0 | 0 | 0 | 100.0% |
| Categories | 3 | 2 | 1 | 0 | 0 | 66.7% |
| Global | 3 | 3 | 0 | 0 | 0 | 100.0% |
| Install | 2 | 1 | 0 | 1 | 0 | 50.0% |
| Posts | 3 | 2 | 1 | 0 | 0 | 66.7% |
| Settings | 2 | 2 | 0 | 0 | 0 | 100.0% |
| Stats | 1 | 1 | 0 | 0 | 0 | 100.0% |
| Tags | 3 | 2 | 1 | 0 | 0 | 66.7% |
| Uploads | 1 | 0 | 0 | 1 | 0 | 0.0% |
| Users | 2 | 2 | 0 | 0 | 0 | 100.0% |

## 📝 Detailed Test Results

### Auth API

**Total Tests:** 5 | 
**Passed:** 5 | 
**Failed:** 0

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| POST /api/v1/auth/login (Admin) | POST | ✅ ✅ PASSED | 200 | 0.488s | - |
| POST /api/v1/auth/login (Invalid) | POST | ✅ ✅ PASSED | 401 | 0.012s | - |
| POST /api/v1/auth/register | POST | ✅ ✅ PASSED | 200 | 0.551s | - |
| POST /api/v1/auth/login (New User) | POST | ✅ ✅ PASSED | 200 | 0.326s | - |
| POST /api/v1/auth/logout | POST | ✅ ✅ PASSED | 200 | 0.004s | - |

### Categories API

**Total Tests:** 3 | 
**Passed:** 2 | 
**Failed:** 1

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| GET /api/v1/categories/ | GET | ✅ ✅ PASSED | 200 | 0.021s | - |
| GET /api/v1/categories/tree | GET | ✅ ✅ PASSED | 404 | 0.014s | - |
| POST /api/v1/categories/ | POST | ❌ ❌ FAILED | 200 | 0.074s | Expected [201], got 200 |

### Global API

**Total Tests:** 3 | 
**Passed:** 3 | 
**Failed:** 0

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| GET / | GET | ✅ ✅ PASSED | 200 | 0.025s | - |
| GET /health | GET | ✅ ✅ PASSED | 200 | 0.004s | - |
| GET /api/v1/csrf-token | GET | ✅ ✅ PASSED | 200 | 0.004s | - |

### Install API

**Total Tests:** 2 | 
**Passed:** 1 | 
**Failed:** 0

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| GET /api/v1/install/status | GET | ✅ ✅ PASSED | 200 | 0.008s | - |
| POST /api/v1/install/setup | POST | ⏭️ ⏭️ SKIPPED | - | 0.000s | Skipped to avoid affecting production installation |

### Posts API

**Total Tests:** 3 | 
**Passed:** 2 | 
**Failed:** 1

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| GET /api/v1/posts/ (Public) | GET | ✅ ✅ PASSED | 200 | 0.031s | - |
| POST /api/v1/posts/me | POST | ❌ ❌ FAILED | 200 | 0.084s | Expected [201], got 200 |
| GET /api/v1/posts/all (Admin) | GET | ✅ ✅ PASSED | 200 | 0.044s | - |

### Settings API

**Total Tests:** 2 | 
**Passed:** 2 | 
**Failed:** 0

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| GET /api/v1/settings/public | GET | ✅ ✅ PASSED | 200 | 0.015s | - |
| GET /api/v1/settings/ (Admin) | GET | ✅ ✅ PASSED | 200 | 0.014s | - |

### Stats API

**Total Tests:** 1 | 
**Passed:** 1 | 
**Failed:** 0

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| GET /api/v1/stats/overview | GET | ✅ ✅ PASSED | 200 | 0.025s | - |

### Tags API

**Total Tests:** 3 | 
**Passed:** 2 | 
**Failed:** 1

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| GET /api/v1/tags/ | GET | ✅ ✅ PASSED | 200 | 0.014s | - |
| GET /api/v1/tags/trending | GET | ✅ ✅ PASSED | 404 | 0.017s | - |
| POST /api/v1/tags/ | POST | ❌ ❌ FAILED | 200 | 0.063s | Expected [201], got 200 |

### Uploads API

**Total Tests:** 1 | 
**Passed:** 0 | 
**Failed:** 0

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| POST /api/v1/uploads/ | POST | ⏭️ ⏭️ SKIPPED | - | 0.000s | Skipped - Requires valid image file (jpg, jpeg, png, pdf, docx) |

### Users API

**Total Tests:** 2 | 
**Passed:** 2 | 
**Failed:** 0

| Endpoint | Method | Status | Status Code | Response Time | Notes |
|----------|--------|--------|-------------|---------------|-------|
| GET /api/v1/users/ (List) | GET | ✅ ✅ PASSED | 200 | 0.019s | - |
| GET /api/v1/users/me | GET | ✅ ✅ PASSED | 200 | 0.010s | - |

## 🐛 Issues Found

### 🟡 Medium Priority Issues

- **POST /api/v1/categories/** (POST): Expected [201], got 200

- **POST /api/v1/tags/** (POST): Expected [201], got 200

- **POST /api/v1/posts/me** (POST): Expected [201], got 200


## 💡 Recommendations

1. **Fix Failed Tests:** Address the failed and error tests listed above
2. **Review Authentication:** Ensure all auth-dependent endpoints work correctly
3. **Check Permissions:** Verify role-based access control is working

---

*This report was auto-generated by the comprehensive API test script*
