/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'badfriends-bg': '#0a0e1a',
        'badfriends-card': '#111827',
        'badfriends-border': '#1e3a5f',
        'bobo': '#f59e0b',
        'cheeto': '#ef4444',
        'tiger': '#10b981',
        'dead': '#a855f7',
      }
    },
  },
  plugins: [],
}
