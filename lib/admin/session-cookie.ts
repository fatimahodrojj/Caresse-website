// Name of the admin session cookie. Kept free of server-only imports so
// proxy.ts can use it. "__Host-" makes the browser enforce Secure, path=/
// and no Domain (only set when the cookie is Secure, i.e. in production).
export const ADMIN_SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-caresse-admin" : "caresse-admin";
