/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customDarkMode: '#171923',
        customTextHeader: '#2D3F91',
      },},
  },
  plugins: [],
}