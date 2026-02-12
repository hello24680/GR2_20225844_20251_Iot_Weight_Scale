/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d9fe7',  // Blue color for buttons and accents
      },
    },
  },
  plugins: [require("daisyui")],
}
