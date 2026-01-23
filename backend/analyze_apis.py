import asyncio
import httpx
import sys
import io

# Set UTF-8 encoding for Windows console
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

async def test_endpoints():
    async with httpx.AsyncClient() as client:
        # Login as admin
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@aicmr.test", "password": "Admin123456!"}
        )
        print("=" * 60)
        print("Testing 3 Failed APIs")
        print("=" * 60)

        if resp.status_code != 200:
            print("❌ Login failed!")
            return

        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Test 1: Create Category
        print("\n📁 Test 1: POST /api/v1/categories/")
        print("-" * 40)

        # Get existing categories
        resp = await client.get("http://localhost:8000/api/v1/categories/")
        existing_cats = resp.json()
        print(f"Existing categories: {len(existing_cats)}")

        # Try to create category with existing slug
        test_slug = "test-category-analysis"
        resp = await client.post(
            "http://localhost:8000/api/v1/categories/",
            json={
                "name": "Test Category Analysis",
                "slug": test_slug,
                "description": "Test"
            },
            headers=headers
        )
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")

        # Check if it returns 200 or 201
        if resp.status_code == 201:
            print("✅ Returns 201 Created - CORRECT for new resource")
        elif resp.status_code == 200:
            print("⚠️ Returns 200 OK - Should return 201 for new resource")

        # Test 2: Create Post
        print("\n📝 Test 2: POST /api/v1/posts/me")
        print("-" * 40)

        # First, login as regular user
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "posttest@example.com", "password": "PostTest123!"}
        )

        if resp.status_code == 200:
            user_token = resp.json()["access_token"]
            user_headers = {"Authorization": f"Bearer {user_token}"}

            test_slug = f"post-test-{int(asyncio.get_event_loop().time())}"
            resp = await client.post(
                "http://localhost:8000/api/v1/posts/me",
                json={
                    "title": "Test Post Analysis",
                    "slug": test_slug,
                    "content": "Test content",
                    "excerpt": "Test",
                    "status": "draft"
                },
                headers=user_headers
            )
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.json()}")

            if resp.status_code == 201:
                print("✅ Returns 201 Created - CORRECT for new resource")
            elif resp.status_code == 200:
                print("⚠️ Returns 200 OK - Should return 201 for new resource")

        # Test 3: Create Tag
        print("\n🏷️  Test 3: POST /api/v1/tags/")
        print("-" * 40)

        # Get existing tags
        resp = await client.get("http://localhost:8000/api/v1/tags/")
        existing_tags = resp.json()
        print(f"Existing tags: {len(existing_tags['items'])}")

        test_tag_slug = f"tagtest-{int(asyncio.get_event_loop().time())}"
        resp = await client.post(
            "http://localhost:8000/api/v1/tags/",
            json={
                "name": "Tag Test",
                "slug": test_tag_slug,
                "color": "#FF0000"
            },
            headers=headers
        )
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")

        if resp.status_code == 201:
            print("✅ Returns 201 Created - CORRECT for new resource")
        elif resp.status_code == 200:
            print("⚠️ Returns 200 OK - Should return 201 for new resource")

        print("\n" + "=" * 60)
        print("📊 Analysis Complete")
        print("=" * 60)

asyncio.run(test_endpoints())
