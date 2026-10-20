import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Carousel from "@/components/Carousel";
import { team } from "@/data/team";
import type { TeamMember } from "@/lib/types";

/**
 * Meet Our Team. Mobile: one card at a time. Desktop (xl): three cards.
 */
export default function Team() {
  const t = useTranslations("Team");
  return (
    <section id="team" className="bg-rose px-4 py-5 font-sans md:px-8 md:py-12 xl:px-[120px] xl:py-20">
      <div data-reveal className="mx-auto flex max-w-[1200px] flex-col gap-3 md:gap-8 xl:gap-10">
        <div className="flex flex-col gap-[10px] text-center md:gap-3 xl:gap-3">
          <h2 className="font-heading text-[32px] md:text-[40px] xl:text-5xl">{t("title")}</h2>
          <p className="text-sm opacity-80 md:text-base xl:text-lg">
            {t("subtitle")}
          </p>
        </div>
        <Carousel
          label={t("title")}
          itemClassName="basis-full md:basis-[calc((100%-12px)/2)] xl:basis-auto"
          listClassName="md:grid md:grid-cols-3 md:gap-4 md:overflow-visible xl:grid xl:grid-cols-3 xl:gap-4 xl:overflow-visible"
          arrowClassName="size-11"
          hideArrowsFrom="md"
        >
          {team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </Carousel>
        <Link
          href="/team"
          className="flex min-h-10 items-center justify-center text-center text-lg font-bold text-sky ltr:tracking-[0.5px] md:text-xl xl:block xl:min-h-0 xl:text-[22px]"
        >
          {t("knowMore")}
        </Link>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const t = useTranslations("Team.members");
  const name = t(`${member.id}.name`);
  return (
    <article className="flex w-full flex-col items-center gap-2 rounded-card bg-white p-3 text-center md:gap-3 md:p-4 xl:gap-3 xl:p-5">
      <div className="relative size-[120px] shrink-0 overflow-hidden rounded-media md:aspect-square md:size-auto md:w-full xl:aspect-square xl:size-auto xl:w-full">
        <Image
          src={member.photo}
          alt={name}
          fill
          sizes="(min-width: 1280px) 350px, (min-width: 768px) 30vw, 120px"
          className="object-cover"
          style={
            member.photoCrop && {
              objectPosition: member.photoCrop.position,
              transform: `scale(${member.photoCrop.zoom})`,
              transformOrigin: member.photoCrop.origin,
            }
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-xl xl:text-[22px]">{name}</h3>
        <p className="text-[13px] font-semibold leading-[1.5] text-sky">{t(`${member.id}.role`)}</p>
      </div>
      {member.character ? (
        <Image
          src={member.character}
          alt=""
          width={50}
          height={50}
          className="mt-auto size-11 rounded-full md:size-[50px] xl:size-[50px]"
        />
      ) : (
        // Keeps the card layout while the illustration is missing.
        <span aria-hidden="true" className="mt-auto size-11 md:size-[50px] xl:size-[50px]" />
      )}
    </article>
  );
}
