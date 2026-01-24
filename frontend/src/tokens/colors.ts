/**
 * Design Tokens - Colors
 *
 * Primary (Indigo): Main actions, CTAs
 * Accent (Teal): Highlights, secondary actions
 * Neutral (Gray): Text, borders, backgrounds
 * Semantic: Status colors with semantic meaning
 *
 * @see {@link https://tailwindcss.com/docs/customizing-colors}
 */

export const colors = {
  // Primary Colors (Indigo)
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5', // Primary actions
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Accent Colors (Teal)
  accent: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // CTA, highlights
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },

  // Neutral Grays
  gray: {
    50: '#F9FAFB',  // Background
    100: '#F3F4F6',
    200: '#E5E7EB', // Border
    300: '#D1D5DB',
    400: '#9CA3AF', // Disabled
    500: '#6B7280',
    600: '#4B5563', // Text secondary
    700: '#374151',
    800: '#1F2937',
    900: '#111827', // Text primary
  },

  // Semantic Colors
  semantic: {
    success: '#10B981', // Published, active
    warning: '#F59E0B', // Draft, pending
    error: '#EF4444',   // Error, deleted
    info: '#3B82F6',     // Info, scheduled
  },
} as const;

// CSS variable names for runtime access
export const colorVars = {
  // Primary
  'primary-50': 'var(--color-primary-50)',
  'primary-100': 'var(--color-primary-100)',
  'primary-200': 'var(--color-primary-200)',
  'primary-300': 'var(--color-primary-300)',
  'primary-400': 'var(--color-primary-400)',
  'primary-500': 'var(--color-primary-500)',
  'primary-600': 'var(--color-primary-600)',
  'primary-700': 'var(--color-primary-700)',
  'primary-800': 'var(--color-primary-800)',
  'primary-900': 'var(--color-primary-900)',

  // Accent
  'accent-50': 'var(--color-accent-50)',
  'accent-100': 'var(--color-accent-100)',
  'accent-200': 'var(--color-accent-200)',
  'accent-300': 'var(--color-accent-300)',
  'accent-400': 'var(--color-accent-400)',
  'accent-500': 'var(--color-accent-500)',
  'accent-600': 'var(--color-accent-600)',
  'accent-700': 'var(--color-accent-700)',
  'accent-800': 'var(--color-accent-800)',
  'accent-900': 'var(--color-accent-900)',

  // Gray
  'gray-50': 'var(--color-gray-50)',
  'gray-100': 'var(--color-gray-100)',
  'gray-200': 'var(--color-gray-200)',
  'gray-300': 'var(--color-gray-300)',
  'gray-400': 'var(--color-gray-400)',
  'gray-500': 'var(--color-gray-500)',
  'gray-600': 'var(--color-gray-600)',
  'gray-700': 'var(--color-gray-700)',
  'gray-800': 'var(--color-gray-800)',
  'gray-900': 'var(--color-gray-900)',

  // Semantic
  'success': 'var(--color-success)',
  'warning': 'var(--color-warning)',
  'error': 'var(--color-error)',
  'info': 'var(--color-info)',
} as const;
