import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import sharp from "sharp";

// Photo uploads from the admin panel, stored in Vercel Blob.
// Accepted: JPG, PNG or WebP (checked from the file contents, not its name),
// up to 5 MB. Each photo is rotated upright, resized to fit `maxSize`,
// converted to WebP and stripped of metadata (e.g. GPS location).

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);

/**
 * Vercel Blob credentials: BLOB_STORE_ID (newer stores; on Vercel the
 * library signs in automatically with the project's OIDC token) or
 * BLOB_READ_WRITE_TOKEN (older stores).
 */
function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

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

  let output: Buffer;
  try {
    output = await sharp(input)
      .rotate()
      .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch (error) {
    console.error(`admin.image_resize_failed code=${error instanceof Error ? error.name : "unknown"}`);
    return { status: "error", message: "This image could not be read. Please choose another JPG, PNG or WebP photo." };
  }

  if (!blobConfigured()) {
    return { status: "error", message: "Photo uploads are not set up yet (Vercel Blob). See docs/admin-setup.md." };
  }

  const pathname = `${folder}/${randomUUID()}.webp`;
  // Public stores give a public URL. Private stores reject public uploads;
  // then the photo is stored privately and served by app/media (same site).
  const failures: string[] = [];
  for (const access of ["public", "private"] as const) {
    try {
      const blob = await put(pathname, output, { access, contentType: "image/webp" });
      return { status: "ok", url: access === "public" ? blob.url : `${MEDIA_PREFIX}${pathname}` };
    } catch (error) {
      failures.push(`${access}:${describeError(error)}`);
    }
  }
  console.error(`admin.upload_failed ${failures.join(" ")}`);
  return {
    status: "error",
    message: "The photo could not be uploaded. Nothing was changed. Please try again; if it keeps failing, check the Blob storage in Vercel.",
  };
}

/** Where photos from a private Blob store are served (app/media/[...path]). */
export const MEDIA_PREFIX = "/media/";

/** Photo paths this site creates: therapists/<uuid>.webp or products/<uuid>.webp. */
export const MEDIA_PATH = /^(therapists|products)\/[0-9a-f-]{36}\.webp$/;

/**
 * Error type plus Vercel Blob's own message (it describes the storage setup,
 * e.g. missing credentials or a private store, and never contains the file
 * or personal data).
 */
function describeError(error: unknown): string {
  if (!(error instanceof Error)) return "unknown";
  const detail = error.message.startsWith("Vercel Blob:") ? ` "${error.message.slice(0, 300)}"` : "";
  return `${error.name}${detail}`;
}

/** Deletes an uploaded photo (photos in /public are left alone). */
export async function deleteImage(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const privatePath = url.startsWith(MEDIA_PREFIX) ? url.slice(MEDIA_PREFIX.length) : null;
  if (!privatePath && !url.includes(".blob.vercel-storage.com")) return;
  if (privatePath && !MEDIA_PATH.test(privatePath)) return;
  try {
    await del(privatePath ?? url);
  } catch (error) {
    console.error(`admin.image_delete_failed ${describeError(error)}`);
  }
}
