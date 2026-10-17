"use client";

import { useRouter } from "next/navigation";
import { SubmitButton, TextField } from "@/components/admin/forms";
import { useAdminForm } from "@/components/admin/useAdminForm";
import { saveSettings } from "@/lib/admin/actions/settings";
import type { ClinicSettings } from "@/lib/settings";

export default function SettingsForm({ settings }: { settings: ClinicSettings }) {
  const router = useRouter();
  const { pending, onSubmit, errors } = useAdminForm(saveSettings, () => router.refresh());
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField name="phone" label="Phone" type="tel" dir="ltr" defaultValue={settings.phone} error={errors.phone} hint="Shown in the footer and used by “Call Us”." required />
        <TextField name="email" label="Email" type="email" defaultValue={settings.email} error={errors.email} required />
        <TextField name="addressEn" label="Address (English)" defaultValue={settings.addressEn} error={errors.addressEn} required />
        <TextField name="addressAr" label="Address (Arabic)" dir="rtl" defaultValue={settings.addressAr} error={errors.addressAr} required />
      </div>
      <TextField name="instagramUrl" label="Instagram link" type="url" dir="ltr" defaultValue={settings.instagramUrl} error={errors.instagramUrl} required />
      <div className="md:w-1/2">
        <TextField
          name="retentionMonths"
          label="Delete handled requests after (months)"
          type="number"
          inputMode="numeric"
          defaultValue={settings.retentionMonths}
          error={errors.retentionMonths}
          hint="Contacted, approved and declined requests are deleted automatically this many months after they were received. New requests are never deleted."
          required
        />
      </div>
      <SubmitButton pending={pending} pendingLabel="Saving…" className="self-start">
        Save settings
      </SubmitButton>
    </form>
  );
}
