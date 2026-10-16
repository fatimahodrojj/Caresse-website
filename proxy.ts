import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Next 16 "proxy" (formerly middleware): picks the language from the URL.
// Unprefixed URLs are English, /ar/... is Arabic, /en/... redirects to the
// unprefixed URL.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals, Vercel internals and
  // files with an extension (images, icons, robots.txt, sitemap.xml…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
