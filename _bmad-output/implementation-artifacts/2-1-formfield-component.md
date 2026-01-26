# Story 2.1: FormField Component

Status: ready-for-dev

## Story

**As a** Developer,
**I want** A FormField component with label, input, and error message,
**so that** I can build forms quickly without thinking about field structure.

## Acceptance Criteria

1. [ ] Create `FormField` component with label + input + error
2. [ ] Support input types: text, email, password, number, textarea
3. [ ] Display error message when validation fails
4. [ ] Use design tokens (spacing, colors, borders)
5. [ ] Implement consistent field spacing (gap-4 = 16px)
6. [ ] Support required field indicator (*)
7. [ ] Add inline documentation with usage examples
8. [ ] Accessible (labels, ARIA, keyboard navigation)

## Tasks / Subtasks

- [ ] **Task 1: Create FormField component structure** (AC: #1, #4, #5)
  - [ ] 1.1 Create `frontend/src/components/ui/form-field.tsx`
  - [ ] 1.2 Define FormField component wrapping input and label
  - [ ] 1.3 Add consistent spacing (gap-4 = 16px between label and input)
  - [ ] 1.4 Add TypeScript props interface
  - [ ] 1.5 Use design tokens for spacing and colors

- [ ] **Task 2: Implement label section** (AC: #6)
  - [ ] 2.1 Add label prop (required)
  - [ ] 2.2 Display label above input
  - [ ] 2.3 Add required indicator (*) when required=true
  - [ ] 2.4 Style label with font-semibold and text-sm

- [ ] **Task 3: Implement input section** (AC: #2)
  - [ ] 3.1 Support text input type (default)
  - [ ] 3.2 Support email input type
  - [ ] 3.3 Support password input type
  - [ ] 3.4 Support number input type
  - [ ] 3.5 Support textarea (multiline)
  - [ ] 3.6 Add textarea support with rows prop

- [ ] **Task 4: Implement error display** (AC: #3)
  - [ ] 4.1 Add error prop (string or undefined)
  - [ ] 4.2 Display error message below input when error exists
  - [ ] 4.3 Style error with text-destructive (red) color
  - [ ] 4.4 Add input border color change on error (border-destructive)

- [ ] **Task 5: Apply styling** (AC: #4)
  - [ ] 5.1 Use border token (border-input)
  - [ ] 5.2 Use background token (bg-background)
  - [ ] 5.3 Use rounded token (rounded-md)
  - [ ] 5.4 Add focus ring (ring-2 ring-ring)
  - [ ] 5.5 Add hover border color (border-primary)

- [ ] **Task 6: Add accessibility** (AC: #8)
  - [ ] 6.1 Link label to input using htmlFOR
  - [ ] 6.2 Add aria-invalid="true" when error exists
  - [ ] 6.3 Add aria-describedby for error message
  - [ ] 6.4 Test with screen reader

- [ ] **Task 7: Add documentation** (AC: #7)
  - [ ] 7.1 Add file header comment with usage instructions
  - [ ] 7.2 Add JSDoc examples for all input types
  - [ ] 7.3 Add error handling examples
  - [ ] 7.4 Add required field examples
  - [ ] 7.5 Verify Design System principles documented
  - [ ] 7.6 Verify Vietnamese language in comments

- [ ] **Task 8: Testing and validation** (AC: #2, #3, #5, #6)
  - [ ] 8.1 Test all input types render correctly
  - [ ] 8.2 Test error message displays
  - [ ] 8.3 Test required indicator displays
  - [ ] 8.4 Test textarea expands correctly
  - [ ] 8.5 Test in light and dark modes

## Dev Notes

### Architecture Alignment

**Design System Principle: Eliminate Choices** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Only 1 form field structure (no variants)
- No size prop (only 1 default size)
- Opinionated spacing (gap-4 between elements)

**Design System Principle: Documentation = Code** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- Inline examples in component comments
- Copy-paste ready templates
- No separate form documentation needed

### Technical Context

**File to Create:** `frontend/src/components/ui/form-field.tsx`

**Dependencies:**
- React (forwardRef, InputHTMLAttributes, TextareaHTMLAttributes)
- Design tokens (spacing, colors, borders)
- Utility function cn for className merging
- Label and textarea from HTML

**Implementation Pattern:**
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  name: string
  placeholder?: string
  type?: "text" | "email" | "password" | "number"
  error?: string
  required?: boolean
  rows?: number // for textarea
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, name, placeholder, type = "text", error, required = false, rows = 3, ...props }, ref) => {
    const InputComponent = type === "textarea" ? "textarea" : "input"

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        {/* Label */}
        <label htmlFor={name} className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>

        {/* Input */}
        <InputComponent
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          rows={type === "textarea" ? rows : undefined}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            type === "textarea" && "h-32 resize-none"
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        />

        {/* Error Message */}
        {error && (
          <p id={`${name}-error`} className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export { FormField }
```

### Component Structure

**FormField Parts:**
1. **Label** - Field label with required indicator
2. **Input** - Text input or textarea
3. **Error** - Error message (conditional)

**Props:**
- `label` (required) - Field label text
- `name` (required) - Input name attribute
- `placeholder` (optional) - Placeholder text
- `type` (optional, default: "text") - Input type: text, email, password, number, textarea
- `error` (optional) - Error message string
- `required` (optional, default: false) - Show required indicator
- `rows` (optional, default: 3) - Textarea rows (only for textarea type)

**Spacing:**
- Gap between elements: gap-4 (16px)
- Input height: h-10 (40px) for text inputs
- Textarea height: h-32 (128px)

**Styling:**
- Border: border-input token → border-destructive on error
- Background: bg-background token
- Rounded: rounded-md
- Focus ring: ring-2 ring-ring → ring-destructive on error

### Usage Examples

**Basic Text Input:**
```tsx
import { FormField } from '@/components/ui/form-field'

<FormField
  label="Email Address"
  name="email"
  type="email"
  placeholder="user@example.com"
  required={true}
/>
```

**Password Input:**
```tsx
<FormField
  label="Password"
  name="password"
  type="password"
  placeholder="Enter your password"
  required={true}
/>
```

**Number Input:**
```tsx
<FormField
  label="Age"
  name="age"
  type="number"
  placeholder="25"
/>
```

**Textarea:**
```tsx
<FormField
  label="Bio"
  name="bio"
  type="textarea"
  placeholder="Tell us about yourself..."
  rows={4}
/>
```

**With Error:**
```tsx
<FormField
  label="Email"
  name="email"
  type="email"
  error="Please enter a valid email address"
  required={true}
/>
```

**Complete Form Example:**
```tsx
import { FormField } from '@/components/ui/form-field'
import { Button } from '@/components/ui/button'

export default function LoginForm() {
  return (
    <form className="flex flex-col gap-6">
      <FormField
        label="Email Address"
        name="email"
        type="email"
        placeholder="user@example.com"
        required={true}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        required={true}
      />

      <Button type="submit">Login</Button>
    </form>
  )
}
```

**With React Hook Form:**
```tsx
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/ui/form-field'

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="user@example.com"
        error={errors.email?.message}
        required={true}
        {...register('email', { required: 'Email is required' })}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        error={errors.password?.message}
        required={true}
        {...register('password', { required: 'Password is required' })}
      />

      <button type="submit">Submit</button>
    </form>
  )
}
```

### Input Types Support

**text** (default):
- Standard text input
- Single line

**email**:
- Email validation by browser
- Shows email keyboard on mobile

**password**:
- Masks input characters
- Shows password toggle on some browsers

**number**:
- Number input with increment/decrement arrows
- Validates numeric input

**textarea**:
- Multiline text input
- Resizable vertically
- Customizable rows (default: 3 rows)

### Accessibility Considerations

**Semantic HTML:**
- `<label>` linked to input via htmlFOR
- `<input>` or `<textarea>` for field
- `<p>` for error message

**ARIA Attributes:**
- `aria-invalid="true"` when error exists
- `aria-describedby` links input to error message
- `required` attribute for required fields

**Keyboard Navigation:**
- Tab: Focus input
- Enter/Space: No special behavior (browser default)
- Arrow keys: Navigate in textarea

**Screen Reader:**
- Label announced when focusing input
- Error announced if present
- Required status announced

### Testing Standards

**Visual Testing:**
- Label displays above input
- Required indicator (*) shows in red
- Error message shows below input in red
- Input border turns red on error
- Spacing consistent (16px gaps)

**Functional Testing:**
- All input types render correctly
- Textarea expands with rows prop
- Error displays when error prop provided
- Required indicator shows when required=true

**Accessibility Testing:**
- Label links to input (click label focuses input)
- Screen reader announces label and error
- ARIA attributes present
- Keyboard navigation works

**Cross-Browser Testing:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)
- Email/number keyboard shows on mobile

### Project Structure Notes

**Alignment:** FormField follows component structure
- Location: `frontend/src/components/ui/form-field.tsx`
- Naming: kebab-case
- Exports: Named export (FormField)

**Integration Points:**
- Used with FormLayout component
- Used with React Hook Form (optional but recommended)
- Used in all form pages (login, register, profile, etc.)

**Dependencies:**
- No other Design System components required
- Can be used standalone or with FormLayout

**No Conflicts Detected**

### References

- [Architecture: Component Structure](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-3-component-structure)
- [Epic 2: Design System Components](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-2-design-system-components)
- [Story 2.1 in Epics](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#story-21-formfield-component)
- [React Hook Form Documentation](https://react-hook-form.com/)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**File Created:** None yet - Status: ready-for-dev

**Next Steps:**
1. Create form-field.tsx component file
2. Implement label, input, error sections
3. Add support for all input types (text, email, password, number, textarea)
4. Add error styling and ARIA attributes
5. Add inline Vietnamese documentation
6. Test with React Hook Form integration

**Dependencies:**
- None (can be implemented independently)

**Integration with FormLayout:**
- FormField can be used standalone
- FormLayout wraps multiple FormFields
- Both components use consistent spacing (gap-4)

### File List

- `frontend/src/components/ui/form-field.tsx` (to be created)
