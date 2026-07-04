/** @type {import('tailwindcss').Config} */
export default {
  // Theming is driven by CSS variables (dark by default, light under html.light),
  // ported from docs/03-blueprint/prototype/index.html.
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-background-primary)',
        'surface-2': 'var(--color-background-secondary)',
        'surface-3': 'var(--color-background-tertiary)',
        ink: 'var(--color-text-primary)',
        'ink-soft': 'var(--color-text-secondary)',
        'ink-faint': 'var(--color-text-tertiary)',
        info: 'var(--color-text-info)',
        success: 'var(--color-text-success)',
        warning: 'var(--color-text-warning)',
        danger: 'var(--color-text-danger)',
        'tint-info': 'var(--color-background-info)',
        'tint-success': 'var(--color-background-success)',
        'tint-warning': 'var(--color-background-warning)',
        'tint-danger': 'var(--color-background-danger)',
        brand: 'var(--color-text-info)',
        line: 'var(--color-border-tertiary)',
      },
      borderColor: {
        DEFAULT: 'var(--color-border-tertiary)',
        line: 'var(--color-border-tertiary)',
        'line-2': 'var(--color-border-secondary)',
        info: 'var(--color-border-info)',
        warning: 'var(--color-border-warning)',
        danger: 'var(--color-border-danger)',
      },
      borderRadius: {
        md: 'var(--border-radius-md)',
        lg: 'var(--border-radius-lg)',
        xl: 'var(--border-radius-xl)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      // aa- redesign tokens (src/index.css :root) — utilities draw from the same source of truth.
      boxShadow: {
        'aa-sm': 'var(--aa-shadow-sm)',
        'aa-md': 'var(--aa-shadow-md)',
        'aa-lg': 'var(--aa-shadow-lg)',
      },
      spacing: {
        'aa-1': 'var(--aa-space-1)',
        'aa-2': 'var(--aa-space-2)',
        'aa-3': 'var(--aa-space-3)',
        'aa-4': 'var(--aa-space-4)',
        'aa-5': 'var(--aa-space-5)',
        'aa-6': 'var(--aa-space-6)',
        'aa-7': 'var(--aa-space-7)',
      },
      fontSize: {
        'aa-2xs': 'var(--aa-fs-2xs)',
        'aa-xs': 'var(--aa-fs-xs)',
        'aa-sm': 'var(--aa-fs-sm)',
        'aa-base': 'var(--aa-fs-base)',
        'aa-md': 'var(--aa-fs-md)',
        'aa-lg': 'var(--aa-fs-lg)',
        'aa-xl': 'var(--aa-fs-xl)',
        'aa-2xl': 'var(--aa-fs-2xl)',
      },
    },
  },
  plugins: [],
};
