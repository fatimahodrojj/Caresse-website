import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import { team } from "@/data/team";
import type { TeamMember } from "@/lib/types";

/**
 * Meet Our Team. Mobile: one card at a time. Desktop (xl): three cards.
 */
export default function Team() {
  return (
    <section id="team" className="bg-rose px-4 py-5 font-sans xl:px-[120px] xl:py-20">
      <div data-reveal className="mx-auto flex max-w-[1200px] flex-col gap-3 xl:gap-10">
        <div className="flex flex-col gap-[10px] text-center xl:gap-3">
          <h2 className="font-heading text-[32px] xl:text-5xl">Meet Our Team</h2>
          <p className="text-sm opacity-80 xl:text-lg">
            A dedicated, specialized group of professionals passionate about supporting the healthy
            growth of our families.
          </p>
        </div>
        <Carousel
          label="Meet Our Team"
          itemClassName="basis-full md:basis-[calc((100%-12px)/2)] xl:basis-auto"
          listClassName="xl:grid xl:grid-cols-3 xl:gap-4 xl:overflow-visible"
          arrowClassName="size-11"
          hideArrowsFrom="xl"
        >
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </Carousel>
        <Link
          href="/#services"
          className="text-center text-lg font-bold tracking-[0.5px] text-sky xl:text-[22px]"
        >
          Know More About Our Therapy →
        </Link>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex w-full flex-col items-center gap-2 rounded-card bg-white p-3 text-center xl:gap-3 xl:p-5">
      <div className="relative size-[120px] shrink-0 overflow-hidden rounded-media xl:aspect-square xl:size-auto xl:w-full">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(min-width: 1280px) 350px, 120px"
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
        <h3 className="font-heading text-xl xl:text-[22px]">{member.name}</h3>
        <p className="text-[13px] font-semibold leading-[1.5] text-sky">{member.role}</p>
      </div>
      {member.character ? (
        <Image
          src={member.character}
          alt=""
          width={50}
          height={50}
          className="mt-auto size-11 rounded-full xl:size-[50px]"
        />
      ) : (
        // Keeps the card layout while the illustration is missing.
        <span aria-hidden="true" className="mt-auto size-11 xl:size-[50px]" />
      )}
    </article>
  );
}
