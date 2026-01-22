# 🔧 Hướng Dẫn Sửa Trang Trắng (Blank Page)

## ❌ Vấn Đề

Trang `http://aicmr.local/dashboard/posts` hiển thị **hoàn toàn trắng/trống**.

---

## 🕵 Kiểm Tra Bước 1: Xem Console Browser

### Bước 1: Mở DevTools
```
Windows/Linux: F12 hoặc Ctrl+Shift+I
Mac: Cmd+Option+I
```

### Bước 2: Chuyển sang tab Console
```
1. F12 để mở DevTools
2. Click tab "Console"
3. Reload trang (F5 hoặc Ctrl+R)
```

### Bước 3: Tìm lỗi

**Xem có các lỗi màu đỏ như:**

```
❌ Error: Module not found: '@/components/ui/dropdown-menu'
❌ Error: Component is not defined
❌ TypeError: Cannot read properties of undefined
❌ SyntaxError: Unexpected token
```

---

## 🕵 Kiểm Tra Bước 2: Xem Network

### Bước 1: Chuyển sang tab Network
```
1. F12 để mở DevTools
2. Click tab "Network"
3. Reload trang (F5)
```

### Bước 2: Tìm request thất bại

**Xem có các request:**
```
❌ 404 Not Found (trang không tồn tại)
❌ 500 Internal Server Error (lỗi server)
❌ 0ms (hoàn toàn không có request)
```

---

## 🔍 Kiểm Tra Bước 3: Kiểm Tra File

### Bước 1: Xem file có tồn tại

```
Mở terminal trong D:\code\AiCMR\frontend\src\app\dashboard\posts\

Chạy:
ls -la

Nên thấy:
  drwxr-xr-x  ./
  drwxr-xr-x  ../
  -rw-r--r-- page.tsx
```

Nếu **page.tsx KHÔNG tồn tại**:
```
Error: No such file or directory
```

**Giải pháp:** File đã bị xóa. Hãy tạo lại (nhưng tôi đã thấy nó tồn tại rồi)

### Bước 2: Kiểm tra nội dung file

```
Mở: D:\code\AiCMR\frontend\src\app\dashboard\posts\page.tsx

Xem:
  1. Có export default function DashboardPostsPage?
  2. Có return statement?
  3. Code có đầy đủ không bị cutoff?
```

---

## 🐛 Lỗi Thường Gặp

### Lỗi 1: Import Path Sai

**Symptom:** Console hiển thị "Module not found"

**Giải pháp:** Kiểm tra imports trong file:
```typescript
// ĐÚNG ✅
import { Card } from "@/components/ui/card-wrapped";

// SAI ❌
import { Card } from "@/components/ui/card-wrapp";  // thiếu d
```

### Lỗi 2: Component Export Sai

**Symptom:** "Component is not defined" hoặc blank page

**Giải pháp:** Kiểm tra file exports:
```typescript
// File: components/ui/card-wrapped.tsx
import { Card } from "@/components/ui/card";

export { Card };  // ✅ ĐÚNG

export default Card;  // ❌ SAI cho named import
```

### Lỗi 3: TypeScript/Build Error

**Symptom:** Dev server hiển thị lỗi

**Giải pháp:** Xem terminal dev server:
```
cd frontend
npm run dev

Xem terminal có lỗi màu đỏ không?
```

### Lỗi 4: Layout Không Đúng

**Symptom:** Trang trắng nhưng console không có lỗi

**Giải pháp:** Kiểm tra layout:
```typescript
// File: app/dashboard/layout.tsx

// ĐÚNG ✅
import ModeratorGuard from "@/components/auth/ModeratorGuard";

// SAI ❌
import ModeratorGuard from "@/components/auth/Moderator";  // gỡ
```

---

## 🔧 Các Bước Sửa Lỗi

### Bước 1: Xóa Cache Dev Server

```
1. Mở terminal chạy dev server
2. Ctrl+C để dừng server
3. Chạy lại: npm run dev
```

### Bước 2: Xóa Cache Trình Duyệt

```
Chrome/Edge:
  1. F12 mở DevTools
  2. Chuột phải vào refresh button
  3. Click "Empty Cache and Hard Reload"

Firefox:
  1. Ctrl+Shift+Delete
  2. Hoặc Ctrl+F5
```

### Bước 3: Mở Browser Mới (Incognito)

```
Chrome/Edge:
  Ctrl+Shift+N

Firefox:
  Ctrl+Shift+P
```

---

## 📋 Kiểm Tra Component Dependencies

### Kiểm tra wrapper components:

```bash
# Mở terminal
cd D:\code\AiCMR\frontend\src\components\ui

# Kiểm tra các files tồn tại:
ls -la *wrapped*.tsx

Nên thấy:
  badge-wrapped.tsx      ✅
  dropdown-menu-wrapped.tsx  ✅
  card-wrapped.tsx          ✅
  button-wrapped.tsx         ✅
```

### Kiểm tra nội dung wrapper files:

**File: badge-wrapped.tsx**
```typescript
import { Badge } from "@/components/ui/badge";

export { Badge };  // Đúng
```

**File: dropdown-menu-wrapped.tsx**
```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
};  // Đúng
```

---

## 🎯 Bước Sửa Chi Tiết

### Nếu console hiển thị lỗi:

**Ví dụ 1: "Module not found"**
```
1. Xem lỗi: Cannot resolve '@/components/ui/xxx'
2. Mở file: src/components/ui/
3. Kiểm tra file có tồn tại không
4. Nếu không, tạo file
5. Nếu có, kiểm tra import path
```

**Ví dụ 2: "xxx is not defined"**
```
1. Xem component: Card, Button, Badge...
2. Mở file wrapper tương ứng
3. Kiểm tra export statement
4. Đảm bảo sử dụng named export nếu import dùng { Component }
```

### Nếu console không có lỗi nhưng trang trắng:

**Ví dụ 1: Component return null**
```typescript
// Kiểm tra file page.tsx

export default function DashboardPostsPage() {
  // Nếu logic return null:
  if (loading) return <LoadingSpinner />;  // ✅ ĐÚNG
  
  // Sai:
  if (loading) return null;  // ❌ SAI - sẽ trắng
}
```

**Ví dụ 2: Early return mà không có UI**
```typescript
// Kiểm tra file app/dashboard/layout.tsx

export default function DashboardLayout({ children }) {
  // ĐÚNG:
  return (
    <ModeratorGuard>
      <div className="flex ...">
        <AdminSidebar />
        <main className="...">{children}</main>
      </div>
    </ModeratorGuard>
  );
}
```

---

## 📝 Ghi Chú Khi Báo Cáo Lỗi

Khi bạn báo lỗi, vui lòng cung cấp:

### 1. Console Errors
```
Screenshot console (F12 → tab Console)
Copy-paste tất cả lỗi màu đỏ
```

### 2. Network Errors
```
Screenshot network tab (F12 → tab Network)
Chỉ rõ các request thất bại (404, 500, etc)
```

### 3. Page URL
```
URL chính xác:
  ✅ http://aicmr.local/dashboard/posts (đúng)
  ❌ http://aicmr.local/dashboard/post (sai - thiếu s)
```

### 4. Terminal Dev Server
```
Copy-paste output từ terminal khi chạy npm run dev
```

---

## 🚀 Test Sau Khi Sửa

### Checklist:
- [ ] Xóa cache dev server
- [ ] Xóa cache trình duyệt
- [ ] Mở browser mới (incognito)
- [ ] Truy cập: http://aicmr.local/dashboard/posts
- [ ] Xem console không có lỗi
- [ ] Xem trang không còn trắng
- [ ] Xem menu items hiển thị
- [ ] Click menu item "Quản lý bài đăng"

---

## 📞 Nếu Vẫn Lỗi

Sau khi làm tất cả các bước trên mà vẫn thấy trang trắng:

### Hãy cung cấp:
1. **Screenshot** trang trắng
2. **Screenshot** console errors (F12)
3. **Screenshot** network tab (F12)
4. **Copy-paste** nội dung `page.tsx`
5. **Copy-paste** terminal output
6. **OS & Browser** (Chrome/Firefox/Edge, version)

### Để tôi có thể:
- Xem chính xác lỗi gì
- Xác định nguyên nhân gốc
- Cung cấp giải pháp chính xác

---

**👉 Bắt đầu kiểm tra: F12 → Console → Reload trang → Tìm lỗi đỏ!**
