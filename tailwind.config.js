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
        'openai-green': '#10a37f',
        'openai-dark': '#0d0d0d',
        'openai-gray': '#f7f7f8',
        'openai-border': '#e5e5e5',
        'openai-text': '#2d333a',
        'openai-light-gray': '#6e6e80',
        // 暗色主题颜色
        'dark-bg': '#1a1a1a',
        'dark-surface': '#2d2d2d',
        'dark-border': '#404040',
        'dark-text': '#e5e5e5',
        'dark-text-secondary': '#a0a0a0',
        'dark-input': '#333333'
      },
      fontFamily: {
        'sans': ['Söhne', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}