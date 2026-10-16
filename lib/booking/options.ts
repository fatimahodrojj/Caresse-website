// Choices for the booking form. Values match the Prisma enums in
// prisma/schema.prisma; labels are what people see. Safe to use in the
// browser (no server-only code).

export const APPOINTMENT_FOR_OPTIONS = [
  { value: "CHILD", label: "For my child" },
  { value: "SELF", label: "For myself" },
] as const;

// Therapies (not conditions), matching the footer's Services list, plus an
// option for people who don't know which therapy they need.
export const SERVICE_OPTIONS = [
  { value: "SPEECH_THERAPY", label: "Speech Therapy" },
  { value: "ABA_THERAPY", label: "ABA Therapy" },
  { value: "OCCUPATIONAL_THERAPY", label: "Occupational Therapy" },
  { value: "PSYCHOMOTOR_SUPPORT", label: "Psychomotor Support" },
  { value: "NOT_SURE", label: "Not sure, help me choose" },
] as const;

export const TIME_SLOT_OPTIONS = [
  { value: "MORNING", label: "Morning" },
  { value: "AFTERNOON", label: "Afternoon" },
] as const;

export type AppointmentForValue = (typeof APPOINTMENT_FOR_OPTIONS)[number]["value"];
export type ServiceValue = (typeof SERVICE_OPTIONS)[number]["value"];
export type TimeSlotValue = (typeof TIME_SLOT_OPTIONS)[number]["value"];

export const CHILD_AGE_MAX = 17;
export const NOTES_MAX_LENGTH = 1000;

export function labelFor<T extends string>(
  options: readonly { value: T; label: string }[],
  value: T,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
