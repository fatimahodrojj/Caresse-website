import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActionButton from "@/components/admin/ActionButton";
import { ContactButtons, ForChip, StatusChip } from "@/components/admin/RequestParts";
import { Card, PageHeader } from "@/components/admin/ui";
import { deleteRequest, setRequestStatus } from "@/lib/admin/actions/requests";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDate, languageLabel, serviceLabel, timeSlotLabel } from "@/lib/admin/requests";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Request" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[2px] border-b border-line py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <dt className="text-sm opacity-60 sm:w-44 sm:shrink-0">{label}</dt>
      <dd className="text-[15px] font-semibold">{children}</dd>
    </div>
  );
}

export default async function RequestPage({ params }: PageProps<"/admin/requests/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const request = await getDb().appointmentRequest.findUnique({ where: { id } });
  if (!request) notFound();

  const forChild = request.appointmentFor === "CHILD";
  const name = `${request.firstName} ${request.lastName}`;
  return (
    <>
      <PageHeader title={name} back={{ href: "/admin", label: "All requests" }} />

      <div className="flex flex-wrap items-center gap-2">
        <ForChip forChild={forChild} />
        <StatusChip status={request.status} />
        <span className="text-[13px] opacity-70">Received {formatDate(request.createdAt)}</span>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-bold opacity-60">Phone</h2>
          <p dir="ltr" className="w-fit text-xl font-bold">
            {request.phone}
          </p>
        </div>
        <ContactButtons phone={request.phone} />
      </Card>

      <Card>
        <dl>
          <Row label="For">{forChild ? "Their child" : "Themselves"}</Row>
          <Row label={forChild ? "Parent's name" : "Name"}>{name}</Row>
          {forChild && <Row label="Child's first name">{request.childFirstName}</Row>}
          {forChild && <Row label="Child's age">{request.childAge} {request.childAge === 1 ? "year" : "years"}</Row>}
          <Row label="Service">{serviceLabel(request.service)}</Row>
          <Row label="Preferred time">{timeSlotLabel(request.timeSlot)}</Row>
          <Row label="Form language">{languageLabel(request.language)}</Row>
          <Row label="Needs or goals">
            {request.notes ? <span className="whitespace-pre-wrap font-normal leading-[1.6]">{request.notes}</span> : <span className="font-normal opacity-60">None</span>}
          </Row>
          <Row label="Consent given">{formatDate(request.consentAt)}</Row>
          {request.statusChangedAt && <Row label="Status changed">{formatDate(request.statusChangedAt)}</Row>}
          <Row label="Request ID">
            <span className="font-mono text-[13px] font-normal">{request.id}</span>
          </Row>
        </dl>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Update status</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {request.status !== "CONTACTED" && (
            <ActionButton
              action={setRequestStatus}
              fields={{ id: request.id, status: "CONTACTED" }}
              label="Mark as contacted"
              icon="phone"
              pendingLabel="Saving…"
            />
          )}
          {request.status !== "APPROVED" && (
            <ActionButton
              action={setRequestStatus}
              fields={{ id: request.id, status: "APPROVED" }}
              label="Approve"
              icon="check"
              variant="primary"
              pendingLabel="Saving…"
            />
          )}
          {request.status !== "DECLINED" && (
            <ActionButton
              action={setRequestStatus}
              fields={{ id: request.id, status: "DECLINED" }}
              label="Decline"
              icon="x"
              variant="dangerOutline"
              pendingLabel="Declining…"
              confirm={{
                title: "Decline this request?",
                body: `${name}'s request will be marked as declined. You can still change the status later.`,
                confirmLabel: "Decline request",
                danger: true,
              }}
            />
          )}
        </div>
      </Card>

      <Card className="flex flex-col gap-3 border-danger/20">
        <h2 className="text-lg font-bold">Delete this request</h2>
        <p className="text-sm opacity-75">
          For when a family asks us to remove their data. This deletes the request and everything in it for good.
        </p>
        <ActionButton
          action={deleteRequest}
          fields={{ id: request.id }}
          label="Delete permanently"
          icon="trash"
          variant="dangerOutline"
          pendingLabel="Deleting…"
          className="sm:w-fit"
          confirm={{
            title: "Delete permanently?",
            body: `${name}'s request, including the notes and any child details, will be deleted. This cannot be undone.`,
            confirmLabel: "Delete permanently",
            danger: true,
          }}
        />
      </Card>
    </>
  );
}
