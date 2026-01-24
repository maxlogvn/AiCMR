---
project_name: 'AiCMR'
user_name: 'DamodTeam'
date: '2026-01-24'
sections_completed: ['discovery', 'technology_stack', 'language_rules', 'framework_rules', 'design_system', 'authorization', 'anti_patterns', 'naming_conventions']
workflow_type: 'project-context'
status: 'complete'
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Project Overview

**Type:** Brownfield UI/UX Redesign
**Primary Focus:** Frontend design system implementation
**Backend:** NO CHANGES to FastAPI/SQLAlchemy/MySQL

---

## Technology Stack & Versions

### Frontend (Primary Focus)

```
Next.js 16.1.4    | React 19.2.3      | TypeScript 5.9.3
TailwindCSS 4     | Radix UI 1.1.15+  | TanStack Query 5.90.19
Zustand 5.0.10    | Axios 1.13.2      | Zod 4.3.5
Sonner 2.0.7      | React Hook Form 7.71.1
```

### Backend (NO CHANGES)

```
FastAPI 0.115+ | SQLAlchemy 2.0 | MySQL 8.0 | Redis 7
```

### Critical Version Constraints

| Constraint | Details |
|-----------|---------|
| React 19 | New JSX transform - NO `import React from 'react'` needed |
| Next.js 16 | App Router ONLY (not Pages Router) |
| TypeScript 5.9 | `strict: true` enforced - NO `any` without explicit comment |
| TailwindCSS 4 | Uses `@tailwindcss/postcss` (not v3 syntax) |

---

## Language-Specific Rules (TypeScript/React)

### TypeScript Configuration

```json
{
  "strict": true,        // NO any types without explicit comment
  "target": "ES2017",    // Use async/await, not Promise chains
  "jsx": "react-jsx",    // NO React import needed
  "paths": { "@/*": ["./src/*"] }  // Use path aliases
}
```

### Import/Export Patterns

```typescript
// ✅ Good - Use path alias
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

// ❌ Bad - Relative paths
import { Button } from '../../../components/ui'
```

### Error Handling Pattern

```typescript
// ✅ Always wrap API calls with toast notification
try {
  await mutation.mutateAsync(data)
  toast({ title: 'Thành công', description: 'Đã lưu' })
} catch (error) {
  toast({
    title: 'Lỗi',
    description: error.message,
    variant: 'destructive'
  })
}
```

---

## Framework-Specific Rules (Next.js/React)

### Next.js App Router Rules

- **Server Components by default** - ONLY add `'use client'` when necessary
- **Route groups:** `(public)`, `dashboard/`, `user/`
- **NO folders inside groups** without `page.tsx`
- **Layout inheritance:** Root → Group → Page

### React Hooks Rules

```typescript
// ✅ Good - Hooks at top level
'use client'
import { useState, useEffect } from 'react'

function Component() {
  const [state, setState] = useState()
  useEffect(() => { /* ... */ }, [])
  return <div />
}

// ❌ Bad - Hooks in conditions
function Component() {
  if (condition) {
    useEffect(() => { /* ... */ }, []) // NEVER!
  }
}
```

### State Management

```typescript
// Server state → TanStack Query
const { data, isLoading } = useQuery({
  queryKey: ['posts'],
  queryFn: () => api.posts.list()
})

// Client state → Zustand
const { user, setUser } = useAuthStore()

// Form state → React Hook Form + Zod
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema)
})
```

---

## Design System Rules (CRITICAL)

### ZERO MAGIC VALUES (NFR-VIS-001)

```typescript
// ✅ Good - Use design tokens
<div className="p-4 text-gray-900 bg-primary-600 rounded-lg">

// ❌ FORBIDDEN - Magic values
<div className="p-[16px] text-[#111827] bg-[#4F46E5]">
<div style={{ backgroundColor: '#4F46E5' }}>
```

### Design Token Colors

| Category | Token | Value |
|----------|-------|-------|
| Primary | `primary-600` | #4F46E5 |
| Primary | `primary-50` | #EEF2FF |
| Accent | `accent-500` | #14B8A6 |
| Accent | `accent-50` | #F0FDFA |
| Semantic | `success`, `warning`, `error`, `info` | — |

### Spacing Scale (8px base)

| Token | Value |
|-------|-------|
| `0`, `1` | 0px, 4px |
| `2`, `3`, `4` | 8px, 12px, 16px |
| `6` | 24px |

### Component Organization

```
/src/components/
├── ui/              # Base reusable (Button, Input, Badge, Card)
├── layout/          # Layout (Sidebar, TopBar, Container, Breadcrumb)
├── feedback/        # Feedback (Toast, Spinner, Alert)
├── overlays/        # Overlays (Modal, Dialog, Tooltip)
├── data-display/    # Data display (DataTable, StatusBadge, RankBadge)
├── auth/            # Auth guards only
└── {domain}/        # Domain-specific (post/, category/, tag/)
```

### Class Composition Pattern

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-styles',
  variant && variantStyles[variant],
  className
)}>
```

---

## Authorization Rules

### Rank-Based System (0-10)

```
Guest(0) < Member(1-2) < Editor(3-4) < Moderator(5) < Admin(10)
```

### Authorization Pattern

```typescript
// ✅ Good - Component-level check
{userRank >= 5 && <ModeratorOnlyContent />}

// ✅ Good - Route-level guard
<ModeratorGuard>
  <ModeratorOnlyPage />
</ModeratorGuard>

// ❌ FORBIDDEN - Hardcoded rank without guard
if (user.rank >= 5) { /* expose data */ }
```

---

## Radix UI Wrapper Pattern

```typescript
// ✅ Good - Use wrapped components
import { Button } from '@/components/ui/button-wrapped'

// ❌ Bad - Use raw Radix UI (loses design system)
import { Button } from '@radix-ui/react-button'
```

**Wrapper Naming:** `{component}-wrapped.tsx`

---

## Critical Anti-Patterns (FORBIDDEN)

| Anti-Pattern | Why Forbidden |
|--------------|---------------|
| `p-[16px]`, `text-[#4F46E5]` | Magic values violate NFR-VIS-001 |
| `style={{ backgroundColor: '#4F46E5' }}` | Bypasses design tokens |
| Direct Radix imports | Loses design system styles |
| State fetching in useEffect | Use TanStack Query instead |
| Prop drilling for auth | Use Zustand auth store |
| Hardcoded rank checks | Use guard components |
| Forms without Zod | Use React Hook Form + Zod |

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PostCard.tsx`, `CategoryTree.tsx` |
| Utilities | kebab-case | `use-toast.ts`, `api-client.ts` |
| Radix wrappers | `{name}-wrapped.tsx` | `button-wrapped.tsx` |
| Zustand stores | `{domain}-store.ts` | `auth-store.ts` |

---

## Implementation Sequence

1. **Foundation:** Design tokens → TailwindCSS config
2. **Base UI:** Button, Input, Badge, Card
3. **Layout:** Sidebar, TopBar, Container, Breadcrumb
4. **Data/Feedback:** DataTable, Toast, Spinner, Alert
5. **Pages:** Blog (SSR) → Dashboard → User profile

---

## Quality Checklist

Before committing code, verify:

- [ ] No magic values (all colors/spacing use tokens)
- [ ] Components use `cn()` for class composition
- [ ] API calls wrapped with try-catch + toast
- [ ] Server state uses TanStack Query
- [ ] Client state uses Zustand
- [ ] Forms use React Hook Form + Zod
- [ ] Protected routes use guard components
- [ ] Radix components use wrapped versions

---

**Project Context Status:** COMPLETE ✅

**Last Updated:** 2026-01-24
