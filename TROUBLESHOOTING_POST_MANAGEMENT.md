# 🔧 Hướng Dẫn Sửa Lỗi: Không Thấy Nút Quản Lý Bài Đăng

## ❌ Vấn Đề

Bạn đang truy cập `http://aicmr.local/dashboard/stats` (trang Tổng quan) và **không thấy nút nào để quản lý bài đăng**.

---

## ✅ Giải Pháp

### Phương pháp 1: Truy Cập Đúng Trang

```
URL SAI: http://aicmr.local/dashboard/stats   ← Đây là trang thống kê
URL ĐÚNG: http://aicmr.local/dashboard/posts  ← Trang quản lý bài đăng
```

**Cách 1: Truy cập trực tiếp**
```
Gõ vào trình duyệt: http://aicmr.local/dashboard/posts
```

**Cách 2: Click từ AdminSidebar**
```
1. Vào Dashboard (nếu chưa vào)
2. Nhìn menu bên trái (AdminSidebar)
3. Click "📄 Quản lý bài đăng"
```

---

## 🗺️ AdminSidebar - Menu Bên Trái

```
AdminSidebar (menu bên trái trong dashboard area)

┌──────────────────────────────────┐
│  📊 Tổng quan                  │ → /dashboard/stats (trang mặc định)
│  👥 Quản lý người dùng         │ → /dashboard/users-manager
│  📄 Quản lý bài đăng ⭐       │ → /dashboard/posts  ← CLICK VÀO ĐÂY
│  ⚙️ Cấu hình hệ thống         │ → /dashboard/settings (admin only)
│  👤 Tài khoản của tôi          │ → /user/profile
└──────────────────────────────────┘

⭐ = Menu item quan trọng
```

---

## 🎯 Cách Truy Cập

### Bước 1: Vào Dashboard Area

**Option 1 - Từ UserSidebar:**
```
1. Đăng nhập vào hệ thống
2. Click "Trang quản trị" trong UserSidebar (menu bên trái)
```

**Option 2 - Từ Navbar:**
```
1. Click "Quản trị" trong Navbar (menu trên cùng)
```

**Option 3 - Truy cập trực tiếp:**
```
http://aicmr.local/dashboard
```

### Bước 2: Chọn "Quản lý bài đăng"

```
Trong menu bên trái (AdminSidebar):

❌ Đừng click "Tổng quan" → /dashboard/stats (thống kê)
❌ Đừng click "Quản lý người dùng" → /dashboard/users-manager
✅ Click "Quản lý bài đăng" → /dashboard/posts (cần thiết!)
```

---

## 🔗 Tất Cả Links

### User Area (cho TẤT CẢ user):
```
• Hồ sơ cá nhân:      /user/profile
• Bài đăng của tôi:  /user/posts
• Tạo bài mới:        /user/posts/new
• Đổi mật khẩu:       /user/change-password
```

### Dashboard Area (cho Moderator+, rank >= 3):
```
• Tổng quan:            /dashboard/stats        ← Trang mặc định
• Quản lý người dùng:   /dashboard/users-manager
• Quản lý bài đăng:    /dashboard/posts        ← BẠN CLICK VÀO ĐÂY
• Cài đặt:            /dashboard/settings     (admin only)
```

---

## 📱 Layout Dashboard

```
┌──────────────────────────────────────────────────────────┐
│  Navbar (menu trên cùng)                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────┬──────────────────────────────┐    │
│  │                │                              │    │
│  │   AdminSidebar │      Main Content            │    │
│  │   (menu bên   │      (để hiển thị)         │    │
│  │    trái)      │                              │    │
│  │                │                              │    │
│  │ 📊 Tổng quan │                              │    │
│  │ 👥 Quản lý    │                              │    │
│  │   người dùng  │                              │    │
│  │ 📄 Quản lý    │   [Nội dung trang]           │    │
│  │   bài đăng ⭐ │                              │    │
│  │ ⚙️ Cài đặt    │                              │    │
│  │ 👤 Tài khoản │                              │    │
│  │   của tôi     │                              │    │
│  │                │                              │    │
│  └────────────────┴──────────────────────────────┘    │
│                                                          │
│  Footer (chân trang)                                 │
└──────────────────────────────────────────────────────────┘
```

---

## ⚠️ Các Lỗi Thường Gặp

### Lỗi 1: "Tôi không thấy AdminSidebar"
```
Nguyên nhân:
• Bạn chưa vào dashboard area
• Bạn đang ở user area (/user/*)

Giải pháp:
1. Click "Trang quản trị" trong UserSidebar
2. Hoặc truy cập: http://aicmr.local/dashboard
```

### Lỗi 2: "Tôi chỉ thấy sidebar trống"
```
Nguyên nhân:
• User rank < 1 (không có quyền)
• Sidebar bị collapsed

Giải pháp:
1. Kiểm tra rank của tài khoản (phải >= 1)
2. Click nút collapse/expand ở góc sidebar
```

### Lỗi 3: "Tôi không thấy menu items"
```
Nguyên nhân:
• Bạn đang ở trang /dashboard/stats (Tổng quan)
• Không có menu items hiển thị

Giải pháp:
1. Click menu item "Quản lý bài đăng" trong sidebar
2. Hoặc truy cập: http://aicmr.local/dashboard/posts
```

---

## 🎯 Tóm Tắt

| Trang Bạn Muốn | URL Đúng | Cách Truy Cập |
|---------------|----------|---------------|
| Tổng quan | `/dashboard/stats` | Vào dashboard → Mặc định |
| Quản lý bài đăng | `/dashboard/posts` | Click "Quản lý bài đăng" trong sidebar |
| Quản lý người dùng | `/dashboard/users-manager` | Click "Quản lý người dùng" trong sidebar |

---

## 🚀 Bắt Đầu

### Cách 1: Truy Cập Trực Tiếp
```
Mở: http://aicmr.local/dashboard/posts
```

### Cách 2: Click Menu
```
1. Vào: http://aicmr.local/dashboard
2. Click: "📄 Quản lý bài đăng" trong sidebar bên trái
```

---

## 📝 Ghi Chú Quan Trọng

1. **AdminSidebar chỉ xuất hiện trong Dashboard Area**
   - Khi bạn vào `/dashboard/*`, sidebar sẽ xuất hiện bên trái

2. **URL `/dashboard/stats` là trang mặc định**
   - Khi vào `/dashboard`, tự động redirect sang `/dashboard/stats`
   - Đây là trang Tổng quan, KHÔNG phải trang quản lý bài

3. **Để quản lý bài đăng:**
   - Click menu item "Quản lý bài đăng" trong sidebar
   - Hoặc truy cập trực tiếp `/dashboard/posts`

---

**👉 Bắt đầu: Truy cập http://aicmr.local/dashboard/posts**
