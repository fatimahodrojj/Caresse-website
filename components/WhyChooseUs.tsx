import Image from "next/image";
import { useTranslations } from "next-intl";

// Text: messages/*.json (Why.points.<key>). Star colours and
// their 13% tinted circles follow Figma's order: blue, pink, gold, purple.
const points = [
  { key: "personalized", star: "/images/icons/star-blue.svg", circle: "bg-sky/[0.13]" },
  { key: "certified", star: "/images/icons/star-pink.svg", circle: "bg-pink/[0.13]" },
  { key: "childFriendly", star: "/images/icons/star-gold.svg", circle: "bg-gold/[0.13]" },
  { key: "familyCentered", star: "/images/icons/star-purple.svg", circle: "bg-purple/[0.13]" },
] as const;

/**
 * Why Families Choose Caresse (the "About Us" nav target).
 * Mobile: stacked, characters below. Desktop (xl): text left, characters right.
 * Figma fixes the text at 895px and the characters at 410px, which overflows
 * the 1280px content width, so the text column takes the remaining space.
 */
export default function WhyChooseUs() {
  const t = useTranslations("Why");
  return (
    <section id="about" className="bg-ice p-4 font-sans md:px-8 md:py-12 xl:px-20 xl:py-[120px]">
      <div data-reveal className="mx-auto flex max-w-[1280px] flex-col gap-3 md:flex-row md:items-center md:gap-8 xl:flex-row xl:items-center xl:gap-20">
        <div className="flex flex-col gap-3 md:min-w-0 md:flex-1 md:gap-6 xl:min-w-0 xl:flex-1 xl:gap-10">
          <h2 className="font-heading text-[32px] md:text-[44px] xl:text-[56px]">{t("title")}</h2>
          <ul className="flex flex-col gap-[10px] md:gap-4 xl:gap-6">
            {points.map((point) => (
              <li key={point.key} className="flex items-start gap-[10px] md:gap-4 xl:gap-4">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full md:size-10 xl:size-10 ${point.circle}`}
                >
                  <Image src={point.star} alt="" width={20} height={20} className="size-4 md:size-5 xl:size-5" />
                </span>
                <div className="flex flex-col gap-[2px] xl:gap-1">
                  <h3 className="text-base font-bold md:text-lg xl:text-lg">{t(`points.${point.key}.title`)}</h3>
                  <p className="text-[13px] leading-[1.4] opacity-70 md:text-sm xl:text-sm">{t(`points.${point.key}.description`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex h-[180px] items-center justify-center md:shrink-0 xl:h-[333px] xl:shrink-0">
          <Image
            src="/images/illustrations/why-character-jump-1.png"
            alt=""
            width={160}
            height={160}
            className="me-[-8px] size-[100px] rounded-full lg:me-[-12px] lg:size-32 xl:me-[-15px] xl:size-40"
          />
          <Image
            src="/images/illustrations/why-character-jump-2.png"
            alt=""
            width={180}
            height={180}
            className="size-[110px] rounded-full lg:size-36 xl:size-[180px]"
          />
        </div>
      </div>
    </section>
  );
}
