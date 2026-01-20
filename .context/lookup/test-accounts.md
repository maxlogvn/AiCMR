# Test Accounts - Quick Reference

Tài khoản test cho phát triển và testing.

## Mật khẩu chung
`User@123456`

## Admin (Rank 5)
- Email: `admin_test@aicmr.com`
- Quyền: Full access, quản lý users, settings
- Dùng để: Test admin features, quản lý hệ thống

## Moderator (Rank 3)
- Email: `mod@aicmr.com`
- Quyền: Moderate content, quản lý users thường
- Dùng để: Test moderation features

## Member (Rank 1)
- Email: `member@aicmr.com`
- Quyền: Tạo, đọc, update content của chính mình
- Dùng để: Test user features thường

## Guest (Rank 0)
- Email: `guest@aicmr.com`
- Quyền: Chỉ đọc public content
- Dùng để: Test public access, unauthorized behavior

## Rank System
- 0: Guest - Chỉ đọc public content
- 1: Member - Truy cập personal content
- 3: Moderator - Moderate content, quản lý users
- 5: Admin - Full access

## Sử dụng trong Tests

```python
# Login và lấy token
@pytest.fixture
async def admin_token(client: AsyncClient):
    response = await client.post("/api/v1/auth/login", json={
        "email": "admin_test@aicmr.com",
        "password": "User@123456"
    })
    return response.json()["access_token"]

# Test với role cụ thể
def test_admin_only_endpoint(client: AsyncClient, admin_token: str):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = await client.get("/api/v1/admin/dashboard", headers=headers)
    assert response.status_code == 200
```

## Reset Password

Nếu cần reset test accounts:

```bash
# Reset tất cả test accounts
docker compose exec backend python scripts/create_test_accounts.py
```

## Tham Chiếu
- Security: `concepts/security.md`
- Debugging: `guides/debugging.md`
- Docker commands: `examples/docker-commands.md`
