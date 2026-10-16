import Image from "next/image";
import { useTranslations } from "next-intl";

// docs/homepage-content.md (Stats). "Progress Rate" is used on all screen
// sizes (decision: Figma desktop said "Good reviews").
const stats = [
  { value: "500+", label: "casesHelped" },
  { value: "90%", label: "progressRate" },
  { value: "10+", label: "therapyServices" },
] as const;

/**
 * Stats band. Mobile: three stats in a row, character below.
 * Desktop (xl): stats and character side by side.
 */
export default function Stats() {
  const t = useTranslations("Stats");
  return (
    <section className="bg-navy p-4 font-sans md:px-8 md:py-10 xl:px-20 xl:py-16">
      <div data-reveal className="mx-auto flex max-w-[1280px] flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-0">
        <dl className="flex gap-3 text-center md:flex-1 md:gap-8 xl:flex-1 xl:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-1 flex-col-reverse justify-end gap-[6px] xl:gap-2">
              <dt className="text-xs font-semibold text-white md:text-sm xl:text-base">{t(stat.label)}</dt>
              <dd dir="ltr" className="font-heading text-4xl text-gold md:text-5xl md:leading-normal xl:text-[64px] xl:leading-normal">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        <Image
          src="/images/illustrations/stats-character-accent.png"
          alt=""
          width={127}
          height={104}
          className="h-[78px] w-24 rounded-[38px] object-cover md:h-[104px] md:w-[127px] md:rounded-[50px] xl:h-[104px] xl:w-[127px] xl:rounded-[50px]"
        />
      </div>
    </section>
  );
}
