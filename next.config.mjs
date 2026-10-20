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
  // English has no URL prefix; /en and /en/... redirect permanently to the
  // unprefixed URLs (runs before the i18n proxy).
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
