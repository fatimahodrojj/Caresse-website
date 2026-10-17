import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Requests" };

export default async function RequestsPage() {
  await requireAdmin();
  return <PageHeader title="Requests" />;
}
