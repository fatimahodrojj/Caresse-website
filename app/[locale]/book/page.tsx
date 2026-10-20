import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm, { Characters } from "@/components/booking/BookingForm";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/book">): Promise<Metadata> {
  return pageMetadata((await params).locale, "book");
}

/** Book a Session (Figma 33:5 desktop, 113:709 mobile). */
export default async function BookPage({ params }: PageProps<"/[locale]/book">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Book");

  return (
    <>
      <Navbar currentHref={null} />
      <main className="font-sans">
        <section className="bg-cream px-4 pb-4 pt-4 md:px-8 md:pb-10 md:pt-8 xl:px-20 xl:pt-[100px]">
          <div className="mx-auto flex max-w-[800px] flex-col items-center gap-3 text-center md:gap-6">
            <Characters size="large" />
            <div className="flex flex-col gap-[10px] md:gap-4">
              <h1 className="text-balance font-heading text-[44px] leading-[1.1] md:text-[64px] md:leading-normal">
                {t("title")}
              </h1>
              <p className="text-[15px] leading-[1.5] opacity-80 md:text-lg">
                {t("intro")}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-cream-form px-4 pb-5 pt-4 md:px-8 md:pb-20 md:pt-6">
          <div className="mx-auto max-w-[901px]">
            <BookingForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
