/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'badfriends': {
          'bg': '#0a0e1a',
          'card': '#111827',
          'border': '#1e3a5f',
          'input': '#1f2937',
          'text': '#ffffff',
          'text-muted': '#9ca3af',
          'text-dim': '#6b7280',
        },
        'primary': '#ef4444',
        'primary-dark': '#dc2626',
        'accent': '#f59e0b',
        'accent-dark': '#d97706',
        'bobo': '#f59e0b',
        'cheeto': '#ef4444',
        'tiger': '#10b981',
        'dead': '#a855f7',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}