import { z } from "zod";
import {
  APPOINTMENT_FOR_VALUES,
  CHILD_AGE_MAX,
  NOTES_MAX_LENGTH,
  SERVICE_VALUES,
  TIME_SLOT_VALUES,
  type AppointmentForValue,
  type ServiceValue,
  type TimeSlotValue,
} from "@/lib/booking/options";

// Server-side validation for the booking form. The server always runs this.
// Errors are returned as codes (e.g. "phoneInvalid"); the form shows them in
// the page's language from messages/*.json (BookingForm.errors.<code>).

/** Error codes; each one has a message under BookingForm.errors. */
export type BookingErrorCode =
  | "appointmentForRequired"
  | "childFirstNameRequired"
  | "childFirstNameTooLong"
  | "childFirstNameLettersOnly"
  | "childAgeRequired"
  | "childAgeInvalid"
  | "firstNameRequired"
  | "firstNameTooLong"
  | "firstNameLettersOnly"
  | "lastNameRequired"
  | "lastNameTooLong"
  | "lastNameLettersOnly"
  | "phoneRequired"
  | "phoneInvalid"
  | "serviceRequired"
  | "timeSlotRequired"
  | "notesTooLong"
  | "consentRequired";

// Letters in any script (Arabic, accented Latin…), plus spaces, apostrophes,
// dots and hyphens. Must start with a letter.
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;

function nameField(field: "firstName" | "lastName" | "childFirstName") {
  const required: BookingErrorCode = `${field}Required`;
  return z
    .string({ error: required })
    .trim()
    .min(1, required)
    .max(50, `${field}TooLong` satisfies BookingErrorCode)
    .regex(NAME_PATTERN, `${field}LettersOnly` satisfies BookingErrorCode);
}

/** Digits only, keeping a leading "+": "+961 71-234 567" → "+96171234567". */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  return (trimmed.startsWith("+") ? "+" : "") + trimmed.replace(/\D/g, "");
}

const phoneField = z
  .string({ error: "phoneRequired" satisfies BookingErrorCode })
  .trim()
  .min(1, "phoneRequired" satisfies BookingErrorCode)
  .regex(/^\+?[\d\s\-().]+$/, "phoneInvalid" satisfies BookingErrorCode)
  .transform(normalizePhone)
  .refine((phone) => {
    const digits = phone.replace("+", "").length;
    return digits >= 7 && digits <= 15;
  }, "phoneInvalid" satisfies BookingErrorCode);

const childFirstNameField = nameField("childFirstName");

const bookingFields = z.object({
  appointmentFor: z.enum(APPOINTMENT_FOR_VALUES, {
    error: "appointmentForRequired" satisfies BookingErrorCode,
  }),
  // Checked below, only when the appointment is for a child.
  childFirstName: z.string().optional(),
  childAge: z.string().optional(),
  firstName: nameField("firstName"),
  lastName: nameField("lastName"),
  phone: phoneField,
  service: z.enum(SERVICE_VALUES, { error: "serviceRequired" satisfies BookingErrorCode }),
  timeSlot: z.enum(TIME_SLOT_VALUES, { error: "timeSlotRequired" satisfies BookingErrorCode }),
  notes: z
    .string()
    .trim()
    .max(NOTES_MAX_LENGTH, "notesTooLong" satisfies BookingErrorCode)
    .optional(),
  consent: z.literal("on", { error: "consentRequired" satisfies BookingErrorCode }),
});

/** Field names the form can show an error under. */
export type BookingField = keyof z.input<typeof bookingFields>;

export type BookingFieldErrors = Partial<Record<BookingField, BookingErrorCode>>;

/** Errors for the child fields; only checked when the appointment is for a child. */
function childFieldErrors(raw: Record<string, unknown>): BookingFieldErrors {
  if (raw.appointmentFor !== "CHILD") return {};
  const errors: BookingFieldErrors = {};

  const childName = childFirstNameField.safeParse(raw.childFirstName ?? "");
  if (!childName.success) {
    errors.childFirstName =
      (childName.error.issues[0]?.message as BookingErrorCode | undefined) ?? "childFirstNameRequired";
  }

  const age = typeof raw.childAge === "string" ? raw.childAge.trim() : "";
  if (age === "") {
    errors.childAge = "childAgeRequired";
  } else if (!/^\d{1,2}$/.test(age) || Number(age) > CHILD_AGE_MAX) {
    errors.childAge = "childAgeInvalid";
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
  | { success: false; fieldErrors: BookingFieldErrors };

/**
 * Validates the submitted form. All fields are checked in one pass (including
 * the child fields), so every problem is reported at once.
 */
export function validateBooking(raw: Record<string, unknown>): BookingValidation {
  const parsed = bookingFields.safeParse(raw);
  const fieldErrors: BookingFieldErrors = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as BookingField | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message as BookingErrorCode;
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
