import asyncio
import httpx

async def test():
    async with httpx.AsyncClient() as client:
        # Login
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@aicmr.test", "password": "Admin123456!"}
        )
        print(f"Login status: {resp.status_code}")

        if resp.status_code != 200:
            print(f"Login failed: {resp.text}")
            return

        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Test 1: Create Category
        print("\n" + "="*60)
        print("Test 1: POST /api/v1/categories/")
        print("="*60)

        resp = await client.post(
            "http://localhost:8000/api/v1/categories/",
            json={
                "name": "Test Category 201",
                "slug": "test-cat-201-verify",
                "description": "Testing 201 status"
            },
            headers=headers
        )
        print(f"Status Code: {resp.status_code}")
        if resp.status_code == 201:
            print("SUCCESS! Returns 201 Created")
        elif resp.status_code == 200:
            print("FAIL! Still returns 200 OK instead of 201 Created")
        else:
            print(f"ERROR: {resp.status_code} - {resp.text}")

        # Test 2: Create Post
        print("\n" + "="*60)
        print("Test 2: POST /api/v1/posts/me")
        print("="*60)

        resp = await client.post(
            "http://localhost:8000/api/v1/posts/me",
            json={
                "title": "Test Post 201",
                "slug": "test-post-201-verify",
                "content": "Testing 201 status",
                "excerpt": "Test",
                "status": "draft"
            },
            headers=headers
        )
        print(f"Status Code: {resp.status_code}")
        if resp.status_code == 201:
            print("SUCCESS! Returns 201 Created")
        elif resp.status_code == 200:
            print("FAIL! Still returns 200 OK instead of 201 Created")
        else:
            print(f"ERROR: {resp.status_code} - {resp.text[:200]}")

        # Test 3: Create Tag
        print("\n" + "="*60)
        print("Test 3: POST /api/v1/tags/")
        print("="*60)

        resp = await client.post(
            "http://localhost:8000/api/v1/tags/",
            json={
                "name": "Test Tag 201",
                "slug": "test-tag-201-verify",
                "color": "#FF0000"
            },
            headers=headers
        )
        print(f"Status Code: {resp.status_code}")
        if resp.status_code == 201:
            print("SUCCESS! Returns 201 Created")
        elif resp.status_code == 200:
            print("FAIL! Still returns 200 OK instead of 201 Created")
        else:
            print(f"ERROR: {resp.status_code} - {resp.text}")

        print("\n" + "="*60)
        print("Summary: All 3 CREATE endpoints should return 201 Created")
        print("="*60)

asyncio.run(test())
