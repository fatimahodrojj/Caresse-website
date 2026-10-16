import { z } from "zod";
import {
  CHILD_AGE_MAX,
  NOTES_MAX_LENGTH,
  type AppointmentForValue,
  type ServiceValue,
  type TimeSlotValue,
} from "@/lib/booking/options";

// Server-side validation for the booking form. The server always runs this;
// the browser only adds `required` attributes for convenience.

// Letters in any script (Arabic, accented Latin…), plus spaces, apostrophes,
// dots and hyphens. Must start with a letter.
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;

function nameField(what: string) {
  return z
    .string({ error: `Please enter ${what}.` })
    .trim()
    .min(1, `Please enter ${what}.`)
    .max(50, `Please keep ${what} to 50 characters or fewer.`)
    .regex(NAME_PATTERN, `Please use letters only for ${what}.`);
}

/** Digits only, keeping a leading "+": "+961 71-234 567" → "+96171234567". */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  return (trimmed.startsWith("+") ? "+" : "") + trimmed.replace(/\D/g, "");
}

const PHONE_ERROR = "Please enter a valid phone number, e.g. +961 71 234 567.";

const phoneField = z
  .string({ error: "Please enter your phone number." })
  .trim()
  .min(1, "Please enter your phone number.")
  .regex(/^\+?[\d\s\-().]+$/, PHONE_ERROR)
  .transform(normalizePhone)
  .refine((phone) => {
    const digits = phone.replace("+", "").length;
    return digits >= 7 && digits <= 15;
  }, PHONE_ERROR);

const childFirstNameField = nameField("your child's first name");

const bookingFields = z.object({
  appointmentFor: z.enum(["CHILD", "SELF"] satisfies AppointmentForValue[], {
    error: "Please choose who this appointment is for.",
  }),
  // Checked below, only when the appointment is for a child.
  childFirstName: z.string().optional(),
  childAge: z.string().optional(),
  firstName: nameField("your first name"),
  lastName: nameField("your last name"),
  phone: phoneField,
  service: z.enum(
    [
      "AUTISM",
      "SPEECH_LANGUAGE",
      "NEURO_DEVELOPMENTAL",
      "FEEDING",
      "FAMILY_SUPPORT",
      "CO_THERAPY",
    ] satisfies ServiceValue[],
    { error: "Please select a therapy service." },
  ),
  timeSlot: z.enum(["MORNING", "AFTERNOON"] satisfies TimeSlotValue[], {
    error: "Please select a preferred time slot.",
  }),
  notes: z
    .string()
    .trim()
    .max(NOTES_MAX_LENGTH, `Please keep this under ${NOTES_MAX_LENGTH.toLocaleString("en-US")} characters.`)
    .optional(),
  consent: z.literal("on", {
    error: "Please tick this box so we can contact you about your request.",
  }),
});

/** Field names the form can show an error under. */
export type BookingField = keyof z.input<typeof bookingFields>;

/** Errors for the child fields; only checked when the appointment is for a child. */
function childFieldErrors(raw: Record<string, unknown>): Partial<Record<BookingField, string>> {
  if (raw.appointmentFor !== "CHILD") return {};
  const errors: Partial<Record<BookingField, string>> = {};

  const childName = childFirstNameField.safeParse(raw.childFirstName ?? "");
  if (!childName.success) {
    errors.childFirstName =
      childName.error.issues[0]?.message ?? "Please enter your child's first name.";
  }

  const age = typeof raw.childAge === "string" ? raw.childAge.trim() : "";
  if (age === "") {
    errors.childAge = "Please enter your child's age.";
  } else if (!/^\d{1,2}$/.test(age) || Number(age) > CHILD_AGE_MAX) {
    errors.childAge = `Please enter an age from 0 to ${CHILD_AGE_MAX} in whole years.`;
  }
  return errors;
}

export type BookingInput = {
  appointmentFor: AppointmentForValue;
  firstName: string;
  lastName: string;
  phone: string;
  childFirstName: string | null;
  childAge: number | null;
  service: ServiceValue;
  timeSlot: TimeSlotValue;
  notes: string | null;
};

export type BookingValidation =
  | { success: true; data: BookingInput }
  | { success: false; fieldErrors: Partial<Record<BookingField, string>> };

/**
 * Validates the submitted form. All fields are checked in one pass (including
 * the child fields), so every problem is reported at once.
 */
export function validateBooking(raw: Record<string, unknown>): BookingValidation {
  const parsed = bookingFields.safeParse(raw);
  const fieldErrors: Partial<Record<BookingField, string>> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as BookingField | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
  }
  Object.assign(fieldErrors, childFieldErrors(raw));

  if (!parsed.success || Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  const data = parsed.data;
  const forChild = data.appointmentFor === "CHILD";
  return {
    success: true,
    data: {
      appointmentFor: data.appointmentFor,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      // Child details are kept only when the appointment is for a child.
      childFirstName: forChild ? String(raw.childFirstName).trim() : null,
      childAge: forChild ? Number(String(raw.childAge).trim()) : null,
      service: data.service,
      timeSlot: data.timeSlot,
      notes: data.notes ? data.notes : null,
    },
  };
}

export const BOOKING_FIELDS = [
  "appointmentFor",
  "childFirstName",
  "childAge",
  "firstName",
  "lastName",
  "phone",
  "service",
  "timeSlot",
  "notes",
  "consent",
] as const satisfies readonly BookingField[];
