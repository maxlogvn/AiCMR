# AiCMR Design System - Actionable Blueprint (Implementation Plan)

**Dành cho:** Dev Leads, Tech Architects
**Mục tiêu:** Concrete execution plan - From zero → working design system
**Timeline estimate:** 4-6 weeks (small team 3-5 devs)

---

## 📋 Executive Summary

### What We're Building

**Design System = "Operating System for Frontend Team"**

- **NOT:** Component library chỉ
- **BUT:** Complete development platform (components + patterns + templates + rules)

### Approach

**Emergent Design System:**
1. Build 3-5 **real pages** first
2. Identify **patterns** emerge
3. **Extract** reusable components
4. **Refine** into system

### Success Criteria

- Dev confidence ↑ (team không ngại UI features)
- Development speed ↑ (less time on style decisions)
- Consistency ↑ (all pages look professional)
- Onboarding time ↓ (new dev productive in days)

---

## 🎯 Phase 0: Foundation Setup (Week 1)

### Goal: Theme infrastructure + Team alignment

### Tasks

#### 0.1 Setup Theme Tokens (2 days)

**File:** `frontend/src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light mode */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    --radius: 0.5rem;
  }

  .dark {
    /* Dark mode */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Config:** `frontend/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(142.1 76.2% 36.3%)',
          foreground: 'hsl(355.7 100% 97.3%)',
        },
        warning: {
          DEFAULT: 'hsl(32.6 94.6% 43.1%)',
          foreground: 'hsl(48 96% 89%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

**Deliverable:**
- ✅ Theme tokens defined
- ✅ Dark/Light mode working
- ✅ Tailwind config updated

---

#### 0.2 Setup Theme Provider (1 day)

**File:** `frontend/src/components/theme-provider.tsx`

```tsx
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**File:** `frontend/src/components/theme-toggle.tsx`

```tsx
'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center justify-center rounded-md p-2"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
```

**Integrate:** `frontend/src/app/layout.tsx`

```tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Deliverable:**
- ✅ Theme provider working
- ✅ Toggle button working
- ✅ Dark/Light mode persists

---

#### 0.3 Team Alignment Workshop (1 day)

**Agenda:** 2 hours

**Slide deck:**
1. Why Design System? (Problem: Inconsistent UI, Solution: System)
2. Design System Philosophy (5 principles from `design-system-principles-v1.md`)
3. How We'll Build (Emergent approach: pages → patterns → components)
4. Golden Rules (5 rules to remember)

**Hands-on:**
- Live demo: Theme toggle
- Show template pages
- Q&A

**Deliverable:**
- ✅ Team aligned on philosophy
- ✅ Team understands approach
- ✅ Team knows what to expect

---

#### 0.4 Create Base Components (1 day)

**Priority #1:** Button

**File:** `frontend/src/components/ui/button.tsx`

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Deliverable:**
- ✅ Button component working
- ✅ All variants tested
- ✅ Inline docs added

---

### Phase 0 Deliverables

✅ Theme infrastructure (tokens + provider)
✅ Team aligned
✅ Base component: Button

---

## 🎨 Phase 1: Build Real Pages (Week 2-3)

### Goal: 3-5 real pages → Identify patterns

### Pages to Build

#### 1.1 User Profile Page

**File:** `frontend/src/app/(dashboard)/users/[id]/page.tsx`

**Requirements:**
- Display user info (name, email, rank, created_at)
- Actions: Edit, Delete, Back to list
- Layout: LayoutShell (Sidebar + Topbar + Content)

**Estimate:** 1 day

**After building, identify patterns:**
- Pattern: Detail page layout
- Pattern: Action buttons (Edit, Delete, Back)
- Pattern: Info display (label + value pairs)

---

#### 1.2 Post Listing Page

**File:** `frontend/src/app/(dashboard)/posts/page.tsx`

**Requirements:**
- Table of posts (title, slug, status, author, date)
- Search bar
- Filter by status (published, draft, archived)
- Pagination
- Create button
- Layout: LayoutShell

**Estimate:** 2 days

**After building, identify patterns:**
- Pattern: Listing page layout
- Pattern: Table with actions
- Pattern: Search + Filter + Pagination
- Pattern: "Create New" button placement

---

#### 1.3 Post Edit Page

**File:** `frontend/src/app/(dashboard)/posts/[id]/edit/page.tsx`

**Requirements:**
- Form fields: Title, Slug, Content (rich text), Status, Category, Tags
- Validation: Title required, slug unique
- Actions: Save, Cancel, Delete
- Layout: LayoutShell

**Estimate:** 2 days

**After building, identify patterns:**
- Pattern: Edit page layout
- Pattern: Form layout (label + field + error)
- Pattern: Form validation
- Pattern: Action buttons (Save, Cancel)

---

#### 1.4 Category Management Page

**File:** `frontend/src/app/(dashboard)/categories/page.tsx`

**Requirements:**
- Table of categories
- Create/Edit/Delete actions
- Modal for create/edit
- Layout: LayoutShell

**Estimate:** 1 day

**After building, identify patterns:**
- Pattern: Modal usage
- Pattern: CRUD operations
- Pattern: Simple form in modal

---

#### 1.5 Settings Page

**File:** `frontend/src/app/(dashboard)/settings/page.tsx`

**Requirements:**
- Tabs: General, Security, Notifications
- Form fields in each tab
- Save button per tab
- Layout: LayoutShell

**Estimate:** 1 day

**After building, identify patterns:**
- Pattern: Tab navigation
- Pattern: Sectioned forms
- Pattern: Settings layout

---

### Phase 1 Deliverables

✅ 5 real pages working
✅ Patterns identified (documented)
✅ Team familiar with building pages

---

## 🔧 Phase 2: Extract Components (Week 3-4)

### Goal: Extract patterns → Reusable components

### Components to Extract

#### 2.1 FormField Component

**From:** Post Edit Page, Settings Page

**Pattern identified:**
- Label + Input + Error message
- Consistent spacing
- Validation state

**Extract to:** `frontend/src/components/ui/form-field.tsx`

```tsx
import * as React from 'react'

export interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'textarea'
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
```

**Estimate:** 1 day

**Deliverable:**
- ✅ FormField component extracted
- ✅ Tested in existing pages
- ✅ Inline docs added

---

#### 2.2 FormLayout Component

**From:** Post Edit Page, Settings Page

**Pattern identified:**
- Consistent spacing between fields
- Section grouping
- Action buttons placement

**Extract to:** `frontend/src/components/ui/form-layout.tsx`

```tsx
import * as React from 'react'

export interface FormLayoutProps {
  children: React.ReactNode
  actions?: React.ReactNode
}

export function FormLayout({ children, actions }: FormLayoutProps) {
  return (
    <form className="space-y-6">
      <div className="space-y-4">{children}</div>

      {actions && (
        <div className="flex gap-4 pt-4">{actions}</div>
      )}
    </form>
  )
}
```

**Estimate:** 0.5 day

**Deliverable:**
- ✅ FormLayout component extracted
- ✅ Tested in existing pages

---

#### 2.3 DataTable Component

**From:** Post Listing Page, User Listing Page

**Pattern identified:**
- Table with sortable headers
- Pagination controls
- Row actions (Edit, Delete)
- Empty state

**Extract to:** `frontend/src/components/ui/data-table.tsx`

```tsx
import * as React from 'react'

export interface Column<T> {
  key: keyof T | 'actions'
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pagination?: boolean
  pageSize?: number
}

export function DataTable<T>({
  data,
  columns,
  pagination = false,
  pageSize = 10,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')
  const [page, setPage] = React.useState(1)

  // Sort logic
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }, [data, sortColumn, sortDirection])

  // Pagination logic
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData

    const start = (page - 1) * pageSize
    const end = start + pageSize
    return sortedData.slice(start, end)
  }, [sortedData, page, pagination, pageSize])

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-sm font-medium"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => {
                        if (sortColumn === col.key) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                        } else {
                          setSortColumn(col.key as keyof T)
                          setSortDirection('asc')
                        }
                      }}
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      {col.label}
                      {sortColumn === col.key && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="border-b border-border">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-sm">
                    {col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No data found
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && sortedData.length > pageSize && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, sortedData.length)} of {sortedData.length}
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPage(p => p + 1)}
              disabled={page * pageSize >= sortedData.length}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
```

**Estimate:** 2 days

**Deliverable:**
- ✅ DataTable component extracted
- ✅ Sort, pagination working
- ✅ Tested in existing pages

---

#### 2.4 LayoutShell Component

**From:** All pages

**Pattern identified:**
- Sidebar navigation
- Top bar (breadcrumb + theme toggle + user menu)
- Content container
- Consistent layout structure

**Extract to:** `frontend/src/components/ui/layout-shell.tsx`

```tsx
import * as React from 'react'
import { ThemeToggle } from './theme-toggle'

export interface LayoutShellProps {
  children: React.ReactNode
  title?: string
  actions?: React.ReactNode
  backUrl?: string
}

export function LayoutShell({
  children,
  title,
  actions,
  backUrl,
}: LayoutShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-border p-4">
            <h1 className="text-xl font-bold">AiCMR</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <a href="/dashboard" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
              Dashboard
            </a>
            <a href="/posts" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
              Posts
            </a>
            <a href="/categories" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
              Categories
            </a>
            <a href="/users" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
              Users
            </a>
            <a href="/settings" className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
              Settings
            </a>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {backUrl && (
                <a href={backUrl} className="text-sm text-muted-foreground hover:text-foreground">
                  ← Back
                </a>
              )}
              {title && (
                <h2 className="text-lg font-semibold">{title}</h2>
              )}
            </div>

            <div className="flex items-center gap-4">
              {actions}
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

**Estimate:** 1 day

**Deliverable:**
- ✅ LayoutShell component extracted
- ✅ Responsive layout working
- ✅ Sidebar, topbar working

---

#### 2.5 Modal Component

**From:** Category Management Page

**Pattern identified:**
- Overlay backdrop
- Centered content
- Close button
- Actions (Save, Cancel)

**Extract to:** `frontend/src/components/ui/modal.tsx`

```tsx
'use client'

import * as React from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="mt-6 flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Estimate:** 1 day

**Deliverable:**
- ✅ Modal component extracted
- ✅ Tested in existing pages

---

### Phase 2 Deliverables

✅ 5 core components extracted:
- FormField
- FormLayout
- DataTable
- LayoutShell
- Modal

✅ All components tested in existing pages
✅ Inline docs added

---

## 📚 Phase 3: Documentation as Templates (Week 4-5)

### Goal: Create template pages + Getting Started guide

### Templates to Create

#### 3.1 Listing Page Template

**File:** `frontend/src/app/(dashboard)/_templates/listing-page.tsx`

**Content:** Complete example with:
- LayoutShell
- Search bar
- DataTable
- Pagination
- Create button

**Estimate:** 1 day

---

#### 3.2 Detail Page Template

**File:** `frontend/src/app/(dashboard)/_templates/detail-page.tsx`

**Content:** Complete example with:
- LayoutShell
- Info display (label + value)
- Action buttons (Edit, Delete, Back)

**Estimate:** 0.5 day

---

#### 3.3 Edit Page Template

**File:** `frontend/src/app/(dashboard)/_templates/edit-page.tsx`

**Content:** Complete example with:
- LayoutShell
- FormLayout
- FormField components
- Validation
- Action buttons (Save, Cancel)

**Estimate:** 0.5 day

---

#### 3.4 Getting Started Guide

**File:** `docs/getting-started.md` (Already created in Phase 0)

**Content:**
- Quick start (3 steps)
- Components catalog
- Common patterns
- Cheatsheet
- Debugging guide

**Estimate:** 1 day

---

### Phase 3 Deliverables

✅ 3 page templates created
✅ Getting Started guide complete
✅ Team can onboard new devs

---

## 🚀 Phase 4: Team Rollout & Iteration (Week 5-6)

### Goal: Team adoption + Feedback collection

### Tasks

#### 4.1 Team Workshop (1 day)

**Agenda:**
- Demo: All 5 components
- Demo: Template pages
- Hands-on: Build new page together
- Q&A

**Deliverable:**
- ✅ Team trained
- ✅ Team excited

---

#### 4.2 Gradual Rollout (1 week)

**Week 1:**
- 1 dev uses new components on 1 feature
- Collect feedback
- Fix bugs

**Week 2:**
- 2 devs use new components on 2 features
- Collect feedback
- Refine components

**Week 3:**
- All devs use new components
- All new features use design system

**Deliverable:**
- ✅ Team fully adopted
- ✅ All new features consistent

---

#### 4.3 Iterate on Feedback (Ongoing)

**Common issues to expect:**
- Component missing X feature → Add it
- Component too rigid → Make more flexible
- Documentation unclear → Update docs
- Performance issues → Optimize

**Process:**
1. Collect feedback in team chat
2. Prioritize: Impact vs. Effort
3. Implement high-impact changes
4. Release updates
5. Repeat

**Deliverable:**
- ✅ Design system improving
- ✅ Team happy

---

## 📊 Success Metrics (KPIs)

### Metric 1: Development Speed

**Measure:** Time to build new listing page

**Before:**
- 2 days (inconsistent, lots of decisions)

**After:**
- 0.5 day (copy template, modify)

**Improvement:** 75% faster

---

### Metric 2: Dev Confidence

**Measure:** "Would you volunteer for UI feature?"

**Before:**
- 1/5 devs volunteer

**After:**
- 4/5 devs volunteer

**Improvement:** 300% increase

---

### Metric 3: Consistency Score

**Measure:** Visual consistency audit (random 10 pages)

**Before:**
- 3/10 consistent (30%)

**After:**
- 9/10 consistent (90%)

**Improvement:** 200% increase

---

### Metric 4: Onboarding Time

**Measure:** New dev builds first feature alone

**Before:**
- 2 weeks

**After:**
- 3 days

**Improvement:** 70% faster

---

## 🎯 Phase Completion Criteria

### Phase 0 Complete When:
- ✅ Theme tokens defined
- ✅ Theme provider working
- ✅ Team aligned
- ✅ Button component working

### Phase 1 Complete When:
- ✅ 5 real pages working
- ✅ Patterns documented
- ✅ No blockers identified

### Phase 2 Complete When:
- ✅ 5 core components extracted
- ✅ All components tested
- ✅ Inline docs added

### Phase 3 Complete When:
- ✅ 3 templates created
- ✅ Getting Started complete
- ✅ Team can onboard new devs

### Phase 4 Complete When:
- ✅ Team fully adopted
- ✅ All new features use system
- ✅ Feedback loop active

---

## 📝 Implementation Notes

### Tech Stack Decisions

**Why shadcn base?**
- Accessibility built-in
- Proven patterns
- Copy-paste approach (owned by team)

**Why custom styling?**
- Complete visual control
- Consistency priority
- Hardcoded styles problematic in shadcn

**Why Tailwind CSS?**
- Already using in project
- Great with CSS variables
- Easy theme switching

---

### Risk Mitigation

**Risk 1: Team overwhelmed by complexity**

**Mitigation:**
- Simplify thinking layer (not technical)
- Plain language documentation
- Only 10-15 components
- 3-5 golden rules (easy to remember)

---

**Risk 2: Components not flexible enough**

**Mitigation:**
- Build pages first → Know actual needs
- Component extraction based on real usage
- Handle edge cases when they occur
- Don't over-engineer upfront

---

**Risk 3: Documentation outdated**

**Mitigation:**
- Documentation = Code (template pages)
- Inline comments at component definition
- Single source of truth
- No separate docs to maintain

---

**Risk 4: Team resistance to change**

**Mitigation:**
- Gradual rollout (not big bang)
- Early wins (show value quickly)
- Team feedback loop
- Address concerns promptly

---

## 🔄 Next Steps After v1

### v1 (Current): Foundation
- 5 core components
- 3 page templates
- Getting Started guide
- Theme system

### v2 (Future): Enhanced
- Animation guidelines
- Responsive patterns
- Accessibility improvements
- Advanced components (when needed)

### v3 (Future): Complete
- Component storybook
- Advanced documentation
- Design tokens tool
- Figma integration

---

## 📞 Support

**Questions?**
- Ask in team chat
- Check `getting-started.md`
- Check `design-system-principles-v1.md`

**Feedback?**
- What works?
- What doesn't?
- What's missing?

**Design system = Living system** - Always evolving!

---

**Document version:** 1.0
**Last updated:** 2026-01-26
**Maintained by:** Frontend Team AiCMR

---

**Ready to build? Let's go! 🚀**
