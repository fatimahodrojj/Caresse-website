"use client";

import { startTransition, useActionState } from "react";
import { useToast } from "@/components/admin/Toast";
import { IDLE, type ActionState } from "@/lib/admin/action-state";

export type ServerAction = (previous: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * useActionState for admin actions: shows the toast as soon as the action
 * returns (from the layout's toast provider, so it still shows when the
 * button that started it disappears), then calls onSuccess.
 */
export function useToastAction(action: ServerAction, onSuccess?: (state: ActionState & { status: "success" }) => void) {
  const toast = useToast();
  return useActionState(async (previous: ActionState, formData: FormData) => {
    const result = await action(previous, formData);
    if (result.status === "success") {
      toast("success", result.message);
      onSuccess?.(result);
    } else if (result.status === "error") {
      toast("error", result.message);
    }
    return result;
  }, IDLE);
}

/**
 * Runs a server action from a form. Submits through onSubmit (not the form's
 * action prop) so React keeps what was typed when the server returns errors,
 * instead of resetting the form.
 */
export function useAdminForm(action: ServerAction, onSuccess?: (state: ActionState & { status: "success" }) => void) {
  const [state, formAction, pending] = useToastAction(action, onSuccess);
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  return { state, pending, onSubmit, errors };
}
