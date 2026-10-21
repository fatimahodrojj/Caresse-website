import createNextIntlPlugin from "next-intl/plugin";

// Connects next-intl to i18n/request.ts (loads messages per language).
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Development only: let phones on the local network load the dev
  // server's scripts (http://192.168.0.195:3000). Without this, Next 16
  // blocks them, so the page renders but nothing interactive works.
  // Update the address if this computer's local IP changes.
  allowedDevOrigins: ["192.168.0.195"],
  // Admin photo uploads (up to 5 MB, see lib/admin/images.ts) go through
  // server actions; the default limit is 1 MB.
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
  // Photos uploaded in the admin panel are stored in Vercel Blob.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // The admin panel is never indexed (also set in proxy.ts and its metadata).
  async headers() {
    return [{ source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  // English has no URL prefix; /en and /en/... redirect permanently to the
  // unprefixed URLs (runs before the i18n proxy).
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      // The admin panel is English only.
      { source: "/ar/admin", destination: "/admin", permanent: false },
      { source: "/ar/admin/:path*", destination: "/admin/:path*", permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
