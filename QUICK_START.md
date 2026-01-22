# 🚀 Quick Start - Frontend Navigation AiCMR

## ⚡ TL;DR (Quá Dài, Không Đọc)

Frontend đã được **sắp xếp lại** với:
- ✅ Global Navbar (thông minh, responsive)
- ✅ Global Footer (trên tất cả trang)
- ✅ Breadcrumb (tự động)
- ✅ Quick Navigation (cards)
- ✅ 4 Layouts riêng biệt (Public, Auth, User, Dashboard)

**Kết quả**: UX tốt hơn, điều hướng rõ ràng, responsive & dark mode.

---

## 🎯 Điều Hướng Chính

```
                    NAVBAR (Global)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    Chưa login      Logged in      Moderator
        │           (rank 0-2)      (rank 3+)
        │               │               │
    [Login]         [Profile]    [Dashboard]
    [Register]      [Home]       [Profile]
    [Blog]          [Blog]       [Home]
    [Home]          [Logout]     [Logout]
```

---

## 📱 Các Khu Vực Chính

### 1. Public Pages (`/`, `/blog`)
```
┌─ Navbar (Simple)
├─ Content
└─ Footer
```
**Hiển thị**: Trang chủ, Blog, Links

### 2. Auth Pages (`/login`, `/register`)
```
┌─ Navbar
├─ Centered Form
└─ Footer
```
**Hiển thị**: Form đăng nhập/ký

### 3. User Area (`/user/*`)
```
┌─ Navbar
├─ UserSidebar | Content (Breadcrumb + QuickNav)
└─ Footer
```
**Hiển thị**: Hồ sơ, Đổi mật khẩu, Bài đăng

### 4. Admin Area (`/dashboard/*`)
```
┌─ Navbar
├─ AdminSidebar | Content (Breadcrumb + QuickNav)
└─ Footer
```
**Hiển thị**: Thống kê, Người dùng, Bài đăng, Cài đặt

---

## 🔗 Navigation Flow

```
HOME PAGE (/)
    ├─ [Not Logged] → /login, /register, /blog
    └─ [Logged] → /user/profile, /dashboard (if ok), /blog

LOGIN/REGISTER
    └─ [Success] → /user/profile

USER PROFILE (/user/profile)
    ├─ Navbar → [Logout], [Home], [Dashboard if ok]
    ├─ Sidebar → Change Password, Home, Dashboard, Logout
    └─ QuickNav → Password, Dashboard, Home

DASHBOARD (/dashboard/*)
    ├─ Navbar → [Profile], [Home], [Logout]
    ├─ Sidebar → Stats, Users, Posts, Settings (admin), Profile
    └─ QuickNav → Users, Posts, Settings (admin)
```

---

## 🎨 Components

| Component | File | Purpose |
|-----------|------|---------|
| **Navbar** | `components/layout/Navbar.tsx` | Global navigation (responsive) |
| **Footer** | `components/layout/Footer.tsx` | Global footer (all pages) |
| **Breadcrumb** | `components/layout/Breadcrumb.tsx` | Auto navigation trail |
| **QuickNavigation** | `components/layout/QuickNavigation.tsx` | Action cards |

---

## 📍 Breadcrumb Examples

```
/user/profile
└─ 🏠 > Hồ sơ cá nhân

/dashboard/stats
└─ 🏠 > Quản trị > Thống kê
```

---

## 💡 Quick Navigation Examples

### User Profile
```
┌─ 🔐 Đổi Mật Khẩu
├─ 🛠️ Quản Trị (if moderator)
└─ 🏠 Trang Chủ
```

### Dashboard Stats
```
┌─ 👥 Quản Lý Người Dùng
├─ 📝 Quản Lý Bài Đăng
└─ ⚙️ Cài Đặt (admin only)
```

---

## 🛠️ How to Use in Your Page

### Add Breadcrumb
```tsx
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function MyPage() {
  return (
    <>
      <Breadcrumb />
      {/* Your content */}
    </>
  );
}
```

### Add Quick Navigation
```tsx
import QuickNavigation from "@/components/layout/QuickNavigation";
import { Users, Settings, Home } from "lucide-react";

export default function MyPage() {
  return (
    <>
      <QuickNavigation
        title="Quick Actions"
        links={[
          {
            label: "Users",
            href: "/dashboard/users-manager",
            icon: <Users className="h-5 w-5" />,
            description: "Manage all users",
          },
          {
            label: "Settings",
            href: "/dashboard/settings",
            icon: <Settings className="h-5 w-5" />,
            description: "System configuration",
          },
          {
            label: "Home",
            href: "/",
            icon: <Home className="h-5 w-5" />,
            description: "Back to home",
          },
        ]}
      />
      {/* Your content */}
    </>
  );
}
```

---

## 🔐 Rank-based Access

```
Rank 0-2 (User)
└─ Can access: /user/*

Rank 3-4 (Moderator)
└─ Can access: /user/*, /dashboard/stats, /dashboard/users-manager

Rank 5 (Admin)
└─ Can access: ALL /dashboard/*, /user/*
```

---

## 📁 File Structure

```
src/
├── components/layout/
│   ├── Navbar.tsx ← New
│   ├── Footer.tsx ← New
│   ├── Breadcrumb.tsx ← New
│   └── QuickNavigation.tsx ← New
│
├── app/
│   ├── (public)/layout.tsx ← Updated
│   ├── (auth)/layout.tsx ← Updated
│   ├── user/layout.tsx ← Updated
│   ├── user/profile/page.tsx ← Updated
│   ├── dashboard/layout.tsx ← Updated
│   └── dashboard/stats/page.tsx ← Updated
```

---

## ✨ Features

✅ **Responsive** - Works on all devices  
✅ **Dark Mode** - Full support  
✅ **Accessible** - ARIA labels, semantic HTML  
✅ **Smart** - Shows different content based on auth state  
✅ **Automatic** - Breadcrumb and nav generated from routes  
✅ **Reusable** - Components used globally  
✅ **Fast** - Optimized with dynamic imports  

---

## 🚦 Status

| Item | Status |
|------|--------|
| Navbar | ✅ Complete |
| Footer | ✅ Complete |
| Breadcrumb | ✅ Complete |
| QuickNavigation | ✅ Complete |
| Public Layout | ✅ Updated |
| Auth Layout | ✅ Updated |
| User Layout | ✅ Updated |
| Dashboard Layout | ✅ Updated |
| User Profile | ✅ Updated |
| Dashboard Stats | ✅ Updated |

---

## 📖 Read More

- `NAVIGATION_GUIDE.md` - Detailed guide (Vietnamese)
- `NAVIGATION_DIAGRAMS.md` - Visual diagrams
- `FRONTEND_RESTRUCTURE_SUMMARY.md` - Complete summary

---

## 🤔 FAQ

**Q: Where's the navbar?**  
A: In `src/components/layout/Navbar.tsx`, auto-imported in layouts.

**Q: How to add breadcrumb to my page?**  
A: Import and use `<Breadcrumb />` at the top of your content.

**Q: How to customize quick navigation?**  
A: Pass custom `links` array to `<QuickNavigation />` component.

**Q: Does it work on mobile?**  
A: Yes! All components are fully responsive.

**Q: What about dark mode?**  
A: Fully supported. Uses Tailwind's dark mode class.

**Q: How are admins shown different options?**  
A: Based on user's `rank` property from authentication.

---

## ⚡ Quick Commands

```bash
# Run dev server
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

---

**Last Updated**: 2026-01-22  
**Status**: ✅ Production Ready  
**Version**: 1.0
