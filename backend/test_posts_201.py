import asyncio
import httpx

async def test():
    async with httpx.AsyncClient() as client:
        # Step 1: Check if user exists, create if not
        print("="*60)
        print("Step 1: Checking test user...")
        print("="*60)

        resp = await client.post(
            "http://localhost:8000/api/v1/auth/register",
            json={
                "email": "testuser201@example.com",
                "username": "testuser201",
                "password": "TestUser123!"
            }
        )
        print(f"Register status: {resp.status_code}")

        if resp.status_code == 200:
            print("User created successfully")
        else:
            print(f"User already exists or error: {resp.text}")
            print("Will try to login anyway...")

        # Step 2: Login
        print("\n" + "="*60)
        print("Step 2: Logging in...")
        print("="*60)

        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "testuser201@example.com", "password": "TestUser123!"}
        )
        print(f"Login status: {resp.status_code}")

        if resp.status_code != 200:
            print(f"Login failed: {resp.text}")
            return

        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Login successful!")

        # Step 3: Test POST /api/v1/posts/me
        print("\n" + "="*60)
        print("Step 3: Testing POST /api/v1/posts/me")
        print("="*60)

        resp = await client.post(
            "http://localhost:8000/api/v1/posts/me",
            json={
                "title": "Test Post 201 Verification",
                "slug": "test-post-201-final",
                "content": "Testing 201 status code",
                "excerpt": "Test",
                "status": "draft"
            },
            headers=headers
        )
        print(f"Status Code: {resp.status_code}")

        if resp.status_code == 201:
            print("SUCCESS! Returns 201 Created")
            data = resp.json()
            print(f"Post ID: {data.get('id')}")
            print(f"Title: {data.get('title')}")
        elif resp.status_code == 200:
            print("FAIL! Still returns 200 OK instead of 201 Created")
        else:
            print(f"ERROR: {resp.status_code}")
            print(f"Response: {resp.text[:300]}")

        print("\n" + "="*60)
        print("Test Complete")
        print("="*60)

asyncio.run(test())
