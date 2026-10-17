import AdminNav from "@/components/admin/AdminNav";
import { Suspense } from "react";
import { FlashToast, ToastProvider } from "@/components/admin/Toast";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";

// Signed-in admin pages: navigation, toasts. Each page checks the session
// itself too (layouts are not re-run on every navigation).
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const newCount = await getDb().appointmentRequest.count({ where: { status: "NEW" } });
  return (
    <ToastProvider>
      <Suspense>
        <FlashToast />
      </Suspense>
      <div className="lg:flex">
        <AdminNav newCount={newCount} />
        <main className="min-h-dvh min-w-0 flex-1 px-4 pb-[104px] pt-5 md:px-8 md:pt-8 lg:pb-12 lg:pt-10">
          <div className="mx-auto flex max-w-[960px] flex-col gap-6">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
