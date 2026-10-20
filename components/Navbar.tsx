import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { homeHref, navLinks } from "@/data/navigation";
import LanguageSwitch from "@/components/LanguageSwitch";
import MobileMenu from "@/components/MobileMenu";

// Hidden until the shop has products. The component below is ready; flip
// this to render it.
const SHOW_CART = false;

/**
 * One navbar for the whole site (Figma had a duplicate inside the hero).
 * Mobile: white header, sticky at the top.
 * Desktop (xl, 1280px+): transparent, sits over the hero, not sticky.
 */
/**
 * @param currentHref The nav link to mark as the current page (default: Home).
 *   Pass null on pages that aren't in the nav, e.g. /book.
 */
export default function Navbar({ currentHref = homeHref }: { currentHref?: string | null }) {
  const t = useTranslations("Navbar");
  const tNav = useTranslations("Nav");
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white font-sans text-navy xl:absolute xl:inset-x-0 xl:border-0 xl:bg-transparent">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-2 px-3 min-[360px]:gap-[14px] md:px-8 xl:h-20 xl:justify-start xl:ps-0 xl:pe-[13px]">
        <Link href={homeHref} className="flex min-h-10 shrink-0 items-center">
          <Image
            src="/images/brand/logo.png"
            alt={t("logoAlt")}
            width={1080}
            height={391}
            priority
            sizes="(min-width: 1280px) 199px, (min-width: 768px) 122px, 105px"
            className="h-7 w-auto min-[360px]:h-8 min-[390px]:h-[38px] md:h-[44px] xl:h-[72px]"
          />
        </Link>

        <nav aria-label={t("mainNav")} className="hidden xl:ms-auto xl:block">
          <ul className="flex items-center gap-10 text-xl font-semibold">
            {navLinks.map((link) => {
              const isCurrent = link.href === currentHref;
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
                    {tNav(link.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Figma order: mobile = language, Book, cart, menu; desktop = cart, Book, language.
            Below 390px the logo and Book button shrink so the row fits on one line. */}
        <div className="flex items-center gap-1 min-[360px]:gap-[6px] xl:gap-[14px]">
          {SHOW_CART && <CartButton />}
          <Link
            href="/book"
            className="order-2 inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full bg-pink px-[10px] text-xs font-bold text-white min-[360px]:px-3 min-[360px]:text-[13px] min-[390px]:px-4 min-[390px]:text-sm xl:min-h-0 xl:w-[141px] xl:px-6 xl:py-3 xl:text-[15px]"
          >
            {t("bookSession")}
          </Link>
          <LanguageSwitch />
          <MobileMenu currentHref={currentHref} />
        </div>
      </div>
    </header>
  );
}

function CartButton() {
  const t = useTranslations("Navbar");
  return (
    <button
      type="button"
      aria-label={t("cart")}
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
