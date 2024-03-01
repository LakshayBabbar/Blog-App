/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        bak: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
        bak2: "linear-gradient(319deg, #663dff 0%, #aa00ff 37%, #cc4499 100%)",
      }
    },
  },
  plugins: [],
}
