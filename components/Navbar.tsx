import Image from "next/image";
import Link from "next/link";
import { homeHref, navLinks } from "@/data/navigation";
import MobileMenu from "@/components/MobileMenu";

// Hidden until the shop has products and the Arabic site exists. The
// components below are ready; flip these to render them.
const SHOW_CART = false;
const SHOW_LANGUAGE_SWITCH = false;

/**
 * One navbar for the whole site (Figma had a duplicate inside the hero).
 * Mobile: white header, sticky at the top.
 * Desktop (xl, 1280px+): transparent, sits over the hero, not sticky.
 */
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white font-sans text-navy xl:absolute xl:inset-x-0 xl:border-0 xl:bg-transparent">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-2 px-3 min-[360px]:gap-[14px] md:px-8 xl:h-20 xl:justify-start xl:pl-0 xl:pr-[13px]">
        <Link href={homeHref} className="flex min-h-10 shrink-0 items-center">
          <Image
            src="/images/brand/logo.png"
            alt="Caresse – Multitherapeutic Services"
            width={1080}
            height={391}
            priority
            sizes="(min-width: 1280px) 199px, (min-width: 768px) 122px, 105px"
            className="h-[38px] w-auto md:h-[44px] xl:h-[72px]"
          />
        </Link>

        <nav aria-label="Main" className="hidden xl:ml-auto xl:block">
          <ul className="flex items-center gap-10 text-xl font-semibold">
            {navLinks.map((link) => {
              const isCurrent = link.href === homeHref;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={
                      isCurrent
                        ? "transition-opacity"
                        : "opacity-80 transition-opacity hover:opacity-100"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Figma order: mobile = Arabic, Book, cart, menu; desktop = cart, Book, Arabic. */}
        <div className="flex items-center gap-[6px] xl:gap-[14px]">
          {SHOW_CART && <CartButton />}
          <Link
            href="/book"
            className="order-2 inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full bg-pink px-3 text-sm font-bold text-white min-[360px]:px-4 xl:min-h-0 xl:w-[141px] xl:px-6 xl:py-3 xl:text-[15px]"
          >
            Book a Session
          </Link>
          {SHOW_LANGUAGE_SWITCH && <LanguageButton />}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function CartButton() {
  return (
    <button
      type="button"
      aria-label="Cart"
      className="order-3 flex size-[34px] items-center xl:order-1 justify-center rounded-full bg-mist xl:size-11"
    >
      <Image
        src="/images/icons/shopping-cart.svg"
        alt=""
        width={20}
        height={20}
        className="size-4 xl:size-5"
      />
    </button>
  );
}

function LanguageButton() {
  return (
    <button
      type="button"
      lang="ar"
      dir="rtl"
      className="order-1 whitespace-nowrap rounded-full bg-pink px-[10px] xl:order-3 py-[6px] text-[10px] font-bold text-white xl:px-6 xl:py-3 xl:text-[15px]"
    >
      العربية
    </button>
  );
}
