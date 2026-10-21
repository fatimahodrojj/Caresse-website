import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActionButton from "@/components/admin/ActionButton";
import TherapistForm from "@/components/admin/TherapistForm";
import { Card, PageHeader } from "@/components/admin/ui";
import { deleteTherapist } from "@/lib/admin/actions/therapists";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Edit therapist" };

export default async function EditTherapistPage({ params }: PageProps<"/admin/therapists/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const therapist = await getDb().therapist.findUnique({ where: { id } });
  if (!therapist) notFound();

  return (
    <>
      <PageHeader title={therapist.nameEn} back={{ href: "/admin/therapists", label: "Therapists" }} />
      <TherapistForm therapist={therapist} />
      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Delete therapist</h2>
        <p className="text-sm opacity-75">Removes {therapist.nameEn} from the website and from this list. To keep them here, hide them instead.</p>
        <ActionButton
          action={deleteTherapist}
          fields={{ id: therapist.id }}
          label="Delete therapist"
          icon="trash"
          variant="dangerOutline"
          pendingLabel="Deleting…"
          className="sm:w-fit"
          confirm={{
            title: `Delete ${therapist.nameEn}?`,
            body: "Their profile and photo are removed from the website. This cannot be undone.",
            confirmLabel: "Delete therapist",
            danger: true,
          }}
        />
      </Card>
    </>
  );
}
