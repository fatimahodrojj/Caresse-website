import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/session-cookie";

// Next 16 "proxy" (formerly middleware).
// Public site: picks the language from the URL. Unprefixed URLs are English,
// /ar/... is Arabic, /en/... redirects to the unprefixed URL.
// Admin (/admin, English only): first line of defence only. Without a
// session cookie, admin pages redirect to the sign-in page. Every admin page
// and server action checks the session again against the database.
const handleI18n = createMiddleware(routing);

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/setup"]);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!PUBLIC_ADMIN_PATHS.has(pathname) && !request.cookies.has(ADMIN_SESSION_COOKIE)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  return handleI18n(request);
}

export const config = {
  // Everything except API routes, Next internals, Vercel internals and
  // files with an extension (images, icons, robots.txt, sitemap.xml…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
