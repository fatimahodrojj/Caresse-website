"use client";

import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { localeDirection, type Locale } from "@/i18n/routing";

/**
 * Link to the same page in the other language ("العربية" / "English").
 * The label is written in its own language, so it is marked with that
 * language and direction; on English pages it uses the system Arabic font
 * (no Arabic font download for one word).
 *
 * A plain link to the localized path ("/book" ↔ "/ar/book"): next-intl's Link
 * would add "/en", which only redirects to "/".
 */
export default function LanguageSwitch() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const target: Locale = locale === "en" ? "ar" : "en";

  return (
    <NextLink
      href={getPathname({ href: pathname, locale: target })}
      hrefLang={target}
      lang={target}
      dir={localeDirection[target]}
      className="order-1 whitespace-nowrap rounded-full bg-pink px-[10px] py-[6px] text-[10px] font-bold text-white xl:order-3 xl:px-6 xl:py-3 xl:text-[15px]"
    >
      {t("switchLanguage")}
    </NextLink>
  );
}
