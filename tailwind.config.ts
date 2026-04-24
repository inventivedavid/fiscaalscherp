import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Donker navy + warm goud — autoriteit + vertrouwen.
        ink: {
          50: "#f4f6fa",
          100: "#e4e9f2",
          200: "#c3cddf",
          300: "#95a5c2",
          400: "#6278a1",
          500: "#425a85",
          600: "#2f4268",
          700: "#243454",
          800: "#1a2740",
          900: "#111b2e",
          950: "#0a1020",
        },
        gold: {
          50: "#fdf9ef",
          100: "#faf0d4",
          200: "#f4deaa",
          300: "#ecc474",
          400: "#e3a845",
          500: "#d68f27",
          600: "#b9721d",
          700: "#95571b",
          800: "#7a471d",
          900: "#653c1c",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Inter",
          "Roboto",
          "sans-serif",
        ],
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(17, 27, 46, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
