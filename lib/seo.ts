import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL = "https://caresseclinic.com";

/**
 * Whether Arabic pages may appear in search results (in the sitemap, no
 * noindex). The clinic approved the translations on 2026-10-20
 * (docs/arabic-review.md). Set to false to hide Arabic from search again.
 */
export const ARABIC_INDEXED = true;

/** Locales that search engines may index. */
export const indexedLocales: readonly Locale[] = ARABIC_INDEXED ? routing.locales : ["en"];

/** Pages with their own metadata (key = Metadata.<key> in messages/*.json). */
export const PAGES = { home: "/", book: "/book" } as const;

const OPEN_GRAPH_LOCALE: Record<Locale, string> = { en: "en_US", ar: "ar_LB" };

/** Path of a page in one language, e.g. ("/book", "ar") → "/ar/book". */
export function localizedPath(href: (typeof PAGES)[keyof typeof PAGES], locale: Locale): string {
  return getPathname({ href, locale });
}

/** Title, description, canonical URL, hreflang links and Open Graph for a page. */
export async function pageMetadata(localeParam: string, page: keyof typeof PAGES): Promise<Metadata> {
  const locale = hasLocale(routing.locales, localeParam) ? localeParam : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: `Metadata.${page}` });
  const href = PAGES[page];
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath(href, locale),
      languages: {
        ...Object.fromEntries(routing.locales.map((other) => [other, localizedPath(href, other)])),
        "x-default": localizedPath(href, routing.defaultLocale),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Caresse",
      title,
      description,
      url: localizedPath(href, locale),
      locale: OPEN_GRAPH_LOCALE[locale],
      alternateLocale: routing.locales
        .filter((other) => other !== locale)
        .map((other) => OPEN_GRAPH_LOCALE[other]),
    },
  };
}
