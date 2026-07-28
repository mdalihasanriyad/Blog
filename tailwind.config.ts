import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Editorial palette — deep indigo-ink, warm paper, muted amber accent.
        ink: {
          DEFAULT: '#1B2333',
          50: '#F3F4F7',
          100: '#E3E5EB',
          200: '#C3C7D3',
          300: '#9BA1B5',
          400: '#6B7290',
          500: '#4A5069',
          600: '#363C52',
          700: '#262C40',
          800: '#1B2333',
          900: '#12161F',
          950: '#0A0D13',
        },
        paper: {
          DEFAULT: '#FAF8F3',
          dim: '#F1EEE6',
        },
        amber: {
          DEFAULT: '#C9A227',
          light: '#E0C158',
          dark: '#9C7D1D',
        },
        sage: {
          DEFAULT: '#7A8B78',
          light: '#A3B0A1',
          dark: '#5C6B5A',
        },
        brick: {
          DEFAULT: '#B4483D',
          light: '#D1685D',
        },
        slate: {
          DEFAULT: '#5C6470',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-lg': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#2A3142',
            '--tw-prose-headings': '#1B2333',
            '--tw-prose-links': '#9C7D1D',
            '--tw-prose-bold': '#1B2333',
            '--tw-prose-quotes': '#5C6470',
            '--tw-prose-quote-borders': '#C9A227',
            '--tw-prose-code': '#1B2333',
            maxWidth: '68ch',
            a: { textDecoration: 'none', borderBottom: '1px solid #C9A227', fontWeight: '500' },
          },
        },
      }),
      keyframes: {
        'ribbon-fill': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
