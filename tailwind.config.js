/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        'primary-dark': '#000000',
        'secondary-dark': '#1a1a1a',
        'accent-dark': '#ff6b00',
        'text-dark': '#ffffff',
        
        // Light mode colors
        'primary-light': '#ffffff',
        'secondary-light': '#f5f5f5',
        'accent-light': '#ff6b00',
        'text-light': '#000000',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to right, #000000, #1a1a1a)',
        'gradient-light': 'linear-gradient(to right, #ffffff, #f5f5f5)',
      },
    },
  },
  plugins: [],
};