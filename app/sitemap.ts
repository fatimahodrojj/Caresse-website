import type { MetadataRoute } from "next";
import { indexedLocales, localizedPath, PAGES, SITE_URL } from "@/lib/seo";

/** /sitemap.xml: every page in each language that may be indexed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGES).flatMap((href) =>
    indexedLocales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(href, locale)}`,
      alternates:
        indexedLocales.length > 1
          ? {
              languages: Object.fromEntries(
                indexedLocales.map((other) => [other, `${SITE_URL}${localizedPath(href, other)}`]),
              ),
            }
          : undefined,
    })),
  );
}
