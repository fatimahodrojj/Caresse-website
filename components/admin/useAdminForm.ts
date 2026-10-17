"use client";

import { startTransition, useActionState } from "react";
import { useActionToast } from "@/components/admin/Toast";
import { IDLE, type ActionState } from "@/lib/admin/action-state";

type ServerAction = (previous: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Runs a server action from a form and shows the toast. Submits through
 * onSubmit (not the form's action prop) so React keeps what was typed when
 * the server returns errors, instead of resetting the form.
 */
export function useAdminForm(action: ServerAction, onSuccess?: (state: ActionState & { status: "success" }) => void) {
  const [state, formAction, pending] = useActionState(action, IDLE);
  useActionToast(state, onSuccess);
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  return { state, pending, onSubmit, errors };
}
