import Image from "next/image";
import { useTranslations } from "next-intl";
import { team } from "@/data/team";
import type { TeamMember } from "@/lib/types";

// Full class names per accent colour (Tailwind only sees complete names).
const accentClasses: Record<
  TeamMember["accent"],
  { ring: string; text: string; iconBg: string; tag: string }
> = {
  sky: { ring: "border-sky", text: "text-sky", iconBg: "bg-sky/[0.13]", tag: "border-sky/20 bg-sky/[0.13]" },
  pink: { ring: "border-pink", text: "text-pink", iconBg: "bg-pink/[0.13]", tag: "border-pink/20 bg-pink/[0.13]" },
  purple: {
    ring: "border-purple",
    text: "text-purple",
    iconBg: "bg-purple/[0.13]",
    tag: "border-purple/20 bg-purple/[0.13]",
  },
};

const iconColor: Record<TeamMember["accent"], string> = { sky: "blue", pink: "pink", purple: "purple" };

/**
 * Therapist profiles for /team (Figma 68:4 desktop, 113:535 mobile).
 * All profiles are listed one after another (Figma mobile used a carousel,
 * which hid two of the three therapists). Mobile: photo on top. Tablet and
 * desktop: round photo beside the text, alternating sides.
 */
export default function TeamProfiles() {
  return (
    <div className="flex flex-col gap-4 md:gap-8 xl:gap-14">
      {team.map((member, index) => (
        <Profile key={member.id} member={member} photoAtEnd={index % 2 === 1} />
      ))}
    </div>
  );
}

function Profile({ member, photoAtEnd }: { member: TeamMember; photoAtEnd: boolean }) {
  const t = useTranslations("TeamPage");
  const tMember = useTranslations("Team.members");
  const accent = accentClasses[member.accent];
  const name = tMember(`${member.id}.name`);
  const expertise = t.raw(`members.${member.id}.expertise`) as string[];
  const headingId = `profile-${member.id}`;

  return (
    <article
      data-reveal
      aria-labelledby={headingId}
      className={`flex flex-col gap-3 rounded-card border border-line bg-cream-warm p-4 drop-shadow-card md:items-center md:gap-8 md:p-8 xl:gap-14 xl:rounded-[32px] xl:p-14 ${
        photoAtEnd ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <div
        className={`relative h-[260px] w-full shrink-0 overflow-hidden rounded-card border-4 ${accent.ring} md:size-[220px] md:rounded-full lg:size-[300px] xl:size-[420px]`}
      >
        <Image
          src={member.photo}
          alt={name}
          fill
          sizes="(min-width: 1280px) 420px, (min-width: 1024px) 300px, (min-width: 768px) 220px, 100vw"
          className="object-cover md:!object-center"
          style={member.profilePhotoPosition ? { objectPosition: member.profilePhotoPosition } : undefined}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 xl:gap-6">
        <div className="flex flex-col gap-[6px] xl:gap-2">
          <h2 id={headingId} className="font-heading text-[32px] leading-[1.05] xl:text-[44px]">
            {name}
          </h2>
          <p className={`text-sm font-bold xl:text-lg ${accent.text}`}>{tMember(`${member.id}.role`)}</p>
        </div>

        <ul className="flex flex-col gap-[10px] xl:gap-3">
          <MetaRow icon={`/images/icons/graduation-cap-${iconColor[member.accent]}.svg`} iconBg={accent.iconBg}>
            {t(`members.${member.id}.credential`)}
          </MetaRow>
          <MetaRow icon={`/images/icons/clock-${iconColor[member.accent]}.svg`} iconBg={accent.iconBg}>
            {t(`members.${member.id}.experience`)}
          </MetaRow>
        </ul>

        <div className="flex flex-col gap-[10px] xl:gap-3">
          <h3 className="text-xs font-bold opacity-55 ltr:uppercase ltr:tracking-[0.24px]">{t("expertiseTitle")}</h3>
          <ul className="flex flex-wrap gap-2 xl:gap-[10px]">
            {expertise.map((area) => (
              <li
                key={area}
                className={`rounded-full border px-[14px] py-2 text-[13px] font-bold xl:px-4 xl:py-[10px] xl:text-sm ${accent.tag}`}
              >
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 xl:gap-[10px]">
          <h3 className="text-xs font-bold opacity-55 ltr:uppercase ltr:tracking-[0.24px]">
            {t("about", { name: t(`members.${member.id}.firstName`) })}
          </h3>
          <p className="text-sm leading-[1.8] text-navy/80 xl:text-base">{t(`members.${member.id}.bio`)}</p>
        </div>
      </div>
    </article>
  );
}

function MetaRow({ icon, iconBg, children }: { icon: string; iconBg: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-[10px] xl:gap-3">
      <span className={`flex size-7 shrink-0 items-center justify-center rounded-full xl:size-8 ${iconBg}`}>
        <Image src={icon} alt="" width={18} height={18} className="size-4 xl:size-[18px]" />
      </span>
      <span className="min-w-0 flex-1 text-[13px] font-semibold leading-[1.45] xl:text-[15px]">{children}</span>
    </li>
  );
}
