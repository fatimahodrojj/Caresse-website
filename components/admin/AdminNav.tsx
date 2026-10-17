"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/admin/Icon";
import { logout } from "@/lib/admin/actions/auth";

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Requests", icon: "inbox" },
  { href: "/admin/therapists", label: "Therapists", icon: "users" },
  { href: "/admin/shop", label: "Shop", icon: "bag" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/requests") : pathname.startsWith(href);
}

function Badge({ count, className = "" }: { count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <span className={`min-w-5 rounded-full bg-pink px-[6px] text-center text-[11px] font-bold leading-5 text-white ${className}`}>
      {count > 99 ? "99+" : count}
      <span className="sr-only"> new</span>
    </span>
  );
}

/**
 * Admin navigation. Phone and tablet: tab bar at the bottom.
 * Desktop (lg): sidebar with the same tabs and sign out.
 */
export default function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-8 border-e border-line bg-white px-4 py-6 lg:flex">
        <Link href="/admin" className="flex min-h-11 items-center px-2">
          <Image src="/images/brand/logo.png" alt="Caresse admin" width={1080} height={391} className="h-11 w-auto" priority />
        </Link>
        <nav aria-label="Admin" className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-control px-3 text-[15px] font-semibold transition-colors ${
                  active ? "bg-mist text-navy" : "text-navy/75 hover:bg-cream"
                }`}
              >
                <Icon name={tab.icon} />
                <span className="flex-1">{tab.label}</span>
                {tab.href === "/admin" && <Badge count={newCount} />}
              </Link>
            );
          })}
        </nav>
        <form action={logout} className="mt-auto">
          <button type="submit" className="flex min-h-12 w-full items-center gap-3 rounded-control px-3 text-[15px] font-semibold text-navy/75 hover:bg-cream">
            <Icon name="logout" />
            Sign out
          </button>
        </form>
      </aside>

      <nav
        aria-label="Admin"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto grid max-w-xl grid-cols-4">
          {tabs.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-[64px] flex-col items-center justify-center gap-1 text-[12px] font-semibold ${
                    active ? "text-sky" : "text-navy/65"
                  }`}
                >
                  <span className="relative">
                    <Icon name={tab.icon} className="size-6" />
                    {tab.href === "/admin" && <Badge count={newCount} className="absolute -end-3 -top-2" />}
                  </span>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
