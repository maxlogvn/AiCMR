# Post Management Feature

## Core Concept
Post Management enables users to create, edit, and delete posts with full lifecycle management. Regular users manage only their own posts (/user/posts); moderators (rank >=3) manage all system posts (/dashboard/posts) with bulk actions. Each post has status (Draft/Published/Archived), metadata (category, tags, SEO), and visibility controls.

## Key Workflows

### User Post Management (/user/posts)
1. View list of own posts with filters (status, date)
2. Create new post (title, content, category, tags, SEO)
3. Edit existing post (all fields)
4. Publish draft or archive published post
5. Delete post permanently

### Admin/Moderator Post Management (/dashboard/posts)
1. View ALL system posts in table
2. Filter by status (All/Draft/Published/Archived)
3. Search by title or author
4. Bulk actions: Publish, Archive, Delete multiple posts
5. Individual post actions: View, Edit, Archive, Delete
6. Stats: Total, Published, Draft, Archived counts

## Post Model
```
Post:
  - id, title, slug, excerpt, content
  - thumbnail_url, featured_image
  - category_id, tags[], author_id
  - status (draft/published/archived)
  - featured, pinned flags
  - seo_title, seo_description, seo_keywords
  - created_at, updated_at, published_at
```

## Access Control
- **User (rank 0-2)**: /user/posts (own posts only)
- **Moderator (rank 3-4)**: /dashboard/posts (all posts, bulk actions)
- **Admin (rank 5)**: /dashboard/posts (all posts, bulk actions)

**Dependencies**: React Query, Tailwind CSS, form validation libraries
