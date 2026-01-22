# Post Module Implementation Plan

## Overview

This document outlines the comprehensive implementation plan for the post module, which allows authenticated users to create, edit, and delete posts. Admin/Moderators can manage posts, categories, and tags in the dashboard. Post content is stored as markdown files in storage for easy RAG integration.

## Tech Stack

- **Backend**: FastAPI + SQLAlchemy (async) + MySQL
- **Frontend**: Next.js 16 + TypeScript + React Query + Zustand
- **Storage**: Local filesystem for markdown files
- **Cache**: Redis
- **Authentication**: JWT with rank-based permissions

## Phase 1: Backend Foundation (Database Models & Schemas)

### 1.1 Database Models

Create the following models in `backend/app/models/`:

#### Post Model (`post.py`)
```python
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    content_path = Column(String(512), nullable=False)  # Path to markdown file
    cover_image_id = Column(Integer, ForeignKey("attachments.id"), nullable=True)
    excerpt = Column(Text, nullable=True)
    status = Column(Enum(PostStatus), default=PostStatus.DRAFT, nullable=False, index=True)
    view_count = Column(Integer, default=0, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="posts")
    category = relationship("Category", backref="posts")
    cover_image = relationship("Attachment", backref="cover_posts")
    tags = relationship("Tag", secondary="post_tags", backref="posts")
    metadata = relationship("PostMetadata", backref="post", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_post_user_status", "user_id", "status"),
        Index("idx_post_category_status", "category_id", "status"),
        Index("idx_post_published", "published_at"),
    )
```

#### Category Model (`category.py`)
```python
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Self-referential relationship for hierarchy
    children = relationship("Category", backref=backref('parent', remote_side=[id]))
    __table_args__ = (Index("idx_category_parent", "parent_id", "is_active"),)
```

#### Tag Model (`tag.py`)
```python
class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    color = Column(String(7), nullable=True)  # Hex color code
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (Index("idx_tag_name", "name"),)
```

#### Post Tags Junction Table
```python
class PostTag(Base):
    __tablename__ = "post_tags"

    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
```

#### Post Metadata Model (`post_metadata.py`)
```python
class PostMetadata(Base):
    __tablename__ = "post_metadata"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    key = Column(String(100), nullable=False)
    value = Column(Text, nullable=False)  # JSON string for flexible data
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("idx_post_metadata_post_key", "post_id", "key"),
    )
```

#### Post Status Enum
```python
from enum import Enum as PyEnum

class PostStatus(str, PyEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
```

### 1.2 Pydantic Schemas

Create schemas in `backend/app/schemas/`:

#### Post Schemas (`post.py`)
- `PostBase`: title, slug, excerpt, status, category_id, tags, cover_image_id
- `PostCreate`: PostBase + content (markdown string)
- `PostUpdate`: Optional PostBase fields + optional content
- `PostResponse`: PostBase + id, user, view_count, created_at, updated_at, published_at
- `PostListResponse`: PostResponse with pagination
- `PostQuery`: status, category_id, tag_ids, search, author_id, date_from, date_to

#### Category Schemas (`category.py`)
- `CategoryBase`: name, slug, description, parent_id, is_active
- `CategoryCreate`: CategoryBase
- `CategoryUpdate`: Optional CategoryBase fields
- `CategoryResponse`: CategoryBase + id, created_at + children list

#### Tag Schemas (`tag.py`)
- `TagBase`: name, slug, color
- `TagCreate`: TagBase
- `TagUpdate`: Optional TagBase fields
- `TagResponse`: TagBase + id, created_at

#### Metadata Schemas (`post.py`)
- `PostMetadataBase`: key, value
- `PostMetadataCreate`: PostMetadataBase
- `PostMetadataUpdate`: Optional value
- `PostMetadataResponse`: PostMetadataBase + id, created_at, updated_at

### 1.3 Database Migration

Create migration script in `backend/scripts/migrate_posts.py`:
- Create all tables
- Add indexes
- Insert default categories if needed

---

## Phase 2: Storage Layer (Markdown File Management)

### 2.1 Markdown Storage Service

Create `backend/app/services/post_storage.py`:

```python
from pathlib import Path
from typing import Optional
import aiofiles
from app.core.config import get_settings
from loguru import logger

class PostStorageService:
    """Service for managing markdown file storage for posts"""

    def __init__(self):
        self.settings = get_settings()
        self.storage_dir = Path(self.settings.UPLOAD_DIR) / "posts"
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def _get_file_path(self, post_id: int, slug: str) -> Path:
        """Generate file path for a post"""
        return self.storage_dir / f"{post_id}_{slug}.md"

    async def save_post_content(self, post_id: int, slug: str, content: str) -> Path:
        """Save markdown content to file"""
        file_path = self._get_file_path(post_id, slug)
        async with aiofiles.open(file_path, mode='w', encoding='utf-8') as f:
            await f.write(content)
        logger.info(f"Saved post content: {file_path}")
        return file_path

    async def read_post_content(self, post_id: int, slug: str) -> Optional[str]:
        """Read markdown content from file"""
        file_path = self._get_file_path(post_id, slug)
        if not file_path.exists():
            return None
        async with aiofiles.open(file_path, mode='r', encoding='utf-8') as f:
            content = await f.read()
        return content

    async def update_post_content(self, post_id: int, slug: str, content: str) -> Path:
        """Update existing markdown content"""
        return await self.save_post_content(post_id, slug, content)

    async def delete_post_content(self, post_id: int, slug: str) -> bool:
        """Delete markdown file"""
        file_path = self._get_file_path(post_id, slug)
        if file_path.exists():
            file_path.unlink()
            logger.info(f"Deleted post content: {file_path}")
            return True
        return False
```

---

## Phase 3: CRUD Operations

### 3.1 Post CRUD (`backend/app/crud/crud_post.py`)

```python
async def get_by_id(db: AsyncSession, post_id: int) -> Optional[Post]:
async def get_by_slug(db: AsyncSession, slug: str) -> Optional[Post]:
async def get_all(db: AsyncSession, skip: int, limit: int, filters: PostQuery) -> list[Post]:
async def create(db: AsyncSession, obj_in: PostCreate, user_id: int) -> Post:
async def update(db: AsyncSession, db_obj: Post, obj_in: PostUpdate) -> Post:
async def delete(db: AsyncSession, post_id: int) -> bool:
async def increment_view_count(db: AsyncSession, post_id: int) -> int:
async def get_user_posts(db: AsyncSession, user_id: int, skip: int, limit: int) -> list[Post]:
async def get_published_posts(db: AsyncSession, skip: int, limit: int) -> list[Post]:
```

### 3.2 Category CRUD (`backend/app/crud/crud_category.py`)

```python
async def get_by_id(db: AsyncSession, category_id: int) -> Optional[Category]:
async def get_by_slug(db: AsyncSession, slug: str) -> Optional[Category]:
async def get_all(db: AsyncSession, active_only: bool = True) -> list[Category]:
async def get_tree_structure(db: AsyncSession) -> list[Category]:
async def create(db: AsyncSession, obj_in: CategoryCreate) -> Category:
async def update(db: AsyncSession, db_obj: Category, obj_in: CategoryUpdate) -> Category:
async def delete(db: AsyncSession, category_id: int) -> bool:
async def get_with_post_count(db: AsyncSession, category_id: int) -> Category:
```

### 3.3 Tag CRUD (`backend/app/crud/crud_tag.py`)

```python
async def get_by_id(db: AsyncSession, tag_id: int) -> Optional[Tag]:
async def get_by_slug(db: AsyncSession, slug: str) -> Optional[Tag]:
async def get_all(db: AsyncSession) -> list[Tag]:
async def create(db: AsyncSession, obj_in: TagCreate) -> Tag:
async def update(db: AsyncSession, db_obj: Tag, obj_in: TagUpdate) -> Tag:
async def delete(db: AsyncSession, tag_id: int) -> bool:
async def get_trending_tags(db: AsyncSession, limit: int = 10) -> list[Tag]:
```

### 3.4 PostMetadata CRUD

```python
async def set_metadata(db: AsyncSession, post_id: int, key: str, value: Any) -> PostMetadata:
async def get_metadata(db: AsyncSession, post_id: int, key: str) -> Optional[PostMetadata]:
async def get_all_metadata(db: AsyncSession, post_id: int) -> list[PostMetadata]:
async def delete_metadata(db: AsyncSession, post_id: int, key: str) -> bool:
async def bulk_set_metadata(db: AsyncSession, post_id: int, metadata: dict[str, Any]) -> list[PostMetadata]:
```

---

## Phase 4: API Endpoints (FastAPI)

### 4.1 Public Endpoints (`backend/app/api/v1/posts.py`)

```python
# List published posts with filters
@router.get("/", response_model=Page[PostResponse])
@cache(expire=300, namespace="posts")
async def list_posts(...)

# Get post detail by slug
@router.get("/{slug}", response_model=PostResponse)
async def get_post_by_slug(slug: str, ...)

# Get raw markdown content
@router.get("/{slug}/raw")
async def get_post_raw(slug: str, ...)
```

### 4.2 Authenticated User Endpoints (MEMBER_RANK+)

```python
# Create new post
@router.post("/me", response_model=PostResponse)
async def create_post(post_in: PostCreate, current_user: User = Depends(get_current_active_user), ...)

# Get current user's posts
@router.get("/me", response_model=Page[PostResponse])
async def get_my_posts(...)

# Update own post
@router.patch("/me/{post_id}", response_model=PostResponse)
async def update_my_post(post_id: int, post_in: PostUpdate, ...)

# Delete own post
@router.delete("/me/{post_id}")
async def delete_my_post(post_id: int, ...)
```

### 4.3 Admin/Moderator Endpoints (MODERATOR_RANK+)

```python
# List all posts with any status
@router.get("/all", response_model=Page[PostResponse])
async def list_all_posts(...)

# Update any post
@router.patch("/{post_id}", response_model=PostResponse)
async def update_post(post_id: int, post_in: PostUpdate, ...)

# Delete any post
@router.delete("/{post_id}")
async def delete_post(post_id: int, ...)

# Bulk actions
@router.post("/bulk/publish")
async def bulk_publish_posts(post_ids: list[int], ...)

@router.post("/bulk/archive")
async def bulk_archive_posts(post_ids: list[int], ...)
```

### 4.4 Category & Tag Endpoints

```python
# Public
@router.get("/categories", response_model=list[CategoryResponse])
@router.get("/categories/{slug}", response_model=CategoryResponse)
@router.get("/tags", response_model=list[TagResponse])
@router.get("/tags/{slug}", response_model=TagResponse)

# Admin only
@router.post("/categories", response_model=CategoryResponse)
@router.patch("/categories/{category_id}", response_model=CategoryResponse)
@router.delete("/categories/{category_id}")
@router.post("/tags", response_model=TagResponse)
@router.patch("/tags/{tag_id}", response_model=TagResponse)
@router.delete("/tags/{tag_id}")
```

### 4.5 Metadata Endpoints

```python
@router.get("/{post_id}/metadata", response_model=list[PostMetadataResponse])
@router.patch("/{post_id}/metadata", response_model=list[PostMetadataResponse])
@router.delete("/{post_id}/metadata/{key}")
```

### 4.6 Security Features

- CSRF protection on all write operations
- Rate limiting on create/update endpoints
- Ownership checks for user posts
- Cache invalidation on write operations
- Proper error handling and logging

---

## Phase 5: Frontend Components (Next.js)

### 5.1 Public Pages

#### Blog Listing (`app/(public)/blog/page.tsx`)
- Grid/list view toggle
- Filter sidebar (categories, tags, date range)
- Search bar
- Pagination
- Featured posts carousel

#### Post Detail (`app/(public)/posts/[slug]/page.tsx`)
- Markdown rendering (using `react-markdown`)
- Display metadata (author, date, categories, tags, view count)
- Related posts sidebar
- Social sharing buttons
- Back to blog link

### 5.2 User Dashboard

#### My Posts (`app/(dashboard)/posts/page.tsx`)
- Table view with columns: title, status, category, date, views, actions
- Filter by status
- Create new post button
- Quick actions (edit, delete, publish)

#### Post Editor (`app/(dashboard)/posts/new/page.tsx` & `edit/[id]/page.tsx`)
- Markdown editor (textarea or rich editor like `react-markdown-editor-lite`)
- Cover image upload
- Category selection (dropdown with hierarchy)
- Tag input (with autocomplete)
- Excerpt field
- Metadata editor (dynamic key-value fields)
- Preview mode
- Save as draft / Publish buttons

### 5.3 Admin/Moderator Dashboard

#### Post Management (`app/(dashboard)/admin/posts/page.tsx`)
- All posts with filtering
- Bulk selection
- Bulk actions (publish, archive, delete)
- Moderation queue (posts pending approval if needed)

#### Category Management (`app/(dashboard)/admin/categories/page.tsx`)
- Category tree view
- Create, edit, reorder
- Nested category support

#### Tag Management (`app/(dashboard)/admin/tags/page.tsx`)
- Tag list with usage count
- Merge tags functionality
- Rename, delete tags

### 5.4 UI Components

#### Post Components (`components/post/`)
- `PostCard`: Compact card for grid view
- `PostListItem`: Row for table/list view
- `PostDetail`: Full post detail display
- `PostEditor`: Markdown editor with toolbar
- `MetadataEditor`: Dynamic key-value field editor
- `PostFilter`: Filter sidebar
- `PostPagination`: Pagination controls

#### Category & Tag Components
- `CategoryBadge`: Category display chip
- `TagBadge`: Tag display chip
- `CategorySelect`: Dropdown with hierarchy
- `TagInput`: Multi-select with autocomplete

---

## Phase 6: State Management & API Integration

### 6.1 React Query Hooks (`lib/hooks/`)

```typescript
// usePosts.ts
export function usePosts(filters?: PostQuery) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => PostService.getAll(filters),
  });
}

// usePost.ts
export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => PostService.getBySlug(slug),
  });
}

// useCreatePost.ts
export function useCreatePost() {
  return useMutation({
    mutationFn: PostService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// useUpdatePost.ts
export function useUpdatePost(postId: number) {
  return useMutation({
    mutationFn: (data: PostUpdate) => PostService.update(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}

// useDeletePost.ts
export function useDeletePost() {
  return useMutation({
    mutationFn: PostService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
```

### 6.2 API Services (`lib/api/posts.ts`)

```typescript
class PostService {
  static async getAll(filters?: PostQuery): Promise<Page<PostResponse>> { ... }
  static async getBySlug(slug: string): Promise<PostResponse> { ... }
  static async getRawContent(slug: string): Promise<string> { ... }
  static async create(data: PostCreate): Promise<PostResponse> { ... }
  static async update(id: number, data: PostUpdate): Promise<PostResponse> { ... }
  static async delete(id: number): Promise<void> { ... }
  static async publish(id: number): Promise<PostResponse> { ... }
  static async archive(id: number): Promise<PostResponse> { ... }
  static async getMetadata(id: number): Promise<PostMetadataResponse[]> { ... }
  static async updateMetadata(id: number, data: Record<string, any>): Promise<PostMetadataResponse[]> { ... }
}
```

### 6.3 Zustand Stores (`stores/`)

```typescript
// postStore.ts
interface PostStore {
  editorDraft: Record<number, string>; // postId -> markdown content
  unsavedChanges: Record<number, boolean>;
  setEditorDraft: (postId: number, content: string) => void;
  clearEditorDraft: (postId: number) => void;
}

// filterStore.ts
interface FilterStore {
  filters: PostQuery;
  setFilters: (filters: PostQuery) => void;
  clearFilters: () => void;
}
```

---

## Phase 7: Testing

### 7.1 Backend Tests (`backend/tests/`)

- `test_post_models.py`: Model CRUD, relationships
- `test_post_schemas.py`: Schema validation
- `test_post_crud.py`: CRUD operations
- `test_post_api.py`: API endpoint tests
- `test_post_storage.py`: File storage operations
- `test_category_api.py`: Category endpoints
- `test_tag_api.py`: Tag endpoints

### 7.2 Frontend Tests

- Component tests: `PostCard.test.tsx`, `PostEditor.test.tsx`
- Hook tests: `usePosts.test.ts`, `useCreatePost.test.ts`
- E2E tests: Create post flow, Edit post flow, Filter posts flow

---

## Phase 8: RAG Integration Preparation

### 8.1 Metadata Structure

Standard metadata fields for RAG:
- `author`: Author username
- `publish_date`: Publication date
- `category`: Primary category
- `tags`: List of tags
- `language`: Content language (vi, en)
- `reading_time`: Estimated reading time in minutes
- `difficulty_level`: Beginner, Intermediate, Advanced
- `related_topics`: Array of related topics
- `summary`: AI-generated summary
- `keywords`: Array of keywords

### 8.2 Content Formatting Guidelines

- Use standard markdown formatting
- Include YAML frontmatter for metadata:
```markdown
---
title: "Post Title"
author: "username"
category: "technology"
tags: ["ai", "ml"]
language: vi
---

# Content here
```

### 8.3 Export API

```python
@router.get("/export")
async def export_posts(
    post_ids: list[int] = Query(...),
    format: str = Query("markdown", enum=["markdown", "json"]),
    current_user: User = Depends(require_min_rank(ADMIN_RANK))
):
    """Export posts for RAG pipeline"""
    pass
```

---

## File Structure

### Backend
```
backend/app/
├── models/
│   ├── post.py
│   ├── category.py
│   ├── tag.py
│   └── post_metadata.py
├── schemas/
│   ├── post.py
│   ├── category.py
│   └── tag.py
├── crud/
│   ├── crud_post.py
│   ├── crud_category.py
│   └── crud_tag.py
├── services/
│   └── post_storage.py
├── api/v1/
│   ├── posts.py
│   ├── categories.py
│   └── tags.py
└── storage/
    └── posts/  # Markdown files
```

### Frontend
```
frontend/
├── app/
│   ├── (public)/
│   │   ├── blog/
│   │   │   └── page.tsx
│   │   └── posts/
│   │       └── [slug]/
│   │           └── page.tsx
│   └── (dashboard)/
│       ├── posts/
│       │   ├── page.tsx
│       │   ├── new/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx
│       └── admin/
│           ├── posts/
│           │   └── page.tsx
│           ├── categories/
│           │   └── page.tsx
│           └── tags/
│               └── page.tsx
├── components/
│   ├── post/
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── PostDetail.tsx
│   │   ├── PostEditor.tsx
│   │   └── MetadataEditor.tsx
│   └── category/
│       └── CategoryBadge.tsx
├── lib/
│   ├── api/
│   │   └── posts.ts
│   └── hooks/
│       ├── usePosts.ts
│       └── usePost.ts
└── stores/
    └── postStore.ts
```

---

## Key Features

✅ **Post Management**: Full CRUD with markdown file storage
✅ **Metadata System**: Extensible JSON-based metadata for RAG
✅ **Categories & Tags**: Hierarchical categories, flexible tagging
✅ **User Permissions**: Members manage own posts, Admin/Mod manage all
✅ **Publishing Workflow**: Draft → Published → Archived
✅ **Content Storage**: Markdown files in `storage/posts/` for easy RAG extraction
✅ **Search & Filters**: By category, tags, date, search term
✅ **Caching**: Redis caching for performance
✅ **Rate Limiting**: Prevent abuse on create/update operations
✅ **CSRF Protection**: All write operations protected
✅ **Extensibility**: Easy to add new metadata fields via JSON

---

## Dependencies to Add

### Backend
```txt
aiofiles==24.1.0  # Async file operations
python-slugify==8.0.4  # Slug generation
```

### Frontend
```txt
react-markdown==9.0.1  # Markdown rendering
react-markdown-editor-lite==1.3.4  # Markdown editor (optional)
date-fns==3.6.0  # Date formatting
```

---

## Implementation Order

1. **Phase 1**: Create models, schemas, and migration script
2. **Phase 2**: Implement markdown storage service
3. **Phase 3**: Implement CRUD operations
4. **Phase 4**: Create API endpoints (public, user, admin)
5. **Phase 5**: Build frontend components and pages
6. **Phase 6**: Implement state management and API integration
7. **Phase 7**: Write tests
8. **Phase 8**: Prepare RAG integration endpoints

---

**Last Updated**: 2026-01-22
