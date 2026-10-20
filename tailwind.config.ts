import type { Config } from "tailwindcss";

// Design tokens from the Figma design system (docs/design-system.md).
// Components use these instead of hardcoding hex values.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        navy: "#2A3B4D",
        pink: "#EA6E9C",
        sky: "#4A9FE0",
        gold: "#F0C349",
        purple: "#B19CD9",
        // Supporting colors and section backgrounds
        cream: {
          DEFAULT: "#FFF8EC",
          warm: "#FFF8F0",
          // Booking form section (Figma 33:5)
          form: "#FDF8F3",
        },
        muted: "#737373",
        mist: "#E8EFF8",
        line: "#E5E7EB",
        ice: "#E3F0FF",
        rose: "#FFE4EC",
        // Not in Figma: accessible error colour for form messages
        // (6.6:1 on white). See docs/design-system.md.
        danger: "#B3261E",
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
        sans: ["var(--font-sans)", "sans-serif"],
        heading: ["var(--font-heading)", "cursive"],
        script: ["var(--font-script)", "cursive"],
        // "Caresse" wordmark: the brand font in every language.
        wordmark: ["var(--font-boogaloo)", "cursive"],
      },
      borderRadius: {
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
        form: "0 10px 14px rgba(42, 59, 77, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
