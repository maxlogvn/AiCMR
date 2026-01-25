# AiCMR Design System - Common Patterns (v1)

**Dành cho:** Frontend Team AiCMR
**Thời gian đọc:** 10 phút
**Mục tiêu:** Copy → Modify → Ship, không cần think về implementation

---

## 🎯 Pattern Philosophy

**"Copy template → Modify → Ship"**

Design system = **Bộ template**, không phải bộ components:
- Components = Building blocks (Button, FormField, DataTable)
- Patterns = Cách combine components để build features
- Templates = Complete page examples (copy & modify)

**Quy tắc:**
1. ✅ Copy pattern từ đây
2. ✅ Modify theo use case của bạn
3. ❌ KHÔNG build từ scratch
4. ❌ KHÔNG tạo new pattern nếu pattern đã tồn tại

---

## 📋 Pattern 1: Listing Page (Table + Search + Create)

**Use cases:**
- Users listing page
- Posts listing page
- Categories listing page
- Tags listing page

**Structure:**
- LayoutShell (title + subtitle + create button)
- Stats cards (optional)
- Search + filters
- DataTable (with pagination)
- Bulk actions (optional)

### Template Code

```tsx
"use client";

/**
 * Listing Page Template
 *
 * Copy pattern này để tạo listing page mới:
 * 1. Replace "Items" with your entity (Users, Posts, Categories)
 * 2. Modify columns trong DataTable
 * 3. Update API calls
 * 4. Modify filters nếu cần
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { LayoutShell } from "@/components/ui/layout-shell";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function ItemsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 20;

  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ["items", page, search],
    queryFn: async () => {
      const api = (await import("@/lib/api")).default;
      return api.get("/items", {
        params: { page, size: pageSize, search }
      });
    },
  });

  const items = data?.data?.items || [];
  const total = data?.data?.total || 0;

  return (
    <LayoutShell
      title="Quản lý Items"
      subtitle="Quản lý tất cả items trong hệ thống"
      icon={FileText}
      actions={
        <Button onClick={() => router.push("/items/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo item
        </Button>
      }
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={items}
        columns={[
          { key: "name", label: "Tên", sortable: true },
          { key: "slug", label: "Slug", sortable: true },
          { key: "created_at", label: "Ngày tạo", sortable: true },
        ]}
        pagination
        page={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
      />
    </LayoutShell>
  );
}
```

### Copy từ:
- `frontend/src/app/dashboard/posts/page.tsx` (full example với stats + filters)
- `frontend/src/app/dashboard/categories/page.tsx` (simple example)

---

## 📝 Pattern 2: Create/Edit Page (Form)

**Use cases:**
- Create new post
- Edit user profile
- Create category
- Edit settings

**Structure:**
- LayoutShell (title + back button)
- FormLayout (consistent spacing)
- FormField components (label + input + error)
- Action buttons (Save + Cancel)

### Template Code

```tsx
"use client";

/**
 * Create/Edit Page Template
 *
 * Copy pattern này để tạo form page mới:
 * 1. Replace "Item" với entity của bạn
 * 2. Modify form fields
 * 3. Update API calls (create vs update)
 * 4. Add validation nếu cần
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LayoutShell } from "@/components/ui/layout-shell";
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

export default function ItemFormPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const api = (await import("@/lib/api")).default;
      return api.post("/items", data);
    },
    onSuccess: () => {
      showSuccess("Lưu thành công");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      router.push("/items");
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Lưu thất bại");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Tên không được để trống";
    if (!formData.slug) newErrors.slug = "Slug không được để trống";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <LayoutShell
      title="Tạo Item mới"
      backUrl="/items"
    >
      <form onSubmit={handleSubmit}>
        <FormLayout
          actions={
            <>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
            </>
          }
        >
          <FormField
            label="Tên"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <FormField
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            error={errors.slug}
            required
          />

          <FormField
            label="Mô tả"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả..."
          />
        </FormLayout>
      </form>
    </LayoutShell>
  );
}
```

### Copy từ:
- `frontend/src/app/user/profile/page.tsx` (view-only pattern)
- Các form components trong `frontend/src/components/category/`

---

## 👁️ Pattern 3: Detail Page (Display + Actions)

**Use cases:**
- User profile detail
- Post detail
- Category detail
- Settings page

**Structure:**
- LayoutShell (title + actions)
- Card-based layout
- Info sections (label + value)
- Action buttons (Edit, Delete, Back)

### Template Code

```tsx
"use client";

/**
 * Detail Page Template
 *
 * Copy pattern này để tạo detail page:
 * 1. Replace "Item" với entity của bạn
 * 2. Modify info sections
 * 3. Update actions (Edit, Delete, etc.)
 * 4. Add status badges nếu cần
 */

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LayoutShell } from "@/components/ui/layout-shell";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Fetch item detail
  const { data: item, isLoading } = useQuery({
    queryKey: ["item", params.id],
    queryFn: async () => {
      const api = (await import("@/lib/api")).default;
      return api.get(`/items/${params.id}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <LayoutShell
      title={item.data.name}
      subtitle="Chi tiết thông tin item"
      actions={
        <>
          <Button variant="secondary" onClick={() => router.push(`/items/${item.data.id}/edit`)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </>
      }
    >
      {/* Item Info */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Tên</label>
              <p className="font-medium">{item.data.name}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Slug</label>
              <p className="font-medium">{item.data.slug}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Trạng thái</label>
              <div className="mt-1">
                <Badge variant={item.data.is_active ? "success" : "destructive"}>
                  {item.data.is_active ? "Hoạt động" : "Vô hiệu"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Additional sections */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Mô tả</h3>
          <p className="text-foreground">{item.data.description}</p>
        </div>
      </div>
    </LayoutShell>
  );
}
```

### Copy từ:
- `frontend/src/app/user/profile/page.tsx` (user profile pattern)

---

## 🔐 Pattern 4: Auth Forms (Login/Register)

**Use cases:**
- Login page
- Register page
- Forgot password
- Reset password

**Structure:**
- Centered card layout
- Form with 2-3 fields
- Single action button
- Link to switch auth mode

### Template Code

```tsx
"use client";

/**
 * Auth Form Template (Login/Register)
 *
 * Copy pattern này để tạo auth forms:
 * 1. Modify title và fields
 * 2. Update API endpoint
 * 3. Add validation
 * 4. Add redirect logic
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const api = (await import("@/lib/api")).default;
      return api.post("/auth/login", data);
    },
    onSuccess: () => {
      showSuccess("Đăng nhập thành công");
      router.push("/dashboard");
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Đăng nhập thất bại");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <div className="bg-card border border-border rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Đăng nhập</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Nhập email và mật khẩu để tiếp tục
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <FormLayout>
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                required
              />

              <FormField
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </FormLayout>
          </form>

          {/* Switch Auth Mode */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Chưa có tài khoản? </span>
            <a href="/register" className="text-primary hover:underline">
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Copy từ:
- `frontend/src/app/login/page.tsx`
- `frontend/src/app/register/page.tsx`

---

## 🎨 Pattern 5: Modal/Dialog Forms

**Use cases:**
- Quick create (trong listing page)
- Confirm delete
- Edit inline
- Display additional info

**Structure:**
- Dialog/Modal component (shadcn)
- FormLayout bên trong
- Save + Cancel buttons
- Close on backdrop click

### Template Code

```tsx
"use client";

/**
 * Dialog Form Template
 *
 * Copy pattern này để tạo modal forms:
 * 1. Modify form fields
 * 2. Update API calls
 * 3. Handle open/close state
 * 4. Add validation
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: any; // For edit mode
}

export function ItemFormDialog({ open, onOpenChange, item }: ItemFormDialogProps) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: item?.name || "",
    slug: item?.slug || "",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const api = (await import("@/lib/api")).default;
      if (item) {
        return api.put(`/items/${item.id}`, data);
      } else {
        return api.post("/items", data);
      }
    },
    onSuccess: () => {
      showSuccess(item ? "Cập nhật thành công" : "Tạo thành công");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      onOpenChange(false);
    },
    onError: (error) => {
      const err = error as { response?: { data?: { detail?: string } } };
      showError(err.response?.data?.detail || "Thất bại");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Chỉnh sửa" : "Tạo mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }}>
          <FormLayout
            actions={
              <>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Đang lưu..." : "Lưu"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
              </>
            }
          >
            <FormField
              label="Tên"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <FormField
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </FormLayout>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Copy từ:
- `frontend/src/components/dashboard/BulkPublishDialog.tsx`
- `frontend/src/components/category/CategoryForm.tsx`

---

## 📊 Pattern 6: Empty States

**Use cases:**
- No data in table
- No search results
- First-time user
- Deleted items

**Structure:**
- Icon + Title + Description
- Optional CTA button
- Consistent spacing

### Template Code

```tsx
/**
 * Empty State Template
 *
 * Copy pattern này để tạo empty states:
 * 1. Modify icon, title, description
 * 2. Add CTA button nếu cần
 * 3. Update action logic
 */

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon = FileText,
  title = "Không có dữ liệu",
  description = "Chưa có item nào được tạo",
  actionLabel,
  onAction,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        {description}
      </p>

      {/* CTA Button */}
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Usage:
<EmptyState
  icon={FileText}
  title="Không tìm thấy bài viết nào"
  description="Thử thay đổi bộ lọc hoặc tạo bài viết mới"
  actionLabel="Tạo bài viết"
  onAction={() => router.push("/posts/new")}
/>
```

### Copy từ:
- `frontend/src/components/dashboard/EmptyState.tsx` (if exists)

---

## 🔍 Pattern 7: Search & Filter

**Use cases:**
- Search bar in listing pages
- Filter dropdown (status, category, date)
- URL persistence for filters
- Debounced search input

### Template Code

```tsx
/**
 * Search & Filter Template
 *
 * Features:
 * - Debounced search (300ms)
 * - Filter dropdowns
 * - URL persistence
 * - Clear filters button
 */

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchAndFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status !== "all") params.set("status", status);

    const queryString = params.toString();
    const newPath = queryString ? `/items?${queryString}` : "/items";
    router.replace(newPath);
  }, [debouncedSearch, status, router]);

  const handleClear = () => {
    setSearch("");
    setStatus("all");
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-md"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-md"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Vô hiệu</option>
        </select>

        {/* Clear Button */}
        {(search || status !== "all") && (
          <Button variant="secondary" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
```

### Copy từ:
- `frontend/src/app/dashboard/posts/page.tsx` (full example)

---

## 🎯 Pattern 8: Loading & Error States

**Use cases:**
- Initial page load
- API fetching
- Form submission
- Error handling

### Template Code

```tsx
/**
 * Loading & Error States Template
 *
 * Copy pattern này để handle loading/error states:
 * 1. Check isLoading → Show skeleton
 * 2. Check error → Show error message
 * 3. Check no data → Show empty state
 * 4. Otherwise → Show content
 */

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function MyPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const api = (await import("@/lib/api")).default;
      return api.get("/items");
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Skeleton cards */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Đã xảy ra lỗi khi tải dữ liệu
          </p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!data || data.data.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  // Content
  return <div>{/* Your content here */}</div>;
}
```

### Copy từ:
- Tất cả pages trong `frontend/src/app/`

---

## 📝 Summary: How to Use This Guide

**Workflow:**
1. **Identify use case** → Choose matching pattern
2. **Copy template code** → Paste into your file
3. **Modify content** → Update API calls, fields, labels
4. **Test in browser** → Dev server auto-reloads
5. **Ship** → Done!

**Pattern Selection Guide:**
- Listing items → Pattern 1 (Listing Page)
- Create/edit items → Pattern 2 (Form Page)
- View item detail → Pattern 3 (Detail Page)
- Login/register → Pattern 4 (Auth Forms)
- Quick forms → Pattern 5 (Dialog Forms)
- No data → Pattern 6 (Empty States)
- Search/filter → Pattern 7 (Search & Filter)
- Loading/errors → Pattern 8 (Loading & Error)

**Remember:**
- ✅ Copy template → Modify → Ship
- ❌ Build from scratch
- ❌ Create new pattern if pattern exists
- ✅ Ask team if unsure

---

**Document version:** 1.0
**Last updated:** 2026-01-26
**Maintained by:** Frontend Team AiCMR

---

*"Design system = Bộ template, not just components"*
