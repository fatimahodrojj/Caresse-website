import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TeamProfiles from "@/components/TeamProfiles";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { getTeam } from "@/lib/therapists";

export async function generateMetadata({ params }: PageProps<"/[locale]/team">): Promise<Metadata> {
  return pageMetadata((await params).locale, "team");
}

/** Our Team (Figma 68:4 desktop, 113:535 mobile). */
export default async function TeamPage({ params }: PageProps<"/[locale]/team">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("TeamPage");
  const team = await getTeam(locale);

  return (
    <>
      <Navbar currentHref="/team" />
      <main className="bg-cream font-sans">
        <section className="px-4 pb-6 pt-4 md:px-8 md:pb-16 md:pt-10 xl:px-[120px] xl:pb-24 xl:pt-24">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:gap-10 xl:gap-14">
            <div data-reveal className="flex flex-col items-center gap-2 text-center xl:gap-3">
              <h1 className="text-balance font-heading text-4xl leading-[1.05] md:text-5xl xl:text-[64px]">
                {t("title")}
              </h1>
              <p className="max-w-[760px] text-sm leading-[1.6] opacity-75 md:text-base xl:text-lg">
                {t("subtitle")}
              </p>
            </div>

            <TeamProfiles members={team} />

            <div data-reveal className="flex flex-col items-center gap-3 pt-3 text-center xl:gap-4 xl:pt-4">
              <Link
                href="/book"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-9 py-[14px] text-base font-bold drop-shadow-form transition-transform hover:-translate-y-px xl:px-11 xl:py-[18px] xl:text-lg"
              >
                {t("cta")}
              </Link>
              <p className="max-w-[560px] text-[13px] leading-[1.6] opacity-75 xl:text-sm">{t("ctaNote")}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
