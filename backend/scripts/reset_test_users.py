"""
Script reset và tạo lại tài khoản test cho AiCMR

Usage:
    python scripts/reset_test_users.py
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, delete

from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.post import Post
from app.models.post_tag import PostTag
from app.models.base import Base
from app.core.config import get_settings
from app.core.security import get_password_hash

settings = get_settings()


# Test users with different ranks
# Note: Using .com domain to avoid email validation issues with reserved TLDs
# (.test, .local, .dev, .example are reserved TLDs and not accepted by EmailStr validator)
TEST_USERS = [
    {
        "email": "admin.aicmr@gmail.com",
        "username": "admin",
        "password": "Admin@123",
        "rank": 10,
        "is_superuser": True,
        "is_active": True,
        "description": "Super Admin - Full quyền truy cập"
    },
    {
        "email": "moderator.aicmr@gmail.com",
        "username": "moderator",
        "password": "Mod@123",
        "rank": 5,
        "is_superuser": False,
        "is_active": True,
        "description": "Moderator - Quản lý content, users"
    },
    {
        "email": "editor.aicmr@gmail.com",
        "username": "editor",
        "password": "Editor@123",
        "rank": 3,
        "is_superuser": False,
        "is_active": True,
        "description": "Editor - Đăng bài, quản lý bài viết"
    },
    {
        "email": "member.aicmr@gmail.com",
        "username": "member",
        "password": "Member@123",
        "rank": 1,
        "is_superuser": False,
        "is_active": True,
        "description": "Member - Người dùng thường"
    },
    {
        "email": "guest.aicmr@gmail.com",
        "username": "guest",
        "password": "Guest@123",
        "rank": 0,
        "is_superuser": False,
        "is_active": True,
        "description": "Guest - Khách, quyền hạn thấp nhất"
    },
    {
        "email": "testuser.aicmr@gmail.com",
        "username": "testuser",
        "password": "Test@123",
        "rank": 1,
        "is_superuser": False,
        "is_active": True,
        "description": "Test User - Dùng cho test tự động"
    },
    {
        "email": "inactive.aicmr@gmail.com",
        "username": "inactive",
        "password": "Inactive@123",
        "rank": 1,
        "is_superuser": False,
        "is_active": False,
        "description": "Inactive User - Tài khoản bị vô hiệu"
    },
]


async def reset_users():
    """Xóa tất cả users và tạo lại users test"""

    # Create async engine
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=False,
    )

    # Create session factory
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        # Delete in correct order due to foreign key constraints
        print("🗑️  Deleting all existing data...")
        print("   - Deleting post_tags...")
        await session.execute(delete(PostTag))
        print("   - Deleting posts...")
        await session.execute(delete(Post))
        print("   - Deleting refresh_tokens...")
        await session.execute(delete(RefreshToken))
        print("   - Deleting users...")
        await session.execute(delete(User))
        await session.commit()

        # Create test users
        print("📝 Creating test users...")
        print("-" * 60)

        for user_data in TEST_USERS:
            # Copy data to avoid modifying original
            data = {**user_data}
            description = data.pop("description", "")
            password = data.pop("password")

            user = User(
                **data,
                hashed_password=get_password_hash(password)
            )
            session.add(user)
            await session.flush()
            await session.refresh(user)

            rank_name = {
                10: "ADMIN",
                5: "MODERATOR",
                3: "EDITOR",
                1: "MEMBER",
                0: "GUEST"
            }.get(data["rank"], "UNKNOWN")

            print(f"✅ Created: {user.username:15} | {rank_name:10} | {user.email:25} | {description}")

        await session.commit()
        print("-" * 60)
        print(f"🎉 Successfully created {len(TEST_USERS)} test users!")

        # Display summary table
        print("\n📋 TEST USERS SUMMARY")
        print("=" * 100)
        print(f"{'Username':<15} | {'Email':<25} | {'Password':<15} | {'Rank':<10} | {'Description'}")
        print("-" * 100)

        for u in TEST_USERS:
            # Get original data directly from TEST_USERS
            password = u.get("password", "")
            email = u.get("email", "")
            username = u.get("username", "")
            rank = u.get("rank", 0)
            description = u.get("description", "")

            rank_name = {
                10: "ADMIN",
                5: "MODERATOR",
                3: "EDITOR",
                1: "MEMBER",
                0: "GUEST"
            }.get(rank, "UNKNOWN")

            print(f"{username:<15} | {email:<25} | {password:<15} | {rank_name:<10} | {description}")

        print("=" * 100)

    await engine.dispose()


if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("  AiCMR - Reset Test Users Script")
    print("=" * 50 + "\n")

    # Confirm before proceeding
    confirm = input("⚠️  This will DELETE ALL existing users. Continue? (yes/no): ")
    if confirm.lower() not in ["yes", "y"]:
        print("❌ Operation cancelled.")
        sys.exit(0)

    asyncio.run(reset_users())
    print("\n✨ Done! You can now login with the test accounts above.\n")
