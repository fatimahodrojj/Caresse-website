import Image from "next/image";
import { useTranslations } from "next-intl";

type Character = {
  src: string;
  // Wrapper size and corner radius per breakpoint, from Figma.
  className: string;
  sizes: string;
};

// Mobile (Figma 113:7): 96 / 112 / 96px circles, 8px apart; they shrink
// with the screen below ~370px so all three fit on small phones.
// Desktop (Figma 7:4): 289×260 / 391×386 / 285×240, overlapping by 60px.
const characters: Character[] = [
  {
    src: "/images/illustrations/hero-character-blue.png",
    className:
      "size-[min(96px,26vw)] rounded-full md:size-40 xl:me-[-60px] xl:h-[260px] xl:w-[289px] xl:rounded-[130px]",
    sizes: "(min-width: 1280px) 289px, (min-width: 768px) 160px, 96px",
  },
  {
    src: "/images/illustrations/hero-character-pink.png",
    className:
      "size-[min(112px,30vw)] rounded-full md:size-48 xl:me-[-60px] xl:h-[386px] xl:w-[391px] xl:rounded-[150px]",
    sizes: "(min-width: 1280px) 391px, (min-width: 768px) 192px, 112px",
  },
  {
    src: "/images/illustrations/hero-character-gold.png",
    className:
      "size-[min(96px,26vw)] rounded-full md:size-40 xl:h-[240px] xl:w-[285px] xl:rounded-[120px]",
    sizes: "(min-width: 1280px) 285px, (min-width: 768px) 160px, 96px",
  },
];

/**
 * Hero: three characters and the tagline on the hero gradient.
 * On desktop the transparent navbar sits on top, hence the 180px top
 * padding.
 */
export default function Hero() {
  const t = useTranslations("Hero");
  return (
    <section className="bg-hero p-3 md:px-8 md:py-10 xl:px-20 xl:pb-[120px] xl:pt-[180px]">
      <h1 className="sr-only">{t("heading")}</h1>
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-2 md:gap-4 xl:gap-0">
        <div className="flex items-center justify-center gap-2 md:gap-4 xl:h-[459px] xl:w-[1038px] xl:gap-0">
          {characters.map((character) => (
            <div
              key={character.src}
              className={`relative shrink-0 overflow-hidden ${character.className}`}
            >
              <Image
                src={character.src}
                alt=""
                fill
                priority
                sizes={character.sizes}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <p className="text-shadow-tagline w-full text-center text-balance font-script text-[min(36px,9.2vw)] leading-[1.1] tracking-[2px] text-navy opacity-95 md:text-[44px] md:tracking-[3px] xl:text-[52px] xl:tracking-[3px]">
          {t("tagline")}
        </p>
      </div>
    </section>
  );
}
