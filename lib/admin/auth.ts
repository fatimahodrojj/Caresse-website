import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/session-cookie";

// Admin authentication: argon2id password hashes and database sessions.
// Plain passwords are never stored or logged; only their hashes are kept.

const SESSION_DAYS = 7;

// argon2id (the library's default algorithm) with the OWASP-recommended
// minimum: 19 MiB memory, 2 iterations, 1 lane.
const ARGON2_OPTIONS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 };

export const PASSWORD_MIN_LENGTH = 12;

export type AdminUser = { id: string; email: string };

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Compares two strings in constant time (for secrets such as the setup token). */
export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(Buffer.from(sha256(a)), Buffer.from(sha256(b)));
}

export function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

// Checked when the email is unknown, so the response takes as long as for a
// real account and does not reveal which emails exist.
let dummyHash: Promise<string> | undefined;

export async function verifyPassword(passwordHash: string | null, password: string): Promise<boolean> {
  try {
    if (!passwordHash) {
      dummyHash ??= hashPassword(randomBytes(16).toString("hex"));
      await verify(await dummyHash, password);
      return false;
    }
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

/** Starts a session for the user and sets the session cookie. */
export async function createSession(userId: string): Promise<void> {
  const db = getDb();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await db.adminSession.create({ data: { id: sha256(token), userId, expiresAt } });
  (await cookies()).set(ADMIN_SESSION_COOKIE, token, cookieOptions(expiresAt));
}

/** Ends the current session (database row and cookie). */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) await getDb().adminSession.deleteMany({ where: { id: sha256(token) } });
  store.set(ADMIN_SESSION_COOKIE, "", cookieOptions(new Date(0)));
}

/** Id of the current session (hash of the cookie token), if any. */
export async function currentSessionId(): Promise<string | null> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return token ? sha256(token) : null;
}

/** The signed-in admin, or null. Checked against the database on every request. */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const sessionId = await currentSessionId();
  if (!sessionId) return null;
  const session = await getDb().adminSession.findUnique({
    where: { id: sessionId },
    select: { expiresAt: true, user: { select: { id: true, email: true } } },
  });
  if (!session || session.expiresAt.getTime() <= Date.now()) return null;
  return session.user;
});

/**
 * The signed-in admin; otherwise redirects to the sign-in page. Called by
 * every admin page and every admin server action (proxy.ts only checks that
 * a cookie exists).
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
