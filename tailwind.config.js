/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dev: {
          900: '#000000', // Pure black
          800: '#111111', // Very dark gray
          700: '#222222', // Dark gray
          600: '#333333', // Medium dark gray
          500: '#666666', // Medium gray
          400: '#999999', // Light gray
          300: '#EAEAEA', // Very light gray
          200: '#F5F5F5', // Off white
          100: '#FFFFFF', // Pure white
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
