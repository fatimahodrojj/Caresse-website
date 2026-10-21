"use server";

import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { sendClinicEmail } from "@/lib/booking/email";
import { cleanupOldRequests } from "@/lib/admin/cleanup";
import { validateBooking, type BookingFieldErrors } from "@/lib/booking/schema";
import { checkRateLimit, clientIp, hashIp, looksLikeBot } from "@/lib/booking/spam";

/** Form-level messages (BookingForm.formErrors.<code> in messages/*.json). */
export type BookingFormErrorCode = "checkFields" | "rateLimited" | "generic";

// Errors are codes, not sentences: the form shows them in the page's language.
export type BookingFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      fieldErrors: BookingFieldErrors;
      formError: BookingFormErrorCode;
    };

/**
 * Handles the /book form. Privacy: never logs the submitted values
 * (they can include health information); logs contain only a request ID
 * or an error code.
 */
export async function submitBookingRequest(
  _previous: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  // Bots get the same "thank you" as people, so they don't learn anything.
  if (looksLikeBot(formData)) return { status: "success" };

  const raw: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw[key] = value;
  }

  const result = validateBooking(raw);
  if (!result.success) {
    return {
      status: "error",
      fieldErrors: result.fieldErrors,
      formError: "checkFields",
    };
  }

  try {
    const db = getDb();
    const ipHash = hashIp(clientIp(await headers()));
    if ((await checkRateLimit(db, ipHash, result.data.phone)) === "limited") {
      return {
        status: "error",
        fieldErrors: {},
        formError: "rateLimited",
      };
    }

    const saved = await db.appointmentRequest.create({
      data: { ...result.data, consentAt: new Date() },
      select: { id: true },
    });

    // The request is saved, so the person sees success even if the email
    // fails; the clinic can still find it in the database.
    const email = await sendClinicEmail({ ...result.data, id: saved.id });
    if (email === "failed") console.error(`booking.email_failed requestId=${saved.id}`);
    if (email === "skipped") console.warn(`booking.email_skipped requestId=${saved.id}`);

    // Delete handled requests past the retention period (Settings). A
    // failure here must not affect the person's booking.
    await cleanupOldRequests(db).catch((error: unknown) => {
      console.error(`booking.cleanup_failed code=${errorCode(error)}`);
    });

    return { status: "success" };
  } catch (error) {
    console.error(`booking.save_failed code=${errorCode(error)}`);
    return {
      status: "error",
      fieldErrors: {},
      formError: "generic",
    };
  }
}

/** A short, data-free description of an error for the logs. */
function errorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
    return error.code;
  }
  return error instanceof Error ? error.name : "unknown";
}
