/**
 * Design Tokens - Typography
 *
 * Font family: Inter (sans-serif), JetBrains Mono (monospace)
 * Type scale follows 8px base rhythm
 *
 * @see {@link https://tailwindcss.com/docs/font-family}
 * @see {@link https://tailwindcss.com/docs/customizing-font-size}
 */

export const typography = {
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
  },
  fontSize: {
    // Heading scale
    display: ['48px', { lineHeight: '56px', letterSpacing: '-0.02' }],
    h1: ['36px', { lineHeight: '40px', letterSpacing: '-0.02' }],
    h2: ['30px', { lineHeight: '36px', letterSpacing: '-0.01' }],
    h3: ['24px', { lineHeight: '32px' }],
    h4: ['20px', { lineHeight: '28px' }],

    // Body scale
    'body-lg': ['18px', { lineHeight: '28px' }],
    body: ['16px', { lineHeight: '24px' }],
    'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.01' }],

    // Utility
    caption: ['12px', { lineHeight: '16px', letterSpacing: '0.04' }],
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

// CSS variable names for runtime access
export const fontVars = {
  'font-sans': 'var(--font-sans)',
  'font-mono': 'var(--font-mono)',
} as const;
