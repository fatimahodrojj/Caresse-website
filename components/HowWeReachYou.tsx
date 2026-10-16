import Image from "next/image";
import { useTranslations } from "next-intl";
import Carousel from "@/components/Carousel";

// Text: messages/*.json (Delivery.modes.<key>). Image-area tints from
// docs/design-system.md (Supporting colors).
const modes = [
  { key: "home", image: "/images/illustrations/delivery-home-visits.png", tint: "bg-tint-peach" },
  { key: "clinic", image: "/images/illustrations/delivery-at-clinic.png", tint: "bg-tint-blush" },
  { key: "online", image: "/images/illustrations/delivery-online-sessions.png", tint: "bg-tint-lilac" },
] as const;

type Mode = (typeof modes)[number];

/**
 * How We Reach You. Mobile: carousel of horizontal cards (image left;
 * stacked below 375px, where the arrows leave too little width).
 * Desktop (xl): three vertical cards side by side.
 */
export default function HowWeReachYou() {
  const t = useTranslations("Delivery");
  return (
    <section className="bg-cream-warm p-3 font-sans md:px-8 md:py-12 xl:px-20 xl:py-24">
      <div data-reveal className="mx-auto flex max-w-[1280px] flex-col gap-2 md:gap-8 xl:gap-12">
        <div className="flex flex-col gap-[6px] text-center md:gap-3 xl:gap-3">
          <h2 className="text-2xl font-bold leading-[1.2] md:text-[32px] xl:text-[40px]">{t("title")}</h2>
          <p className="text-sm leading-[1.6] opacity-75 md:text-base xl:text-base">
            {t("subtitle")}
          </p>
        </div>
        <Carousel
          label={t("title")}
          itemClassName="basis-full md:basis-[calc((100%-12px)/2)] xl:basis-auto"
          listClassName="py-1 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:py-0 xl:grid xl:grid-cols-3 xl:gap-6 xl:overflow-visible xl:py-0"
          arrowClassName="size-11"
          hideArrowsFrom="md"
        >
          {modes.map((mode) => (
            <ModeCard key={mode.key} mode={mode} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

function ModeCard({ mode }: { mode: Mode }) {
  const t = useTranslations("Delivery.modes");
  return (
    <article className="flex w-full flex-col items-center gap-[10px] rounded-panel border border-line bg-white p-2 drop-shadow-card-strong min-[375px]:flex-row md:flex-col md:items-stretch md:gap-3 md:rounded-card md:p-4 xl:flex-col xl:items-stretch xl:gap-4 xl:rounded-card-lg xl:p-6">
      <div
        className={`flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-media border border-line md:h-40 md:w-full md:rounded-panel xl:h-[220px] xl:w-full xl:rounded-panel ${mode.tint}`}
      >
        <Image
          src={mode.image}
          alt=""
          width={180}
          height={180}
          className="size-20 rounded-full md:size-32 xl:size-[180px]"
        />
      </div>
      <div className="flex flex-col gap-[2px] text-center min-[375px]:text-left md:gap-2 xl:gap-4">
        <h3 className="text-base font-bold leading-[1.3] md:text-lg xl:text-xl">{t(`${mode.key}.title`)}</h3>
        <p className="text-xs leading-[1.5] opacity-80 md:text-sm xl:text-sm xl:leading-[1.6]">
          {t(`${mode.key}.description`)}
        </p>
      </div>
    </article>
  );
}
