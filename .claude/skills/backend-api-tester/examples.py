"""
Example: Complete API Testing Suite
====================================

This file demonstrates how to comprehensively test backend APIs
using both manual and automated approaches.

Use this as reference when testing new or existing APIs.
"""

# ===================================================================
# MANUAL TESTING EXAMPLES
# ===================================================================

import asyncio
import httpx
from typing import Dict, List, Any


# Example 1: Quick Health Check
async def example_1_health_check():
    """
    Quick check if backend is running
    """
    print("\n" + "="*60)
    print("Example 1: Health Check")
    print("="*60)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://localhost:8000/health",
                timeout=2.0
            )

            if response.status_code == 200:
                print("✅ Backend is healthy")
                print(f"   Response: {response.json()}")
                return True
            else:
                print(f"❌ Backend returned {response.status_code}")
                return False

    except Exception as e:
        print(f"❌ Cannot connect: {e}")
        return False


# Example 2: Test Single Endpoint
async def example_2_test_single_endpoint():
    """
    Test POST /api/v1/posts/me endpoint
    """
    print("\n" + "="*60)
    print("Example 2: Test Single Endpoint")
    print("="*60)

    async with httpx.AsyncClient() as client:
        # Step 1: Login
        print("\n1. Logging in...")
        response = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={
                "email": "testuser201@example.com",
                "password": "TestUser123!"
            }
        )

        if response.status_code != 200:
            print(f"❌ Login failed: {response.text}")
            return

        token = response.json()["access_token"]
        print("✅ Login successful")

        # Step 2: Get CSRF token
        print("\n2. Getting CSRF token...")
        response = await client.get("http://localhost:8000/api/v1/csrf-token")
        csrf_token = response.json()["csrf_token"]

        headers = {
            "Authorization": f"Bearer {token}",
            "X-CSRF-Token": csrf_token
        }
        print("✅ CSRF token obtained")

        # Step 3: Create post
        print("\n3. Creating post...")
        response = await client.post(
            "http://localhost:8000/api/v1/posts/me",
            json={
                "title": "Example Test Post",
                "slug": f"example-test-{asyncio.get_event_loop().time()}",
                "content": "This is a test post created by example script",
                "excerpt": "Example",
                "status": "draft"
            },
            headers=headers
        )

        print(f"   Status Code: {response.status_code}")

        if response.status_code == 201:
            print("✅ SUCCESS - Returns 201 Created")
            data = response.json()
            print(f"   Post ID: {data.get('id')}")
            print(f"   Title: {data.get('title')}")
            print(f"   Slug: {data.get('slug')}")
        elif response.status_code == 200:
            print("⚠️  WARNING - Returns 200 OK instead of 201 Created")
        else:
            print(f"❌ FAILED - {response.text[:200]}")

        return response.status_code == 201


# Example 3: Test Full CRUD
async def example_3_test_crud():
    """
    Test complete CRUD operations for an endpoint
    """
    print("\n" + "="*60)
    print("Example 3: Test Full CRUD")
    print("="*60)

    async with httpx.AsyncClient() as client:
        # Setup
        response = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "testuser201@example.com", "password": "TestUser123!"}
        )
        token = response.json()["access_token"]

        response = await client.get("http://localhost:8000/api/v1/csrf-token")
        csrf_token = response.json()["csrf_token"]

        headers = {
            "Authorization": f"Bearer {token}",
            "X-CSRF-Token": csrf_token
        }

        post_id = None

        # CREATE
        print("\n1. CREATE")
        print("-" * 60)
        response = await client.post(
            "http://localhost:8000/api/v1/posts/me",
            json={
                "title": "CRUD Example Post",
                "slug": f"crud-example-{asyncio.get_event_loop().time()}",
                "content": "Testing CRUD operations",
                "excerpt": "CRUD Test",
                "status": "draft"
            },
            headers=headers
        )

        if response.status_code == 201:
            post_id = response.json()["id"]
            print(f"✅ Created post ID: {post_id}")
        else:
            print(f"❌ Create failed: {response.text}")
            return

        # READ
        print("\n2. READ")
        print("-" * 60)
        response = await client.get(
            f"http://localhost:8000/api/v1/posts/me/{post_id}",
            headers=headers
        )

        if response.status_code == 200:
            print(f"✅ Retrieved: {response.json()['title']}")
        else:
            print(f"❌ Read failed: {response.text}")

        # UPDATE
        print("\n3. UPDATE")
        print("-" * 60)
        response = await client.patch(
            f"http://localhost:8000/api/v1/posts/me/{post_id}",
            json={"title": "Updated CRUD Example Post"},
            headers=headers
        )

        if response.status_code == 200:
            print(f"✅ Updated: {response.json()['title']}")
        else:
            print(f"❌ Update failed: {response.text}")

        # DELETE
        print("\n4. DELETE")
        print("-" * 60)
        response = await client.delete(
            f"http://localhost:8000/api/v1/posts/me/{post_id}",
            headers=headers
        )

        if response.status_code == 200:
            print("✅ Deleted successfully")
        else:
            print(f"❌ Delete failed: {response.text}")

        # Verify deletion
        print("\n5. VERIFY DELETION")
        print("-" * 60)
        response = await client.get(
            f"http://localhost:8000/api/v1/posts/me/{post_id}",
            headers=headers
        )

        if response.status_code == 404:
            print("✅ Verified: Post no longer exists (404)")
        else:
            print(f"⚠️  Warning: Post still exists (status {response.status_code})")


# Example 4: Batch Test Multiple APIs
async def example_4_batch_test():
    """
    Test multiple endpoints in one go
    """
    print("\n" + "="*80)
    print("Example 4: Batch Test Multiple APIs")
    print("="*80)

    async with httpx.AsyncClient() as client:
        # Setup
        response = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "testuser201@example.com", "password": "TestUser123!"}
        )
        token = response.json()["access_token"]

        response = await client.get("http://localhost:8000/api/v1/csrf-token")
        csrf_token = response.json()["csrf_token"]

        headers = {
            "Authorization": f"Bearer {token}",
            "X-CSRF-Token": csrf_token
        }

        # Define tests
        tests = [
            {
                "name": "GET /api/v1/categories/ (List)",
                "method": "GET",
                "url": "http://localhost:8000/api/v1/categories/",
                "expected": 200
            },
            {
                "name": "POST /api/v1/categories/ (Create)",
                "method": "POST",
                "url": "http://localhost:8000/api/v1/categories/",
                "data": {
                    "name": "Example Category",
                    "slug": f"example-cat-{asyncio.get_event_loop().time()}",
                    "description": "Test"
                },
                "expected": 201
            },
            {
                "name": "GET /api/v1/tags/ (List)",
                "method": "GET",
                "url": "http://localhost:8000/api/v1/tags/",
                "expected": 200
            },
            {
                "name": "POST /api/v1/tags/ (Create)",
                "method": "POST",
                "url": "http://localhost:8000/api/v1/tags/",
                "data": {
                    "name": "Example Tag",
                    "slug": f"example-tag-{asyncio.get_event_loop().time()}",
                    "color": "#00FF00"
                },
                "expected": 201
            },
            {
                "name": "GET /api/v1/posts/ (Public List)",
                "method": "GET",
                "url": "http://localhost:8000/api/v1/posts/",
                "expected": 200
            },
            {
                "name": "GET /api/v1/users/me (Current User)",
                "method": "GET",
                "url": "http://localhost:8000/api/v1/users/me",
                "expected": 200
            },
        ]

        # Run tests
        results = {"passed": 0, "failed": 0, "total": len(tests)}

        for i, test in enumerate(tests, 1):
            print(f"\nTest {i}: {test['name']}")
            print("-" * 80)

            response = await client.request(
                test["method"],
                test["url"],
                json=test.get("data"),
                headers=headers
            )

            if response.status_code == test["expected"]:
                print(f"✅ PASSED - Status: {response.status_code}")
                results["passed"] += 1
            else:
                print(f"❌ FAILED - Expected {test['expected']}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                results["failed"] += 1

        # Summary
        print("\n" + "="*80)
        print("SUMMARY")
        print("="*80)
        print(f"Total: {results['total']}")
        print(f"Passed: {results['passed']}")
        print(f"Failed: {results['failed']}")

        if results["failed"] == 0:
            print("\n✅ All tests passed!")
        else:
            print(f"\n❌ {results['failed']} tests failed")


# ===================================================================
# PYTEST AUTOMATED TESTS
# ===================================================================

"""
Put these in tests/test_api_examples.py

Run with: pytest tests/test_api_examples.py -v
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession


# Test 1: Simple Success Case
@pytest.mark.integration
@pytest.mark.asyncio
async def test_create_post_success(client: AsyncClient, user_headers: dict):
    """Test successful post creation"""
    response = await client.post(
        "/api/v1/posts/me",
        json={
            "title": "Test Post",
            "slug": "test-post",
            "content": "Test content",
            "excerpt": "Test",
            "status": "draft"
        },
        headers=user_headers
    )

    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Test Post"
    assert data["slug"] == "test-post"
    assert "id" in data


# Test 2: Authentication Required
@pytest.mark.integration
@pytest.mark.asyncio
async def test_create_post_unauthorized(client: AsyncClient):
    """Test that unauthorized users cannot create posts"""
    response = await client.post(
        "/api/v1/posts/me",
        json={
            "title": "Unauthorized",
            "slug": "unauthorized",
            "content": "Test"
        }
    )

    assert response.status_code == 401


# Test 3: Not Found
@pytest.mark.integration
@pytest.mark.asyncio
async def test_get_post_not_found(client: AsyncClient):
    """Test getting non-existent post"""
    response = await client.get("/api/v1/posts/99999")

    assert response.status_code == 404

    data = response.json()
    assert "detail" in data
    assert "not found" in data["detail"].lower()


# Test 4: Validation Error
@pytest.mark.integration
@pytest.mark.asyncio
async def test_create_post_validation_error(client: AsyncClient, user_headers: dict):
    """Test input validation"""
    response = await client.post(
        "/api/v1/posts/me",
        json={
            "title": "",  # Empty title should fail
            "slug": "test",
            "content": "Test"
        },
        headers=user_headers
    )

    assert response.status_code == 422  # Validation error


# Test 5: Full CRUD Test Class
@pytest.mark.integration
class TestPostCRUD:
    """Complete CRUD test suite for posts"""

    async def test_create(self, client: AsyncClient, user_headers: dict):
        """Test POST /api/v1/posts/me"""
        response = await client.post(
            "/api/v1/posts/me",
            json={
                "title": "CRUD Test",
                "slug": "crud-test",
                "content": "Test",
                "excerpt": "T",
                "status": "draft"
            },
            headers=user_headers
        )
        assert response.status_code == 201
        return response.json()["id"]

    async def test_read(self, client: AsyncClient, user_headers: dict):
        """Test GET /api/v1/posts/me/{id}"""
        # First create a post
        create_resp = await client.post(
            "/api/v1/posts/me",
            json={
                "title": "Read Test",
                "slug": "read-test",
                "content": "Test",
                "excerpt": "T",
                "status": "draft"
            },
            headers=user_headers
        )
        post_id = create_resp.json()["id"]

        # Then read it
        response = await client.get(f"/api/v1/posts/me/{post_id}", headers=user_headers)
        assert response.status_code == 200
        assert response.json()["title"] == "Read Test"

    async def test_update(self, client: AsyncClient, user_headers: dict):
        """Test PATCH /api/v1/posts/me/{id}"""
        # Create post
        create_resp = await client.post(
            "/api/v1/posts/me",
            json={
                "title": "Update Test",
                "slug": "update-test",
                "content": "Test",
                "excerpt": "T",
                "status": "draft"
            },
            headers=user_headers
        )
        post_id = create_resp.json()["id"]

        # Update post
        response = await client.patch(
            f"/api/v1/posts/me/{post_id}",
            json={"title": "Updated Title"},
            headers=user_headers
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Updated Title"

    async def test_delete(self, client: AsyncClient, user_headers: dict):
        """Test DELETE /api/v1/posts/me/{id}"""
        # Create post
        create_resp = await client.post(
            "/api/v1/posts/me",
            json={
                "title": "Delete Test",
                "slug": "delete-test",
                "content": "Test",
                "excerpt": "T",
                "status": "draft"
            },
            headers=user_headers
        )
        post_id = create_resp.json()["id"]

        # Delete post
        response = await client.delete(
            f"/api/v1/posts/me/{post_id}",
            headers=user_headers
        )
        assert response.status_code == 200

        # Verify deleted
        response = await client.get(f"/api/v1/posts/me/{post_id}", headers=user_headers)
        assert response.status_code == 404


# Test 6: Parameterized Tests
@pytest.mark.integration
@pytest.mark.asyncio
@pytest.mark.parametrize(
    "endpoint,method,data,expected_status",
    [
        ("/api/v1/categories/", "POST", {"name": "Test", "slug": "test-cat", "description": "T"}, 201),
        ("/api/v1/tags/", "POST", {"name": "Test", "slug": "test-tag", "color": "#FF0000"}, 201),
        ("/api/v1/posts/me", "POST", {"title": "T", "slug": "t", "content": "T", "excerpt": "T", "status": "draft"}, 201),
    ]
)
async def test_create_endpoints(
    client: AsyncClient,
    admin_headers: dict,
    endpoint: str,
    method: str,
    data: dict,
    expected_status: int
):
    """Test CREATE endpoints return correct status codes"""
    response = await client.request(
        method,
        endpoint,
        json=data,
        headers=admin_headers
    )

    assert response.status_code == expected_status


# ===================================================================
# TEST DATA FACTORIES
# ===================================================================

"""
Put these in tests/factories.py
"""

import random
import string
from datetime import datetime


def random_string(length: int = 10) -> str:
    """Generate random string for unique test data"""
    return ''.join(random.choices(string.ascii_lowercase, k=length))


def random_email() -> str:
    """Generate random email for testing"""
    return f"{random_string()}@example.com"


class TestPostDataFactory:
    """Factory for creating test post data"""

    @staticmethod
    def create(**kwargs):
        """Create post data with defaults"""
        timestamp = datetime.now().timestamp()
        defaults = {
            "title": f"Test Post {timestamp}",
            "slug": f"test-post-{int(timestamp)}",
            "content": "Test content",
            "excerpt": "Test",
            "status": "draft"
        }
        defaults.update(kwargs)
        return defaults


class TestCategoryDataFactory:
    """Factory for creating test category data"""

    @staticmethod
    def create(**kwargs):
        """Create category data with defaults"""
        timestamp = datetime.now().timestamp()
        defaults = {
            "name": f"Test Category {timestamp}",
            "slug": f"test-category-{int(timestamp)}",
            "description": "Test"
        }
        defaults.update(kwargs)
        return defaults


class TestTagDataFactory:
    """Factory for creating test tag data"""

    @staticmethod
    def create(**kwargs):
        """Create tag data with defaults"""
        timestamp = datetime.now().timestamp()
        defaults = {
            "name": f"Test Tag {timestamp}",
            "slug": f"test-tag-{int(timestamp)}",
            "color": "#FF0000"
        }
        defaults.update(kwargs)
        return defaults


# Example using factory
@pytest.mark.integration
@pytest.mark.asyncio
async def test_with_factory(client: AsyncClient, admin_headers: dict):
    """Test using data factory"""
    post_data = TestPostDataFactory.create(
        title="Custom Title",
        status="published"
    )

    response = await client.post(
        "/api/v1/posts/me",
        json=post_data,
        headers=admin_headers
    )

    assert response.status_code == 201
    assert response.json()["title"] == "Custom Title"


# ===================================================================
# RUN EXAMPLES
# ===================================================================

if __name__ == "__main__":
    """
    Run manual testing examples
    """

    async def run_all_examples():
        """Run all manual testing examples"""
        print("\n" + "="*80)
        print("BACKEND API TESTING EXAMPLES")
        print("="*80)

        # Example 1: Health Check
        await example_1_health_check()

        # Example 2: Single Endpoint
        await example_2_test_single_endpoint()

        # Example 3: CRUD Test
        await example_3_test_crud()

        # Example 4: Batch Test
        await example_4_batch_test()

        print("\n" + "="*80)
        print("ALL EXAMPLES COMPLETED")
        print("="*80)

    # Run examples
    asyncio.run(run_all_examples())


"""
SUMMARY: What We Learned
========================

Manual Testing:
- Quick health checks
- Single endpoint testing
- Full CRUD testing
- Batch testing multiple APIs

Automated Testing with Pytest:
- Integration tests
- Authentication/authorization tests
- Validation tests
- CRUD test classes
- Parameterized tests

Test Data Management:
- Factory pattern for test data
- Random data generation
- Default values with overrides

Best Practices:
- Use descriptive test names
- Follow AAA pattern (Arrange-Act-Assert)
- Test one thing per test
- Use fixtures for common setup
- Make tests independent

Running Tests:
- pytest -v                    # Verbose output
- pytest -s                    # Show prints
- pytest -x                    # Stop on first failure
- pytest --cov                 # Coverage report
- pytest -m integration        # Run by mark

Remember: Good tests catch bugs early, document expected behavior,
and enable safe refactoring!
"""
