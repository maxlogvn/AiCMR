# Story 2.7: Card Component

Status: ready-for-dev

## Story

**As a** Developer,
**I want** A Card component for content grouping and information display,
**so that** I can organize information visually.

## Acceptance Criteria

1. [ ] Create `Card` component as content wrapper
2. [ ] Support header (title + description)
3. [ ] Support body content
4. [ ] Support footer (actions)
5. [ ] Use design tokens (border, shadow, spacing)
6. [ ] Support hover effect (subtle elevation)
7. [ ] Add inline documentation with usage examples
8. [ ] Accessible (semantic HTML)

## Tasks / Subtasks

- [ ] **Task 1: Create Card component structure** (AC: #1)
  - [ ] 1.1 Create `frontend/src/components/ui/card.tsx`
  - [ ] 1.2 Define Card, CardHeader, CardBody, CardFooter sub-components
  - [ ] 1.3 Export named exports (Card, CardHeader, CardBody, CardFooter)
  - [ ] 1.4 Add TypeScript props interfaces

- [ ] **Task 2: Implement Card sections** (AC: #2, #3, #4)
  - [ ] 2.1 Implement CardHeader with title and description support
  - [ ] 2.2 Implement CardBody as content wrapper
  - [ ] 2.3 Implement CardFooter for actions
  - [ ] 2.4 Support optional sections (all optional)

- [ ] **Task 3: Apply design tokens** (AC: #5)
  - [ ] 3.1 Use border token (border-border)
  - [ ] 3.2 Use shadow token (shadow-sm)
  - [ ] 3.3 Use spacing tokens (p-6 = 24px)
  - [ ] 3.4 Use background token (bg-card)
  - [ ] 3.5 Use rounded token (rounded-lg)

- [ ] **Task 4: Add hover effect** (AC: #6)
  - [ ] 4.1 Add hover:shadow-md transition
  - [ ] 4.2 Add transition-all class for smooth effect
  - [ ] 4.3 Verify elevation on hover

- [ ] **Task 5: Add accessibility** (AC: #8)
  - [ ] 5.1 Use semantic HTML (article, section, header, footer)
  - [ ] 5.2 Support ARIA labels if needed
  - [ ] 5.3 Test with screen reader

- [ ] **Task 6: Add documentation** (AC: #7)
  - [ ] 6.1 Add file header comment with usage instructions
  - [ ] 6.2 Add JSDoc examples for each sub-component
  - [ ] 6.3 Verify Design System principles documented
  - [ ] 6.4 Verify Vietnamese language in comments

- [ ] **Task 7: Testing and validation** (AC: #1, #2, #3, #4, #6)
  - [ ] 7.1 Test Card with all sections present
  - [ ] 7.2 Test Card with only CardBody
  - [ ] 7.3 Test hover effect works
  - [ ] 7.4 Test in light mode
  - [ ] 7.5 Test in dark mode

## Dev Notes

### Architecture Alignment

**Design System Principle: Eliminate Choices** [Source: _bmad-output/planning-artifacts/architecture.md#2-2-five-core-principles]
- No card variants (no elevation options like outlined, filled, etc.)
- Only 1 card style with consistent spacing
- Opinionated approach

**Component Composition** [Source: _bmad-output/planning-artifacts/architecture.md#2-3-component-structure]
- Compose from smaller components (CardHeader, CardBody, CardFooter)
- Reuse existing design tokens
- Follow accessibility patterns

### Technical Context

**File to Create:** `frontend/src/components/ui/card.tsx`

**Dependencies:**
- Tailwind CSS classes
- Design tokens from globals.css
- No external dependencies needed

**Implementation Pattern:**
```tsx
import * as React from "react"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))

const CardHeader: React.FC<CardHeaderProps> = ({ title, description, className }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
    {title && <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>}
    {description && <p className="text-sm text-muted-foreground">{description}</p>}
  </div>
)

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
)

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn("flex items-center p-6 pt-0", className)}>{children}</div>
)

export { Card, CardHeader, CardBody, CardFooter }
```

### Component Structure

**Card Variants:** None - only 1 style (opinionated)

**Card Sections:**
- `Card` - Main wrapper with border, shadow, background
- `CardHeader` - Optional title + description
- `CardBody` - Content area (no top padding)
- `CardFooter` - Actions area (no top padding)

**Spacing:**
- Card: padding p-6 (24px)
- CardBody, CardFooter: no top padding (pt-0) to align with header

**Styling:**
- Border: border-border token
- Shadow: shadow-sm → shadow-md on hover
- Background: bg-card token
- Radius: rounded-lg

### Usage Examples

**Basic Card:**
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

<Card>
  <CardHeader
    title="Card Title"
    description="Optional description goes here"
  />
  <CardBody>
    <p>Card content goes here.</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Card without Header:**
```tsx
<Card>
  <CardBody>
    <p>Simple card with just content.</p>
  </CardBody>
</Card>
```

**Card for Stats:**
```tsx
<Card>
  <CardBody>
    <div className="text-2xl font-bold">1,234</div>
    <div className="text-sm text-muted-foreground">Total Users</div>
  </CardBody>
</Card>
```

### Accessibility Considerations

**Semantic HTML:**
- Card: `<div>` (or `<article>` if standalone content)
- CardHeader: `<header>`
- CardBody: `<div>` (or section)
- CardFooter: `<footer>`

**ARIA Attributes:**
- Add `role="region"` if Card contains landmark content
- Add `aria-labelledby` if Card has landmark role

**Keyboard Navigation:**
- No special navigation needed (static content)
- Ensure focusable elements in Card are reachable

### Testing Standards

**Visual Testing:**
- Card displays correctly in light mode
- Card displays correctly in dark mode
- Hover effect works (shadow elevation)
- Spacing is consistent (24px padding)

**Functional Testing:**
- All sections render correctly
- Optional sections can be omitted
- Children render correctly in CardBody and CardFooter

**Accessibility Testing:**
- Semantic HTML structure correct
- Screen reader announces content correctly
- Focus order logical (if Card contains focusable elements)

**Cross-Browser Testing:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)

### Project Structure Notes

**Alignment:** Card follows component structure
- Location: `frontend/src/components/ui/card.tsx`
- Naming: kebab-case
- Exports: Named exports (Card, CardHeader, CardBody, CardFooter)

**No Conflicts Detected**

### References

- [Architecture: Component Structure](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#2-3-component-structure)
- [Epic 2: Design System Components](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-2-design-system-components)
- [Story 2.7 in Epics](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#story-27-card-component)
- [shadcn/ui Card Reference](https://ui.shadcn.com/docs/components/card) (for base structure)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**File Created:** None yet - Status: ready-for-dev

**Next Steps:**
1. Create card.tsx component file
2. Implement all 4 sub-components (Card, CardHeader, CardBody, CardFooter)
3. Add inline Vietnamese documentation
4. Test hover effect and dark mode
5. Verify accessibility

**Dependencies:** None (can be implemented independently)

### File List

- `frontend/src/components/ui/card.tsx` (to be created)
