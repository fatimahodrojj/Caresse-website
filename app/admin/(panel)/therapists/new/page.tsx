import type { Metadata } from "next";
import TherapistForm from "@/components/admin/TherapistForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Add therapist" };

export default async function NewTherapistPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add therapist" back={{ href: "/admin/therapists", label: "Therapists" }} />
      <TherapistForm />
    </>
  );
}
