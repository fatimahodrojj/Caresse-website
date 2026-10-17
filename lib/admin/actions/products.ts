"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { failure, fieldErrorsOf, formValues, success, type ActionState } from "@/lib/admin/action-state";
import { withFlash } from "@/lib/admin/flash";
import { deleteImage, fileFrom, uploadImage } from "@/lib/admin/images";
import { moveInOrder } from "@/lib/admin/reorder";
import { revalidateShopPages } from "@/lib/admin/revalidate";

const text = (label: string, max: number) =>
  z.string().trim().min(1, `Enter the ${label}.`).max(max, `Keep the ${label} to ${max} characters or fewer.`);

const productSchema = z.object({
  id: z.string().max(40).optional(),
  nameEn: text("name in English", 80),
  nameAr: text("name in Arabic", 80),
  descriptionEn: text("description in English", 400),
  descriptionAr: text("description in Arabic", 400),
  // "25", "25.5", "25,50" or "$25" → cents.
  price: z
    .string()
    .trim()
    .transform((value) => value.replace(/^\$/, "").replace(",", "."))
    .refine((value) => /^\d{1,6}(\.\d{1,2})?$/.test(value), "Enter a price in dollars, e.g. 25 or 12.50.")
    .transform((value) => Math.round(Number(value) * 100)),
  visible: z.literal("on").optional(),
});

/** Creates (no id) or updates a product, with an optional new photo. */
export async function saveProduct(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(formValues(formData));
  if (!parsed.success) return failure("Please check the highlighted fields.", fieldErrorsOf(parsed.error));
  const { id, visible, price, ...fields } = parsed.data;

  const db = getDb();
  const existing = id ? await db.product.findUnique({ where: { id }, select: { imageUrl: true } }) : null;
  if (id && !existing) return failure("This product no longer exists. Please reload the page.");

  const file = fileFrom(formData, "photo");
  if (!file && !existing) return failure("Please check the highlighted fields.", { photo: "Choose a photo." });
  let imageUrl: string | undefined;
  if (file) {
    const upload = await uploadImage(file, "products", 1000);
    if (upload.status === "error") return failure(upload.message, { photo: upload.message });
    imageUrl = upload.url;
  }

  const data = { ...fields, priceCents: price, visible: visible === "on", ...(imageUrl ? { imageUrl } : {}) };
  try {
    if (existing && id) {
      await db.product.update({ where: { id }, data });
    } else {
      const last = await db.product.aggregate({ _max: { sortOrder: true } });
      await db.product.create({ data: { ...data, imageUrl: imageUrl!, sortOrder: (last._max.sortOrder ?? 0) + 1 } });
    }
  } catch (error) {
    console.error(`admin.product_save_failed code=${error instanceof Error ? error.name : "unknown"}`);
    await deleteImage(imageUrl);
    return failure("The product could not be saved. Please try again.");
  }
  if (imageUrl && existing) await deleteImage(existing.imageUrl);

  revalidateShopPages();
  revalidatePath("/admin/shop");
  if (!id) redirect(withFlash("/admin/shop", "product-created"));
  return success("Saved. The website is updated.");
}

export async function deleteProduct(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ id: z.string().min(1).max(40) }).safeParse(formValues(formData));
  if (!parsed.success) return failure("Something went wrong. Please reload the page.");
  try {
    const removed = await getDb().product.delete({ where: { id: parsed.data.id }, select: { imageUrl: true } });
    await deleteImage(removed.imageUrl);
  } catch (error) {
    console.error(`admin.product_delete_failed code=${error instanceof Error ? error.name : "unknown"}`);
    return failure("This product could not be deleted. It may have been deleted already.");
  }
  revalidateShopPages();
  revalidatePath("/admin/shop");
  redirect(withFlash("/admin/shop", "product-deleted"));
}

export async function moveProduct(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ id: z.string().min(1).max(40), direction: z.enum(["up", "down"]) }).safeParse(formValues(formData));
  if (!parsed.success) return failure("Something went wrong. Please reload the page.");
  const db = getDb();
  const all = await db.product.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true } });
  const order = moveInOrder(all.map((row) => row.id), parsed.data.id, parsed.data.direction);
  if (!order) return failure("This product cannot move further.");
  await db.$transaction(order.map((rowId, position) => db.product.update({ where: { id: rowId }, data: { sortOrder: position + 1 } })));
  revalidateShopPages();
  revalidatePath("/admin/shop");
  return success(parsed.data.direction === "up" ? "Moved up." : "Moved down.");
}
