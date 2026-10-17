import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/AuthForms";
import Icon from "@/components/admin/Icon";
import { Card, PageHeader, buttonClass } from "@/components/admin/ui";
import { logout } from "@/lib/admin/actions/auth";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const admin = await requireAdmin();
  return (
    <>
      <PageHeader title="Settings" />
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
