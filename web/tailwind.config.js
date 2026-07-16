/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Tell Tailwind to look at App.js and the src folder inside /mobile
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}