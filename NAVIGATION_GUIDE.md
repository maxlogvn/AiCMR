# 📋 Hướng Dẫn Điều Hướng Frontend AiCMR

## 📱 Cấu Trúc Điều Hướng Được Cập Nhật

Hệ thống frontend đã được tổ chức lại với một cấu trúc điều hướng thông minh và dễ sử dụng.

### 🎯 Các Khu Vực Chính

#### 1. **Trang Công Khai** (`/` và `/(public)/`)
- **Navbar**: Hiển thị nút Đăng nhập / Đăng ký cho người chưa xác thực
- **Footer**: Thông tin công ty, liên kết nhanh, liên hệ
- **Trang**: Trang chủ, Blog

**Cấu trúc:**
```
Navbar (đơn giản, không sidebar)
  ↓
Main Content
  ↓
Footer
```

#### 2. **Trang Xác Thực** (`/(auth)/login`, `/(auth)/register`)
- **Navbar**: Đơn giản, hiển thị các liên kết trang chủ
- **Footer**: Liên kết pháp lý và liên hệ
- **Layout**: Centered form

**Cấu trúc:**
```
Navbar
  ↓
Centered Auth Form
  ↓
Footer
```

#### 3. **Khu Vực Người Dùng** (`/user/*`)
- **Navbar**: Hiển thị tên người dùng, Đăng xuất, điều hướng
- **UserSidebar**: Menu bên trái với các tùy chọn (Hồ sơ, Đổi mật khẩu, Dashboard - nếu moderator)
- **Breadcrumb**: Điều hướng cụm từ để theo dõi vị trí
- **Content**: Nội dung chính
- **Footer**: Thông tin công ty

**Cấu trúc:**
```
Navbar
  ↓
┌─────────────────┬──────────────────────┐
│ UserSidebar     │ Breadcrumb           │
│ - Hồ sơ         │ Main Content         │
│ - Đổi mật khẩu  │ - Quick Navigation   │
│ - Dashboard*    │   (nếu có)           │
│ - Trang chủ     │                      │
└─────────────────┴──────────────────────┘
  ↓
Footer
```

#### 4. **Khu Vực Quản Trị** (`/dashboard/*`)
- **Navbar**: Hiển thị user, Đăng xuất
- **AdminSidebar**: Menu quản trị với các tùy chọn
  - Thống kê (rank >= 3)
  - Quản lý người dùng (rank >= 3)
  - Cài đặt hệ thống (rank === 5)
- **Breadcrumb**: Điều hướng
- **Content**: Tổng quan hoặc trang cụ thể
- **Quick Navigation**: Liên kết nhanh đến các hành động thường xuyên
- **Footer**: Thông tin công ty

**Cấu trúc:**
```
Navbar
  ↓
┌──────────────────┬──────────────────────┐
│ AdminSidebar     │ Breadcrumb           │
│ - Tổng quan      │ Main Content         │
│ - Quản lý người   │ - Stats/Users/Posts  │
│ - Cài đặt*       │ - Quick Navigation   │
│ - Tài khoản      │                      │
└──────────────────┴──────────────────────┘
  ↓
Footer
```

---

## 🔗 Liên Kết Chính & Điều Hướng

### Từ Navbar

#### Khi chưa đăng nhập:
```
Trang chủ (/)
Blog (/(public)/blog)
Đăng nhập (/login)
Đăng ký (/register)
```

#### Khi đã đăng nhập:
```
Hồ sơ (/user/profile)
Quản trị (/dashboard) *nếu rank >= 3
Trang chủ (/)
Đăng xuất
```

### Từ User Sidebar (`/user/*`)
```
Hồ sơ cá nhân → /user/profile
Đổi mật khẩu → /user/change-password
Trang quản trị → /dashboard *nếu rank >= 3
Về trang chủ → /
Đăng xuất → /login
```

### Từ Admin Sidebar (`/dashboard/*`)
```
Tổng quan → /dashboard/stats
Quản lý người dùng → /dashboard/users-manager
Cài đặt hệ thống → /dashboard/settings *chỉ admin
Tài khoản của tôi → /user/profile
```

### Quick Navigation
- **Trang User Profile**:
  - Đổi Mật Khẩu → /user/change-password
  - Quản Trị Viên → /dashboard *nếu moderator
  - Về Trang Chủ → /

- **Dashboard Stats**:
  - Quản Lý Người Dùng → /dashboard/users-manager
  - Quản Lý Bài Đăng → /dashboard/posts
  - Cài Đặt Hệ Thống → /dashboard/settings *chỉ admin

---

## 🗺️ Breadcrumb Navigation

Breadcrumb được hiển thị tự động trên tất cả các trang con.

**Ví dụ:**
```
🏠 > Hồ sơ cá nhân  (on /user/profile)
🏠 > Quản Trị > Thống Kê  (on /dashboard/stats)
```

---

## 🎨 Components Mới/Cập Nhật

### 1. **Navbar** (`components/layout/Navbar.tsx`)
- Thông minh theo trạng thái đăng nhập
- Responsive (Mobile menu)
- Điều hướng động dựa trên rank
- Active link highlighting

### 2. **Footer** (`components/layout/Footer.tsx`)
- Thông tin công ty
- Quick links
- Contact info
- Social media links
- Legal links

### 3. **Breadcrumb** (`components/layout/Breadcrumb.tsx`)
- Tự động tạo từ pathname
- Hiển thị trên tất cả trang con
- Home icon + navigation

### 4. **QuickNavigation** (`components/layout/QuickNavigation.tsx`)
- Thẻ có thể kích hoạt được
- Icon + tiêu đề + mô tả
- Hover effects
- Responsive grid

---

## 📄 Cấu Trúc Tệp Cập Nhật

```
frontend/src/
├── app/
│   ├── layout.tsx (Root)
│   ├── page.tsx (Home)
│   ├── (public)/
│   │   ├── layout.tsx ← CẬP NHẬT (Navbar + Footer)
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── ...
│   ├── (auth)/
│   │   ├── layout.tsx ← CẬP NHẬT (Navbar + Footer)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── user/
│   │   ├── layout.tsx ← CẬP NHẬT (Navbar + UserSidebar + Footer)
│   │   ├── profile/page.tsx ← CẬP NHẬT (Breadcrumb + QuickNav)
│   │   ├── change-password/page.tsx
│   │   └── posts/
│   │       ├── page.tsx
│   │       ├── new/page.tsx
│   │       └── [id]/edit/page.tsx
│   └── dashboard/
│       ├── layout.tsx ← CẬP NHẬT (Navbar + AdminSidebar + Footer)
│       ├── page.tsx (Redirect → stats)
│       ├── stats/
│       │   └── page.tsx ← CẬP NHẬT (Breadcrumb + QuickNav)
│       ├── users-manager/
│       │   └── page.tsx
│       ├── posts/
│       │   └── page.tsx
│       └── settings/
│           └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx ← TẠO MỚI (Thông minh)
│   │   ├── Footer.tsx ← TẠO MỚI
│   │   ├── Breadcrumb.tsx ← TẠO MỚI
│   │   └── QuickNavigation.tsx ← TẠO MỚI
│   ├── user/
│   │   └── UserSidebar.tsx (Không thay đổi)
│   ├── admin/
│   │   └── AdminSidebar.tsx (Không thay đổi)
│   └── ...
```

---

## ⚙️ Cách Sử Dụng

### Thêm Breadcrumb vào trang
```tsx
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function MyPage() {
  return (
    <>
      <Breadcrumb />
      {/* Content */}
    </>
  );
}
```

### Thêm Quick Navigation
```tsx
import QuickNavigation from "@/components/layout/QuickNavigation";
import { Icon1, Icon2 } from "lucide-react";

export default function MyPage() {
  const quickLinks = [
    {
      label: "Action 1",
      href: "/path/to/action1",
      icon: <Icon1 />,
      description: "Description for action 1",
    },
    // ...
  ];

  return (
    <>
      <QuickNavigation links={quickLinks} title="Quick Actions" />
      {/* Content */}
    </>
  );
}
```

---

## 🔐 Bảo Mật & Quyền Truy Cập

### Điều hướng dựa trên Rank:
- **Rank 0-2**: Chỉ có quyền truy cập `/user/*`
- **Rank 3+**: Có quyền truy cập `/dashboard/stats` và `/dashboard/users-manager`
- **Rank 5**: Có quyền truy cập đầy đủ `/dashboard/*` bao gồm cài đặt hệ thống

### Guards:
- `AuthGuard`: Bảo vệ tất cả trang `/user/*`
- `ModeratorGuard`: Bảo vệ tất cả trang `/dashboard/*`
- `PublicOnlyGuard`: Bảo vệ trang `/login` và `/register`

---

## 🚀 Tính Năng

### Navbar
✅ Responsive design  
✅ Mobile menu toggle  
✅ Active link highlighting  
✅ Smart navigation based on auth state  
✅ Rank-based menu items  
✅ Logout functionality  

### Footer
✅ Company info  
✅ Quick links  
✅ Contact information  
✅ Social media links  
✅ Legal links  
✅ Sticky/fixed positioning  

### Breadcrumb
✅ Auto-generated from pathname  
✅ Home icon link  
✅ Current page highlighting  
✅ Responsive  

### Quick Navigation
✅ Card-based UI  
✅ Icon + Title + Description  
✅ Hover effects  
✅ Arrow indicator  
✅ Responsive grid  

---

## 📝 Ghi Chú

1. **Mobile Optimization**: Tất cả thành phần đều responsive và hoạt động tốt trên thiết bị di động
2. **Dark Mode**: Hỗ trợ dark mode thông qua Tailwind CSS
3. **Performance**: Sử dụng dynamic imports và lazy loading nơi thích hợp
4. **Accessibility**: Sử dụng semantic HTML và ARIA labels

---

## 🐛 Troubleshooting

### Navbar không hiển thị đúng
- Kiểm tra token authentication được lưu đúng trong localStorage
- Kiểm tra user rank được load đúng

### Breadcrumb không hiển thị
- Đảm bảo route được thêm vào `breadcrumbMap` trong component
- Kiểm tra pathname được truyền đúng

### Quick Navigation không hoạt động
- Kiểm tra `href` có đúng route
- Đảm bảo icon được import từ `lucide-react`

---

## 📚 Tài Liệu Thêm

Xem các file sau để chi tiết:
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Breadcrumb.tsx`
- `src/components/layout/QuickNavigation.tsx`
- `src/app/user/layout.tsx`
- `src/app/dashboard/layout.tsx`

---

**Cập nhật lần cuối**: 2026-01-22  
**Phiên bản**: 1.0  
**Status**: ✅ Production Ready
