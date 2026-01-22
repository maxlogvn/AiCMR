# Post Management URLs & Features

## User Post Routes

| Route | Purpose | Access |
|-------|---------|--------|
| `/user/posts` | List user's posts | Authenticated users |
| `/user/posts/new` | Create new post | Authenticated users |
| `/user/posts/[id]/edit` | Edit post | Post author |

---

## Admin/Moderator Routes

| Route | Purpose | Access | Rank |
|-------|---------|--------|------|
| `/dashboard/posts` | Manage all posts | Authenticated | >=3 |

---

## Post Status Values

```
draft       - Not published, visible only to author
published   - Live, visible to public
archived    - Hidden from lists, can be restored
```

---

## Post List Features

### User List (/user/posts)
```
Filters:
  • Status: All/Draft/Published/Archived
  • (Date range optional)
  • (Category optional)

Search:
  • By post title

Actions per post:
  • Edit
  • View (opens new tab)
  • Publish/Archive toggle
  • Delete

Stats:
  • Total Posts
  • Published Count
  • Draft Count
  • Archived Count
```

### Admin List (/dashboard/posts)
```
Filters:
  • Status tabs: All/Draft/Published/Archived

Search:
  • By title
  • By author name

Bulk Actions:
  • Select multiple → Publish All
  • Select multiple → Archive All
  • Select multiple → Delete All

Individual Actions:
  • View (new tab)
  • Edit (new tab)
  • Archive
  • Delete

Stats:
  • Total Posts count
  • Published count
  • Draft count
  • Archived count
```

---

## Form Fields

### Create/Edit Post
```
Required:
  - Title (text input)
  - Content (markdown editor)

Optional:
  - Slug (auto-generated, editable)
  - Excerpt (short summary)
  - Thumbnail (image upload)
  - Category (dropdown select)
  - Tags (multi-select)
  - Featured (checkbox)
  - Pinned (checkbox)
  - SEO Title (for search engines)
  - SEO Description (for search preview)
  - SEO Keywords (comma-separated)
```

---

## Quick Navigation Examples

### /user/posts
```
Cards:
  📝 Tạo Bài Mới → /user/posts/new
  👤 Hồ Sơ → /user/profile
```

### /dashboard/posts
```
Cards:
  📊 Tổng Quan → /dashboard/stats
  👥 Quản Lý Người Dùng → /dashboard/users-manager
  ⚙️ Cài Đặt (admin only) → /dashboard/settings
```

---

## Breadcrumb Trails

```
/user/posts              → 🏠 > Bài Đăng Của Tôi
/user/posts/new          → 🏠 > Bài Đăng Của Tôi > Tạo Mới
/user/posts/[id]/edit    → 🏠 > Bài Đăng Của Tôi > Chỉnh Sửa
/dashboard/posts         → 🏠 > Quản Trị > Quản Lý Bài Đăng
```
