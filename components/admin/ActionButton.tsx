"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Icon, { type IconName } from "@/components/admin/Icon";
import { SubmitButton } from "@/components/admin/forms";
import { buttonClass } from "@/components/admin/ui";
import { useToastAction, type ServerAction } from "@/components/admin/useAdminForm";

/**
 * A button that runs a server action, then shows a toast and refreshes the
 * page. With `confirm`, it first asks in a dialog (used for every delete and
 * decline). Actions that remove the current page redirect on the server.
 */
export default function ActionButton({
  action,
  fields,
  label,
  pendingLabel = "Working…",
  icon,
  variant = "secondary",
  confirm,
  className = "",
  ariaLabel,
}: {
  action: ServerAction;
  fields: Record<string, string>;
  label: string;
  pendingLabel?: string;
  icon?: IconName;
  variant?: keyof typeof buttonClass;
  confirm?: { title: string; body: string; confirmLabel: string; danger?: boolean };
  className?: string;
  /** For icon-only buttons. */
  ariaLabel?: string;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [, formAction] = useToastAction(action, () => {
    dialogRef.current?.close();
    router.refresh();
  });

  const hidden = Object.entries(fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />);
  const titleId = `confirm-${Object.values(fields).join("-")}-${label.replace(/\W+/g, "-")}`;

  if (!confirm) {
    return (
      <form action={formAction} className={className}>
        {hidden}
        <SubmitButton variant={variant} icon={icon} pendingLabel={pendingLabel} className="w-full" ariaLabel={ariaLabel}>
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
        aria-labelledby={titleId}
        className="m-auto w-[min(92vw,420px)] rounded-card border-0 bg-white p-0 text-navy shadow-2xl backdrop:bg-navy/50"
      >
        <form action={formAction} className="flex flex-col gap-4 p-6">
          {hidden}
          <h2 id={titleId} className="font-heading text-2xl">
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
