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
        obsidian: {
          DEFAULT: "#0a0b0d",
          900: "#0a0b0d",
          800: "#0e1013",
          700: "#141619",
          600: "#1c1f24",
          500: "#262a30",
          400: "#3a3f47",
        },
        // Vault metal-paleta — gebruikt voor brushed/etched oppervlakken
        // op de cockpit en hero. Bewust dicht bij obsidian, alleen iets
        // koeler en met meer blauw-grijze headroom.
        metal: {
          900: "#0a0b0d",
          800: "#0f1114",
          700: "#15181c",
          600: "#1c2026",
          500: "#262b32",
          highlight: "rgba(255,255,255,0.05)",
        },
        bone: {
          DEFAULT: "#e8e2d4",
          pale: "#f4efe2",
          warm: "#d8cfb8",
          dim: "#a89f86",
          deep: "#776f5b",
        },
        emerald: {
          50: "#ecfdf5",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#3ecf94",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          glow: "#3ecf94",
        },
        gold: {
          DEFAULT: "#c9a961",
          100: "#f0e3bd",
          300: "#e5c97d",
          500: "#c9a961",
          700: "#9c7d3c",
        },
        signal: {
          DEFAULT: "#7fffa0",
          glow: "rgba(127,255,160,0.35)",
        },

        // Legacy compat — secundaire pagina's (prijzen, methodologie, kennisbank,
        // benchmarks, tools, voor) gebruiken nog het oude lichte palet.
        // We mappen die namen op dark-equivalenten zodat ze tot fase 3
        // niet broken ogen. Verwijderen zodra die pagina's hergestyled zijn.
        canvas: {
          DEFAULT: "#0a0b0d",
          50: "#0e1013",
          100: "#141619",
          200: "#1c1f24",
          300: "#262a30",
          400: "#3a3f47",
          500: "#5a6068",
          600: "#7a8088",
          700: "#9a9fa6",
          800: "#c2c5ca",
          900: "#e8e2d4",
        },
        ink: {
          DEFAULT: "#e8e2d4",
          soft: "#d8cfb8",
          muted: "rgba(232,226,212,0.65)",
          subtle: "rgba(232,226,212,0.40)",
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.16)",
        },
        accent: {
          50: "rgba(201,169,97,0.06)",
          100: "rgba(201,169,97,0.12)",
          300: "#e5c97d",
          500: "#c9a961",
          700: "#9c7d3c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.6rem, 8vw + 1rem, 5.25rem)",
          { lineHeight: "0.98", letterSpacing: "-0.025em" },
        ],
        "display-lg": [
          "clamp(2rem, 4.5vw + 1rem, 3.5rem)",
          { lineHeight: "1.02", letterSpacing: "-0.02em" },
        ],
        "display-md": [
          "clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)",
          { lineHeight: "1.1", letterSpacing: "-0.015em" },
        ],
        "mono-stat": [
          "clamp(2rem, 7vw, 3.75rem)",
          { lineHeight: "1.0", letterSpacing: "-0.04em" },
        ],
      },
      letterSpacing: {
        eyebrow: "0.18em",
        stamp: "0.32em",
        mark: "0.06em",
      },
      // Legacy boxshadow-naam (card) gebruikt door secundaire pagina's.
      // Kunnen we verwijderen wanneer die pagina's hergestyled zijn.
      boxShadow: {
        glass:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 0 rgba(0,0,0,0.6), 0 24px 48px -24px rgba(0,0,0,0.55)",
        stamp:
          "0 0 0 1px rgba(201,169,97,0.45), 0 1px 0 rgba(255,255,255,0.04)",
        emeraldGlow: "0 0 36px -12px rgba(62,207,148,0.55)",
        // Vault depth — gegraveerde inset op metalen oppervlakken.
        engrave:
          "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.6)",
        // Vault depth — donkere put rond de dial (geen blur, harde drop).
        dialRim:
          "inset 0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px -40px rgba(0,0,0,0.9)",
        // Legacy
        card: "inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 48px -24px rgba(0,0,0,0.6)",
        ring: "0 0 0 1px rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "noise-paper":
          "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.04), transparent 50%), radial-gradient(circle at 100% 100%, rgba(255,255,255,0.03), transparent 60%)",
        "scan-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        bootReveal: {
          "0%": { opacity: "0", transform: "translateY(6px)", filter: "blur(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        stampIn: {
          "0%": {
            opacity: "0",
            transform: "rotate(-14deg) scale(1.4)",
            filter: "blur(2px)",
          },
          "55%": {
            opacity: "1",
            transform: "rotate(-9deg) scale(0.96)",
            filter: "blur(0)",
          },
          "100%": {
            opacity: "1",
            transform: "rotate(-7deg) scale(1)",
            filter: "blur(0)",
          },
        },
        redactReveal: {
          "0%": { width: "100%" },
          "100%": { width: "var(--reveal-width, 0%)" },
        },
        counter: {
          "0%": { opacity: "0.45", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        liftIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        emeraldPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(62,207,148,0.0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(62,207,148,0.08)" },
        },
        bootCursor: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scanlineDrift: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        sealRing: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.04)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // Vault — dial tikt één notch verder met overshoot.
        dialTick: {
          "0%": { transform: "rotate(var(--dial-from, 0deg))" },
          "60%": { transform: "rotate(calc(var(--dial-to, 0deg) + 4deg))" },
          "100%": { transform: "rotate(var(--dial-to, 0deg))" },
        },
        dialBreathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.005)" },
        },
        // Vault — een chamber-drawer schuift open.
        chamberOpen: {
          "0%": {
            opacity: "0",
            clipPath: "inset(0 0 100% 0)",
            transform: "translateY(8px)",
          },
          "60%": {
            opacity: "1",
            clipPath: "inset(0 0 0 0)",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "1",
            clipPath: "inset(0 0 0 0)",
            transform: "translateY(0)",
          },
        },
        // Vault — gegraveerde lijn fade-int met blur die uitzakt.
        etchFade: {
          "0%": { opacity: "0", filter: "blur(2px)", letterSpacing: "0.4em" },
          "100%": {
            opacity: "1",
            filter: "blur(0)",
            letterSpacing: "normal",
          },
        },
        // Vault — emerald puls voor actieve arc.
        arcPulse: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        // Legacy: secundaire pagina's gebruiken nog 'fade-up'.
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "boot-reveal": "bootReveal 0.55s ease-out both",
        "stamp-in": "stampIn 0.6s cubic-bezier(.2,.8,.2,1) both",
        "redact-reveal": "redactReveal 0.9s cubic-bezier(.2,.8,.2,1) both",
        counter: "counter 0.55s ease-out both",
        "lift-in": "liftIn 0.55s cubic-bezier(.2,.8,.2,1) both",
        "emerald-pulse": "emeraldPulse 2.4s ease-in-out infinite",
        "boot-cursor": "bootCursor 1s steps(1) infinite",
        "scan-drift": "scanlineDrift 8s linear infinite",
        "seal-ring": "sealRing 0.7s cubic-bezier(.2,.8,.2,1) both",
        "dial-tick": "dialTick 0.7s cubic-bezier(.2,.8,.2,1) both",
        "dial-breathe": "dialBreathe 4s ease-in-out infinite",
        "chamber-open": "chamberOpen 0.65s cubic-bezier(.2,.8,.2,1) both",
        "etch-fade": "etchFade 0.7s cubic-bezier(.2,.8,.2,1) both",
        "arc-pulse": "arcPulse 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
