import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/AuthForms";
import Icon from "@/components/admin/Icon";
import SettingsForm from "@/components/admin/SettingsForm";
import { Card, PageHeader, buttonClass } from "@/components/admin/ui";
import { logout } from "@/lib/admin/actions/auth";
import { requireAdmin } from "@/lib/admin/auth";
import { getClinicSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const settings = await getClinicSettings();
  return (
    <>
      <PageHeader title="Settings" />

      <Card className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Clinic details</h2>
          <p className="text-sm opacity-75">Shown in the website footer. Changes appear on the website right away.</p>
        </div>
        <SettingsForm settings={settings} />
      </Card>

      <Card className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Your account</h2>
          <p className="text-sm opacity-75">
            Signed in as <span className="font-semibold">{admin.email}</span>
          </p>
        </div>
        <ChangePasswordForm email={admin.email} />
        <form action={logout} className="border-t border-line pt-5">
          <button type="submit" className={buttonClass.secondary}>
            <Icon name="logout" className="size-4" />
            Sign out
          </button>
        </form>
      </Card>
    </>
  );
}
