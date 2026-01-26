# AiCMR Design System - Hướng Dẫn Bắt Đầu (Getting Started)

**Dành cho:** Developer mới join team Frontend AiCMR
**Thời gian đọc:** 5 phút
**Mục tiêu:** Clone repo → Làm được UI ngay trong ngày đầu tiên

---

## 🚀 Quick Start (3 Bước)

### Bước 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/your-org/aicmr.git
cd aicmr

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Truy cập: http://localhost:3000

---

### Bước 2: Copy Template Page

**Quan trọng:** Đừng build từ scratch. Hãy copy template!

```bash
# Template pages có sẵn tại:
frontend/src/app/(dashboard)/users/          # User listing page
frontend/src/app/(dashboard)/users/[id]/      # User detail page
frontend/src/app/(dashboard)/posts/           # Post listing page
frontend/src/app/(dashboard)/posts/[id]/edit/ # Post edit page
```

**Ví dụ: Tạo page mới "Categories"**

```bash
# 1. Copy template users/
cp -r frontend/src/app/(dashboard)/users frontend/src/app/(dashboard)/categories

# 2. Modify file names
cd frontend/src/app/(dashboard)/categories
mv page.tsx page-list.tsx

# 3. Edit content
# Open page-list.tsx và sửa:
# - "Users" → "Categories"
# - users API → categories API
```

---

### Bước 3: Run & Modify

```bash
# Development server đang chạy
npm run dev

# Mở browser:
http://localhost:3000/categories

# Modify content → Auto reload
```

---

## 📦 Components Có Sẵn

**Location:** `frontend/src/components/ui/`

### Component Forms (Quan trọng nhất)

**FormField** - Input field với label + error
```tsx
import { FormField } from '@/components/ui/form-field';

// Cách dùng:
<FormField
  label="Tên danh mục"
  name="name"
  placeholder="Nhập tên danh mục"
  required
/>
```

**FormLayout** - Layout cho form (label + field + error)
```tsx
import { FormLayout } from '@/components/ui/form-layout';

// Cách dùng:
<FormLayout>
  <FormField label="Email" name="email" type="email" />
  <FormField label="Password" name="password" type="password" />
</FormLayout>
```

### Component Tables

**DataTable** - Table với sort + filter + pagination + row selection
```tsx
import { DataTable } from '@/components/ui/data-table';

// Cách dùng:
<DataTable
  data={categories}
  columns={[
    { key: 'name', label: 'Tên', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
  ]}
  pagination
  page={page}
  pageSize={20}
  totalItems={total}
  onPageChange={setPage}
/>

// With row selection:
<DataTable
  data={posts}
  columns={[
    { key: 'title', label: 'Tiêu đề', sortable: true },
    { key: 'status', label: 'Trạng thái' },
  ]}
  selectable
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
/>
```

### Component Layouts

**LayoutShell** - Page header + actions + back button + content wrapper
```tsx
import { LayoutShell } from '@/components/ui/layout-shell';

// Cách dùng:
export default function CategoriesPage() {
  return (
    <LayoutShell
      title="Quản lý danh mục"
      subtitle="Tổ chức bài viết bằng cây danh mục phân cấp"
      actions={
        <Button onClick={handleCreate}>
          Tạo danh mục
        </Button>
      }
    >
      {/* Page content */}
      <DataTable data={categories} columns={columns} />
    </LayoutShell>
  );
}

// With back button:
<LayoutShell
  title="Chỉnh sửa bài viết"
  backUrl="/dashboard/posts"
>
  {/* Edit form */}
</LayoutShell>
```

### Component Buttons

**Button** - Chỉ 3 variants: primary, secondary, destructive
```tsx
import { Button } from '@/components/ui/button';

// Primary (mặc định)
<Button>Lưu</Button>

// Secondary
<Button variant="secondary">Hủy</Button>

// Destructive (Xóa)
<Button variant="destructive">Xóa</Button>

// IMPORTANT: Không có size prop - chỉ 1 kích thước mặc định
// IMPORTANT: Không có outline, ghost, link variants - chỉ 3 variants trên
```

---

### Component Cards

**Card** - Card với hover effect (shadow elevation)
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card';

// Cách dùng:
<Card>
  <CardHeader title="Card Title" description="Optional description" />
  <CardBody>
    <p>Card content goes here.</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Styling:**
- Background: `bg-card` (auto adapt dark/light)
- Border: `border` + `rounded-lg`
- Shadow: `shadow-sm` → `shadow-md` on hover
- Animation: `duration-200` (200ms)

---

### Component Badges

**Badge** - Status/label badges với 5 variants
```tsx
import { Badge } from '@/components/ui/badge';

// 5 Semantic variants:
<Badge variant="primary">Admin</Badge>
<Badge variant="success">Published</Badge>
<Badge variant="warning">Draft</Badge>
<Badge variant="error">Archived</Badge>
<Badge variant="info">Guest</Badge>
```

**Styling:**
- Shape: `rounded-full` (pill shape)
- Font: `text-xs` + `font-semibold`
- Colors: Solid backgrounds với white text
- Hover: Darker background color

**Helper: Rank Badge**
```tsx
function RankBadge({ rank }: { rank: number }) {
  const getRankLabel = (rank: number) => {
    if (rank === 0) return "Guest"
    if (rank <= 2) return "Member"
    if (rank <= 4) return "Editor"
    if (rank === 5) return "Moderator"
    if (rank === 10) return "Admin"
    return `Rank ${rank}`
  }

  const getRankVariant = (rank: number): BadgeVariant => {
    if (rank === 0) return "info"
    if (rank <= 2) return "primary"
    if (rank <= 4) return "success"
    if (rank === 5) return "warning"
    if (rank === 10) return "error"
    return "primary"
  }

  return (
    <Badge variant={getRankVariant(rank)}>
      {getRankLabel(rank)}
    </Badge>
  )
}

// Usage:
<RankBadge rank={0} />  {/* Guest - blue */}
<RankBadge rank={5} />  {/* Moderator - yellow */}
<RankBadge rank={10} /> {/* Admin - red */}
```

**Helper: Status Badge**
```tsx
function StatusBadge({ status }: { status: "draft" | "published" | "archived" }) {
  const variantMap = {
    draft: "warning" as const,
    published: "success" as const,
    archived: "error" as const,
  }

  const labelMap = {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
  }

  return (
    <Badge variant={variantMap[status]}>
      {labelMap[status]}
    </Badge>
  )
}
```

---

### Component Modals

**Modal** - Dialog với backdrop + animation
```tsx
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/modal';
import { useState } from 'react';

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Bạn có chắc không?</ModalTitle>
          <ModalDescription>
            Hành động này không thể hoàn tác.
          </ModalDescription>
        </ModalHeader>

        <ModalFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={() => {
            // Do something
            setOpen(false)
          }}>
            Xác nhận
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

**Features:**
- Backdrop: `bg-black/50` với `backdrop-blur-sm`
- Animation: Zoom in/out + slide + fade (200ms)
- Close: Backdrop click, Escape key, X button
- Focus trap: Keyboard navigation works
- ARIA: Accessible cho screen readers

---

### Component Toasts

**Toast** - Notifications với Sonner
```tsx
import { toast, Toaster } from '@/components/ui/toast';

// In app/layout.tsx - Add Toaster:
<Toaster
  position="bottom-right"
  expand={false}
  richColors
  closeButton
/>

// Usage in component:
function MyComponent() {
  const handleClick = () => {
    toast.success('Thao tác thành công!')
    toast.error('Có lỗi xảy ra!')
    toast.warning('Vui lòng kiểm tra lại')
  }

  return <button onClick={handleClick}>Hiển thị Toast</button>
}
```

**Features:**
- 3 variants: `success`, `error`, `warning`
- Auto-dismiss: 5 giây (default)
- Click để dismiss
- Stack nhiều toast
- Smooth animations

**Toast with Action:**
```tsx
toast.success('Người dùng đã được tạo thành công', {
  action: {
    label: 'Xem',
    onClick: () => {
      // Navigate to user profile
      router.push(`/users/${userId}`)
    },
  },
})
```

**Promise Toast:**
```tsx
toast.promise(
  fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'John' }),
  }),
  {
    loading: 'Đang tạo người dùng...',
    success: 'Người dùng đã được tạo thành công!',
    error: 'Không thể tạo người dùng',
  }
)
```

---

## 🎨 Colors & Spacing

### Design Tokens (Colors)

**LUÔN dùng tokens - KHÔNG hard-code colors**

```tsx
// ❌ KHÔNG - Hard code
<div style={{ backgroundColor: '#3b82f6' }}>

// ✅ ĐÚNG - Dùng token
<div className="bg-primary">

// ✅ ĐÚNG - Dùng token
<Button variant="primary">
```

**Available colors:**
- `primary` - Màu chính (blue)
- `secondary` - Màu phụ (gray)
- `destructive` - Màu xóa (red)
- `success` - Màu thành công (green)
- `warning` - Màu cảnh báo (yellow)

### Spacing Scale

**LUÔN dùng spacing scale - KHÔNG random numbers**

```tsx
// ❌ KHÔNG - Random spacing
<div className="gap-[13px]">

// ✅ ĐÚNG - Spacing scale
<div className="gap-4">   // 16px
<div className="gap-8">   // 32px
<div className="p-6">     // 24px padding
```

**Spacing scale:**
- `4` = 16px
- `6` = 24px
- `8` = 32px
- `12` = 48px

**Quy tắc:**
- Form fields: `gap-4` (16px giữa các field)
- Sections: `gap-8` (32px giữa các section)
- Page padding: `p-6` (24px)

---

## 📋 Common Patterns

### Pattern 1: Listing Page (Table + Search + Create Button)

```tsx
// frontend/src/app/(dashboard)/categories/page.tsx

import { LayoutShell } from '@/components/ui/layout-shell';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';

export default function CategoriesPage() {
  return (
    <LayoutShell
      title="Danh mục"
      actions={
        <Button onClick={() => router.push('/categories/new')}>
          Tạo danh mục
        </Button>
      }
    >
      {/* Search */}
      <input
        type="search"
        placeholder="Tìm kiếm..."
        className="w-full max-w-md"
      />

      {/* Table */}
      <DataTable
        data={categories}
        columns={[
          { key: 'name', label: 'Tên', sortable: true },
          { key: 'slug', label: 'Slug', sortable: true },
          { key: 'actions', label: '' },
        ]}
        pagination
      />
    </LayoutShell>
  );
}
```

**Copy từ:**
- `frontend/src/app/(dashboard)/users/page.tsx`
- `frontend/src/app/(dashboard)/posts/page.tsx`

---

### Pattern 2: Create/Edit Page (Form)

```tsx
// frontend/src/app/(dashboard)/categories/new/page.tsx

import { LayoutShell } from '@/components/ui/layout-shell';
import { FormLayout } from '@/components/ui/form-layout';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';

export default function NewCategoryPage() {
  return (
    <LayoutShell
      title="Tạo danh mục mới"
      backUrl="/categories"
    >
      <form onSubmit={handleSubmit}>
        <FormLayout>
          <FormField
            label="Tên danh mục"
            name="name"
            placeholder="Nhập tên danh mục"
            required
          />

          <FormField
            label="Slug"
            name="slug"
            placeholder="ten-danh-muc"
            required
          />

          <FormField
            label="Mô tả"
            name="description"
            type="textarea"
            placeholder="Mô tả về danh mục"
          />
        </FormLayout>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit">Lưu</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
        </div>
      </form>
    </LayoutShell>
  );
}
```

**Copy từ:**
- `frontend/src/app/(dashboard)/posts/[id]/edit/page.tsx`
- `frontend/src/app/(dashboard)/users/[id]/edit/page.tsx`

---

### Pattern 3: Detail Page (Display + Actions)

```tsx
// frontend/src/app/(dashboard)/categories/[id]/page.tsx

import { LayoutShell } from '@/components/ui/layout-shell';
import { Button } from '@/components/ui/button';

export default function CategoryDetailPage({ params }) {
  const category = await fetchCategory(params.id);

  return (
    <LayoutShell
      title={category.name}
      backUrl="/categories"
      actions={
        <>
          <Button variant="secondary" onClick={() => router.push(`/categories/${category.id}/edit`)}>
            Chỉnh sửa
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Xóa
          </Button>
        </>
      }
    >
      {/* Category info */}
      <div className="space-y-4">
        <div>
          <label className="font-medium">Tên</label>
          <p>{category.name}</p>
        </div>

        <div>
          <label className="font-medium">Slug</label>
          <p>{category.slug}</p>
        </div>

        <div>
          <label className="font-medium">Mô tả</label>
          <p>{category.description}</p>
        </div>
      </div>
    </LayoutShell>
  );
}
```

**Copy từ:**
- `frontend/src/app/(dashboard)/users/[id]/page.tsx`
- `frontend/src/app/(dashboard)/posts/[id]/page.tsx`

---

## 🌓 Dark/Light Mode

### How it Works

Dark/Light mode **tự động** - Không cần setup:

```tsx
// User toggle theme
// → Theme lưu trong localStorage
// → Tất cả components tự update
// → Dùng CSS variables (Tailwind)
```

### Theme Tokens

```tsx
// ✅ ĐÚNG - Dùng token (tự adapt dark/light)
<div className="bg-background text-foreground">

// ❌ KHÔNG - Hard code
<div className="bg-white text-black">
```

**Available tokens:**
- `bg-background` - Background color
- `text-foreground` - Text color
- `bg-primary` / `text-primary-foreground` - Primary color
- `border-border` - Border color

---

## ⚠️ Common Mistakes (Tránh)

### ❌ KHÔNG tạo component mới nếu component đã tồn tại

**Wrong:**
```tsx
// Tạo MyCustomButton (trùng với Button)
export function MyCustomButton() { ... }
```

**Right:**
```tsx
// Dùng Button có sẵn
import { Button } from '@/components/ui/button';
```

---

### ❌ KHÔNG hard-code colors

**Wrong:**
```tsx
<div style={{ backgroundColor: '#3b82f6' }}>
<div className="bg-blue-500">
```

**Right:**
```tsx
<div className="bg-primary">
```

---

### ❌ KHÔNG custom spacing ngoài scale

**Wrong:**
```tsx
<div className="gap-[13px]">
<div style={{ padding: '23px' }}>
```

**Right:**
```tsx
<div className="gap-4">  // 16px
<div className="p-6">    // 24px
```

---

### ❌ KHÔNG build từ zero

**Wrong:**
```tsx
// Tạo page từ scratch (blank file)
export default function NewPage() {
  return (
    <div>  // Empty, think from scratch
      ...
    </div>
  );
}
```

**Right:**
```bash
# Copy template
cp -r frontend/src/app/(dashboard)/users frontend/src/app/(dashboard)/new-page

# Modify content
```

---

## 🔧 Debugging

### Component không render?

**Check:**
1. Component import đúng path?
   ```tsx
   import { Button } from '@/components/ui/button';  // ✅
   ```

2. Component name đúng?
   ```tsx
   <Button>  // ✅ (capital B)
   <button>  // ❌ (native HTML)
   ```

3. Dev server đang chạy?
   ```bash
   npm run dev  // Should be running
   ```

---

### Styles không apply?

**Check:**
1. Tailwind class đúng?
   ```tsx
   <div className="bg-primary">  // ✅ (className)
   <div class="bg-primary">     // ❌ (class - wrong)
   ```

2. CSS import đúng?
   ```tsx
   // app/globals.css should be imported
   import '@/app/globals.css';
   ```

---

### Dark mode không work?

**Check:**
1. Dùng token đúng?
   ```tsx
   <div className="bg-background">  // ✅ (auto adapt)
   <div className="bg-white">       // ❌ (hard coded)
   ```

2. Theme provider wrap đúng?
   ```tsx
   // app/layout.tsx should have ThemeProvider
   <ThemeProvider>
     {children}
   </ThemeProvider>
   ```

---

## 📚 Next Steps

### Day 1: Setup & Explore
- ✅ Clone repo + install
- ✅ Run dev server
- ✅ Explore template pages (`users/`, `posts/`)
- ✅ Explore components (`/components/ui/`)

### Day 2: Copy & Modify
- ✅ Copy template → Create new page
- ✅ Modify content (API, data, labels)
- ✅ Test in browser

### Day 3: Build Feature
- ✅ Implement simple CRUD (Create/Read/Update/Delete)
- ✅ Use existing components only
- ✅ Follow patterns from templates

### Week 1: Productive
- ✅ Build features independently
- ✅ Copy patterns from templates
- ✅ Ask questions when stuck

---

## 🆘 Need Help?

### Check trước khi ask:

1. **Template có sẵn chưa?**
   - Check: `frontend/src/app/(dashboard)/users/`
   - Check: `frontend/src/app/(dashboard)/posts/`

2. **Component có sẵn chưa?**
   - Check: `frontend/src/components/ui/`

3. **Pattern có sẵn chưa?**
   - Check: This guide (Common Patterns)

---

### Ask trong team:

**Channel:** `#frontend-aicmr`

**Format:**
```
🙋 Question: [Mô tả ngắn gọn]

Context:
- Đang làm page: [...]
- Muốn achieve: [...]
- Đã thử: [...]

Screenshot/Error: [Nếu có]
```

**Example:**
```
🙋 Question: How to add filter to DataTable?

Context:
- Đang làm: Categories listing page
- Muốn: Add filter by "status"
- Đã thử: Check DataTable component docs

```

---

## 📝 Cheatsheet

### Common Components

| Component | Import | Usage |
|-----------|--------|-------|
| Button | `@/components/ui/button` | `<Button>Click</Button>` |
| FormField | `@/components/ui/form-field` | `<FormField label="Name" name="name" />` |
| FormLayout | `@/components/ui/form-layout` | `<FormLayout>...</FormLayout>` |
| DataTable | `@/components/ui/data-table` | `<DataTable data={...} columns={...} />` |
| LayoutShell | `@/components/ui/layout-shell` | `<LayoutShell title="Title">...</LayoutShell>` |
| Card | `@/components/ui/card` | `<Card><CardHeader title="..." /></Card>` |
| Badge | `@/components/ui/badge` | `<Badge variant="success">Active</Badge>` |
| Modal | `@/components/ui/modal` | `<Modal open={open}><ModalContent>...</ModalContent></Modal>` |
| Toast | `@/components/ui/toast` | `toast.success('Success!')` |

### Common Tailwind Classes

| Class | Usage | Value |
|-------|-------|-------|
| `gap-4` | Spacing giữa items | 16px |
| `gap-8` | Spacing giữa sections | 32px |
| `p-6` | Padding | 24px |
| `bg-primary` | Background color | Primary (blue) |
| `text-foreground` | Text color | Auto adapt (dark/light) |
| `rounded-md` | Border radius | Medium |

### File Locations

| File type | Location |
|-----------|----------|
| Pages | `frontend/src/app/(dashboard)/` |
| Components | `frontend/src/components/ui/` |
| Template pages | `frontend/src/app/(dashboard)/{users,posts}/` |

---

**Document version:** 2.0 (FINAL)
**Last updated:** 2026-01-26
**Maintained by:** Frontend Team AiCMR

**Changes in v2.0:**
- ✅ Added Card component documentation
- ✅ Added Badge component documentation (RankBadge, StatusBadge helpers)
- ✅ Added Modal component documentation
- ✅ Added Toast component documentation (Sonner integration)
- ✅ Updated Cheatsheet with new components

---

**Happy coding! 🚀**

Nhớ: **Copy template → Modify → Ship** - Đừng build từ scratch!
