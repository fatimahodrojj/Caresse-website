import { createHash } from "node:crypto";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/booking/spam-fields";

// Spam protection for the booking form, invisible to real people:
// a honeypot field, a minimum fill time and rate limits stored in Postgres
// (Vercel functions don't share memory, so an in-memory limit wouldn't hold).

const MIN_FILL_TIME_MS = 3_000;
const IP_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 }; // 5 per hour
const PHONE_LIMIT = { max: 3, windowMs: 24 * 60 * 60 * 1000 }; // 3 per day
const ATTEMPT_RETENTION_MS = 24 * 60 * 60 * 1000;

/** True when the submission looks automated (honeypot filled or filled too fast). */
export function looksLikeBot(formData: FormData): boolean {
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;

  // Missing without JavaScript; only judge it when present.
  const startedAt = Number(formData.get(STARTED_AT_FIELD));
  if (Number.isFinite(startedAt) && startedAt > 0) {
    return Date.now() - startedAt < MIN_FILL_TIME_MS;
  }
  return false;
}

/** First address in x-forwarded-for (set by Vercel), else x-real-ip. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

/** Salted SHA-256 of the IP, so the raw address is never stored. */
export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/**
 * Checks the per-IP and per-phone limits. When allowed, records the attempt.
 * Also deletes attempt records older than 24 hours.
 */
export async function checkRateLimit(
  db: PrismaClient,
  ipHash: string,
  phone: string,
): Promise<"allowed" | "limited"> {
  const now = Date.now();

  await db.submissionAttempt.deleteMany({
    where: { createdAt: { lt: new Date(now - ATTEMPT_RETENTION_MS) } },
  });

  const [ipCount, phoneCount] = await Promise.all([
    db.submissionAttempt.count({
      where: { ipHash, createdAt: { gte: new Date(now - IP_LIMIT.windowMs) } },
    }),
    db.appointmentRequest.count({
      where: { phone, createdAt: { gte: new Date(now - PHONE_LIMIT.windowMs) } },
    }),
  ]);

  if (ipCount >= IP_LIMIT.max || phoneCount >= PHONE_LIMIT.max) return "limited";

  await db.submissionAttempt.create({ data: { ipHash } });
  return "allowed";
}
