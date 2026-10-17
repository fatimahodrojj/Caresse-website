"use client";

import { useRef } from "react";
import { SubmitButton, TextField } from "@/components/admin/forms";
import { useAdminForm } from "@/components/admin/useAdminForm";
import { changePassword, login, setupFirstAdmin } from "@/lib/admin/actions/auth";

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-control bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
      {message}
    </p>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const { state, pending, onSubmit } = useAdminForm(login);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormError message={state.status === "error" ? state.message : undefined} />
      {next && <input type="hidden" name="next" value={next} />}
      <TextField name="email" label="Email" type="email" autoComplete="username" inputMode="email" required />
      <TextField name="password" label="Password" type="password" autoComplete="current-password" required />
      <SubmitButton pending={pending} pendingLabel="Signing in…" className="mt-2 min-h-12">
        Sign in
      </SubmitButton>
    </form>
  );
}

export function SetupForm() {
  const { state, pending, onSubmit, errors } = useAdminForm(setupFirstAdmin);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormError message={state.status === "error" ? state.message : undefined} />
      <TextField
        name="token"
        label="Setup token"
        type="password"
        autoComplete="off"
        hint="The ADMIN_SETUP_TOKEN value you set in Vercel."
        error={errors.token}
        required
      />
      <TextField name="email" label="Your email" type="email" autoComplete="username" inputMode="email" error={errors.email} required />
      <TextField
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        hint="At least 12 characters. A short sentence is easy to remember."
        error={errors.password}
        required
      />
      <TextField name="confirm" label="Repeat the password" type="password" autoComplete="new-password" error={errors.confirm} required />
      <SubmitButton pending={pending} pendingLabel="Creating account…" className="mt-2 min-h-12">
        Create admin account
      </SubmitButton>
    </form>
  );
}

export function ChangePasswordForm({ email }: { email: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { pending, onSubmit, errors } = useAdminForm(changePassword, () => formRef.current?.reset());
  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Lets password managers file the new password under the right account. */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <TextField name="current" label="Current password" type="password" autoComplete="current-password" error={errors.current} required />
      <TextField
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        hint="At least 12 characters."
        error={errors.password}
        required
      />
      <TextField name="confirm" label="Repeat the new password" type="password" autoComplete="new-password" error={errors.confirm} required />
      <SubmitButton pending={pending} pendingLabel="Changing…" className="self-start">
        Change password
      </SubmitButton>
    </form>
  );
}
