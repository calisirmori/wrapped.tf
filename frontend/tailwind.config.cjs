module.exports = {
  darkMode: 'class', // DaisyUI works with class-based dark mode
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'], // Enable light and dark themes
  },
};