import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/admin/Icon";
import { ForChip, StatusChip } from "@/components/admin/RequestParts";
import { EmptyState, PageHeader, buttonClass, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { cleanupOldRequests } from "@/lib/admin/cleanup";
import {
  STATUS_FILTERS,
  formatDate,
  languageLabel,
  serviceLabel,
  timeSlotLabel,
  type StatusFilter,
} from "@/lib/admin/requests";
import { getDb } from "@/lib/db";
import type { Prisma, RequestStatus } from "@/lib/generated/prisma/client";
import { getClinicSettings, telHref } from "@/lib/settings";

export const metadata: Metadata = { title: "Requests" };

const PAGE_SIZE = 30;

const FILTER_LABELS: Record<StatusFilter, string> = {
  new: "New",
  contacted: "Contacted",
  approved: "Approved",
  declined: "Declined",
  all: "All",
};

/** Name words must all match (first or last name); digits match the phone. */
function searchWhere(query: string): Prisma.AppointmentRequestWhereInput | undefined {
  const words = query.trim().split(/\s+/).filter(Boolean).slice(0, 5);
  if (words.length === 0) return undefined;
  const digits = query.replace(/\D/g, "");
  const byName: Prisma.AppointmentRequestWhereInput = {
    AND: words.map((word) => ({
      OR: [
        { firstName: { contains: word, mode: "insensitive" } },
        { lastName: { contains: word, mode: "insensitive" } },
      ],
    })),
  };
  return digits.length >= 3 ? { OR: [byName, { phone: { contains: digits } }] } : byName;
}

export default async function RequestsPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const params = await searchParams;
  const filter: StatusFilter = STATUS_FILTERS.includes(params.status as StatusFilter) ? (params.status as StatusFilter) : "new";
  const query = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  const page = Math.max(1, Math.min(50, Number(params.page) || 1));

  const db = getDb();
  await cleanupOldRequests(db);
  const search = searchWhere(query);
  const where: Prisma.AppointmentRequestWhereInput = {
    ...(filter === "all" ? {} : { status: filter.toUpperCase() as RequestStatus }),
    ...(search ?? {}),
  };
  const [requests, total, counts, { retentionMonths }] = await Promise.all([
    db.appointmentRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: page * PAGE_SIZE,
      select: {
        id: true,
        appointmentFor: true,
        firstName: true,
        lastName: true,
        childFirstName: true,
        childAge: true,
        phone: true,
        service: true,
        timeSlot: true,
        language: true,
        status: true,
        createdAt: true,
      },
    }),
    db.appointmentRequest.count({ where }),
    db.appointmentRequest.groupBy({ by: ["status"], _count: true, where: search }),
    getClinicSettings(),
  ]);
  const countFor = (key: StatusFilter) =>
    key === "all"
      ? counts.reduce((sum, row) => sum + row._count, 0)
      : (counts.find((row) => row.status === key.toUpperCase())?._count ?? 0);

  const hrefFor = (next: { status?: StatusFilter; page?: number }) => {
    const search = new URLSearchParams();
    const status = next.status ?? filter;
    if (status !== "new") search.set("status", status);
    if (query) search.set("q", query);
    if (next.page && next.page > 1) search.set("page", String(next.page));
    const string = search.toString();
    return string ? `/admin?${string}` : "/admin";
  };

  return (
    <>
      <PageHeader title="Requests" description="Appointment requests from the Book a Session page." />

      <form role="search" action="/admin" className="flex gap-2">
        {filter !== "new" && <input type="hidden" name="status" value={filter} />}
        <label className="sr-only" htmlFor="request-search">
          Search by name or phone
        </label>
        <input
          id="request-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search by name or phone"
          className={`${inputClass} flex-1`}
        />
        <button type="submit" className={`${buttonClass.primary} shrink-0 px-4`} aria-label="Search">
          <Icon name="search" className="size-5" />
        </button>
      </form>

      <nav aria-label="Filter by status" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <ul className="flex w-max gap-2">
          {STATUS_FILTERS.map((key) => {
            const active = key === filter;
            return (
              <li key={key}>
                <Link
                  href={hrefFor({ status: key })}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${
                    active ? "border-navy bg-navy text-white" : "border-navy/15 bg-white hover:bg-mist"
                  }`}
                >
                  {FILTER_LABELS[key]}
                  <span className={`rounded-full px-2 text-xs leading-5 ${active ? "bg-white/20" : "bg-navy/[0.08]"}`}>{countFor(key)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {requests.length === 0 ? (
        <EmptyState
          image="/images/illustrations/why-character-jump-1.png"
          title={query ? "No matching requests" : filter === "new" ? "No new requests" : "Nothing here yet"}
          text={
            query
              ? "Try another name or phone number, or search in All."
              : filter === "new"
                ? "New requests from the website appear here."
                : "Requests with this status appear here."
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {requests.map((request) => {
            const forChild = request.appointmentFor === "CHILD";
            return (
              <li key={request.id} className="relative flex flex-col gap-3 rounded-card border border-line bg-white p-4 transition-colors hover:border-sky/50 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ForChip forChild={forChild} />
                    <StatusChip status={request.status} />
                  </div>
                  <span className="text-[13px] opacity-70">{formatDate(request.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-bold">
                    {/* The whole card opens the request. */}
                    <Link href={`/admin/requests/${request.id}`} className="after:absolute after:inset-0 after:rounded-card">
                      {request.firstName} {request.lastName}
                    </Link>
                  </h2>
                  {forChild && (
                    <p className="text-sm">
                      Child: <span className="font-semibold">{request.childFirstName}</span>, {request.childAge}{" "}
                      {request.childAge === 1 ? "year" : "years"}
                    </p>
                  )}
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  <div className="flex gap-2">
                    <dt className="opacity-60">Phone</dt>
                    <dd>
                      <a href={telHref(request.phone)} dir="ltr" className="relative z-10 font-semibold text-sky underline-offset-2 hover:underline">
                        {request.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="opacity-60">Service</dt>
                    <dd className="font-semibold">{serviceLabel(request.service)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="opacity-60">Time</dt>
                    <dd className="font-semibold">{timeSlotLabel(request.timeSlot)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="opacity-60">Form language</dt>
                    <dd className="font-semibold">{languageLabel(request.language)}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      )}

      {requests.length < total && (
        <Link href={hrefFor({ page: page + 1 })} scroll={false} className={`${buttonClass.secondary} self-center`}>
          Show more ({total - requests.length} left)
        </Link>
      )}

      <p className="flex items-start gap-2 text-[13px] opacity-70">
        <Icon name="clock" className="mt-[2px] size-4 shrink-0" />
        Contacted, approved and declined requests are deleted automatically {retentionMonths} months after they were received.
        You can change this in Settings.
      </p>
    </>
  );
}
