import Image from "next/image";

// docs/homepage-content.md (Why Families Choose Caresse). Star colours and
// their 13% tinted circles follow Figma's order: blue, pink, gold, purple.
const points = [
  {
    title: "Personalized Treatment Plans",
    description:
      "Every person's journey is unique. We tailor our clinical therapy programs directly to individual needs, goals, and speeds.",
    star: "/images/icons/star-blue.svg",
    circle: "bg-sky/[0.13]",
  },
  {
    title: "Certified & Caring Therapists",
    description:
      "Our licensed multidisciplinary team operates with a deep commitment to gentle, effective, evidence-based practices.",
    star: "/images/icons/star-pink.svg",
    circle: "bg-pink/[0.13]",
  },
  {
    title: "Child-Friendly Environment",
    description:
      "Our state-of-the-art sensory rooms and treatment spaces are designed to feel bright, playful, and completely safe.",
    star: "/images/icons/star-gold.svg",
    circle: "bg-gold/[0.13]",
  },
  {
    title: "Family-Centered Approach",
    description:
      "We work closely alongside parents and school teams, ensuring progress is supported outside the clinic walls too.",
    star: "/images/icons/star-purple.svg",
    circle: "bg-purple/[0.13]",
  },
];

/**
 * Why Families Choose Caresse (the "About Us" nav target).
 * Mobile: stacked, characters below. Desktop (xl): text left, characters right.
 * Figma fixes the text at 895px and the characters at 410px, which overflows
 * the 1280px content width, so the text column takes the remaining space.
 */
export default function WhyChooseUs() {
  return (
    <section id="about" className="bg-ice p-4 font-sans xl:px-20 xl:py-[120px]">
      <div data-reveal className="mx-auto flex max-w-[1280px] flex-col gap-3 xl:flex-row xl:items-center xl:gap-20">
        <div className="flex flex-col gap-3 xl:min-w-0 xl:flex-1 xl:gap-10">
          <h2 className="font-heading text-[32px] xl:text-[56px]">Why Families Choose Caresse</h2>
          <ul className="flex flex-col gap-[10px] xl:gap-6">
            {points.map((point) => (
              <li key={point.title} className="flex items-start gap-[10px] xl:gap-4">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full xl:size-10 ${point.circle}`}
                >
                  <Image src={point.star} alt="" width={20} height={20} className="size-4 xl:size-5" />
                </span>
                <div className="flex flex-col gap-[2px] xl:gap-1">
                  <h3 className="text-base font-bold xl:text-lg">{point.title}</h3>
                  <p className="text-[13px] leading-[1.4] opacity-70 xl:text-sm">{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex h-[180px] items-center justify-center xl:h-[333px] xl:shrink-0">
          <Image
            src="/images/illustrations/why-character-jump-1.png"
            alt=""
            width={160}
            height={160}
            className="mr-[-8px] size-[100px] rounded-full xl:mr-[-15px] xl:size-40"
          />
          <Image
            src="/images/illustrations/why-character-jump-2.png"
            alt=""
            width={180}
            height={180}
            className="size-[110px] rounded-full xl:size-[180px]"
          />
        </div>
      </div>
    </section>
  );
}
