import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#156082",
          navy: "#0E2841",
          heading: "#0F4761",
          orange: "#E97132",
          green: "#196B24",
          sky: "#0F9ED5",
          grey: "#E8E8E8",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"],
        heading: ["Manrope", "Inter", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        panel: "0 16px 40px rgba(14, 40, 65, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
