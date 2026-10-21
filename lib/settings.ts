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
