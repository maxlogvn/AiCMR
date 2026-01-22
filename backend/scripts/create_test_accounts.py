"""
Script to create test accounts for AiCMR

Usage:
    python -m scripts.create_test_accounts

Test accounts will be created with the following credentials:
    - Admin: admin@aicmr.local / Admin@123456
    - Moderator: moderator@aicmr.local / Moderator@123456
    - Member: member@aicmr.local / Member@123456
    - Guest: testuser@example.com / Test@123456
"""

import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import get_db, init_db
from app.crud import create, get_by_email
from app.schemas.user import UserCreate
from app.core.constants import ADMIN_RANK, MODERATOR_RANK, MEMBER_RANK, GUEST_RANK
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger

# Define test accounts
TEST_ACCOUNTS = [
    {
        "email": "admin@aicmr.local",
        "username": "admin",
        "password": "Admin@123456",
        "rank": 5,  # ADMIN
        "description": "System Administrator",
    },
    {
        "email": "moderator@aicmr.local",
        "username": "moderator",
        "password": "Moderator@123456",
        "rank": 3,  # MODERATOR
        "description": "Content Moderator",
    },
    {
        "email": "member@aicmr.local",
        "username": "member",
        "password": "Member@123456",
        "rank": 1,  # MEMBER
        "description": "Regular Member",
    },
    {
        "email": "testuser@example.com",
        "username": "testuser",
        "password": "Test@123456",
        "rank": 0,  # GUEST
        "description": "Test User",
    },
]


async def create_test_accounts():
    """Create test accounts in the database."""
    try:
        # Initialize database
        await init_db()
        logger.info("Database initialized")

        # Get async session
        async_generator = get_db()
        db = await async_generator.__anext__()

        created_count = 0
        skipped_count = 0

        for account in TEST_ACCOUNTS:
            try:
                # Check if user already exists
                existing = await get_by_email(db, account["email"])
                if existing:
                    logger.warning(
                        f"Account already exists: {account['email']} (ID: {existing.id})"
                    )
                    skipped_count += 1
                    continue

                # Create new user
                user_data = UserCreate(
                    email=account["email"],
                    username=account["username"],
                    password=account["password"],
                )
                user = await create(db, user_data)

                # Update rank
                user.rank = account["rank"]
                await db.commit()

                logger.info(
                    f"✅ Created test account: {account['email']} (Rank: {account['rank']} - {account['description']})"
                )
                created_count += 1

            except Exception as e:
                logger.error(f"❌ Failed to create account {account['email']}: {str(e)}")
                await db.rollback()
                continue

        # Summary
        logger.info(f"\n{'='*60}")
        logger.info(f"Test Account Creation Summary")
        logger.info(f"{'='*60}")
        logger.info(f"Created: {created_count}")
        logger.info(f"Skipped (already exist): {skipped_count}")
        logger.info(f"Total: {created_count + skipped_count}")
        logger.info(f"{'='*60}\n")

        # Print credentials
        logger.info("Test Account Credentials:")
        logger.info("-" * 60)
        for account in TEST_ACCOUNTS:
            rank_names = {0: "GUEST", 1: "MEMBER", 3: "MODERATOR", 5: "ADMIN"}
            rank_name = rank_names.get(account["rank"], f"RANK_{account['rank']}")
            logger.info(f"\nRole: {rank_name}")
            logger.info(f"  Email: {account['email']}")
            logger.info(f"  Password: {account['password']}")
            logger.info(f"  Rank: {account['rank']}")
        logger.info(f"\n{'='*60}\n")

        await db.close()

    except Exception as e:
        logger.error(f"Fatal error: {str(e)}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(create_test_accounts())
