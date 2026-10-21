import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getClinicSettings, telHref } from "@/lib/settings";

/**
 * "Ready to Take the First Step?" call to action on the CTA gradient.
 * Mobile: stacked, buttons side by side at half width, characters below.
 * Desktop (xl): text left, characters right.
 */
export default async function CTA() {
  const t = await getTranslations("Cta");
  // Phone number from the admin panel (Settings).
  const { phone } = await getClinicSettings();
  return (
    <section className="bg-cta px-4 py-5 font-sans text-white md:px-8 md:py-12 xl:px-20 xl:py-[120px]">
      <div data-reveal className="mx-auto flex max-w-[1280px] flex-col gap-3 md:flex-row md:items-center md:gap-10 xl:flex-row xl:items-center xl:gap-20">
        <div className="flex flex-col gap-4 md:flex-1 md:gap-5 xl:flex-1 xl:gap-8">
          <h2 className="font-heading text-[32px] md:text-[44px] xl:text-[64px]">{t("title")}</h2>
          <p className="text-sm leading-[1.6] opacity-90 md:text-base xl:text-lg">
            {t("body")}
          </p>
          <div className="flex gap-3 md:gap-4 xl:gap-4">
            <Link
              href="/book"
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-gold px-[18px] text-[15px] font-bold text-navy md:flex-none md:px-8 xl:h-auto xl:flex-none xl:px-9 xl:py-4 xl:text-lg"
            >
              {t("bookNow")}
            </Link>
            <a
              href={telHref(phone)}
              className="flex h-12 flex-1 items-center justify-center rounded-full border-2 border-white px-[18px] text-[15px] font-bold md:flex-none md:px-8 xl:h-auto xl:flex-none xl:px-9 xl:py-4 xl:text-lg"
            >
              {t("callUs")}
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center md:shrink-0 xl:w-[400px] xl:shrink-0">
          <Image
            src="/images/illustrations/cta-character-gold.png"
            alt=""
            width={154}
            height={160}
            className="me-[-20px] h-[124px] w-[120px] rounded-[60px] lg:me-[-30px] lg:h-40 lg:w-[154px] lg:rounded-[80px] xl:me-[-30px] xl:h-40 xl:w-[154px] xl:rounded-[80px]"
          />
          <Image
            src="/images/illustrations/cta-character-blue.png"
            alt=""
            width={149}
            height={140}
            // The image's white disc is a 280px circle flush with its right
            // edge; the corners carry Figma's pink gradient. A square box,
            // right-aligned and clipped to a circle, shows only the disc.
            className="size-[110px] rounded-full object-cover object-right lg:size-[140px] xl:size-[140px]"
          />
        </div>
      </div>
    </section>
  );
}
