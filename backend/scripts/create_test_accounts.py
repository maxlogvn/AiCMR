import sys
import os
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.crud.crud_user import create, get_by_email
from app.schemas.user import UserCreate
from app.core.config import get_settings

settings = get_settings()

async def init_cache():
    try:
        redis = aioredis.from_url(settings.REDIS_URL, encoding="utf8", decode_responses=True)
        FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
        print("Initialized Redis cache")
    except Exception as e:
        print(f"Failed to initialize Redis cache: {e}")

async def create_users():
    await init_cache()

    # Define test accounts
    users_to_create = [
        {
            "email": "guest@aicmr.com", 
            "username": "guest_test", 
            "password": "User@123456", 
            "rank": 0, 
            "role": "Guest"
        },
        {
            "email": "member@aicmr.com", 
            "username": "member_test", 
            "password": "User@123456", 
            "rank": 1, 
            "role": "Member"
        },
        {
            "email": "mod@aicmr.com", 
            "username": "mod_test", 
            "password": "User@123456", 
            "rank": 3, 
            "role": "Moderator"
        },
        {
            "email": "admin_test@aicmr.com", 
            "username": "admin_test", 
            "password": "User@123456", 
            "rank": 5, 
            "role": "Admin"
        }
    ]

    async with AsyncSessionLocal() as db:
        print("Starting test account creation...")
        
        for user_data in users_to_create:
            try:
                # Check if user exists
                existing_user = await get_by_email(db, email=user_data["email"])
                if existing_user:
                    print(f"[-] User {user_data['email']} already exists. Skipping.")
                    continue
                
                # Create user
                print(f"[*] Creating {user_data['role']} ({user_data['email']})...")
                new_user = UserCreate(
                    email=user_data["email"],
                    username=user_data["username"],
                    password=user_data["password"],
                    rank=user_data["rank"],
                    is_active=True
                )
                
                created_user = await create(db, new_user)
                print(f"[+] Created {user_data['role']}: {created_user.email} (Rank {created_user.rank})")
                
            except Exception as e:
                print(f"[!] Error creating {user_data['email']}: {e}")
                # Rollback current transaction if error occurs to avoid blocking others
                await db.rollback()

        # Commit all changes
        await db.commit()
        print("Done.")

if __name__ == "__main__":
    asyncio.run(create_users())
