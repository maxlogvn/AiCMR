# AiCMR Design System Documentation

**Version:** 1.0
**Last Updated:** 2026-01-26
**Target Audience:** Frontend Developers (New & Existing)

---

## 🎯 What is Design System?

**Design System = Operating System cho Frontend Team**

Đây không phải là:
- ❌ Bộ sưu tập component (component library)
- ❌ Framework lý thuyết (theoretical framework)
- ❌ Tài liệu UI tĩnh (static UI documentation)

Đây là:
- ✅ **Cách thức làm việc** (how we work)
- ✅ **Bàn đảng phát triển** (development platform)
- ✅ **Máy sản xuất page** (page production machine)

**Mục tiêu:**
- Sản xuất page **nhanh** (fast)
- Đúng chuẩn **ngay từ đầu** (correct from day 1)
- Team **không ngại** làm UI features (no UI fear)

---

## 🚀 Quick Start (5 phút)

### Bước 1: Đọc Getting Started Guide

**📖 [01 - Getting Started](./01-getting-started.md)** *(5 phút)*

Đây là **QUAN TRỌNG NHẤT** - sẽ guide bạn từ zero đến hero trong 5 phút:
- Clone repo + install
- Copy template page
- Run dev server
- Modify content → Ship

### Bước 2: Hiểu Design System Principles

**📖 [03 - Principles](./03-principles.md)** *(10 phút)*

5 nguyên tắc cốt lõi:
1. Build pages first → Extract later
2. Eliminate Choices
3. Documentation = Code
4. Optimize for 90%
5. Ownership over Abstraction

### Bước 3: Copy Patterns & Build

**📖 [02 - Common Patterns](./02-common-patterns.md)** *(Reference)*

8 patterns hoàn chỉnh với template code:
- Pattern 1: Listing Page (Table + Search + Create)
- Pattern 2: Create/Edit Page (Form)
- Pattern 3: Detail Page (Display + Actions)
- Pattern 4: Auth Forms (Login/Register)
- Pattern 5: Modal/Dialog Forms
- Pattern 6: Empty States
- Pattern 7: Search & Filter
- Pattern 8: Loading & Error States

---

## 📁 Documentation Structure

```
docs/design-system/
├── README.md                          # This file - Overview
├── 01-getting-started.md              # 5-minute quick start
├── 02-common-patterns.md              # 8 patterns with templates
├── 03-principles.md                   # 5 core principles
├── 04-team-rollout.md                 # 3-week adoption plan
└── 05-implementation-summary.md       # Complete overview
```

**Reading Order (Cho người mới):**
1. ✅ **README.md** (này) - 2 phút
2. ✅ **01-getting-started.md** - 5 phút
3. ✅ **03-principles.md** - 10 phút
4. ✅ **02-common-patterns.md** - Reference khi cần
5. ⏭️ **04-team-rollout.md** - Nếu cần rollout
6. ⏭️ **05-implementation-summary.md** - Nếu cần overview

---

## 🎨 Components Reference

### Core Components (4 components)

**Location:** `frontend/src/components/ui/`

| Component | File | Purpose | Usage |
|-----------|------|---------|-------|
| **FormField** | `form-field.tsx` | Input field với label + error | Forms |
| **FormLayout** | `form-layout.tsx` | Form wrapper với spacing | Forms |
| **LayoutShell** | `layout-shell.tsx` | Page layout (header + actions) | Pages |
| **DataTable** | `data-table.tsx` | Table (sorting + selection + pagination) | Listings |

**Actions:**
| Component | File | Purpose | Usage |
|-----------|------|---------|-------|
| **Button** | `button.tsx` | 3 variants: primary, secondary, destructive | All pages |

### How to Use Components

**Quick Copy-Paste:**

```tsx
// Form Field
import { FormField } from '@/components/ui/form-field';

<FormField
  label="Email"
  name="email"
  type="email"
  placeholder="user@example.com"
  required
/>

// Data Table
import { DataTable } from '@/components/ui/data-table';

<DataTable
  data={items}
  columns={[
    { key: 'name', label: 'Tên', sortable: true },
    { key: 'email', label: 'Email' },
  ]}
  pagination
/>

// Layout Shell
import { LayoutShell } from '@/components/ui/layout-shell';

<LayoutShell
  title="Quản lý Users"
  actions={<Button onClick={handleCreate}>Tạo User</Button>}
>
  {/* Page content */}
</LayoutShell>
```

---

## 🎯 Design Tokens

### Colors (5 Semantic Colors)

**LUÔN dùng tokens - KHÔNG hard-code:**

```tsx
// ✅ ĐÚNG - Dùng token
<div className="bg-primary text-primary-foreground">

// ❌ KHÔNG - Hard code
<div style={{ backgroundColor: '#F97316' }}>
```

**Available Colors:**
- `primary` - Màu chính (orange) - Main actions
- `success` - Màu thành công (green) - Success messages
- `warning` - Màu cảnh báo (yellow) - Warnings
- `destructive` - Màu xóa (red) - Errors, destructive actions
- `muted` - Màu phụ (gray) - Secondary text

### Spacing Scale

**LUÔN dùng spacing scale - KHÔNG random numbers:**

```tsx
// ✅ ĐÚNG - Spacing scale
<div className="gap-4">   // 16px
<div className="gap-8">   // 32px
<div className="p-6">     // 24px padding

// ❌ KHÔNG - Random spacing
<div className="gap-[13px]">
```

**Spacing Scale:**
- `4` = 16px - Form fields gap
- `8` = 32px - Sections gap
- `6` = 24px - Page padding

### Typography

**5 Sizes:**
- `xs` = 12px - Captions, helper text
- `sm` = 14px - Labels, secondary text
- `base` = 16px - Body text
- `lg` = 18px - Section headings
- `xl` = 20px - Page titles

---

## 🔄 Dark/Light Mode

**Tự động - Không cần setup:**

```tsx
// Dùng tokens - tự adapt dark/light
<div className="bg-background text-foreground">

// ❌ KHÔNG hard-code
<div className="bg-white text-black">
```

**Toggle Theme:**
```tsx
import { useTheme } from '@/components/providers/theme-provider';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}
```

---

## 📋 Template Pages

**Copy → Modify → Ship**

**Location:** `frontend/src/app/`

| Page | Path | Pattern | Use For |
|------|------|---------|---------|
| Posts Listing | `/dashboard/posts/page.tsx` | Pattern 1 | Listing pages |
| User Profile | `/user/profile/page.tsx` | Pattern 3 | Detail pages |
| Category Management | `/dashboard/categories/page.tsx` | Custom | Tree views |

**How to Copy Template:**
```bash
# 1. Copy template folder
cp -r frontend/src/app/dashboard/posts frontend/src/app/dashboard/users

# 2. Modify content
cd frontend/src/app/dashboard/users
# Edit page.tsx:
# - "Posts" → "Users"
# - posts API → users API
# - Columns definition
```

---

## 🚨 Common Mistakes (Tránh)

### ❌ KHÔNG tạo component mới nếu component đã tồn tại

**Wrong:**
```tsx
export function MyCustomButton() { ... }
```

**Right:**
```tsx
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
export default function NewPage() {
  return <div>{/* Empty, think from scratch */}</div>;
}
```

**Right:**
```bash
# Copy template
cp -r frontend/src/app/dashboard/posts frontend/src/app/dashboard/new-page
# Modify content
```

---

## 📊 Success Metrics

**Design System thành công khi:**

1. **Dev confidence ↑** - Team không ngại UI features
2. **Development speed ↑** - Less time style decisions
3. **Consistency ↑** - All pages look consistent
4. **Onboarding time ↓** - New dev productive in days

---

## 🔧 Troubleshooting

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

### Styles không apply?

**Check:**
1. Tailwind class đúng?
   ```tsx
   <div className="bg-primary">  // ✅ (className)
   <div class="bg-primary">     // ❌ (class - wrong)
   ```
2. CSS import đúng?
   ```tsx
   import '@/app/globals.css';  // Should be imported
   ```

### Dark mode không work?

**Check:**
1. Dùng token đúng?
   ```tsx
   <div className="bg-background">  // ✅ (auto adapt)
   <div className="bg-white">       // ❌ (hard coded)
   ```
2. Theme provider wrap đúng?
   ```tsx
   <ThemeProvider>{children}</ThemeProvider>
   ```

---

## 📞 Support

### Questions?

**Check trước khi ask:**
1. **Template có sẵn chưa?** - Check `frontend/src/app/dashboard/`
2. **Component có sẵn chưa?** - Check `frontend/src/components/ui/`
3. **Pattern có sẵn chưa?** - Check [Common Patterns](./02-common-patterns.md)

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

---

## 📚 Additional Resources

### External Documentation

- **TailwindCSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/docs/primitives
- **Next.js:** https://nextjs.org/docs
- **React Query:** https://tanstack.com/query/latest/docs

### Internal Documentation

- **[CLAUDE.md](../../CLAUDE.md)** - Project guidance
- **[API Contracts](../api-contracts-backend.md)** - Backend API docs
- **[Data Models](../data-models-backend.md)** - Database schema
- **[Project Overview](../project-overview.md)** - Project architecture

---

## 🎉 Conclusion

**Design System = Máy sản xuất page nhanh và đúng**

Nhớ:
- ✅ Copy template → Modify → Ship
- ❌ Build from scratch
- ✅ Use existing components
- ❌ Create new components unless needed
- ✅ Use design tokens
- ❌ Hard-code colors

**Happy Building! 🚀**

---

**Document version:** 1.0
**Last updated:** 2026-01-26
**Maintained by:** Frontend Team AiCMR

---

*"Consistency > Perfection. Ship first, refine later."*
