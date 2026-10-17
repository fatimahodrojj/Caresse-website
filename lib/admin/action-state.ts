import type { z } from "zod";

/** Result of an admin form action, shown as a toast and field errors. */
export type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string; id?: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export const IDLE: ActionState = { status: "idle" };

export function success(message: string, id?: string): ActionState {
  return { status: "success", message, id };
}

export function failure(message: string, fieldErrors?: Record<string, string>): ActionState {
  return { status: "error", message, fieldErrors };
}

/** First zod error message per field, for showing under each input. */
export function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    errors[field] ??= issue.message;
  }
  return errors;
}

/** String fields of a FormData, without files. */
export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}
