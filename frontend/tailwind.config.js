/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',
          accent: '#10b981', // Emerald
          glow: '#34d399',
        }
      }
    },
  },
  plugins: [],
}
