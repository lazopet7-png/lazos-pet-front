/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pet: {
          50: '#f3f8f5',
          100: '#e1eee7',
          200: '#c5ddd1',
          300: '#9cc4b1',
          400: '#70a68e',
          500: '#508a72',
          600: '#3d705d',
          700: '#315b4c',
          800: '#294a3f',
          900: '#233e36',
        },
        clay: {
          50: '#fcf6f2',
          100: '#f8e9df',
          200: '#efd0bc',
          300: '#e3ad8c',
          400: '#d4875f',
          500: '#c66d47',
          600: '#ad5334',
          700: '#8f402b',
        },
      },
      fontFamily: {
        'admin': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'memorial': ['Lora', 'Georgia', 'serif'],
        'elegant': ['Lora', 'Georgia', 'serif'],
        'serif': ['Lora', 'Georgia', 'serif'],
      },
      fontSize: {
        'memorial-title': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'memorial-subtitle': ['1.5rem', { lineHeight: '1.3', fontWeight: '500' }],
        'memorial-body': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'memorial-caption': ['0.9rem', { lineHeight: '1.4', fontWeight: '400' }],
      }
    },
  },
  plugins: [],
}
