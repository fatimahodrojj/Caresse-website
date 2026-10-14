"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { homeHref, navLinks } from "@/data/navigation";

/**
 * Hamburger button + dropdown panel for screens below xl.
 * Figma only designs the closed state, so the open panel reuses the nav
 * labels and design tokens. Closes on toggle, link tap or Escape.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="order-4 xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex size-9 items-center justify-center rounded-full bg-mist"
      >
        {open ? (
          <CloseIcon />
        ) : (
          <Image src="/images/icons/menu.svg" alt="" width={18} height={18} />
        )}
      </button>

      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-white"
      >
        <ul>
          {navLinks.map((link) => {
            const isCurrent = link.href === homeHref;
            return (
              <li key={link.href} className="border-t border-line first:border-t-0">
                <Link
                  href={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center px-3 text-base font-semibold ${
                    isCurrent ? "" : "opacity-80"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

// Same stroke style as icons/menu.svg (navy, 2px, round caps, 18px box).
function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="text-navy"
    >
      <path
        d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
