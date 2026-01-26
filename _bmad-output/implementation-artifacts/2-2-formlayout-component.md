# Story 2.2: FormLayout Component

Status: ready-for-dev

## Story

**As a** Developer,
**I want** A FormLayout component to wrap form fields with consistent spacing,
**so that** All forms have uniform spacing and structure.

## Acceptance Criteria

1. [ ] Create `FormLayout` component as form wrapper
2. [ ] Implement consistent spacing between fields (gap-4 = 16px)
3. [ ] Support responsive columns (1, 2, or 3 columns)
4. [ ] Include actions section at bottom (Save/Cancel buttons)
5. [ ] Handle form submission callback
6. [ ] Add inline documentation with usage examples
7. [ ] Work with React Hook Form (optional but recommended)

## Tasks / Subtasks

- [ ] **Task 1: Create FormLayout component** (AC: #1, #2)
  - [ ] 1.1 Create `frontend/src/components/ui/form-layout.tsx`
  - [ ] 1.2 Define FormLayout wrapper component
  - [ ] 1.3 Add consistent spacing between children (gap-4)
  - [ ] 1.4 Add TypeScript props interface

- [ ] **Task 2: Implement columns support** (AC: #3)
  - [ ] 2.1 Add columns prop (1, 2, or 3, default: 1)
  - [ ] 2.2 Implement CSS Grid for multi-column layout
  - [ ] 2.3 Add responsive breakpoint (single column on mobile)
  - [ ] 2.4 Test column behavior

- [ ] **Task 3: Implement actions section** (AC: #4)
  - [ ] 3.1 Add actions prop (React nodes for buttons)
  - [ ] 3.2 Position actions at bottom
  - [ ] 3.3 Right-align action buttons
  - [ ] 3.4 Add spacing between action buttons (gap-2)

- [ ] **Task 4: Implement form submission** (AC: #5)
  - [ ] 4.1 Accept onSubmit callback prop
  - [ ] 4.2 Wrap children in form element
  - [ ] 4.3 Call onSubmit when form submitted
  - [ ] 4.4 Prevent default form behavior

- [ ] **Task 5: Apply styling** (AC: #2)
  - [ ] 5.1 Use gap-4 (16px) between form fields
  - [ ] 5.2 Use gap-2 (8px) between action buttons
  - [ ] 5.3 Add responsive padding if needed
  - [ ] 5.4 Ensure mobile-friendly layout

- [ ] **Task 6: Add React Hook Form support** (AC: #7)
  - [ ] 6.1 Support useForm methods passthrough
  - [ ] 6.2 Add example with useForm
  - [ ] 6.3 Test React Hook Form integration

- [ ] **Task 7: Add documentation** (AC: #6)
  - [ ] 7.1 Add file header comment with usage instructions
  - [ ] 7.2 Add single-column example
  - [ ] 7.3 Add multi-column example
  - [ ] 7.4 Add actions example
  - [ ] 7.5 Add React Hook Form example
  - [ ] 7.6 Verify Design System principles documented
  - [ ] 7.7 Verify Vietnamese language in comments

- [ ] **Task 8: Testing and validation** (AC: #2, #3, #4, #5)
  - [ ] 8.1 Test single column layout
  - [ ] 8.2 Test two-column layout
  - [ ] 8.3 Test three-column layout
  - [ ] 8.4 Test actions display correctly
  - [ ] 8.5 Test form submission works

## Dev Notes

### Architecture Alignment

**Design System Principle: Eliminate Choices** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Only 1 form layout pattern (no variants)
- Opinionated spacing (gap-4 between fields)
- Consistent actions positioning (right-aligned)

**Design System Principle: Optimize for 90%** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Covers 90% of form use cases (single, two, three columns)
- Ignore edge cases (4+ columns rarely needed)

### Technical Context

**File to Create:** `frontend/src/components/ui/form-layout.tsx`

**Dependencies:**
- React (FormEvent, forwardRef)
- FormField component (for examples)
- Button component (for actions)
- Utility function cn for className merging
- Design tokens (spacing)

**Implementation Pattern:**
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface FormLayoutProps extends React.HTMLAttributes<HTMLFormElement> {
  columns?: 1 | 2 | 3
  actions?: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

const FormLayout = React.forwardRef<HTMLFormElement, FormLayoutProps>(
  ({ className, columns = 1, actions, onSubmit, children, ...props }, ref) => {
    const gridClass = {
      1: "grid-cols-1",
      2: "grid grid-cols-1 md:grid-cols-2 gap-4",
      3: "grid grid-cols-1 md:grid-cols-3 gap-4",
    }

    return (
      <form
        ref={ref}
        onSubmit={onSubmit}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        {/* Form Fields */}
        <div className={gridClass[columns]}>
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex justify-end gap-2">
            {actions}
          </div>
        )}
      </form>
    )
  }
)

FormLayout.displayName = "FormLayout"

export { FormLayout }
```

### Component Structure

**FormLayout Sections:**
1. **Form Fields** - Wrapped in grid container
2. **Actions** - Action buttons (optional)

**Props:**
- `columns` (optional, default: 1) - Number of columns: 1, 2, or 3
- `actions` (optional) - Action buttons (React nodes)
- `onSubmit` (optional) - Form submission handler
- All standard form attributes (method, action, etc.)

**Layout Patterns:**

**Single Column (default):**
```
Field 1
Field 2
Field 3
[Actions]
```

**Two Columns:**
```
Field 1  Field 2
Field 3  Field 4
[Actions]
```

**Three Columns:**
```
Field 1  Field 2  Field 3
Field 4  Field 5  Field 6
[Actions]
```

**Spacing:**
- Between fields: gap-4 (16px) in grid
- Between sections: gap-6 (24px)
- Between actions: gap-2 (8px)

**Responsive Behavior:**
- Mobile (< 768px): Always single column
- Tablet+ (≥ 768px): Use specified columns (1, 2, or 3)

### Usage Examples

**Basic Single Column Form:**
```tsx
import { FormLayout } from '@/components/ui/form-layout'
import { FormField } from '@/components/ui/form-field'
import { Button } from '@/components/ui/button'

export default function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted')
  }

  return (
    <FormLayout onSubmit={handleSubmit} columns={1}>
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="user@example.com"
        required={true}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password"
        required={true}
      />

      <Button type="submit">Login</Button>
    </FormLayout>
  )
}
```

**Two Column Form:**
```tsx
<FormLayout columns={2}>
  <FormField
    label="First Name"
    name="firstName"
    placeholder="John"
  />

  <FormField
    label="Last Name"
    name="lastName"
    placeholder="Doe"
  />

  <FormField
    label="Email"
    name="email"
    type="email"
    placeholder="user@example.com"
  />

  <FormField
    label="Phone"
    name="phone"
    type="tel"
    placeholder="+1 234 567 8900"
  />

  <Button type="submit" className="md:col-span-2">
    Submit
  </Button>
</FormLayout>
```

**Form with Multiple Actions:**
```tsx
import { Button } from '@/components/ui/button'

<FormLayout
  onSubmit={handleSubmit}
  actions={
    <>
      <Button type="button" variant="secondary">
        Cancel
      </Button>
      <Button type="submit">Save Changes</Button>
    </>
  }
>
  {/* Form fields */}
</FormLayout>
```

**With React Hook Form:**
```tsx
import { useForm } from 'react-hook-form'
import { FormLayout } from '@/components/ui/form-layout'
import { FormField } from '@/components/ui/form-field'
import { Button } from '@/components/ui/button'

export default function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)} columns={2}>
      <FormField
        label="First Name"
        name="firstName"
        error={errors.firstName?.message}
        required={true}
        {...register('firstName', { required: 'First name is required' })}
      />

      <FormField
        label="Last Name"
        name="lastName"
        error={errors.lastName?.message}
        required={true}
        {...register('lastName', { required: 'Last name is required' })}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        error={errors.email?.message}
        required={true}
        {...register('email', { required: 'Email is required' })}
      />

      <FormField
        label="Phone"
        name="phone"
        type="tel"
        error={errors.phone?.message}
      />

      <FormField
        label="Bio"
        name="bio"
        type="textarea"
        rows={4}
      />

      <Button type="submit" className="md:col-span-2">
        Create User
      </Button>
    </FormLayout>
  )
}
```

**Full Page Example:**
```tsx
export default function CreateUserPage() {
  return (
    <LayoutShell
      title="Create User"
      icon={<UserPlus className="h-8 w-8" />}
      actions={
        <Button type="submit" form="user-form">
          Create User
        </Button>
      }
    >
      <FormLayout
        id="user-form"
        onSubmit={handleSubmit}
        columns={2}
        actions={
          <>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
            <Button type="submit">Save User</Button>
          </>
        }
      >
        {/* All form fields */}
      </FormLayout>
    </LayoutShell>
  )
}
```

### Responsive Behavior

**Mobile (< 768px):**
- All forms are single column
- Full-width inputs
- Actions stack vertically

**Tablet (768px - 1024px):**
- Two-column layout shows 2 columns
- Three-column layout shows 3 columns

**Desktop (> 1024px):**
- All column layouts work as specified

**Spanning Multiple Columns:**
```tsx
// In React Hook Form or manual form:
<div className="md:col-span-2">
  <FormField label="Address" name="address" />
</div>

<div className="md:col-span-3">
  <FormField label="Bio" name="bio" type="textarea" rows={4} />
</div>
```

### Accessibility Considerations

**Semantic HTML:**
- `<form>` element for form wrapper
- Proper form submission handling
- Labels linked to inputs (via FormField)

**ARIA Attributes:**
- Add `aria-label` to form if needed
- Add `aria-describedby` for help text

**Keyboard Navigation:**
- Tab: Navigate between fields
- Enter: Submit form (if button focused)
- Escape: Cancel (if cancel button present)

### Testing Standards

**Visual Testing:**
- Single column layout works
- Two-column layout works
- Three-column layout works
- Actions right-aligned
- Responsive: single column on mobile

**Functional Testing:**
- Form submission works
- Actions render correctly
- Columns render correctly
- Children render in grid

**Integration Testing:**
- Works with FormField components
- Works with React Hook Form
- Works with Button components

**Cross-Browser Testing:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)

### Project Structure Notes

**Alignment:** FormLayout follows component structure
- Location: `frontend/src/components/ui/form-layout.tsx`
- Naming: kebab-case
- Exports: Named export (FormLayout)

**Integration Points:**
- Used with FormField component
- Used with Button component (for actions)
- Used with React Hook Form (optional)

**Dependencies:**
- FormField component (recommended but not required)
- Button component (for actions)

**No Conflicts Detected**

### References

- [Architecture: Component Structure](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-3-component-structure)
- [Epic 2: Design System Components](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-2-design-system-components)
- [Story 2.2 in Epics](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#story-22-formlayout-component)
- [FormField Component](d:/code/AiCMR/frontend/src/components/ui/form-field.tsx)
- [Button Component](d:/code/AiCMR/frontend/src/components/ui/button.tsx)
- [React Hook Form Documentation](https://react-hook-form.com/)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**File Created:** None yet - Status: ready-for-dev

**Next Steps:**
1. Create form-layout.tsx component file
2. Implement single, two, three-column layouts
3. Add actions section with right alignment
4. Add responsive breakpoint (mobile: single column)
5. Add inline Vietnamese documentation
6. Test with FormField and React Hook Form

**Dependencies:**
- FormField component (Story 2.1)
- Button component (already exists)

### File List

- `frontend/src/components/ui/form-layout.tsx` (to be created)
