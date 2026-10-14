import type { Config } from "tailwindcss";

// Design tokens derived from the Caresse logo palette.
// Keeping these centralized means every component pulls from the
// same source of truth instead of hardcoding hex values inline.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FFF8EC",
          light: "#FFFDF8",
          warm: "#FFF8F0",
        },
        gold: {
          DEFAULT: "#F0C349",
          soft: "#FCEBBF",
        },
        sky: {
          DEFAULT: "#4A9FE0",
          soft: "#DCEEFB",
        },
        pink: {
          DEFAULT: "#EA6E9C",
          soft: "#FBDFE9",
        },
        navy: {
          DEFAULT: "#2A3B4D",
          soft: "#5C6E80",
        },
        lavender: "#9B87D9",
        // Figma design system (docs/design-system.md). The tokens above are
        // still used by the old components and are removed as each one is
        // replaced.
        purple: "#B19CD9",
        muted: "#737373",
        mist: "#E8EFF8",
        line: "#E5E7EB",
        ice: "#E3F0FF",
        rose: "#FFE4EC",
        tint: {
          peach: "#FFF8F5",
          blush: "#FFF8F8",
          lilac: "#FAF8FF",
        },
      },
      backgroundImage: {
        hero: "linear-gradient(to right, #FFE5B8, #A2D8FF 50%, #FEADCB)",
        cta: "linear-gradient(to right, #4A9FE0, #EA6E9C)",
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        heading: ["var(--font-heading)", "cursive"],
        script: ["var(--font-script)", "cursive"],
      },
      borderRadius: {
        xl2: "1.75rem",
        "card-lg": "28px",
        card: "24px",
        panel: "20px",
        media: "16px",
        control: "12px",
      },
      dropShadow: {
        card: "0 12px 12px rgba(42, 59, 77, 0.04)",
        "card-strong": "0 10px 12px rgba(0, 0, 0, 0.07)",
        control: "0 10px 10px rgba(42, 59, 77, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
