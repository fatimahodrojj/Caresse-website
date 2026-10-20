"use server";

import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { sendClinicEmail } from "@/lib/booking/email";
import { validateBooking, type BookingField } from "@/lib/booking/schema";
import { checkRateLimit, clientIp, hashIp, looksLikeBot } from "@/lib/booking/spam";

export type BookingFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      fieldErrors: Partial<Record<BookingField, string>>;
      formError: string;
    };

const CLINIC_PHONE = "+961 71056803";

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
      formError: "Please check the highlighted fields.",
    };
  }

  try {
    const db = getDb();
    const ipHash = hashIp(clientIp(await headers()));
    if ((await checkRateLimit(db, ipHash, result.data.phone)) === "limited") {
      return {
        status: "error",
        fieldErrors: {},
        formError: `You've sent several requests recently. Please wait a little, or call us at ${CLINIC_PHONE}.`,
      };
    }

    const saved = await db.appointmentRequest.create({
      data: { ...result.data, consentAt: new Date() },
      select: { id: true, createdAt: true },
    });

    // The request is saved, so the person sees success even if the email
    // fails; the clinic can still find it in the database.
    const email = await sendClinicEmail({ ...result.data, ...saved });
    if (email === "failed") console.error(`booking.email_failed requestId=${saved.id}`);
    if (email === "skipped") console.warn(`booking.email_skipped requestId=${saved.id}`);

    return { status: "success" };
  } catch (error) {
    console.error(`booking.save_failed code=${errorCode(error)}`);
    return {
      status: "error",
      fieldErrors: {},
      formError: `Something went wrong and your request was not sent. Please try again, or call us at ${CLINIC_PHONE}.`,
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
