# Guide: Testing Commands

**Core Concept**: Run automated tests for both frontend and backend components to verify code quality and catch regressions.

**Key Points**:
1. Frontend tests use npm/JavaScript
2. Backend tests use pytest/Python
3. Run tests in respective component directories
4. CI/CD pipeline automates test execution
5. Test reports generated for analysis

**Frontend Testing**:

**Setup**:
```bash
# Ensure dependencies are installed
cd frontend
npm install
```

**Run Tests**:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test App.test.js
```

**Test Configuration** (package.json):
```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage",
    "test:watch": "react-scripts test --watch"
  }
}
```

**Common Frontend Test Commands**:
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (if Cypress/Playwright configured)
npm run test:e2e
```

**Backend Testing**:

**Setup**:
```bash
# Install test dependencies
cd backend
pip install pytest pytest-asyncio pytest-cov httpx

# Activate virtual environment (recommended)
source venv/bin/activate  # Linux/Mac
# or
source venv/Scripts/activate  # Windows
```

**Run Tests**:
```bash
# Run all tests
pytest

# Run tests with verbose output
pytest -v

# Run tests with coverage report
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api.py

# Run specific test function
pytest tests/test_api.py::test_create_user

# Run tests matching pattern
pytest -k "user"
```

**Test Configuration** (pytest.ini):
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
python_classes = Test*
asyncio_mode = auto
```

**Common Backend Test Commands**:
```bash
# Unit tests only
pytest -m unit

# Integration tests only
pytest -m integration

# Fast tests (skip slow)
pytest -m "not slow"

# Show local variables on failure
pytest -l

# Drop to debugger on failure
pytest --pdb
```

**Docker Environment Testing**:

**Test in Running Containers**:
```bash
# Frontend tests in container
docker-compose exec frontend npm test

# Backend tests in container
docker-compose exec backend pytest

# Backend with coverage in container
docker-compose exec backend pytest --cov=app --cov-report=html
```

**Test Coverage Reports**:

**Frontend**:
```bash
npm test -- --coverage

# Report generated at:
# frontend/coverage/
#   - index.html (HTML report)
#   - lcov-report/ (LCOV format)
```

**Backend**:
```bash
pytest --cov=app --cov-report=html

# Report generated at:
# backend/htmlcov/index.html
# backend/coverage.xml (for CI/CD)
```

**Continuous Integration (CI/CD)**:

**GitHub Actions Example** (.github/workflows/test.yml):
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend && npm install
          cd ../backend && pip install -r requirements.txt
      - name: Run backend tests
        run: cd backend && pytest --cov=app
      - name: Run frontend tests
        run: cd frontend && npm test -- --coverage
```

**Test Best Practices**:

1. **Write tests first** (TDD) when possible
2. **Keep tests independent** - no test should depend on another
3. **Use descriptive test names** - test_create_user_with_valid_data
4. **Mock external dependencies** - API calls, database
5. **Test edge cases** - empty inputs, null values, errors
6. **Maintain good coverage** - aim for 80%+ coverage
7. **Run tests before commit** - catch issues early
8. **Keep tests fast** - slow tests in separate suite

**Troubleshooting**:

| Issue | Cause | Solution |
|-------|-------|----------|
| Tests not found | Wrong directory | Ensure you're in `frontend/` or `backend/` |
| Import errors | Dependencies not installed | Run `npm install` or `pip install` |
| Database errors | Test database not configured | Set `TEST_DATABASE_URL` in .env |
| Slow tests | Too many async operations | Use `pytest-asyncio` for async tests |
| Port conflicts | Services not running | Start Docker containers first |

**Reference**: [README.md](../../README.md)

**Related**:
- concepts/architecture.md - System architecture
- lookup/commands-reference.md - Development commands
