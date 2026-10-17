import Image from "next/image";
import Link from "next/link";
import Icon, { type IconName } from "@/components/admin/Icon";

// Shared admin building blocks. Every control is at least 44px tall.

export const buttonClass = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy px-5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-navy/15 bg-white px-5 text-sm font-bold text-navy transition-colors hover:bg-mist disabled:opacity-50",
  danger:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-danger px-5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50",
  dangerOutline:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-danger/30 bg-white px-5 text-sm font-bold text-danger transition-colors hover:bg-danger/5 disabled:opacity-50",
  icon: "inline-flex size-11 items-center justify-center rounded-full border border-navy/15 bg-white text-navy transition-colors hover:bg-mist disabled:opacity-40",
};

export const inputClass =
  "min-h-12 w-full rounded-control border border-line bg-white px-4 py-3 text-base text-navy outline-none transition-colors placeholder:text-navy/40 focus:border-sky focus:ring-2 focus:ring-sky/25 aria-[invalid=true]:border-danger";

export function PageHeader({
  title,
  description,
  back,
  action,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3">
      {back && (
        <Link href={back.href} className="-ms-2 inline-flex min-h-11 w-fit items-center gap-1 px-2 text-sm font-semibold opacity-80 hover:opacity-100">
          <Icon name="back" className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[32px] leading-[1.1] md:text-[40px]">{title}</h1>
          {description && <p className="text-sm opacity-75 md:text-base">{description}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-card border border-line bg-white p-4 md:p-6 ${className}`}>{children}</div>;
}

export function LinkButton({
  href,
  icon,
  children,
  variant = "primary",
}: {
  href: string;
  icon?: IconName;
  children: React.ReactNode;
  variant?: keyof typeof buttonClass;
}) {
  return (
    <Link href={href} className={buttonClass[variant]}>
      {icon && <Icon name={icon} className="size-4" />}
      {children}
    </Link>
  );
}

/** Empty list message with one of the site's characters. */
export function EmptyState({
  image,
  title,
  text,
  action,
}: {
  image: string;
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-navy/15 bg-white/60 px-6 py-10 text-center">
      <Image src={image} alt="" width={140} height={140} className="size-28 rounded-full md:size-32" />
      <p className="font-heading text-2xl">{title}</p>
      {text && <p className="max-w-sm text-sm opacity-75">{text}</p>}
      {action}
    </div>
  );
}

/** Grey placeholder blocks shown while a page loads. */
export function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-card bg-navy/[0.06] ${className}`} />;
}
