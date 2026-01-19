from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.attachment import Attachment
from app.schemas.attachment import AttachmentCreate


async def create(db: AsyncSession, obj_in: AttachmentCreate) -> Attachment:
    db_obj = Attachment(
        filename=obj_in.filename,
        file_path=obj_in.file_path,
        content_type=obj_in.content_type,
        file_size=obj_in.file_size,
        is_public=obj_in.is_public,
        user_id=obj_in.user_id,
    )
    db.add(db_obj)
    await db.flush()
    await db.refresh(db_obj)
    return db_obj


async def get(db: AsyncSession, id: int) -> Optional[Attachment]:
    result = await db.execute(select(Attachment).where(Attachment.id == id))
    return result.scalar_one_or_none()


async def get_multi_by_user(
    db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100
) -> List[Attachment]:
    result = await db.execute(
        select(Attachment)
        .where(Attachment.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


async def remove(db: AsyncSession, id: int) -> Optional[Attachment]:
    db_obj = await get(db, id)
    if db_obj:
        await db.delete(db_obj)
        await db.flush()
    return db_obj
