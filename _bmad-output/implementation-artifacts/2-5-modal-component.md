# Story 2.5: Modal/Dialog Component

Status: ready-for-dev

## Story

**As a** User,
**I want** Modal dialogs for confirmations and forms,
**so that** I can focus on specific actions without leaving the page.

## Acceptance Criteria

1. [ ] Create `Modal` component with backdrop and content
2. [ ] Support open/close state control
3. [ ] Close on backdrop click
4. [ ] Close on Escape key press
5. [ ] Support title and description
6. [ ] Support custom content (forms, confirmations)
7. [ ] Smooth open/close animation (200ms)
8. [ ] Accessible (focus trap, ARIA, keyboard navigation)
9. [ ] Add inline documentation with usage examples

## Tasks / Subtasks

- [ ] **Task 1: Create Modal component structure** (AC: #1, #7)
  - [ ] 1.1 Create `frontend/src/components/ui/modal.tsx`
  - [ ] 1.2 Use shadcn Dialog as base component
  - [ ] 1.3 Add Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter sub-components
  - [ ] 1.4 Add smooth transition animation (200ms)
  - [ ] 1.5 Add TypeScript props interfaces

- [ ] **Task 2: Implement state control** (AC: #2)
  - [ ] 2.1 Support open prop (boolean)
  - [ ] 2.2 Support onOpenChange callback
  - [ ] 2.3 Test modal opens when open=true
  - [ ] 2.4 Test modal closes when open=false

- [ ] **Task 3: Implement backdrop** (AC: #3)
  - [ ] 3.1 Add DialogOverlay for backdrop
  - [ ] 3.2 Style backdrop with semi-transparent black
  - [ ] 3.3 Add backdrop click handler to close modal
  - [ ] 3.4 Test backdrop click closes modal

- [ ] **Task 4: Implement Escape key** (AC: #4)
  - [ ] 4.1 Add Escape key listener
  - [ ] 4.2 Close modal when Escape pressed
  - [ ] 4.3 Verify Escape works even when content focused

- [ ] **Task 5: Implement content sections** (AC: #5, #6)
  - [ ] 5.1 Add DialogHeader for title and description
  - [ ] 5.2 Add DialogTitle component
  - [ ] 5.3 Add DialogDescription component
  - [ ] 5.4 Add DialogContent for body
  - [ ] 5.5 Add DialogFooter for actions
  - [ ] 5.6 Support children for custom content

- [ ] **Task 6: Add accessibility** (AC: #8)
  - [ ] 6.1 Implement focus trap (DialogPortal)
  - [ ] 6.2 Add ARIA attributes (role="dialog", aria-labelledby)
  - [ ] 6.3 Add aria-describedby for description
  - [ ] 6.4 Test keyboard navigation (Tab, Enter, Escape)
  - [ ] 6.5 Test with screen reader

- [ ] **Task 7: Add documentation** (AC: #9)
  - [ ] 7.1 Add file header comment with usage instructions
  - [ ] 7.2 Add controlled modal example
  - [ ] 7.3 Add confirmation modal example
  - [ ] 7.4 Add form modal example
  - [ ] 7.5 Verify Design System principles documented
  - [ ] 7.6 Verify Vietnamese language in comments

- [ ] **Task 8: Testing and validation** (AC: #2, #3, #4, #7)
  - [ ] 8.1 Test modal opens and closes
  - [ ] 8.2 Test backdrop click closes modal
  - [ ] 8.3 Test Escape key closes modal
  - [ ] 8.4 Test animation is smooth (200ms)
  - [ ] 8.5 Test focus trap works

## Dev Notes

### Architecture Alignment

**Design System Principle: Eliminate Choices** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Only 1 modal style (no size variants like sm, md, lg)
- Opinionated animation (200ms)
- Consistent content structure

**Design System Principle: Documentation = Code** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Inline examples in component comments
- Copy-paste ready templates
- No separate modal documentation needed

### Technical Context

**File to Create:** `frontend/src/components/ui/modal.tsx`

**Dependencies:**
- @radix-ui/react-dialog (Radix Dialog primitive)
- Design tokens (spacing, colors, animations)
- Utility function cn for className merging

**Implementation Pattern:**
```tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Modal = DialogPrimitive.Root
const ModalTrigger = DialogPrimitive.Trigger
const ModalPortal = DialogPrimitive.Portal
const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg",
        "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ModalPortal>
))
ModalContent.displayName = DialogPrimitive.Content.displayName

const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
ModalHeader.displayName = "ModalHeader"

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
ModalTitle.displayName = DialogPrimitive.Title.displayName

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ModalDescription.displayName = DialogPrimitive.Description.displayName

const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
ModalFooter.displayName = "ModalFooter"

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
}
```

### Component Structure

**Modal Parts:**
1. **Modal** - Root component (controls open/close state)
2. **ModalTrigger** - Button to open modal
3. **ModalOverlay** - Backdrop (semi-transparent black)
4. **ModalContent** - Modal content wrapper
5. **ModalHeader** - Header section (title + description)
6. **ModalTitle** - Title text
7. **ModalDescription** - Description text
8. **ModalFooter** - Footer section (actions)
9. **Close button** - X icon in top-right

**Props:**
- `open` (boolean) - Controlled open state
- `onOpenChange` (callback) - Called when modal should close
- `defaultOpen` (boolean) - Uncontrolled open state

**Styling:**
- Animation: 200ms duration
- Backdrop: bg-black/50 with backdrop-blur-sm
- Content: max-w-lg (512px), rounded-lg corners
- Shadow: shadow-lg
- Spacing: p-6 (24px padding)

### Usage Examples

**Basic Controlled Modal:**
```tsx
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, Button } from '@/components/ui/modal'
import { useState } from 'react'

export default function BasicModal() {
  const [open, setOpen] = useState(false)

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Are you sure?</ModalTitle>
          <ModalDescription>
            This action cannot be undone.
          </ModalDescription>
        </ModalHeader>

        <ModalFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            // Do something
            setOpen(false)
          }}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

**Modal with Trigger Button:**
```tsx
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, Button } from '@/components/ui/modal'

export default function TriggerModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open Modal</Button>
      </ModalTrigger>

      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalDescription>
            Modal description goes here.
          </ModalDescription>
        </ModalHeader>

        <div className="py-4">
          <p>Modal content goes here.</p>
        </div>

        <ModalFooter>
          <Button variant="secondary">Close</Button>
          <Button>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

**Confirmation Modal:**
```tsx
function DeleteConfirmationModal({ open, onConfirm, onCancel }) {
  return (
    <Modal open={open} onOpenChange={onCancel}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Item</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </ModalDescription>
        </ModalHeader>

        <ModalFooter>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Usage
function MyComponent() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    // Delete logic here
    setShowDeleteModal(false)
  }

  return (
    <>
      <Button onClick={() => setShowDeleteModal(true)}>Delete Item</Button>
      <DeleteConfirmationModal
        open={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  )
}
```

**Form Modal:**
```tsx
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter, Button } from '@/components/ui/modal'
import { FormLayout, FormField } from '@/components/ui/form-layout'
import { useForm } from 'react-hook-form'

function CreateUserModal({ open, onOpenChange, onSubmit }) {
  const { register, handleSubmit } = useForm()

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Create New User</ModalTitle>
          <ModalDescription>
            Fill in the form below to create a new user account.
          </ModalDescription>
        </ModalHeader>

        <FormLayout onSubmit={handleSubmit(onSubmit)} columns={2}>
          <FormField
            label="First Name"
            name="firstName"
            required={true}
            {...register('firstName', { required: 'First name is required' })}
          />

          <FormField
            label="Last Name"
            name="lastName"
            required={true}
            {...register('lastName', { required: 'Last name is required' })}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            required={true}
            {...register('email', { required: 'Email is required' })}
          />

          <FormField
            label="Role"
            name="role"
            placeholder="Select role"
          />

          <ModalFooter className="col-span-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </ModalFooter>
        </FormLayout>
      </ModalContent>
    </Modal>
  )
}
```

### Accessibility Features

**Focus Trap:**
- Tab key stays within modal content
- First element auto-focused on open
- Focus returns to trigger on close

**ARIA Attributes:**
- `role="dialog"` - Identifies as dialog
- `aria-modal="true"` - Modal is active
- `aria-labelledby` - Links to title
- `aria-describedby` - Links to description

**Keyboard Navigation:**
- Escape: Closes modal
- Tab: Navigate within modal
- Enter: Activates default button

**Screen Reader:**
- Announces modal title on open
- Announces modal description
- Announces close action

### Animation Details

**Duration:** 200ms

**Animations:**
- Fade in/out for overlay
- Zoom in/out for content
- Slide in/out for positioning

**Easing:** cubic-bezier(0.4, 0, 0.2, 1)

**States:**
- `data-[state=open]` - Modal is visible
- `data-[state=closed]` - Modal is hidden

### Testing Standards

**Visual Testing:**
- Modal centers on screen
- Backdrop displays correctly
- Content displays with proper spacing
- Close button visible in top-right

**Functional Testing:**
- Modal opens when open=true
- Modal closes when open=false
- Backdrop click closes modal
- Escape key closes modal
- Close button closes modal

**Accessibility Testing:**
- Focus trap works (Tab stays in modal)
- Screen reader announces content
- Keyboard navigation works
- ARIA attributes present

**Cross-Browser Testing:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)
- Touch devices (backdrop touch closes)

### Project Structure Notes

**Alignment:** Modal follows component structure
- Location: `frontend/src/components/ui/modal.tsx`
- Naming: kebab-case
- Exports: Named exports (Modal, ModalTrigger, ModalContent, etc.)

**Integration Points:**
- Used for confirmation dialogs
- Used for forms in modals
- Used for detailed views
- Used for alerts and notifications

**Dependencies:**
- @radix-ui/react-dialog (must install)

**No Conflicts Detected**

### References

- [Architecture: Component Structure](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-3-component-structure)
- [Epic 2: Design System Components](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-2-design-system-components)
- [Story 2.5 in Epics](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#story-25-modaldialog-component)
- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**File Created:** None yet - Status: ready-for-dev

**Next Steps:**
1. Install @radix-ui/react-dialog dependency
2. Create modal.tsx component file
3. Implement all sub-components (Modal, ModalTrigger, ModalContent, etc.)
4. Add smooth animations (200ms fade, zoom, slide)
5. Implement focus trap and ARIA attributes
6. Add inline Vietnamese documentation
7. Test keyboard navigation and screen reader

**Dependencies to Install:**
```bash
npm install @radix-ui/react-dialog
```

### File List

- `frontend/src/components/ui/modal.tsx` (to be created)
