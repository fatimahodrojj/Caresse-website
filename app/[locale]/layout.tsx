import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import WhatsAppButton from "@/components/WhatsAppButton";
import { localeDirection, routing } from "@/i18n/routing";
import { ARABIC_INDEXED, SITE_URL } from "@/lib/seo";
import { fontVariables } from "@/lib/fonts";
import { getClinicSettings, whatsappHref } from "@/lib/settings";
import "../globals.css";

// Shared by every page; titles, descriptions and links are set per page
// (lib/seo.ts). Arabic pages are noindex while ARABIC_INDEXED is false.
export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(SITE_URL),
    robots: locale === "ar" && !ARABIC_INDEXED ? { index: false, follow: true } : undefined,
  };
}

// Both languages are rendered at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  // Floating WhatsApp chat button: the clinic phone from the admin Settings.
  const [{ phone }, t] = await Promise.all([getClinicSettings(), getTranslations("WhatsApp")]);

  return (
    <html lang={locale} dir={localeDirection[locale]}>
      <body className={`${fontVariables[locale]} bg-cream font-sans text-navy`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <WhatsAppButton href={whatsappHref(phone)} label={t("label")} />
      </body>
    </html>
  );
}
