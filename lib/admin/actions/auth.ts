"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { clientIp, hashIp } from "@/lib/booking/spam";
import {
  PASSWORD_MIN_LENGTH,
  createSession,
  currentSessionId,
  destroySession,
  hashPassword,
  requireAdmin,
  safeEqual,
  verifyPassword,
} from "@/lib/admin/auth";
import { checkLoginLimit, hashKey, recordLoginFailure } from "@/lib/admin/rate-limit";
import { failure, fieldErrorsOf, formValues, success, type ActionState } from "@/lib/admin/action-state";

// Logs contain only error codes, never emails or passwords.

const INVALID_LOGIN = "Invalid email or password.";
const TOO_MANY = "Too many attempts. Please wait 15 minutes and try again.";

const emailField = z.email("Please enter a valid email address.").max(254).transform((email) => email.toLowerCase());
const newPasswordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(200, "Use 200 characters or fewer.");

const loginSchema = z.object({
  email: z.string().trim().max(254),
  password: z.string().min(1).max(200),
  next: z.string().optional(),
});

/** Only redirect back to admin pages (no open redirects). */
function safeNext(next: string | undefined): string {
  return next && /^\/admin(\/[\w\-/]*)?$/.test(next) && !next.startsWith("/admin/login") ? next : "/admin";
}

async function ipHash(): Promise<string> {
  return hashIp(clientIp(await headers()));
}

export async function login(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(formValues(formData));
  if (!parsed.success) return failure(INVALID_LOGIN);
  const { email, password, next } = parsed.data;
  const db = getDb();
  const ip = await ipHash();
  const emailHash = hashKey(email);

  try {
    if ((await checkLoginLimit(db, ip, emailHash)) === "limited") return failure(TOO_MANY);
    const user = await db.adminUser.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, passwordHash: true },
    });
    const valid = await verifyPassword(user?.passwordHash ?? null, password);
    if (!user || !valid) {
      await recordLoginFailure(db, ip, emailHash);
      return failure(INVALID_LOGIN);
    }
    await createSession(user.id);
  } catch (error) {
    console.error(`admin.login_failed code=${error instanceof Error ? error.name : "unknown"}`);
    return failure("Something went wrong. Please try again.");
  }
  redirect(safeNext(next));
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

const setupSchema = z
  .object({
    token: z.string().min(1, "Enter the setup token."),
    email: emailField,
    password: newPasswordField,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, { path: ["confirm"], message: "The passwords do not match." });

/**
 * Creates the first admin account. Works only while ADMIN_SETUP_TOKEN is set
 * and no admin exists yet; after that the setup page is gone.
 */
export async function setupFirstAdmin(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const setupToken = process.env.ADMIN_SETUP_TOKEN;
  const db = getDb();
  if (!setupToken || (await db.adminUser.count()) > 0) return failure("Setup is closed.");

  const parsed = setupSchema.safeParse(formValues(formData));
  if (!parsed.success) return failure("Please check the highlighted fields.", fieldErrorsOf(parsed.error));

  const ip = await ipHash();
  const setupKey = hashKey("setup");
  if ((await checkLoginLimit(db, ip, setupKey)) === "limited") return failure(TOO_MANY);
  if (!safeEqual(parsed.data.token, setupToken)) {
    await recordLoginFailure(db, ip, setupKey);
    return failure("Please check the highlighted fields.", { token: "This setup token is not correct." });
  }

  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await db.$transaction(
      async (tx) => {
        if ((await tx.adminUser.count()) > 0) return null;
        return tx.adminUser.create({ data: { email: parsed.data.email, passwordHash }, select: { id: true } });
      },
      { isolationLevel: "Serializable" },
    );
    if (!user) return failure("Setup is closed.");
    await createSession(user.id);
  } catch (error) {
    console.error(`admin.setup_failed code=${error instanceof Error ? error.name : "unknown"}`);
    return failure("Something went wrong. Please try again.");
  }
  redirect("/admin");
}

const changePasswordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password.").max(200),
    password: newPasswordField,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, { path: ["confirm"], message: "The passwords do not match." })
  .refine((data) => data.password !== data.current, {
    path: ["password"],
    message: "Choose a password different from the current one.",
  });

/** Changes the signed-in admin's password and signs out their other sessions. */
export async function changePassword(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = changePasswordSchema.safeParse(formValues(formData));
  if (!parsed.success) return failure("Please check the highlighted fields.", fieldErrorsOf(parsed.error));

  const db = getDb();
  const user = await db.adminUser.findUnique({ where: { id: admin.id }, select: { passwordHash: true } });
  if (!user || !(await verifyPassword(user.passwordHash, parsed.data.current))) {
    return failure("Please check the highlighted fields.", { current: "Your current password is not correct." });
  }

  const sessionId = await currentSessionId();
  await db.$transaction([
    db.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: await hashPassword(parsed.data.password), passwordChangedAt: new Date() },
    }),
    db.adminSession.deleteMany({ where: { userId: admin.id, NOT: { id: sessionId ?? "" } } }),
  ]);
  return success("Password changed. Other devices have been signed out.");
}
