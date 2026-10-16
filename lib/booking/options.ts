// Choices for the booking form. Values match the Prisma enums in
// prisma/schema.prisma; labels are what people see. Safe to use in the
// browser (no server-only code).

export const APPOINTMENT_FOR_OPTIONS = [
  { value: "CHILD", label: "For my child" },
  { value: "SELF", label: "For myself" },
] as const;

// Service labels match the "Our Services" cards (data/services.ts).
export const SERVICE_OPTIONS = [
  { value: "AUTISM", label: "Autism" },
  { value: "SPEECH_LANGUAGE", label: "Speech & Language Disorders" },
  { value: "NEURO_DEVELOPMENTAL", label: "Neuro Developmental Disorder" },
  { value: "FEEDING", label: "Feeding Disorders" },
  { value: "FAMILY_SUPPORT", label: "Family Support" },
  { value: "CO_THERAPY", label: "Co-Therapy" },
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
