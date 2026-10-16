import type messages from "./messages/en.json";
import type { routing } from "./i18n/routing";

// Type-safe translation keys: every t("...") call is checked against
// messages/en.json, and the locale against the configured languages.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
