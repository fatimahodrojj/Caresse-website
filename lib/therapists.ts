import { cache } from "react";
import { getDb } from "@/lib/db";
import type { Locale } from "@/i18n/routing";

/** A therapist as shown on the public site, in one language. */
export type TeamMember = {
  id: string;
  name: string;
  /** First word of the name, for "About Rawan". */
  firstName: string;
  role: string;
  credential: string;
  experience: string;
  expertise: string[];
  bio: string;
  photoUrl: string;
  /** Optional crop (CSS object-position and zoom). */
  photoPosition: string | null;
  photoZoom: number;
  /** Crop for the wide photo on /team on phones. */
  profilePhotoPosition: string | null;
  character: string | null;
  accent: "sky" | "pink" | "purple";
};

/** Visible therapists in display order, in the given language. */
export const getTeam = cache(async (locale: Locale): Promise<TeamMember[]> => {
  const rows = await getDb().therapist.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } });
  const ar = locale === "ar";
  return rows.map((row) => {
    const name = ar ? row.nameAr : row.nameEn;
    return {
      id: row.id,
      name,
      firstName: name.split(/\s+/)[0] ?? name,
      role: ar ? row.roleAr : row.roleEn,
      credential: ar ? row.credentialAr : row.credentialEn,
      experience: ar ? row.experienceAr : row.experienceEn,
      expertise: ar ? row.expertiseAr : row.expertiseEn,
      bio: ar ? row.bioAr : row.bioEn,
      photoUrl: row.photoUrl,
      photoPosition: row.photoPosition,
      photoZoom: row.photoZoom,
      profilePhotoPosition: row.profilePhotoPosition,
      character: row.character,
      accent: row.accent.toLowerCase() as TeamMember["accent"],
    };
  });
});
