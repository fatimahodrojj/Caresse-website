"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { failure, fieldErrorsOf, formValues, success, type ActionState } from "@/lib/admin/action-state";
import { revalidateAllPages } from "@/lib/admin/revalidate";

const settingsSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s\-().]{7,25}$/, "Enter a phone number, e.g. +961 71056803."),
  email: z.email("Enter a valid email address.").max(254),
  addressEn: z.string().trim().min(1, "Enter the address in English.").max(200),
  addressAr: z.string().trim().min(1, "Enter the address in Arabic.").max(200),
  instagramUrl: z
    .url({ protocol: /^https$/, error: "Enter the full link, starting with https://" })
    .max(300),
  retentionMonths: z.coerce
    .number({ error: "Enter a number of months." })
    .int("Enter a whole number of months.")
    .min(1, "Use at least 1 month.")
    .max(60, "Use 60 months or fewer."),
});

/** Saves the clinic details shown on the site and the request retention period. */
export async function saveSettings(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(formValues(formData));
  if (!parsed.success) return failure("Please check the highlighted fields.", fieldErrorsOf(parsed.error));
  try {
    await getDb().clinicSettings.upsert({ where: { id: 1 }, create: { id: 1, ...parsed.data }, update: parsed.data });
  } catch (error) {
    console.error(`admin.settings_save_failed code=${error instanceof Error ? error.name : "unknown"}`);
    return failure("The settings could not be saved. Please try again.");
  }
  revalidateAllPages();
  revalidatePath("/admin", "layout");
  return success("Saved. The website is updated.");
}
