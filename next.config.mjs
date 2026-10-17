/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Development only: let phones on the local network load the dev
  // server's scripts (http://192.168.0.195:3000). Without this, Next 16
  // blocks them, so the page renders but nothing interactive works.
  // Update the address if this computer's local IP changes.
  allowedDevOrigins: ["192.168.0.195"],
};

export default nextConfig;
