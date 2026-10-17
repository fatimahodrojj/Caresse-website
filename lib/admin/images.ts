import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import sharp from "sharp";

// Photo uploads from the admin panel, stored in Vercel Blob.
// Accepted: JPG, PNG or WebP (checked from the file contents, not its name),
// up to 5 MB. Each photo is rotated upright, resized to fit `maxSize`,
// converted to WebP and stripped of metadata (e.g. GPS location).

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);

export type UploadResult = { status: "ok"; url: string } | { status: "error"; message: string };

/** The uploaded file in a form field, or null when no file was chosen. */
export function fileFrom(formData: FormData, name: string): File | null {
  const value = formData.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}

export async function uploadImage(file: File, folder: "therapists" | "products", maxSize: number): Promise<UploadResult> {
  if (file.size > MAX_UPLOAD_BYTES) return { status: "error", message: "This image is larger than 5 MB. Please choose a smaller one." };

  const input = Buffer.from(await file.arrayBuffer());
  let format: string | undefined;
  try {
    format = (await sharp(input).metadata()).format;
  } catch {
    format = undefined;
  }
  if (!format || !ALLOWED_FORMATS.has(format)) {
    return { status: "error", message: "Please choose a JPG, PNG or WebP image." };
  }

  const output = await sharp(input)
    .rotate()
    .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { status: "error", message: "Photo uploads are not set up yet (Vercel Blob). See docs/admin-setup.md." };
  }
  try {
    const blob = await put(`${folder}/${randomUUID()}.webp`, output, { access: "public", contentType: "image/webp" });
    return { status: "ok", url: blob.url };
  } catch (error) {
    console.error(`admin.upload_failed code=${error instanceof Error ? error.name : "unknown"}`);
    return { status: "error", message: "The photo could not be uploaded. Please try again." };
  }
}

/** Deletes a photo from Vercel Blob (photos in /public are left alone). */
export async function deleteImage(url: string | null | undefined): Promise<void> {
  if (!url || !url.includes(".public.blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch (error) {
    console.error(`admin.image_delete_failed code=${error instanceof Error ? error.name : "unknown"}`);
  }
}
