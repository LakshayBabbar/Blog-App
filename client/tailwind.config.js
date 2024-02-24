/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        bak: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)"
      }
    },
  },
  plugins: [],
}

