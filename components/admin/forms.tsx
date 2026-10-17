"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Icon, { type IconName } from "@/components/admin/Icon";
import { buttonClass, inputClass } from "@/components/admin/ui";

/** Submit button that shows a pending label while the form is sending. */
export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  icon,
  className = "",
  pending: pendingProp,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: keyof typeof buttonClass;
  icon?: IconName;
  className?: string;
  /** For forms submitted with useAdminForm (useFormStatus only sees form actions). */
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${buttonClass[variant]} ${className}`}>
      {icon && !pending && <Icon name={icon} className="size-4" />}
      {pending ? pendingLabel : children}
    </button>
  );
}

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  dir?: "ltr" | "rtl";
};

function FieldShell({ id, label, error, hint, children }: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[13px] opacity-70">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-[13px] font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function TextField({
  type = "text",
  defaultValue,
  autoComplete,
  inputMode,
  required,
  ...field
}: FieldProps & {
  type?: "text" | "email" | "password" | "tel" | "url" | "number";
  defaultValue?: string | number;
  autoComplete?: string;
  inputMode?: "decimal" | "numeric" | "tel" | "email" | "url";
  required?: boolean;
}) {
  const id = useId();
  return (
    <FieldShell id={id} {...field}>
      <input
        id={id}
        name={field.name}
        type={type}
        dir={field.dir}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={describedBy(id, field.error, field.hint)}
        step={type === "number" ? "any" : undefined}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function TextArea({ defaultValue, rows = 4, ...field }: FieldProps & { defaultValue?: string; rows?: number }) {
  const id = useId();
  return (
    <FieldShell id={id} {...field}>
      <textarea
        id={id}
        name={field.name}
        dir={field.dir}
        rows={rows}
        defaultValue={defaultValue}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={describedBy(id, field.error, field.hint)}
        className={`${inputClass} resize-y leading-[1.6]`}
      />
    </FieldShell>
  );
}

/** On/off switch posted as "on" when checked. */
export function Toggle({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-control border border-line bg-white px-4 py-3">
      <span className="flex flex-col">
        <span className="text-sm font-bold">{label}</span>
        {hint && <span className="text-[13px] opacity-70">{hint}</span>}
      </span>
      <input id={id} type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative h-7 w-12 shrink-0 rounded-full bg-navy/20 transition-colors after:absolute after:start-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-sky peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-sky"
      />
    </label>
  );
}

/**
 * Photo picker with a preview of the chosen file before saving. The file is
 * checked again on the server (type, size) and resized there.
 */
export function ImageField({
  name,
  label,
  currentUrl,
  error,
  required,
  round,
}: {
  name: string;
  label: string;
  currentUrl?: string | null;
  error?: string;
  required?: boolean;
  round?: boolean;
}) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setLocalError(null);
    if (!file) return setPreview(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setLocalError("Please choose a JPG, PNG or WebP image.");
      event.target.value = "";
      return setPreview(null);
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError("This image is larger than 5 MB. Please choose a smaller one.");
      event.target.value = "";
      return setPreview(null);
    }
    setPreview(URL.createObjectURL(file));
  }

  const shown = preview ?? currentUrl ?? null;
  const message = localError ?? error;
  return (
    <div className="flex flex-col gap-[6px]">
      <span id={`${id}-label`} className="text-sm font-bold">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-4">
        <div className={`relative size-28 shrink-0 overflow-hidden border border-line bg-mist ${round ? "rounded-full" : "rounded-media"}`}>
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element -- local preview of a file that is not uploaded yet
            <img src={shown} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-[13px] opacity-60">No photo</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={id} className={`${buttonClass.secondary} cursor-pointer`}>
            {shown ? "Choose another photo" : "Choose a photo"}
          </label>
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required={required && !currentUrl}
            onChange={onChange}
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-help`}
            className="sr-only"
          />
          <p id={`${id}-help`} className="text-[13px] opacity-70">
            {preview ? "Preview: saved when you press Save." : "JPG, PNG or WebP, up to 5 MB."}
          </p>
        </div>
      </div>
      {message && <p className="text-[13px] font-semibold text-danger">{message}</p>}
    </div>
  );
}
