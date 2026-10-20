import { defineRouting } from "next-intl/routing";

// English is the default and keeps today's URLs (/, /book); Arabic lives
// under /ar (/ar, /ar/book). /en/... redirects to the unprefixed URL.
export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // No automatic redirects based on the browser language or a cookie:
  // visitors switch with the language button in the navbar.
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

/** Text direction for each language. */
export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};
