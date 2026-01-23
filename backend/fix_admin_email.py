import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, update
from app.core.config import settings
from app.models.user import User

async def fix_admin_email():
    """Update admin email from admin@aicmr.test to admin@aicmr.local"""

    # Create async engine
    engine = create_async_engine(
        f"mysql+aiomysql://{settings.DB_USER}:{settings.DB_PASSWORD}@"
        f"{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
    )

    # Create session
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        # Find admin user
        result = await session.execute(
            select(User).where(User.email == "admin@aicmr.test")
        )
        admin = result.scalar_one_or_none()

        if admin:
            print(f"Found admin user: {admin.email} (ID: {admin.id})")

            # Update email
            new_email = "admin@aicmr.dev"
            await session.execute(
                update(User)
                .where(User.id == admin.id)
                .values(email=new_email)
            )
            await session.commit()

            print(f"✅ Updated admin email to: {new_email}")
        else:
            print("❌ Admin user with email 'admin@aicmr.test' not found")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(fix_admin_email())
