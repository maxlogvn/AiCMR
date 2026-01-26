# Frontend Development Rules - AiCMR

**Version:** 1.0
**Last Updated:** 2026-01-26
**Status:** ACTIVE
**Applies to:** All Agents working on AiCMR Frontend features

---

## 🎯 Philosophy

**"Copy Template → Modify → Ship" - Don't Build from Scratch**

AiCMR Design System = **Bộ template**, không phải bộ components:
- ✅ Components = Building blocks (Button, FormField, DataTable)
- ✅ Patterns = Cách combine components để build features
- ✅ Templates = Complete page examples (copy & modify)

**3 Golden Rules:**
1. ✅ **ALWAYS** copy từ templates/patterns đã có
2. ✅ **NEVER** build UI từ scratch
3. ✅ **WHEN IN DOUBT** → Check existing pages first

---

## 📁 MANDATORY: File Structure Rules

### Page Location Rules

```
frontend/src/app/
├── (public)/           # Public routes (no auth required)
│   ├── blog/[slug]/   # Blog post detail
│   └── blog/          # Blog listing
├── (dashboard)/       # Dashboard routes (auth + rank required)
│   ├── users/         # User management
│   ├── posts/         # Post management
│   ├── categories/    # Category management
│   └── tags/          # Tag management
├── user/              # User dashboard (authenticated users)
│   ├── profile/
│   ├── posts/
│   └── change-password/
├── login/             # Login page
├── register/          # Registration page
└── install/           # Installation page
```

**Rules:**
- **ALWAYS** use route groups: `(public)`, `(dashboard)`
- **NEVER** create pages at root level unless absolutely necessary
- **MUST** use appropriate guard components:
  - `(public)` routes → No guard needed
  - `(dashboard)` routes → `AuthGuard` + `AdminGuard`/`ModeratorGuard`
  - `user/` routes → `AuthGuard`
  - `login/`, `register/` → `PublicOnlyGuard`

### Component Location Rules

```
frontend/src/components/
├── ui/                 # Design System components (NOT for features)
│   ├── button.tsx
│   ├── card.tsx
│   ├── form-field.tsx
│   ├── data-table.tsx
│   └── ... (all reusable UI components)
├── dashboard/          # Dashboard-specific components
│   ├── LayoutShell.tsx
│   ├── StatsCards.tsx
│   └── ... (dashboard features only)
├── auth/              # Auth-specific components
│   ├── SessionTimeoutProvider.tsx
│   └── ... (auth features only)
└── [feature]/         # Feature-specific components (when necessary)
    └── [FeatureComponent].tsx
```

**Rules:**
- **Design System components** → `components/ui/`
- **Dashboard-only features** → `components/dashboard/`
- **Auth-only features** → `components/auth/`
- **Feature-specific** → Create new folder ONLY if component is complex & reusable

---

## 🎨 MANDATORY: Design System Component Usage

### Card Component Rules

**WRONG ❌:**
```tsx
import { Card, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardTitle>Title</CardTitle>
  <CardContent>Content</CardContent>
</Card>
```

**CORRECT ✅:**
```tsx
import { Card, CardHeader, CardBody } from "@/components/ui/card";

<Card>
  <CardHeader title="Title" description="Optional description" />
  <CardBody>
    Content here
  </CardBody>
</Card>
```

**Rules:**
- **ALWAYS** use `CardHeader` with `title` prop (NEVER `CardTitle` component - doesn't exist)
- **ALWAYS** use `CardBody` (NOT `CardContent` - doesn't exist)
- **OPTIONAL:** `description` prop on `CardHeader` for subtitle
- **OPTIONAL:** `CardFooter` for action buttons

### Form Component Rules

**ALWAYS use FormLayout + FormField pattern:**

```tsx
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";

<FormLayout
  actions={
    <Button type="submit">Save</Button>
  }
>
  <FormField
    label="Email"
    name="email"
    type="email"
    placeholder="user@example.com"
    icon={Mail}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />

  <FormField
    label="Password"
    name="password"
    type="password"
    placeholder="••••••••"
    icon={Lock}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    error={errors.password}
  />
</FormLayout>
```

**Rules:**
- **ALWAYS** wrap form fields in `FormLayout`
- **ALWAYS** use `FormField` component (NOT raw `input`)
- **NEVER** use `input-wrapped.tsx` directly (it's internal)
- **ALWAYS** provide `label`, `name`, `type`, `placeholder`
- **OPTIONAL:** `icon` prop for visual indicator
- **OPTIONAL:** `required` prop for validation UI
- **OPTIONAL:** `error` prop for error message

### Toast Notification Rules

**WRONG ❌:**
```tsx
import { ToastProvider } from "@/hooks/useToast";

<ToastProvider>
  {children}
</ToastProvider>
```

**CORRECT ✅:**
```tsx
import { toast } from "@/components/ui/toast";

// In app/layout.tsx - ONLY ONCE
<Toaster position="bottom-right" richColors closeButton />

// In components - use toast directly
const handleClick = async () => {
  try {
    await api.post("/items", data);
    toast.success("Tạo thành công!");
  } catch (error) {
    toast.error("Có lỗi xảy ra!");
  }
};
```

**Rules:**
- **NEVER** use `ToastProvider` (Sonner doesn't need it)
- **ALWAYS** import `toast` from `@/components/ui/toast`
- **ALWAYS** add `<Toaster />` in `app/layout.tsx` (ONLY ONCE)
- **USE** `toast.success()`, `toast.error()`, `toast()` for info

### Button Component Rules

```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary (CTA)</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete/Danger</Button>
<Button variant="outline">Outline</Button>

// With icon
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Create Item
</Button>

// Disabled
<Button disabled={isLoading}>
  {isLoading ? "Creating..." : "Create"}
</Button>
```

**Rules:**
- **ALWAYS** specify `variant` explicitly
- **PRIMARY** for main CTA (Create, Save, Submit)
- **DESTRUCTIVE** for dangerous actions (Delete, Remove)
- **OUTLINE** for secondary/cancel actions
- **DEFAULT** for generic actions

### Modal Component Rules

```tsx
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";

<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Xác nhận xóa</ModalTitle>
    </ModalHeader>

    <div className="py-4">
      Bạn có chắc muốn xóa item này không?
    </div>

    <ModalFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Hủy
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Xóa
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

**Rules:**
- **ALWAYS** use for confirmation dialogs
- **ALWAYS** provide clear action title in `ModalTitle`
- **ALWAYS** include Cancel button (variant="outline")
- **ALWAYS** use variant="destructive" for dangerous actions

---

## 📄 MANDATORY: Page Structure Templates

### Template 1: Listing Page (CRUD List)

**File:** `frontend/src/app/(dashboard)/[feature]/page.tsx`

```tsx
"use client";

/**
 * [Feature] Listing Page
 *
 * Design System Components:
 * - LayoutShell: Page header with title, subtitle, actions
 * - DataTable: Sortable, searchable data table
 * - Button: Create action
 * - Modal: Confirmation dialogs
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { LayoutShell } from "@/components/ui/layout-shell";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";

export default function [Feature]Page() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const pageSize = 20;

  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ["[feature]", page, search],
    queryFn: async () => {
      const api = (await import("@/lib/api")).default;
      return api.get("/[api-endpoint]", {
        params: { page, size: pageSize, search }
      });
    },
  });

  const items = data?.data?.items || [];
  const total = data?.data?.total || 0;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const api = (await import("@/lib/api")).default;
      return api.delete(`/[api-endpoint]/${id}`);
    },
    onSuccess: () => {
      toast.success("Xóa thành công!");
      setDeleteId(null);
      // Refetch
      queryClient.invalidateQueries(["[feature]"]);
    },
    onError: () => {
      toast.error("Không thể xóa item!");
    },
  });

  return (
    <LayoutShell
      title="[Feature Name]"
      subtitle="Quản lý tất cả [feature] trong hệ thống"
      icon={[Icon]}
      actions={
        <Button onClick={() => router.push("/[feature]/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo [feature]
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
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={items}
        isLoading={isLoading}
        columns={[
          { header: "Column 1", accessorKey: "field1" },
          { header: "Column 2", accessorKey: "field2" },
          // ... more columns
        ]}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
        }}
        actions={(item) => [
          {
            label: "Edit",
            onClick: () => router.push(`/[feature]/${item.id}`),
          },
          {
            label: "Delete",
            onClick: () => setDeleteId(item.id),
            variant: "destructive",
          },
        ]}
      />

      {/* Delete Confirmation Modal */}
      <Modal open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Xác nhận xóa</ModalTitle>
          </ModalHeader>

          <div className="py-4">
            Bạn có chắc muốn xóa item này không? Hành động này không thể hoàn tác.
          </div>

          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LayoutShell>
  );
}
```

### Template 2: Create/Edit Page

**File:** `frontend/src/app/(dashboard)/[feature]/new/page.tsx` OR `/[feature]/[id]/edit/page.tsx`

```tsx
"use client";

/**
 * [Feature] Create/Edit Page
 *
 * Design System Components:
 * - LayoutShell: Page header with actions
 * - FormLayout + FormField: Form wrapper
 * - Button: Submit, Cancel actions
 * - Toast: Success/error notifications
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { LayoutShell } from "@/components/ui/layout-shell";
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function [Feature]CreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    field1: "",
    field2: "",
    // ... more fields
  });

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const api = (await import("@/lib/api")).default;
      return api.post("/[api-endpoint]", data);
    },
    onSuccess: () => {
      toast.success("Lưu thành công!");
      router.push("/[feature]");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Có lỗi xảy ra!");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <LayoutShell
      title="Tạo [Feature] Mới"
      subtitle="Điền thông tin để tạo [feature] mới"
      icon={[Icon]}
      actions={
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormLayout
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={mutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {mutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </>
          }
        >
          <FormField
            label="Field 1"
            name="field1"
            type="text"
            placeholder="Nhập field 1"
            value={formData.field1}
            onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
            required
          />

          <FormField
            label="Field 2"
            name="field2"
            type="text"
            placeholder="Nhập field 2"
            value={formData.field2}
            onChange={(e) => setFormData({ ...formData.field2: e.target.value })}
          />

          {/* ... more fields */}
        </FormLayout>
      </form>
    </LayoutShell>
  );
}
```

### Template 3: Detail Page

**File:** `frontend/src/app/(dashboard)/[feature]/[id]/page.tsx`

```tsx
"use client";

/**
 * [Feature] Detail Page
 *
 * Design System Components:
 * - LayoutShell: Page header with actions
 * - Card: Display content
 * - Button: Edit, Back actions
 */

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit } from "lucide-react";
import { LayoutShell } from "@/components/ui/layout-shell";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function [Feature]DetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ["[feature]", params.id],
    queryFn: async () => {
      const api = (await import("@/lib/api")).default;
      return api.get(`/[api-endpoint]/${params.id}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const item = data?.data;

  return (
    <LayoutShell
      title="[Feature] Details"
      subtitle={`Chi tiết ${item?.name || item?.id}`}
      icon={[Icon]}
      actions={
        <>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button onClick={() => router.push(`/[feature]/${params.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </>
      }
    >
      {/* Content Cards */}
      <Card>
        <CardHeader title="Thông tin chung" />
        <CardBody>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Field 1:</label>
              <p className="font-medium">{item?.field1}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Field 2:</label>
              <p className="font-medium">{item?.field2}</p>
            </div>
            {/* ... more fields */}
          </div>
        </CardBody>
      </Card>
    </LayoutShell>
  );
}
```

---

## 🚫 ANTI-PATTERNS (NEVER DO)

### ❌ Anti-Pattern 1: Building Custom Card Wrappers

**WRONG:**
```tsx
// Don't create custom card components like this
function MyCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
```

**CORRECT:**
```tsx
// Use Design System Card
import { Card, CardHeader, CardBody } from "@/components/ui/card";

<Card>
  <CardHeader title={title} />
  <CardBody>
    {children}
  </CardBody>
</Card>
```

### ❌ Anti-Pattern 2: Using Raw HTML Inputs

**WRONG:**
```tsx
<form>
  <label>Email</label>
  <input type="email" />
  <span className="error">{error}</span>
</form>
```

**CORRECT:**
```tsx
import { FormLayout } from "@/components/ui/form-layout";
import { FormField } from "@/components/ui/form-field";

<FormLayout>
  <FormField
    label="Email"
    name="email"
    type="email"
    placeholder="user@example.com"
    error={error}
  />
</FormLayout>
```

### ❌ Anti-Pattern 3: Inline Styling

**WRONG:**
```tsx
<div style={{ backgroundColor: "#fff", padding: "20px" }}>
  <h2 style={{ color: "#333", fontSize: "24px" }}>Title</h2>
</div>
```

**CORRECT:**
```tsx
import { Card, CardHeader } from "@/components/ui/card";

<Card>
  <CardHeader title="Title" />
</Card>
```

**Rules:**
- **NEVER** use inline styles (`style={{}}`)
- **ALWAYS** use Tailwind classes
- **ALWAYS** use Design System components

### ❌ Anti-Pattern 4: Creating New Color Tokens

**WRONG:**
```tsx
<div className="bg-[#FF5733] text-[#CCEEFF]">
  Custom colors
</div>
```

**CORRECT:**
```tsx
// Use design tokens
<div className="bg-primary text-foreground">
  Themed colors
</div>

// Or semantic variants
<div className="bg-destructive text-destructive-foreground">
  Error state
</div>
```

**Available Tokens:**
- Colors: `background`, `foreground`, `card`, `border`, `primary`, `destructive`, `muted`, `accent`
- Semantics: Use semantic token names, NOT hardcoded colors

### ❌ Anti-Pattern 5: Ignoring Design Principles

**WRONG:**
```tsx
// Creating multiple variants "just in case"
<Button variant="primary" size="small" color="blue" outline={true}>
  Too many options!
</Button>
```

**CORRECT:**
```tsx
// Use opinionated defaults
<Button variant="primary">
  Clear intent
</Button>
```

**Principle: "Eliminate Choices"**
- Only ONE right way for 90% of use cases
- Don't build for edge cases until they appear
- Opinionated > Flexible

---

## ✅ CHECKLIST: MANDATORY Before Implementing New Feature

### Phase 1: Discovery (MANDATORY)

- [ ] **Search existing pages** for similar patterns
  - Check: `frontend/src/app/(dashboard)/` for similar features
  - Check: `_bmad-output/planning-artifacts/common-patterns-v1.md`
  - IF pattern exists → COPY IT

- [ ] **Check if component exists**
  - Search: `frontend/src/components/ui/`
  - IF component exists → USE IT
  - IF NOT → Check if it's really needed or can be composed

- [ ] **Review Design System docs**
  - Read: `getting-started-v1.md`
  - Read: `common-patterns-v1.md`
  - Understand: Component API & usage patterns

### Phase 2: Implementation (MANDATORY)

- [ ] **Copy appropriate template**
  - Listing page → Use Template 1
  - Create/Edit page → Use Template 2
  - Detail page → Use Template 3

- [ ] **Replace placeholders**
  - [Feature] → actual feature name
  - [Icon] → actual icon from lucide-react
  - [api-endpoint] → actual backend endpoint
  - field1, field2 → actual fields

- [ ] **Add Design System components**
  - [ ] LayoutShell for page header
  - [ ] FormLayout + FormField for forms
  - [ ] DataTable for listings
  - [ ] Button for actions (correct variant)
  - [ ] Modal for confirmations
  - [ ] Card for content display
  - [ ] toast for notifications

- [ ] **Add proper error handling**
  - [ ] Try/catch API calls
  - [ ] Show toast.error() on failure
  - [ ] Display error messages in FormField

- [ ] **Add loading states**
  - [ ] Show loading skeleton or spinner
  - [ ] Disable buttons during mutations
  - [ ] Handle optimistic updates (if needed)

### Phase 3: Validation (MANDATORY)

- [ ] **Test all user flows**
  - [ ] Create flow
  - [ ] Edit flow
  - [ ] Delete flow
  - [ ] Search/filter flow
  - [ ] Pagination flow

- [ ] **Check responsive design**
  - [ ] Mobile view (375px)
  - [ ] Tablet view (768px)
  - [ ] Desktop view (1024px+)

- [ ] **Verify accessibility**
  - [ ] Keyboard navigation works
  - [ ] Screen reader friendly
  - [ ] Color contrast OK (Design System handles this)

- [ ] **Check error states**
  - [ ] Network errors
  - [ ] Validation errors
  - [ ] Permission errors (403)
  - [ ] Not found errors (404)

---

## 🎯 Agent-Specific Rules

### For Architect Agent:
- ✅ Define component structure
- ✅ Specify Design System components to use
- ✅ List all required API endpoints
- ❌ DON'T specify inline styles or custom CSS
- ❌ DON'T create new components without checking existing ones first

### For Dev Agent:
- ✅ **ALWAYS** copy from templates
- ✅ **ALWAYS** use Design System components
- ✅ **ALWAYS** follow naming conventions
- ❌ NEVER build UI from scratch
- ❌ NEVER use inline styles
- ❌ NEVER create new color tokens

### For QA/Review Agent:
- ✅ **CHECK** if Design System components used correctly
- ✅ **VERIFY** all checklist items completed
- ✅ **ENSURE** no anti-patterns present
- ❌ DON'T approve custom UI without justification
- ❌ DON'T approve hardcoded colors/styles

---

## 📚 Reference Documentation

**Essential Reading (MANDATORY):**
1. `_bmad-output/planning-artifacts/getting-started-v1.md` - Component basics
2. `_bmad-output/planning-artifacts/common-patterns-v1.md` - Usage patterns
3. `_bmad-output/planning-artifacts/DESIGN_SYSTEM_COMPLETION_REPORT.md` - What's been built
4. `frontend/src/app/globals.css` - Design tokens reference

**Component Reference:**
- Button: `frontend/src/components/ui/button.tsx`
- Card: `frontend/src/components/ui/card.tsx`
- FormField: `frontend/src/components/ui/form-field.tsx`
- FormLayout: `frontend/src/components/ui/form-layout.tsx`
- DataTable: `frontend/src/components/ui/data-table.tsx`
- Modal: `frontend/src/components/ui/modal.tsx`
- Toast: `frontend/src/components/ui/toast.tsx`

**Example Pages (Study these):**
- User listing: `frontend/src/app/(dashboard)/users/page.tsx`
- Post listing: `frontend/src/app/(dashboard)/posts/page.tsx`
- User profile: `frontend/src/app/user/profile/page.tsx`
- Login: `frontend/src/app/login/page.tsx`

---

## 🔧 Troubleshooting

**Problem:** Can't find component for my use case

**Solution:**
1. Check `frontend/src/components/ui/` - it probably exists
2. Check `common-patterns-v1.md` - pattern might exist
3. Check existing pages - similar feature might exist
4. ASK: Is this really a new use case or just composition of existing components?

**Problem:** Component doesn't accept prop I need

**Solution:**
1. Check component file - look at interface/props
2. Check if there's a different way to achieve same result
3. DON'T modify Design System components without architect approval
4. ASK: Should I extend component or use it differently?

**Problem:** Template doesn't fit my use case

**Solution:**
1. Use closest template as starting point
2. Modify only what's necessary
3. DON'T build from scratch
4. DOCUMENT: Why template didn't fit (for future reference)

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-26 | Initial version - Frontend Development Rules |

---

**Last Review:** 2026-01-26
**Next Review:** When Design System v2 is planned

**Maintainer:** Product Manager (PM Agent)
**Approved By:** THINKLAP (Project Owner)

---

## 🚨 EMERGENCY RULE

**When in doubt:**
1. **STOP** - Don't build anything yet
2. **SEARCH** - Check existing components & patterns
3. **COPY** - Use template or existing code
4. **ASK** - If truly new use case, get approval first

**NEVER build first, ask questions later.**
