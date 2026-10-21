import { Aref_Ruqaa, Baloo_Bhaijaan_2, Boogaloo, Dancing_Script, Readex_Pro, Sora } from "next/font/google";
import type { Locale } from "@/i18n/routing";

// Design-system fonts (docs/design-system.md). next/font self-hosts them at
// build time: no request to fonts.googleapis.com at runtime and no layout
// shift. globals.css maps them to --font-sans/--font-heading/--font-script.
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora",
});

const boogaloo = Boogaloo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-boogaloo",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-dancing",
});

// Arabic fonts, used only on Arabic pages, where they also draw Latin
// letters and digits so mixed text matches. Not preloaded, so English pages
// never download them; browsers fetch only the subsets a page contains.

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  preload: false,
  weight: ["400", "600", "700"],
  variable: "--font-readex",
});

// Headings use a single weight (no heading sets font-weight).
const balooBhaijaan = Baloo_Bhaijaan_2({
  subsets: ["arabic", "latin"],
  preload: false,
  weight: "600",
  variable: "--font-baloo",
});

// Hero tagline.
const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  preload: false,
  weight: "700",
  variable: "--font-aref",
});

export const fontVariables: Record<Locale, string> = {
  en: [sora, boogaloo, dancingScript].map((font) => font.variable).join(" "),
  // Boogaloo stays for the wordmark.
  ar: [boogaloo, readexPro, balooBhaijaan, arefRuqaa].map((font) => font.variable).join(" "),
};
