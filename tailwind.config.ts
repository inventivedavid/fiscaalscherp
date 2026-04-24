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
        // Warm off-white (stone-achtig), near-black ink, zeer ingetogen amber accent.
        canvas: {
          DEFAULT: "#fafaf8",
          50: "#fdfdfb",
          100: "#f5f4f0",
          200: "#e9e7e1",
          300: "#d6d3ca",
          400: "#a8a39a",
          500: "#78746a",
          600: "#57544c",
          700: "#3d3b35",
          800: "#24231f",
          900: "#121210",
        },
        ink: {
          DEFAULT: "#0a0a0a",
          soft: "#2b2a28",
          muted: "#6b6862",
          subtle: "#97938c",
        },
        accent: {
          // Gebruiken we extreem spaarzaam — kerncijfers, hover states.
          50: "#fef9ec",
          100: "#fbefc8",
          300: "#e5b55a",
          500: "#a16207", // deep amber
          700: "#713f12",
        },
        line: {
          DEFAULT: "#e7e5e0",
          strong: "#d4d1c8",
        },
      },
      fontFamily: {
        // Sans: Inter (via next/font)
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        // Display serif: Instrument Serif (via next/font) — alleen voor headlines.
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 5vw + 1rem, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 3vw + 1rem, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.5rem, 2vw + 0.5rem, 2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        eyebrow: "0.14em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,10,10,0.04), 0 8px 24px -12px rgba(10,10,10,0.08)",
        ring: "0 0 0 1px rgba(10,10,10,0.08)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "counter": {
          "0%": { opacity: "0.3" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "counter": "counter 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
