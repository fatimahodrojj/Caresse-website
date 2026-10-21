import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "@/components/admin/ActionButton";
import { EmptyState, LinkButton, PageHeader } from "@/components/admin/ui";
import { moveTherapist } from "@/lib/admin/actions/therapists";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Therapists" };

export default async function TherapistsPage() {
  await requireAdmin();
  const therapists = await getDb().therapist.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, nameEn: true, roleEn: true, photoUrl: true, visible: true },
  });

  return (
    <>
      <PageHeader
        title="Therapists"
        description="The team on the homepage and the Our Team page, in this order."
        action={
          <LinkButton href="/admin/therapists/new" icon="plus">
            Add therapist
          </LinkButton>
        }
      />
      {therapists.length === 0 ? (
        <EmptyState
          image="/images/illustrations/team-character-rawan-cherry.png"
          title="No therapists yet"
          text="Add the first therapist to show the team on the website."
          action={<LinkButton href="/admin/therapists/new" icon="plus">Add therapist</LinkButton>}
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {therapists.map((therapist, index) => (
            <li key={therapist.id} className="flex items-center gap-3 rounded-card border border-line bg-white p-3 md:gap-4 md:p-4">
              <Image src={therapist.photoUrl} alt="" width={64} height={64} className="size-14 shrink-0 rounded-full object-cover md:size-16" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link href={`/admin/therapists/${therapist.id}`} className="flex min-h-11 flex-col justify-center">
                  <span className="truncate text-base font-bold">{therapist.nameEn}</span>
                  <span className="line-clamp-1 text-[13px] opacity-70">{therapist.roleEn}</span>
                </Link>
                {!therapist.visible && (
                  <span className="w-fit rounded-full bg-navy/10 px-2 py-[2px] text-[12px] font-bold">Hidden from the website</span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <ActionButton
                  action={moveTherapist}
                  fields={{ id: therapist.id, direction: "up" }}
                  label=""
                  icon="up"
                  variant="icon"
                  pendingLabel="…"
                  className={index === 0 ? "invisible" : ""}
                  ariaLabel={`Move ${therapist.nameEn} up`}
                />
                <ActionButton
                  action={moveTherapist}
                  fields={{ id: therapist.id, direction: "down" }}
                  label=""
                  icon="down"
                  variant="icon"
                  pendingLabel="…"
                  className={index === therapists.length - 1 ? "invisible" : ""}
                  ariaLabel={`Move ${therapist.nameEn} down`}
                />
                <LinkButton href={`/admin/therapists/${therapist.id}`} variant="secondary">
                  Edit
                </LinkButton>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
