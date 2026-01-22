#!/usr/bin/env python
"""
Script to create test users in the database for manual testing.
Run this after the database has been initialized.

Usage:
    python backend/create_test_users.py
"""

import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import get_db, AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from sqlalchemy import select


async def create_test_users():
    """Create test users for manual testing."""
    
    # Test users to create
    test_users = [
        {
            "email": "test1@example.com",
            "username": "test1",
            "password": "TestPassword123!",
            "is_active": True,
            "rank": 1,  # MEMBER_RANK
        },
        {
            "email": "test2@example.com",
            "username": "test2",
            "password": "TestPassword456!",
            "is_active": True,
            "rank": 1,  # MEMBER_RANK
        },
        {
            "email": "admin@example.com",
            "username": "admin",
            "password": "AdminPassword123!",
            "is_active": True,
            "rank": 10,  # ADMIN_RANK
            "is_superuser": True,
        },
    ]
    
    async with AsyncSessionLocal() as db:
        print("🔄 Creating test users...\n")
        
        for user_data in test_users:
            # Check if user already exists
            result = await db.execute(
                select(User).where(User.email == user_data["email"])
            )
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                print(f"⏭️  User {user_data['email']} already exists (skipping)")
                continue
            
            # Create new user
            password = user_data.pop("password")
            user = User(
                **user_data,
                hashed_password=get_password_hash(password),
                is_superuser=user_data.get("is_superuser", False),
            )
            
            db.add(user)
            print(f"✅ Created user: {user_data['email']}")
        
        await db.commit()
        print("\n✨ Test users created successfully!\n")
        
        # Display user list
        result = await db.execute(select(User))
        all_users = result.scalars().all()
        
        print("📋 Current users in database:")
        print("-" * 60)
        for user in all_users:
            rank_name = {
                1: "MEMBER",
                3: "MODERATOR",
                5: "MODERATOR",
                10: "ADMIN",
            }.get(user.rank, f"RANK_{user.rank}")
            
            print(f"  • {user.email:25} | {user.username:15} | {rank_name}")
        print("-" * 60)
        
        print("\n🧪 Test Accounts for Manual Testing:")
        print("=" * 60)
        print("\nAccount 1 (User):")
        print("  Email:    test1@example.com")
        print("  Password: TestPassword123!")
        print("\nAccount 2 (User):")
        print("  Email:    test2@example.com")
        print("  Password: TestPassword456!")
        print("\nAccount 3 (Admin):")
        print("  Email:    admin@example.com")
        print("  Password: AdminPassword123!")
        print("\n" + "=" * 60)


if __name__ == "__main__":
    asyncio.run(create_test_users())
