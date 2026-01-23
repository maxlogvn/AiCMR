import asyncio
import httpx

async def test():
    # Login
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "http://localhost:8000/api/v1/auth/login",
            json={"email": "admin@aicmr.test", "password": "Admin123456!"}
        )
        print("Login:", resp.status_code)
        if resp.status_code != 200:
            print(resp.text)
            return

        token = resp.json()["access_token"]
        print("Token OK")

        # Create category
        resp = await client.post(
            "http://localhost:8000/api/v1/categories/",
            json={"name": "Test Category", "slug": "test-cat-999", "description": "Test"},
            headers={"Authorization": f"Bearer {token}"}
        )
        print("Create category:", resp.status_code)
        print(resp.text[:500])

asyncio.run(test())
