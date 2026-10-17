"use client";

import { useActionState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Icon, { type IconName } from "@/components/admin/Icon";
import { SubmitButton } from "@/components/admin/forms";
import { buttonClass } from "@/components/admin/ui";
import { useActionToast } from "@/components/admin/Toast";
import { IDLE, type ActionState } from "@/lib/admin/action-state";

type ServerAction = (previous: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * A button that runs a server action, then shows a toast. With `confirm`,
 * it first asks in a dialog (used for every delete and decline).
 * After success it refreshes the page, or goes to `successHref`.
 */
export default function ActionButton({
  action,
  fields,
  label,
  pendingLabel = "Working…",
  icon,
  variant = "secondary",
  confirm,
  successHref,
  className = "",
}: {
  action: ServerAction;
  fields: Record<string, string>;
  label: string;
  pendingLabel?: string;
  icon?: IconName;
  variant?: keyof typeof buttonClass;
  confirm?: { title: string; body: string; confirmLabel: string; danger?: boolean };
  successHref?: string;
  className?: string;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction] = useActionState(action, IDLE);
  const onSuccess = useCallback(() => {
    dialogRef.current?.close();
    if (successHref) router.push(successHref);
    else router.refresh();
  }, [router, successHref]);
  useActionToast(state, onSuccess);

  const hidden = Object.entries(fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />);

  if (!confirm) {
    return (
      <form action={formAction} className={className}>
        {hidden}
        <SubmitButton variant={variant} icon={icon} pendingLabel={pendingLabel} className="w-full">
          {label}
        </SubmitButton>
      </form>
    );
  }

  return (
    <div className={className}>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className={`${buttonClass[variant]} w-full`}>
        {icon && <Icon name={icon} className="size-4" />}
        {label}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={`${fields.id ?? "action"}-${label}-title`}
        className="m-auto w-[min(92vw,420px)] rounded-card border-0 bg-white p-0 text-navy shadow-2xl backdrop:bg-navy/50"
      >
        <form action={formAction} className="flex flex-col gap-4 p-6">
          {hidden}
          <h2 id={`${fields.id ?? "action"}-${label}-title`} className="font-heading text-2xl">
            {confirm.title}
          </h2>
          <p className="text-sm leading-[1.6] opacity-80">{confirm.body}</p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => dialogRef.current?.close()} className={buttonClass.secondary}>
              Cancel
            </button>
            <SubmitButton variant={confirm.danger ? "danger" : "primary"} pendingLabel={pendingLabel}>
              {confirm.confirmLabel}
            </SubmitButton>
          </div>
        </form>
      </dialog>
    </div>
  );
}
