"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { failure, fieldErrorsOf, formValues, success, type ActionState } from "@/lib/admin/action-state";
import { withFlash } from "@/lib/admin/flash";
import { deleteImage, fileFrom, uploadImage } from "@/lib/admin/images";
import { revalidateTeamPages } from "@/lib/admin/revalidate";
import { moveInOrder } from "@/lib/admin/reorder";
import { CHARACTER_OPTIONS } from "@/lib/characters";

const text = (label: string, max: number) =>
  z.string().trim().min(1, `Enter the ${label}.`).max(max, `Keep the ${label} to ${max} characters or fewer.`);
const optionalText = (max: number) => z.string().trim().max(max, `Keep this to ${max} characters or fewer.`);
/** One item per line; empty lines are ignored. */
const lines = z
  .string()
  .max(1000)
  .transform((value) => value.split("\n").map((line) => line.trim()).filter(Boolean))
  .refine((items) => items.length <= 12, "Use 12 lines or fewer.")
  .refine((items) => items.every((item) => item.length <= 60), "Keep each line to 60 characters or fewer.");

const therapistSchema = z.object({
  id: z.string().max(40).optional(),
  nameEn: text("name in English", 80),
  nameAr: text("name in Arabic", 80),
  roleEn: text("role in English", 160),
  roleAr: text("role in Arabic", 160),
  credentialEn: optionalText(200),
  credentialAr: optionalText(200),
  experienceEn: optionalText(200),
  experienceAr: optionalText(200),
  expertiseEn: lines,
  expertiseAr: lines,
  bioEn: text("bio in English", 2000),
  bioAr: text("bio in Arabic", 2000),
  character: z.union([z.enum(CHARACTER_OPTIONS), z.literal("")], { error: "Choose a character." }),
  accent: z.enum(["SKY", "PINK", "PURPLE"], { error: "Choose a colour." }),
  visible: z.literal("on").optional(),
});

/** Creates (no id) or updates a therapist, with an optional new photo. */
export async function saveTherapist(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = therapistSchema.safeParse({ expertiseEn: "", expertiseAr: "", ...formValues(formData) });
  if (!parsed.success) return failure("Please check the highlighted fields.", fieldErrorsOf(parsed.error));
  const { id, visible, character, ...fields } = parsed.data;

  const db = getDb();
  const existing = id ? await db.therapist.findUnique({ where: { id }, select: { photoUrl: true } }) : null;
  if (id && !existing) return failure("This therapist no longer exists. Please reload the page.");

  const file = fileFrom(formData, "photo");
  if (!file && !existing) return failure("Please check the highlighted fields.", { photo: "Choose a photo." });
  let photo: { photoUrl: string; photoPosition: null; photoZoom: number; profilePhotoPosition: null } | undefined;
  if (file) {
    const upload = await uploadImage(file, "therapists", 1200);
    if (upload.status === "error") return failure(upload.message, { photo: upload.message });
    // A new photo is framed by default; the old crop belonged to the old photo.
    photo = { photoUrl: upload.url, photoPosition: null, photoZoom: 1, profilePhotoPosition: null };
  }

  const data = { ...fields, ...photo, character: character || null, visible: visible === "on" };
  let savedId: string;
  try {
    if (existing && id) {
      await db.therapist.update({ where: { id }, data });
      savedId = id;
    } else {
      const last = await db.therapist.aggregate({ _max: { sortOrder: true } });
      const created = await db.therapist.create({
        data: { ...data, photoUrl: photo!.photoUrl, sortOrder: (last._max.sortOrder ?? 0) + 1 },
        select: { id: true },
      });
      savedId = created.id;
    }
  } catch (error) {
    console.error(`admin.therapist_save_failed code=${error instanceof Error ? error.name : "unknown"}`);
    if (photo) await deleteImage(photo.photoUrl);
    return failure("The therapist could not be saved. Please try again.");
  }
  if (photo && existing) await deleteImage(existing.photoUrl);

  revalidateTeamPages();
  revalidatePath("/admin/therapists");
  if (!id) redirect(withFlash("/admin/therapists", "therapist-created"));
  return success("Saved. The website is updated.", savedId);
}

export async function deleteTherapist(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ id: z.string().min(1).max(40) }).safeParse(formValues(formData));
  if (!parsed.success) return failure("Something went wrong. Please reload the page.");
  const db = getDb();
  try {
    const removed = await db.therapist.delete({ where: { id: parsed.data.id }, select: { photoUrl: true } });
    await deleteImage(removed.photoUrl);
  } catch (error) {
    console.error(`admin.therapist_delete_failed code=${error instanceof Error ? error.name : "unknown"}`);
    return failure("This therapist could not be deleted. They may have been deleted already.");
  }
  revalidateTeamPages();
  revalidatePath("/admin/therapists");
  redirect(withFlash("/admin/therapists", "therapist-deleted"));
}

/** Moves a therapist one place up or down (swaps with the neighbour). */
export async function moveTherapist(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ id: z.string().min(1).max(40), direction: z.enum(["up", "down"]) }).safeParse(formValues(formData));
  if (!parsed.success) return failure("Something went wrong. Please reload the page.");
  const db = getDb();
  const all = await db.therapist.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true } });
  const order = moveInOrder(all.map((row) => row.id), parsed.data.id, parsed.data.direction);
  if (!order) return failure("This therapist cannot move further.");
  await db.$transaction(order.map((rowId, position) => db.therapist.update({ where: { id: rowId }, data: { sortOrder: position + 1 } })));
  revalidateTeamPages();
  revalidatePath("/admin/therapists");
  return success(parsed.data.direction === "up" ? "Moved up." : "Moved down.");
}
