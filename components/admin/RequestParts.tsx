import Icon from "@/components/admin/Icon";
import { buttonClass } from "@/components/admin/ui";
import type { RequestStatus } from "@/lib/generated/prisma/client";
import { STATUS_CHIP, STATUS_LABELS, whatsappHref } from "@/lib/admin/requests";
import { telHref } from "@/lib/settings";

export function StatusChip({ status }: { status: RequestStatus }) {
  const style = STATUS_CHIP[status];
  return (
    <span className={`inline-flex items-center gap-[6px] rounded-full px-3 py-1 text-[13px] font-bold ${style.chip}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${style.dot}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function ForChip({ forChild }: { forChild: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[13px] font-bold ${forChild ? "bg-tint-lilac text-navy ring-1 ring-purple/40" : "bg-cream-warm ring-1 ring-gold/50"}`}>
      {forChild ? "Child" : "Self"}
    </span>
  );
}

/** Call and WhatsApp buttons for a phone number. */
export function ContactButtons({ phone }: { phone: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <a href={telHref(phone)} className={buttonClass.primary}>
        <Icon name="phone" className="size-4" />
        Call
      </a>
      <a href={whatsappHref(phone)} target="_blank" rel="noopener noreferrer" className={buttonClass.secondary}>
        <Icon name="message" className="size-4" />
        WhatsApp
      </a>
    </div>
  );
}
