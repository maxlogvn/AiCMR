"""
Migration script to add category and tag enhancements.

Run this script to add:
- Categories: icon, color, post_count, display_order, show_in_menu
- Tags: description, post_count
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import text
from app.core.database import get_db
import asyncio

async def migrate_categories(db):
    """Migrate categories table"""
    # Check if columns already exist
    result = await db.execute(text(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS "
        "WHERE TABLE_NAME = 'categories' AND TABLE_SCHEMA = DATABASE()"
    ))
    existing_columns = {row[0] for row in result.fetchall()}

    migrations = []

    # Add icon column
    if 'icon' not in existing_columns:
        migrations.append(text("ALTER TABLE categories ADD COLUMN icon VARCHAR(50) NULL COMMENT 'Icon name/class'"))
        print("Adding icon column to categories...")

    # Add color column
    if 'color' not in existing_columns:
        migrations.append(text("ALTER TABLE categories ADD COLUMN color VARCHAR(7) NULL COMMENT 'Hex color (#FF0000)'"))
        print("Adding color column to categories...")

    # Add post_count column
    if 'post_count' not in existing_columns:
        migrations.append(text("ALTER TABLE categories ADD COLUMN post_count INT NOT NULL DEFAULT 0 COMMENT 'Cache post count'"))
        print("Adding post_count column to categories...")

    # Add display_order column
    if 'display_order' not in existing_columns:
        migrations.append(text("ALTER TABLE categories ADD COLUMN display_order INT NOT NULL DEFAULT 0 COMMENT 'Sort order'"))
        print("Adding display_order column to categories...")

    # Add show_in_menu column
    if 'show_in_menu' not in existing_columns:
        migrations.append(text("ALTER TABLE categories ADD COLUMN show_in_menu BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Show in navigation menu'"))
        print("Adding show_in_menu column to categories...")

    # Add index for display_order
    result = await db.execute(text(
        "SHOW INDEX FROM categories WHERE Key_name = 'idx_category_order'"
    ))
    if not result.fetchone():
        migrations.append(text("CREATE INDEX idx_category_order ON categories (display_order)"))
        print("Adding idx_category_order index to categories...")

    # Execute migrations
    for migration in migrations:
        await db.execute(migration)

    await db.commit()
    print(f"Categories table migrated with {len(migrations)} changes.")

async def migrate_tags(db):
    """Migrate tags table"""
    # Check if columns already exist
    result = await db.execute(text(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS "
        "WHERE TABLE_NAME = 'tags' AND TABLE_SCHEMA = DATABASE()"
    ))
    existing_columns = {row[0] for row in result.fetchall()}

    migrations = []

    # Add description column
    if 'description' not in existing_columns:
        migrations.append(text("ALTER TABLE tags ADD COLUMN description TEXT NULL COMMENT 'Tag description'"))
        print("Adding description column to tags...")

    # Add post_count column
    if 'post_count' not in existing_columns:
        migrations.append(text("ALTER TABLE tags ADD COLUMN post_count INT NOT NULL DEFAULT 0 COMMENT 'Cache post count'"))
        print("Adding post_count column to tags...")

    # Add index for post_count
    result = await db.execute(text(
        "SHOW INDEX FROM tags WHERE Key_name = 'idx_tag_post_count'"
    ))
    if not result.fetchone():
        migrations.append(text("CREATE INDEX idx_tag_post_count ON tags (post_count)"))
        print("Adding idx_tag_post_count index to tags...")

    # Execute migrations
    for migration in migrations:
        await db.execute(migration)

    await db.commit()
    print(f"Tags table migrated with {len(migrations)} changes.")

async def backfill_post_counts(db):
    """Backfill post counts for categories and tags"""
    from app.models.category import Category
    from app.models.tag import Tag
    from app.models.post import Post
    from sqlalchemy import func, select
    from app.models.post_tag import PostTag

    print("\nBackfilling post counts for categories...")
    # Get all categories
    result = await db.execute(select(Category))
    categories = result.scalars().all()

    for category in categories:
        # Count posts in this category
        post_count_result = await db.execute(
            select(func.count()).select_from(Post).where(Post.category_id == category.id)
        )
        category.post_count = post_count_result.scalar()
        print(f"  Category '{category.name}': {category.post_count} posts")

    print("\nBackfilling post counts for tags...")
    # Get all tags
    result = await db.execute(select(Tag))
    tags = result.scalars().all()

    for tag in tags:
        # Count posts with this tag
        post_count_result = await db.execute(
            select(func.count()).select_from(PostTag).where(PostTag.tag_id == tag.id)
        )
        tag.post_count = post_count_result.scalar()
        print(f"  Tag '{tag.name}': {tag.post_count} posts")

    await db.commit()
    print("\nPost counts backfilled successfully.")

async def migrate():
    """Run all migrations"""
    print("Starting migration...")
    print("=" * 50)

    async for db in get_db():
        await migrate_categories(db)
        await migrate_tags(db)
        await backfill_post_counts(db)

    print("=" * 50)
    print("Migration completed successfully!")

async def rollback_categories(db):
    """Rollback categories table changes"""
    result = await db.execute(text(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS "
        "WHERE TABLE_NAME = 'categories' AND TABLE_SCHEMA = DATABASE()"
    ))
    existing_columns = {row[0] for row in result.fetchall()}

    migrations = []

    # Drop columns in reverse order
    if 'show_in_menu' in existing_columns:
        migrations.append(text("ALTER TABLE categories DROP COLUMN show_in_menu"))

    if 'display_order' in existing_columns:
        migrations.append(text("ALTER TABLE categories DROP COLUMN display_order"))

    if 'post_count' in existing_columns:
        migrations.append(text("ALTER TABLE categories DROP COLUMN post_count"))

    if 'color' in existing_columns:
        migrations.append(text("ALTER TABLE categories DROP COLUMN color"))

    if 'icon' in existing_columns:
        migrations.append(text("ALTER TABLE categories DROP COLUMN icon"))

    # Drop index
    result = await db.execute(text(
        "SHOW INDEX FROM categories WHERE Key_name = 'idx_category_order'"
    ))
    if result.fetchone():
        migrations.append(text("DROP INDEX idx_category_order ON categories"))

    for migration in migrations:
        await db.execute(migration)

    await db.commit()
    print("Categories table rollback completed.")

async def rollback_tags(db):
    """Rollback tags table changes"""
    result = await db.execute(text(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS "
        "WHERE TABLE_NAME = 'tags' AND TABLE_SCHEMA = DATABASE()"
    ))
    existing_columns = {row[0] for row in result.fetchall()}

    migrations = []

    # Drop columns in reverse order
    if 'post_count' in existing_columns:
        migrations.append(text("ALTER TABLE tags DROP COLUMN post_count"))

    if 'description' in existing_columns:
        migrations.append(text("ALTER TABLE tags DROP COLUMN description"))

    # Drop index
    result = await db.execute(text(
        "SHOW INDEX FROM tags WHERE Key_name = 'idx_tag_post_count'"
    ))
    if result.fetchone():
        migrations.append(text("DROP INDEX idx_tag_post_count ON tags"))

    for migration in migrations:
        await db.execute(migration)

    await db.commit()
    print("Tags table rollback completed.")

async def rollback():
    """Rollback all migrations"""
    print("Rolling back migrations...")
    print("=" * 50)

    async for db in get_db():
        await rollback_categories(db)
        await rollback_tags(db)

    print("=" * 50)
    print("Rollback completed successfully!")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Migrate category and tag enhancements")
    parser.add_argument('--rollback', action='store_true', help='Rollback migrations')

    args = parser.parse_args()

    if args.rollback:
        asyncio.run(rollback())
    else:
        asyncio.run(migrate())
