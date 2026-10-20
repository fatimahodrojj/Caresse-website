import type { Locale } from "@/i18n/routing";

// Values for the booking form's choices. They match the Prisma enums in
// prisma/schema.prisma and are stored as-is in every language. The labels
// people see live in messages/*.json (BookingForm.appointmentFor,
// Therapies, BookingForm.timeSlots). Safe to use in the browser.

export const APPOINTMENT_FOR_VALUES = ["CHILD", "SELF"] as const;

// Therapies (not conditions), plus an option for people who don't know which
// therapy they need.
export const SERVICE_VALUES = [
  "SPEECH_THERAPY",
  "ABA_THERAPY",
  "OCCUPATIONAL_THERAPY",
  "PSYCHOMOTOR_SUPPORT",
  "NOT_SURE",
] as const;

export const TIME_SLOT_VALUES = ["MORNING", "AFTERNOON"] as const;

/** Language of the form, sent in a hidden field. */
export const LANGUAGE_VALUES = ["EN", "AR"] as const;

export type AppointmentForValue = (typeof APPOINTMENT_FOR_VALUES)[number];
export type ServiceValue = (typeof SERVICE_VALUES)[number];
export type TimeSlotValue = (typeof TIME_SLOT_VALUES)[number];
export type LanguageValue = (typeof LANGUAGE_VALUES)[number];

export const FORM_LANGUAGE: Record<Locale, LanguageValue> = { en: "EN", ar: "AR" };

export const CHILD_AGE_MAX = 17;
export const NOTES_MAX_LENGTH = 1000;
