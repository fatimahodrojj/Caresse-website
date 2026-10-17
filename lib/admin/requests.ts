import en from "@/messages/en.json";
import type { RequestStatus } from "@/lib/generated/prisma/client";

// Labels and formatting for appointment requests in the admin panel (English).

export const STATUS_FILTERS = ["new", "contacted", "approved", "declined", "all"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  APPROVED: "Approved",
  DECLINED: "Declined",
};

// Navy text on light tints from the design system, so every chip stays readable.
export const STATUS_CHIP: Record<RequestStatus, { chip: string; dot: string }> = {
  NEW: { chip: "bg-rose", dot: "bg-pink" },
  CONTACTED: { chip: "bg-ice", dot: "bg-sky" },
  APPROVED: { chip: "bg-gold/25", dot: "bg-gold" },
  DECLINED: { chip: "bg-navy/10", dot: "bg-navy/50" },
};

export const serviceLabel = (service: keyof typeof en.Therapies) => en.Therapies[service];
export const timeSlotLabel = (slot: keyof typeof en.BookingForm.timeSlots) => en.BookingForm.timeSlots[slot];
export const languageLabel = (language: "EN" | "AR") => (language === "AR" ? "Arabic" : "English");

/** "21 Oct 2026, 14:05" in Beirut time. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Beirut",
  }).format(date);
}

/**
 * wa.me link. WhatsApp needs the country code: "+961…" and "00961…" keep
 * theirs; Lebanese local numbers ("03 123456", "71 234567") get 961.
 */
export function whatsappHref(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("+")) return `https://wa.me/${digits}`;
  if (digits.startsWith("00")) return `https://wa.me/${digits.slice(2)}`;
  if (digits.startsWith("0")) digits = digits.slice(1);
  return `https://wa.me/${digits.length <= 8 ? `961${digits}` : digits}`;
}
