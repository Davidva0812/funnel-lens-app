/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F97316',
          amber: '#FB923C',
          dark: '#0F1117',
          panel: '#161B27',
          card: '#1E2535',
          border: '#2A3347',
          muted: '#4A5568',
          text: '#E2E8F0',
          sub: '#94A3B8',
        }
      },
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
