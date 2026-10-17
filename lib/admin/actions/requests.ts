"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { failure, formValues, success, type ActionState } from "@/lib/admin/action-state";
import { withFlash } from "@/lib/admin/flash";

// Request actions. Logs contain only request IDs and error codes.

const idField = z.string().min(1).max(40);

const statusSchema = z.object({
  id: idField,
  status: z.enum(["CONTACTED", "APPROVED", "DECLINED"]),
});

const STATUS_MESSAGES = {
  CONTACTED: "Marked as contacted.",
  APPROVED: "Request approved.",
  DECLINED: "Request declined.",
} as const;

export async function setRequestStatus(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = statusSchema.safeParse(formValues(formData));
  if (!parsed.success) return failure("Something went wrong. Please reload the page.");
  const { id, status } = parsed.data;
  try {
    await getDb().appointmentRequest.update({ where: { id }, data: { status, statusChangedAt: new Date() } });
  } catch (error) {
    console.error(`admin.request_status_failed requestId=${id} code=${errorCode(error)}`);
    return failure("This request could not be updated. It may have been deleted.");
  }
  revalidatePath("/admin", "layout");
  return success(STATUS_MESSAGES[status]);
}

export async function deleteRequest(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ id: idField }).safeParse(formValues(formData));
  if (!parsed.success) return failure("Something went wrong. Please reload the page.");
  try {
    await getDb().appointmentRequest.delete({ where: { id: parsed.data.id } });
  } catch (error) {
    console.error(`admin.request_delete_failed requestId=${parsed.data.id} code=${errorCode(error)}`);
    return failure("This request could not be deleted. It may have been deleted already.");
  }
  revalidatePath("/admin", "layout");
  redirect(withFlash("/admin", "request-deleted"));
}

function errorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string") return error.code;
  return error instanceof Error ? error.name : "unknown";
}
