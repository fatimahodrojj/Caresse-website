import { get } from "@vercel/blob";
import { MEDIA_PATH } from "@/lib/admin/images";

/**
 * Serves therapist and product photos when the Vercel Blob store is private
 * (lib/admin/images.ts). Only the photo files the admin creates can be read
 * (therapists/<uuid>.webp, products/<uuid>.webp). File names are random and
 * never reused, so browsers and the CDN may cache them for a long time.
 */
export async function GET(_request: Request, { params }: RouteContext<"/media/[...path]">) {
  const pathname = (await params).path.join("/");
  if (!MEDIA_PATH.test(pathname)) return new Response("Not found", { status: 404 });

  try {
    const result = await get(pathname, { access: "private" });
    if (!result || result.statusCode !== 200) return new Response("Not found", { status: 404 });
    return new Response(result.stream, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(`media.read_failed code=${error instanceof Error ? error.name : "unknown"}`);
    return new Response("Not found", { status: 404 });
  }
}
