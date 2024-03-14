/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        bak: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
        bak2: "linear-gradient(319deg, #663dff 0%, #aa00ff 37%, #cc4499 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite", // Example custom animation
        "bounce-slow": "bounce 3s ease-in-out infinite",
      },
    },
    fontFamily: {
      arapey: ["arapey", "serif"],
    },
  },
  plugins: [
    typography,
    // ...
  ],
};
