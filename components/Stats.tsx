import Image from "next/image";

// docs/homepage-content.md (Stats). "Progress Rate" is used on all screen
// sizes (decision: Figma desktop said "Good reviews").
const stats = [
  { value: "500+", label: "Cases Helped" },
  { value: "90%", label: "Progress Rate" },
  { value: "10+", label: "Therapy Services" },
];

/**
 * Stats band. Mobile: three stats in a row, character below.
 * Desktop (xl): stats and character side by side.
 */
export default function Stats() {
  return (
    <section className="bg-navy p-4 font-sans xl:px-20 xl:py-16">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-0">
        <dl className="flex gap-3 text-center xl:flex-1 xl:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-1 flex-col-reverse gap-[6px] xl:gap-2">
              <dt className="text-xs font-semibold text-white xl:text-base">{stat.label}</dt>
              <dd className="font-heading text-4xl text-gold xl:text-[64px] xl:leading-normal">
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
          className="h-[78px] w-24 rounded-[38px] object-cover xl:h-[104px] xl:w-[127px] xl:rounded-[50px]"
        />
      </div>
    </section>
  );
}
