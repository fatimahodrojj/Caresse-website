import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Boogaloo, Dancing_Script, Sora } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeDirection, routing } from "@/i18n/routing";
import "../globals.css";

// Design-system fonts (docs/design-system.md). next/font self-hosts them at
// build time: no request to fonts.googleapis.com at runtime and no layout
// shift.
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
});

const boogaloo = Boogaloo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-script",
});

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    namespace: "Metadata.home",
  });
  return { title: t("title"), description: t("description") };
}

// Both languages are rendered at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={localeDirection[locale]}>
      <body
        className={`${sora.variable} ${boogaloo.variable} ${dancingScript.variable} bg-cream font-sans text-navy`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
