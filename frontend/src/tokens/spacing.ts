/**
 * Design Tokens - Spacing
 *
 * 8px base system following TailwindCSS conventions
 *
 * @see {@link https://tailwindcss.com/docs/customizing-spacing}
 */

export const spacing = {
   0: '0px',
  1: '4px',
   2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

// TailwindCSS spacing scale reference
export const spacingScale = {
  px: '0px',
  0: '0rem',      // 0px
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

// CSS variable names for runtime access
export const spacingVars = {
  'spacing-0': 'var(--spacing-0)',
  'spacing-1': 'var(--spacing-1)',
  'spacing-2': 'var(--spacing-2)',
  'spacing-3': 'var(--spacing-3)',
  'spacing-4': 'var(--spacing-4)',
  'spacing-5': 'var(--spacing-5)',
  'spacing-6': 'var(--spacing-6)',
  'spacing-8': 'var(--spacing-8)',
  'spacing-10': 'var(--spacing-10)',
  'spacing-12': 'var(--spacing-12)',
  'spacing-16': 'var(--spacing-16)',
  'spacing-20': 'var(--spacing-20)',
  'spacing-24': 'var(--spacing-24)',
} as const;
