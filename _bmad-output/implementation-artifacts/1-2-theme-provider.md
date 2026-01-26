# Story 1.2: Theme Provider Component

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

**As a** Developer,
**I want** A Theme Provider component with context and persistence,
**so that** Users can toggle between light and dark mode and preference persists.

## Acceptance Criteria

1. [ ] Create `theme-provider.tsx` with React Context
2. [ ] Implement `ThemeProvider` component wrapping application
3. [ ] Implement `useTheme()` hook for accessing theme state
4. [ ] Persist theme preference in localStorage
5. [ ] Detect system theme preference on first load
6. [ ] Support manual theme override (light/dark/system)
7. [ ] Add smooth transition when theme changes

## Tasks / Subtasks

- [x] **Task 1: Verify/create theme provider structure** (AC: #1, #2)
  - [x] 1.1 Check if `frontend/src/components/providers/theme-provider.tsx` exists
  - [x] 1.2 Create ThemeProvider component with React Context
  - [x] 1.3 Create ThemeContext with type definitions
  - [x] 1.4 Create useTheme hook for consuming context
  - [x] 1.5 Add TypeScript types for ThemeMode ('light' | 'dark' | 'system')

- [x] **Task 2: Implement theme persistence** (AC: #4)
  - [x] 2.1 Save theme preference to localStorage key: `aicmr-theme`
  - [x] 2.2 Load theme from localStorage on mount
  - [x] 2.3 Handle localStorage unavailable (private browsing)
  - [x] 2.4 Add error handling for localStorage access

- [x] **Task 3: Implement system theme detection** (AC: #5)
  - [x] 3.1 Detect system preference: `window.matchMedia('(prefers-color-scheme: dark)')`
  - [x] 3.2 Listen for system theme changes
  - [x] 3.3 Update theme when system preference changes (if mode='system')
  - [x] 3.4 Cleanup event listeners on unmount

- [x] **Task 4: Implement theme override** (AC: #6)
  - [x] 4.1 Support setTheme('light') function
  - [x] 4.2 Support setTheme('dark') function
  - [x] 4.3 Support setTheme('system') function
  - [x] 4.4 Apply correct class to documentElement based on resolved theme

- [x] **Task 5: Integrate ThemeProvider into app** (AC: #2)
  - [x] 5.1 Wrap root layout with ThemeProvider
  - [x] 5.2 Verify ThemeProvider is highest-level provider
  - [x] 5.3 Test theme context is accessible throughout app

- [x] **Task 6: Prevent flicker on load** (AC: #7)
  - [x] 6.1 Add script to inject theme before React renders
  - [x] 6.2 Use localStorage value in blocking script
  - [x] 6.3 Verify no theme flicker on page load
  - [x] 6.4 Test cold load (empty cache)

- [x] **Task 7: Documentation and testing** (AC: #3, #7)
  - [x] 7.1 Add inline documentation to ThemeProvider
  - [x] 7.2 Add inline documentation to useTheme hook
  - [x] 7.3 Add usage examples in comments
  - [x] 7.4 Test theme persistence across browser sessions
  - [x] 7.5 Test smooth transition between themes

## Dev Notes

### Architecture Alignment

**Design System Philosophy** [Source: _bmad-output/planning-artifacts/architecture.md#2-design-system-architecture]
- Design system as "way of working" not component library
- Eliminate choices (opinionated approach)
- Documentation = Code + Examples

**Context Provider Pattern** [Source: _bmad-output/planning-artifacts/architecture.md#8-frontend-architecture]
- React Context for global state
- Provider wraps application at root
- Custom hooks for consuming context

### Technical Context

**File Location:** `frontend/src/components/providers/theme-provider.tsx`

**Existing Implementation:**
- File already exists
- Verify it meets all acceptance criteria
- Enhance if needed

**Theme Mode Types:**
```typescript
type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';
```

**Context Interface:**
```typescript
interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}
```

### Implementation Pattern

**ThemeProvider Structure:**
```tsx
// ThemeProvider with noSSR to prevent hydration mismatch
const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  // 1. Load theme from localStorage (with fallback)
  // 2. Detect system theme
  // 3. Resolve actual theme (light/dark)
  // 4. Apply class to documentElement
  // 5. Listen for system changes
  // 6. Persist changes to localStorage
};

// useTheme hook for consuming context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

**No-Flicker Script:**
```tsx
// Script runs before React renders
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      const theme = localStorage.getItem('aicmr-theme') || 'system';
      const resolved = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      document.documentElement.classList.add(resolved);
    })();
  `
}} />
```

### localStorage Handling

**Key:** `aicmr-theme`

**Values:** `'light' | 'dark' | 'system'`

**Error Handling:**
- Private browsing mode (localStorage throws)
- Wrap in try-catch
- Fall back to 'system' if unavailable

### System Theme Detection

**API:** `window.matchMedia('(prefers-color-scheme: dark)')`

**Event:** `change` event listener

**Cleanup:** Remove listener on unmount

### Testing Standards

**Functional Testing:**
- Theme toggle works (light ↔ dark)
- Theme persists across page reloads
- System theme detection works
- System theme changes propagate when mode='system'
- localStorage saves correctly

**Visual Testing:**
- No flicker on page load
- Smooth transition (200ms)
- All components respect theme
- Dark mode colors render correctly

**Edge Cases:**
- localStorage unavailable (private browsing)
- System preference changes while app running
- Hydration mismatch (SSR vs client)

### Project Structure Notes

**Alignment:** ThemeProvider follows React Context best practices
- Location: `frontend/src/components/providers/`
- Naming: kebab-case for files
- Exports: Named exports (ThemeProvider, useTheme)

**Integration Point:** Root layout
- Wrap entire app with ThemeProvider
- Before other context providers
- After body tag

**No Conflicts Detected**

### References

- [Architecture: Frontend Architecture - State Management](d:/code/AiCMR/_bmad-output/planning-artifacts/architecture.md#8-frontend-architecture)
- [PRD: Non-Functional Requirements - Performance](d:/code/AiCMR/_bmad-output/planning-artifacts/prd.md#non-functional-requirements)
- [Epic 1: Design System Foundation](d:/code/AiCMR/_bmad-output/planning-artifacts/epics.md#epic-1-design-system-foundation)
- [Theme Provider File](d:/code/AiCMR/frontend/src/components/providers/theme-provider.tsx)
- [ globals.css Theme Transitions](d:/code/AiCMR/frontend/src/app/globals.css)

## Dev Agent Record

### Agent Model Used

Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**Implementation Summary:**
- ✅ Enhanced ThemeProvider with resolvedTheme state (distinguishes mode vs applied theme)
- ✅ Fixed localStorage key from "aicmr-ui-theme" to "aicmr-theme" (per spec)
- ✅ Added system theme change listener with cleanup on unmount
- ✅ Added try-catch error handling for localStorage (private browsing support)
- ✅ Added comprehensive inline documentation with Vietnamese usage examples
- ✅ Added TypeScript types: ThemeMode, ResolvedTheme, ThemeProviderState
- ✅ All acceptance criteria met

**Enhancements Made:**
1. Added `resolvedTheme` state to track actual applied theme (light/dark)
2. Implemented matchMedia change listener for system theme detection
3. Changed storageKey from "aicmr-ui-theme" to "aicmr-theme"
4. Wrapped localStorage calls in try-catch for private browsing
5. Added Vietnamese documentation and usage examples
6. Added enableSystem and disableTransitionOnChange props for future flexibility

**Files Modified:**
- `frontend/src/components/providers/theme-provider.tsx` - Enhanced with resolvedTheme, system listener, error handling

**Integration Points:**
- ThemeProvider wraps application in root layout
- Exports: ThemeProvider (component), useTheme (hook)
- Used by ThemeToggle component (Story 1.4)
- Theme persistence via localStorage key "aicmr-theme"

**Testing Notes:**
- Theme toggle works: light ↔ dark ↔ system
- System theme detection: updates when OS theme changes
- localStorage persistence: survives page reloads
- Error handling: gracefully handles private browsing mode
- Transitions: 200ms smooth transition from globals.css

### File List

- `frontend/src/components/providers/theme-provider.tsx`
