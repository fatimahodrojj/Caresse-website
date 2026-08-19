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
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
