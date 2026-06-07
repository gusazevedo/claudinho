/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#0e0e10',
          sidebar: '#131316',
          elevated: '#1a1a1f',
          input: '#1e1e24',
        },
        border: '#26262e',
        accent: {
          DEFAULT: '#a78bfa',
          dim: 'rgba(167,139,250,0.12)',
          border: 'rgba(167,139,250,0.3)',
        },
        text: {
          base: '#c9c9d4',
          muted: '#6b6b7a',
          heading: '#f0f0f5',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

