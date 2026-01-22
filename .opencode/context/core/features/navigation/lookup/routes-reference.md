# Routes & Navigation Reference

## Public Routes (No Auth Required)
```
/                          - Home page
/(public)/blog             - Blog list
/(public)/blog/[slug]      - Blog post detail
/(auth)/login              - Login page
/(auth)/register           - Register page
```

---

## Authenticated Routes (Auth Required, rank 0+)
```
/user/profile              - User's own profile & settings
/user/change-password      - Change password form
/user/posts                - List user's posts
/user/posts/new            - Create new post
/user/posts/[id]/edit      - Edit post
```

---

## Moderator Routes (Rank >= 3)
```
/dashboard                 - Redirects to /dashboard/stats
/dashboard/stats           - Overview, statistics, quick actions
/dashboard/users-manager   - Manage all users
/dashboard/posts           - Manage all posts (bulk actions)
```

---

## Admin Routes (Rank === 5)
```
/dashboard/settings        - System configuration (admin only)
```

---

## Navbar Links by State

| State | Links | Condition |
|-------|-------|-----------|
| Not Logged In | Home, Blog, Login, Register | No access_token |
| User | Profile, Home, Logout | access_token + rank <3 |
| Moderator | Profile, Dashboard, Home, Logout | access_token + rank >=3 |

---

## Sidebar Links

### UserSidebar (/user/*)
- 🏠 Hồ sơ cá nhân → /user/profile
- 📄 Bài đăng của tôi → /user/posts
- 🔑 Đổi mật khẩu → /user/change-password
- 🛠️ Trang quản trị → /dashboard (if rank >=3)
- 🏠 Trang chủ → /
- 🚪 Đăng xuất

### AdminSidebar (/dashboard/*)
- 📊 Tổng quan → /dashboard/stats
- 👥 Quản lý người dùng → /dashboard/users-manager
- 📄 Quản lý bài đăng → /dashboard/posts
- ⚙️ Cài đặt (admin) → /dashboard/settings
- 👤 Tài khoản → /user/profile

---

## Breadcrumb Trails
```
/user/profile              → 🏠 > Hồ sơ cá nhân
/user/change-password      → 🏠 > Đổi mật khẩu
/user/posts                → 🏠 > Bài đăng của tôi
/dashboard/stats           → 🏠 > Quản trị > Thống kê
/dashboard/users-manager   → 🏠 > Quản trị > Quản lý người dùng
/dashboard/posts           → 🏠 > Quản trị > Quản lý bài đăng
/dashboard/settings        → 🏠 > Quản trị > Cài đặt hệ thống
```
