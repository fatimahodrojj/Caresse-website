import { createHash } from "node:crypto";
import type { PrismaClient } from "@/lib/generated/prisma/client";

// Admin sign-in rate limits, stored in Postgres like the booking limits.
// Only failed attempts count; IPs and emails are stored as salted hashes.

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 10;
const MAX_PER_EMAIL = 5;
const RETENTION_MS = 24 * 60 * 60 * 1000;

/** Salted SHA-256 of an email (or another key such as "setup"). */
export function hashKey(value: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "";
  return createHash("sha256").update(`${salt}:login:${value.trim().toLowerCase()}`).digest("hex");
}

/** "limited" when this IP or this email had too many recent failures. */
export async function checkLoginLimit(
  db: PrismaClient,
  ipHash: string,
  emailHash: string,
): Promise<"allowed" | "limited"> {
  const now = Date.now();
  await db.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(now - RETENTION_MS) } } });
  const since = new Date(now - WINDOW_MS);
  const [byIp, byEmail] = await Promise.all([
    db.loginAttempt.count({ where: { ipHash, createdAt: { gte: since } } }),
    db.loginAttempt.count({ where: { emailHash, createdAt: { gte: since } } }),
  ]);
  return byIp >= MAX_PER_IP || byEmail >= MAX_PER_EMAIL ? "limited" : "allowed";
}

export async function recordLoginFailure(db: PrismaClient, ipHash: string, emailHash: string): Promise<void> {
  await db.loginAttempt.create({ data: { ipHash, emailHash } });
}
