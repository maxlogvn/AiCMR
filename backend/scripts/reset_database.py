import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.core.database import get_db
from app.crud.crud_user import get_by_id
from app.models.user import User
from sqlalchemy import select
import asyncio

async def delete_all_users():
    """Xóa tất cả users từ database"""
    async for db in get_db():
        result = await db.execute(select(User))
        users = result.scalars().all()

        deleted_count = 0
        for user in users:
            if user.id != 1:
                await db.delete(user)
                deleted_count += 1

        await db.commit()
        print(f"Deleted {deleted_count} users (excluding first admin with ID=1)")

async def create_admin_user(db, email, username, password):
    """Tạo admin user mới"""
    from app.crud import create
    from app.schemas.user import UserCreate

    user_data = UserCreate(
        email=email,
        username=username,
        password=password,
        is_active=True,
        rank=5
    )

    admin_user = await create(db, user_data)
    print(f"Created admin user: {admin_user.email}")
    return admin_user

async def reset_database():
    """Reset database: xóa tất cả users và tạo admin mới"""
    async for db in get_db():
        await delete_all_users()

        admin_email = "admin@aicmr.com"
        admin_username = "aicmr_admin"
        admin_password = "Admin@123456"

        await create_admin_user(db, admin_email, admin_username, admin_password)

        print(f"Database reset completed. New admin: {admin_email}/{admin_password}")
        print("Credentials saved to AGENTS.md")

if __name__ == "__main__":
    asyncio.run(reset_database())
