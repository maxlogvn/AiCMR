# Post Management Pages

## /user/posts - User's Post List

**Purpose**: Display list of posts created by logged-in user.

**Features**:
- Stats cards: Total posts, Published, Draft counts
- Filters: Status (All/Draft/Published/Archived), category, date range
- Search: By title
- Pagination: 10 posts per page
- Actions per post: Edit, View, Publish/Archive, Delete
- "Create New Post" button

**Components**:
- Breadcrumb: `🏠 > Bài Đăng Của Tôi`
- QuickNavigation: New Post, Profile, Home

---

## /user/posts/new - Create Post Form

**Purpose**: Create new post with full metadata.

**Form Fields**:
- Title (required)
- Slug (auto-generated from title)
- Excerpt (short summary)
- Content (Markdown editor)
- Thumbnail (image upload)
- Category (dropdown)
- Tags (multi-select)
- SEO: Title, Description, Keywords
- Options: Featured, Pinned checkboxes

**Buttons**:
- Back, Preview, Save Draft, Publish

**Validation**: Title required, content length >10 chars

---

## /user/posts/[id]/edit - Edit Post

**Purpose**: Modify existing post.

**Process**:
1. Load post data by ID
2. Populate form with existing values
3. Allow all fields to be edited
4. Save updates or revert changes
5. Redirect to post list on success

**Same form as create** but pre-filled with post data

---

## /dashboard/posts - Admin Post Management

**Purpose**: Manage ALL system posts with advanced controls.

**Features**:
- Stats cards: Total, Published, Draft, Archived (4 cards)
- Filter: Status tabs (All/Draft/Published/Archived)
- Search: By title or author
- Bulk actions: Select posts → Publish/Archive/Delete buttons
- Table columns: Title, Author, Status, Category, Created, Actions
- Individual actions: View (new tab), Edit (new tab), Archive, Delete

**Special**: Only moderators (rank >=3) can access

**Components**:
- Breadcrumb: `🏠 > Quản Trị > Quản Lý Bài Đăng`
- QuickNavigation: Stats, Users, Settings (if admin)
