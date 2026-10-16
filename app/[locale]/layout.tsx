import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Aref_Ruqaa, Baloo_Bhaijaan_2, Boogaloo, Dancing_Script, Readex_Pro, Sora } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeDirection, routing, type Locale } from "@/i18n/routing";
import "../globals.css";

// Design-system fonts (docs/design-system.md). next/font self-hosts them at
// build time: no request to fonts.googleapis.com at runtime and no layout
// shift. globals.css maps them to --font-sans/--font-heading/--font-script.
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora",
});

const boogaloo = Boogaloo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-boogaloo",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-dancing",
});

// Arabic fonts, used only on Arabic pages, where they also draw Latin
// letters and digits so mixed text matches. Not preloaded, so English pages
// never download them; browsers fetch only the subsets a page contains.

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  preload: false,
  weight: ["400", "600", "700"],
  variable: "--font-readex",
});

// Headings use a single weight (no heading sets font-weight).
const balooBhaijaan = Baloo_Bhaijaan_2({
  subsets: ["arabic", "latin"],
  preload: false,
  weight: "600",
  variable: "--font-baloo",
});

// Hero tagline.
const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  preload: false,
  weight: "700",
  variable: "--font-aref",
});

const fontVariables: Record<Locale, string> = {
  en: [sora, boogaloo, dancingScript].map((font) => font.variable).join(" "),
  // Boogaloo stays for the wordmark.
  ar: [boogaloo, readexPro, balooBhaijaan, arefRuqaa].map((font) => font.variable).join(" "),
};

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
      <body className={`${fontVariables[locale]} bg-cream font-sans text-navy`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
