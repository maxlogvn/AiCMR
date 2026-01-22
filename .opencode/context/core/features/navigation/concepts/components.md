# Navigation Components

## Navbar Component (`components/layout/Navbar.tsx`)

**Purpose**: Global navigation header responsive across all pages.

**Behavior**:
- Renders different links based on `localStorage` auth token
- Not authenticated: Home, Blog, Login, Register
- Authenticated (rank <3): Profile, Home, Logout
- Moderator/Admin (rank >=3): Profile, Dashboard, Home, Logout
- Mobile: hamburger menu toggle

**Key Props**: None (accesses context internally)
**Uses**: Next/Link, lucide-react icons, localStorage, useRouter

---

## Footer Component (`components/layout/Footer.tsx`)

**Purpose**: Consistent footer on all layouts.

**Sections**:
- Brand info (description, mission)
- Quick Links (Home, Blog, Login, Register)
- Resources (Docs, API, Support, FAQ)
- Contact (email, phone, address)
- Social (links to platforms)
- Legal (copyright, terms, privacy)

**Responsive**: Grid adapts to 1/2/4 columns

---

## Breadcrumb Component (`components/layout/Breadcrumb.tsx`)

**Purpose**: Auto-generate navigation trail from pathname.

**Example**: `/dashboard/stats` → `🏠 > Quản trị > Thống kê`

**Routes Mapped**:
- /user/profile → Hồ sơ cá nhân
- /user/change-password → Đổi mật khẩu
- /user/posts → Bài đăng của tôi
- /dashboard/stats → Tổng quan
- /dashboard/users-manager → Quản lý người dùng
- /dashboard/posts → Quản lý bài đăng
- /dashboard/settings → Cài đặt hệ thống

---

## QuickNavigation Component (`components/layout/QuickNavigation.tsx`)

**Purpose**: Card-based action shortcuts with icons.

**Props**:
```typescript
links: Array<{
  label: string;
  href: string;
  icon: ReactNode;
  description: string;
}>
title?: string;
```

**Example**: User Profile → Change Password, Admin Dashboard, Home cards

**Uses**: Next/Link, Tailwind grid (1/2/3 columns responsive)
