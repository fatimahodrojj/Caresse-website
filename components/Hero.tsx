import Image from "next/image";

type Character = {
  src: string;
  // Wrapper size and corner radius per breakpoint, from Figma.
  className: string;
  sizes: string;
};

// Mobile (Figma 113:7): 96 / 112 / 96px circles, 8px apart.
// Desktop (Figma 7:4): 289×260 / 391×386 / 285×240, overlapping by 60px.
const characters: Character[] = [
  {
    src: "/images/illustrations/hero-character-blue.png",
    className:
      "size-24 rounded-full xl:mr-[-60px] xl:h-[260px] xl:w-[289px] xl:rounded-[130px]",
    sizes: "(min-width: 1280px) 289px, 96px",
  },
  {
    src: "/images/illustrations/hero-character-pink.png",
    className:
      "size-28 rounded-full xl:mr-[-60px] xl:h-[386px] xl:w-[391px] xl:rounded-[150px]",
    sizes: "(min-width: 1280px) 391px, 112px",
  },
  {
    src: "/images/illustrations/hero-character-gold.png",
    className:
      "size-24 rounded-full xl:h-[240px] xl:w-[285px] xl:rounded-[120px]",
    sizes: "(min-width: 1280px) 285px, 96px",
  },
];

/**
 * Hero: three characters and the tagline on the hero gradient.
 * On desktop the transparent navbar sits on top, hence the 180px top
 * padding.
 */
export default function Hero() {
  return (
    <section className="bg-hero p-3 xl:px-20 xl:pb-[120px] xl:pt-[180px]">
      <h1 className="sr-only">Caresse – Multitherapeutic Services</h1>
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-2 xl:gap-0">
        <div className="flex items-center justify-center gap-2 xl:h-[459px] xl:w-[1038px] xl:gap-0">
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
        <p className="text-shadow-tagline w-full text-center font-script text-[36px] leading-[1.1] tracking-[2px] text-navy opacity-95 xl:text-[52px] xl:tracking-[3px]">
          A Touch From The Soul
        </p>
      </div>
    </section>
  );
}
