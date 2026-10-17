import Image from "next/image";
import Carousel from "@/components/Carousel";

// docs/homepage-content.md (How We Reach You). Image-area tints from
// docs/design-system.md (Supporting colors).
const modes = [
  {
    title: "Home Visits",
    description:
      "We come to you. Our therapists provide personalized sessions in the comfort of your home.",
    image: "/images/illustrations/delivery-home-visits.png",
    tint: "bg-tint-peach",
  },
  {
    title: "At the Clinic",
    description: "Visit us at our center for a fully equipped, welcoming therapy environment.",
    image: "/images/illustrations/delivery-at-clinic.png",
    tint: "bg-tint-blush",
  },
  {
    title: "Online Sessions",
    description:
      "Connect with our specialists remotely through secure, convenient virtual sessions.",
    image: "/images/illustrations/delivery-online-sessions.png",
    tint: "bg-tint-lilac",
  },
];

type Mode = (typeof modes)[number];

/**
 * How We Reach You. Mobile: carousel of horizontal cards (image left;
 * stacked below 375px, where the arrows leave too little width).
 * Desktop (xl): three vertical cards side by side.
 */
export default function HowWeReachYou() {
  return (
    <section className="bg-cream-warm p-3 font-sans xl:px-20 xl:py-24">
      <div data-reveal className="mx-auto flex max-w-[1280px] flex-col gap-2 xl:gap-12">
        <div className="flex flex-col gap-[6px] text-center xl:gap-3">
          <h2 className="text-2xl font-bold leading-[1.2] xl:text-[40px]">How We Reach You</h2>
          <p className="text-sm leading-[1.6] opacity-75 xl:text-base">
            Choose the way that works best for you - from the comfort of home to our welcoming
            clinic, or from anywhere via secure online sessions.
          </p>
        </div>
        <Carousel
          label="How We Reach You"
          itemClassName="basis-full md:basis-[calc((100%-12px)/2)] xl:basis-auto"
          listClassName="py-1 xl:grid xl:grid-cols-3 xl:gap-6 xl:overflow-visible xl:py-0"
          arrowClassName="size-11"
          hideArrowsFrom="xl"
        >
          {modes.map((mode) => (
            <ModeCard key={mode.title} mode={mode} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

function ModeCard({ mode }: { mode: Mode }) {
  return (
    <article className="flex w-full flex-col items-center gap-[10px] rounded-panel border border-line bg-white p-2 drop-shadow-card-strong min-[375px]:flex-row xl:flex-col xl:items-stretch xl:gap-4 xl:rounded-card-lg xl:p-6">
      <div
        className={`flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-media border border-line xl:h-[220px] xl:w-full xl:rounded-panel ${mode.tint}`}
      >
        <Image
          src={mode.image}
          alt=""
          width={180}
          height={180}
          className="size-20 rounded-full xl:size-[180px]"
        />
      </div>
      <div className="flex flex-col gap-[2px] text-center min-[375px]:text-left xl:gap-4">
        <h3 className="text-base font-bold leading-[1.3] xl:text-xl">{mode.title}</h3>
        <p className="text-xs leading-[1.5] opacity-80 xl:text-sm xl:leading-[1.6]">
          {mode.description}
        </p>
      </div>
    </article>
  );
}
