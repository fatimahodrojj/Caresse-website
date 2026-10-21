import { cache } from "react";
import { getDb } from "@/lib/db";

export type ClinicSettings = {
  phone: string;
  email: string;
  addressEn: string;
  addressAr: string;
  instagramUrl: string;
  retentionMonths: number;
};

// Used if the settings row is ever missing (the migration creates it).
export const DEFAULT_SETTINGS: ClinicSettings = {
  phone: "+961 71056803",
  email: "caresseclinic@gmail.com",
  addressEn: "Airport Road, Zaarour Center, Third floor",
  addressAr: "طريق المطار، مركز زعرور، الطابق الثالث",
  instagramUrl: "https://www.instagram.com/caresseclinic",
  retentionMonths: 12,
};

/** Clinic contact details and admin settings (edited in /admin/settings). */
export const getClinicSettings = cache(async (): Promise<ClinicSettings> => {
  const row = await getDb().clinicSettings.findUnique({ where: { id: 1 } });
  return row ?? DEFAULT_SETTINGS;
});

/** tel: link target: digits with an optional leading "+". */
export function telHref(phone: string): string {
  const trimmed = phone.trim();
  return `tel:${trimmed.startsWith("+") ? "+" : ""}${trimmed.replace(/\D/g, "")}`;
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
