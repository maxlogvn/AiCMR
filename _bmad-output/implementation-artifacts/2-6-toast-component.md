# Story 2.6: Alert/Toast Component

Status: ready-for-dev

## Story

**As a** User,
**I want** Toast notifications for success, error, and warning messages,
**so that** I know when actions succeed or fail.

## Acceptance Criteria

1. [ ] Create `Toast` component for notifications
2. [ ] Support 3 variants: success, error, warning
3. [ ] Auto-dismiss after 5 seconds (optional)
4. [ ] Dismiss on click
5. [ ] Display in corner of screen (top-right or bottom-right)
6. [ ] Support multiple toasts (stack vertically)
7. [ ] Smooth enter/exit animation
8. [ ] Accessible (ARIA live regions)
9. [ ] Add inline documentation with usage examples

## Tasks / Subtasks

- [ ] **Task 1: Create Toast component** (AC: #1, #2, #3)
  - [ ] 1.1 Create `frontend/src/components/ui/toast.tsx`
  - [ ] 1.2 Use Sonner or react-hot-toast for toast management
  - [ ] 1.3 Implement 3 variants (success, error, warning)
  - [ ] 1.4 Add auto-dismiss functionality (5 seconds)
  - [ ] 1.5 Add TypeScript types

- [ ] **Task 2: Implement positioning** (AC: #5)
  - [ ] 2.1 Position toasts in corner (default: bottom-right)
  - [ ] 2.2 Add Toaster component to render toasts
  - [ ] 2.3 Add z-index to ensure toasts display on top
  - [ ] 2.4 Test positioning on different screen sizes

- [ ] **Task 3: Implement stacking** (AC: #6)
  - [ ] 3.1 Support multiple toasts simultaneously
  - [ ] 3.2 Stack toasts vertically
  - [ ] 3.3 Add spacing between toasts
  - [ ] 3.4 Test with 3+ toasts at once

- [ ] **Task 4: Add animations** (AC: #7)
  - [ ] 4.1 Add enter animation (slide in + fade)
  - [ ] 4.2 Add exit animation (slide out + fade)
  - [ ] 4.3 Ensure smooth transitions (200ms)
  - [ ] 4.4 Test animations are smooth

- [ ] **Task 5: Add interactivity** (AC: #4)
  - [ ] 5.1 Add click handler to dismiss toast
  - [ ] 5.2 Add hover effect (pause auto-dismiss)
  - [ ] 5.3 Add close button (optional)
  - [ ] 5.4 Test click dismiss works

- [ ] **Task 6: Add accessibility** (AC: #8)
  - [ ] 6.1 Add role="alert" or role="status"
  - [ ] 6.2 Add aria-live region for screen readers
  - [ ] 6.3 Add aria-describedby for content
  - [ ] 6.4 Test with screen reader

- [ ] **Task 7: Add documentation** (AC: #9)
  - [ ] 7.1 Add file header comment with usage instructions
  - [ ] 7.2 Add success toast example
  - [ ] 7.3 Add error toast example
  - [ ] 7.4 Add warning toast example
  - [ ] 7.5 Add programmatic usage example
  - [ ] 7.6 Verify Design System principles documented
  - [ ] 7.7 Verify Vietnamese language in comments

- [ ] **Task 8: Testing and validation** (AC: #2, #3, #6, #7)
  - [ ] 8.1 Test all 3 variants render correctly
  - [ ] 8.2 Test auto-dismiss works (5 seconds)
  - [ ] 8.3 Test click dismiss works
  - [ ] 8.4 Test multiple toasts stack correctly
  - [ ] 8.5 Test animations are smooth

## Dev Notes

### Architecture Alignment

**Design System Principle: Eliminate Choices** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Only 3 toast variants (no info, neutral, etc.)
- Default position: bottom-right (no position prop)
- Opinionated auto-dismiss (5 seconds)

**Design System Principle: Optimize for 90%** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Covers 90% of notification use cases (success, error, warning)
- Ignore edge cases (custom positions, custom durations)

### Technical Context

**File to Create:** `frontend/src/components/ui/toast.tsx`

**Dependencies:**
- sonner (recommended) or react-hot-toast
- Design tokens (colors, spacing)
- Lucide React icons (Check, X, AlertCircle, etc.)

**Installation (Sonner):**
```bash
npm install sonner
```

**Installation (react-hot-toast):**
```bash
npm install react-hot-toast
```

**Implementation Pattern (Sonner):**
```tsx
import { toast } from 'sonner'
import { Toaster } from 'sonner'

// In layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          closeButton
        />
      </body>
    </html>
  )
}

// Usage in component
function MyComponent() {
  const handleClick = () => {
    toast.success('Operation completed successfully!')
    toast.error('Something went wrong!')
    toast.warning('Please check your input')
  }

  return <button onClick={handleClick}>Show Toast</button>
}
```

**Implementation Pattern (react-hot-toast):**
```tsx
import toast, { Toaster } from 'react-hot-toast'
import 'react-hot-toast/dist/toast.css'

// In layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}

// Usage
function MyComponent() {
  const handleClick = () => {
    toast.success('Operation completed!')
    toast.error('Something went wrong!')
    toast('Warning message')
  }

  return <button onClick={handleClick}>Show Toast</button>
}
```

### Component Configuration

**Sonner Configuration (Recommended):**
```tsx
<Toaster
  position="bottom-right"
  expand={false}
  richColors
  closeButton
  duration={5000}
  toastOptions={{
    className: 'text-sm',
  }}
/>
```

**react-hot-toast Configuration:**
```tsx
<Toaster
  position="bottom-right"
  toastOptions={{
    duration: 5000,
    style: {
      background: 'var(--background)',
      color: 'var(--foreground)',
    },
  }}
/>
```

### Usage Examples

**Basic Success Toast:**
```tsx
import { toast } from 'sonner'

function MyComponent() {
  const handleSuccess = () => {
    toast.success('User created successfully!')
  }

  return <Button onClick={handleSuccess}>Create User</Button>
}
```

**Error Toast:**
```tsx
function MyComponent() {
  const handleError = () => {
    toast.error('Failed to create user. Please try again.')
  }

  return <Button onClick={handleError}>Create User</Button>
}
```

**Warning Toast:**
```tsx
function MyComponent() {
  const handleWarning = () => {
    toast.warning('Please fill in all required fields.')
  }

  return <Button onClick={handleWarning}>Submit</Button>
}
```

**Toast with Action:**
```tsx
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

function MyComponent() {
  const handleWithAction = () => {
    toast('User created successfully', {
      action: {
        label: 'View',
        onClick: () => {
          // Navigate to user profile
          console.log('View user')
        },
      },
    })
  }

  return <Button onClick={handleWithAction}>Create User</Button>
}
```

**Promise Toast:**
```tsx
import { toast } from 'sonner'

function MyComponent() {
  const handleAsync = async () => {
    toast.promise(
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name: 'John' }),
      }),
      {
        loading: 'Creating user...',
        success: 'User created successfully!',
        error: 'Failed to create user',
      }
    )
  }

  return <Button onClick={handleAsync}>Create User</Button>
}
```

**Custom Icon Toast:**
```tsx
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

function MyComponent() {
  const handleCustom = () => {
    toast.success('User created!', {
      icon: <CheckCircle className="h-5 w-5" />,
    })
  }

  return <Button onClick={handleCustom}>Create User</Button>
}
```

**Form Validation Toasts:**
```tsx
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function UserForm() {
  const { handleSubmit, register } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      toast.success('User created successfully!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Toast Variants

**Success (Green):**
- Icon: CheckCircle or Check
- Color: green-500 (background), white (text)
- Use for: Successful operations, confirmations

**Error (Red):**
- Icon: XCircle or X
- Color: red-500 (background), white (text)
- Use for: Errors, failures, validation issues

**Warning (Yellow):**
- Icon: AlertCircle or AlertTriangle
- Color: yellow-500 (background), black (text)
- Use for: Warnings, pending actions,需要注意的事项

### Positioning Options

**Sonner Positions:**
- `top-left`
- `top-right`
- `bottom-left`
- `bottom-right` (recommended)
- `top-center`
- `bottom-center`

**react-hot-toast Positions:**
- `top-left`
- `top-right`
- `top-center`
- `bottom-left`
- `bottom-right`
- `bottom-center` (recommended)

### Accessibility Features

**ARIA Live Regions:**
- `role="status"` for success toasts
- `role="alert"` for error toasts
- `aria-live="polite"` for non-critical toasts
- `aria-live="assertive"` for critical toasts

**Screen Reader:**
- Toast content announced automatically
- Role (status/alert) announced
- Dismiss action announced if button present

**Keyboard:**
- Tab: Focus close button (if present)
- Enter/Space: Dismiss toast (if focused)

**Dismissal:**
- Click: Dismiss toast
- Escape: Dismiss all toasts (if configured)
- Auto-dismiss: 5 seconds (default)

### Animation Details

**Duration:** 5000ms (5 seconds)

**Animations (Sonner):**
- Enter: Slide up + fade in
- Exit: Slide down + fade out
- Smooth transition: 200ms

**Animations (react-hot-toast):**
- Enter: Slide in from side
- Exit: Slide out to side
- Smooth transition: Configurable

### Testing Standards

**Visual Testing:**
- Success toasts display with green styling
- Error toasts display with red styling
- Warning toasts display with yellow styling
- Icons display correctly
- Close button visible

**Functional Testing:**
- Toast appears when triggered
- Toast auto-dismisses after 5 seconds
- Click toast dismisses it
- Multiple toasts stack vertically
- Close button dismisses toast

**Accessibility Testing:**
- Screen reader announces toast content
- ARIA live region works
- Keyboard can dismiss toasts
- Focus trap not needed (toasts are temporary)

**Cross-Browser Testing:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)

### Project Structure Notes

**Alignment:** Toast follows component structure
- Location: `frontend/src/components/ui/toast.tsx`
- Naming: kebab-case
- Exports: Toaster component, toast function

**Integration Points:**
- Toaster in root layout (layout.tsx)
- toast() function called throughout app
- Used in forms, API calls, mutations

**Dependencies:**
- sonner (recommended) or react-hot-toast

**Installation Required:**
```bash
npm install sonner
```

### References

- [Architecture: Component Structure](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-3-component-structure)
- [Epic 2: Design System Components](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-2-design-system-components)
- [Story 2.6 in Epics](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#story-26-alerttoast-component)
- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [react-hot-toast Documentation](https://react-hot-toast.com/)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**File Created:** None yet - Status: ready-for-dev

**Next Steps:**
1. Install sonner dependency (recommended)
2. Create toast.tsx wrapper component (optional)
3. Add Toaster to root layout.tsx
4. Configure toast position (bottom-right)
5. Test all 3 variants (success, error, warning)
6. Test auto-dismiss and click-dismiss
7. Add inline Vietnamese documentation

**Dependencies to Install:**
```bash
npm install sonner
```

**Alternative:**
```bash
npm install react-hot-toast
```

### File List

- `frontend/src/components/ui/toast.tsx` (optional - can use sonner directly)
- `frontend/src/app/layout.tsx` (add Toaster component)

