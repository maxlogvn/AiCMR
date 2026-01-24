/**
 * Design Tokens - Border Radius
 *
 * Consistent border radius values following 4px base unit
 *
 * @see {@link https://tailwindcss.com/docs/theme}
 */

export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;

// CSS variable names for runtime access
export const radiusVars = {
  'radius-none': 'var(--radius-none)',
  'radius-sm': 'var(--radius-sm)',
  'radius-md': 'var(--radius-md)',
  'radius-lg': 'var(--radius-lg)',
  'radius-xl': 'var(--radius-xl)',
  'radius-2xl': 'var(--radius-2xl)',
  'radius-3xl': 'var(--radius-3xl)',
  'radius-full': 'var(--radius-full)',
} as const;
