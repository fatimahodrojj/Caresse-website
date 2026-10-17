import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getClinicSettings, telHref } from "@/lib/settings";
import { homeHref } from "@/data/navigation";

// Wordmark letter colours from Figma (docs/design-system.md, Core palette).
const wordmark = [
  { letter: "C", color: "text-pink" },
  { letter: "a", color: "text-sky" },
  { letter: "r", color: "text-gold" },
  { letter: "e", color: "text-purple" },
  { letter: "s", color: "text-pink" },
  { letter: "s", color: "text-sky" },
  { letter: "e", color: "text-gold" },
];

const DEVELOPER_URL = "https://www.linkedin.com/company/codeyy/";

const quickLinks = [
  { key: "home", href: homeHref },
  { key: "services", href: "/#services" },
  { key: "about", href: "/#about" },
  { key: "ourTeam", href: "/team" },
] as const;

/**
 * Footer: brand block, Quick Links and Contact Info.
 * Mobile: brand block, then two columns side by side. Tablet and desktop: one row.
 */
export default async function Footer() {
  const t = await getTranslations("Footer");
  // Contact details are edited in the admin panel (Settings).
  const settings = await getClinicSettings();
  const address = (await getLocale()) === "ar" ? settings.addressAr : settings.addressEn;
  const [emailUser, emailDomain] = settings.email.split("@");
  return (
    <footer id="contact" className="bg-navy p-3 font-sans text-white md:px-8 md:py-8 xl:px-20 xl:pb-10 xl:pt-6">
      <div data-reveal className="mx-auto flex max-w-[1280px] flex-col gap-2 md:gap-8 xl:gap-16">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:gap-8 xl:flex-row xl:justify-between xl:gap-2">
          <div className="flex flex-col gap-[6px] md:w-[280px] md:shrink-0 md:gap-4 xl:w-[360px] xl:shrink xl:gap-6">
            <p className="flex gap-[2px] self-start font-wordmark text-2xl md:text-3xl xl:text-4xl" aria-label={t("wordmarkLabel")} dir="ltr">
              {wordmark.map((item, index) => (
                <span key={index} aria-hidden="true" className={item.color}>
                  {item.letter}
                </span>
              ))}
            </p>
            <p className="text-xs leading-[1.35] opacity-70 md:text-sm md:leading-[1.5] xl:text-sm xl:leading-[1.5]">
              {t("tagline")}
            </p>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("instagramLabel")}
              className="flex size-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 xl:size-9"
            >
              <Image
                src="/images/icons/instagram.svg"
                alt=""
                width={18}
                height={18}
                className="size-4 xl:size-[18px]"
              />
            </a>
          </div>

          <div className="flex gap-3 md:flex-1 md:justify-end md:gap-10 xl:flex-none xl:gap-[120px]">
            <FooterColumn title={t("quickLinks")} className="md:flex-none xl:w-[160px]">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link href={link.href}>{t(link.key)}</Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title={t("contactTitle")} className="md:w-[240px] md:flex-none xl:w-[240px]">
              <li>{address}</li>
              <li>
                <a href={telHref(settings.phone)} dir="ltr">
                  {settings.phone}
                </a>
              </li>
              <li>
                {/* Break only after the "@" on narrow screens. */}
                <a href={`mailto:${settings.email}`} dir="ltr">
                  {`${emailUser}@`}
                  <wbr />
                  {emailDomain}
                </a>
              </li>
            </FooterColumn>
          </div>
        </div>

        <div className="flex flex-col gap-[6px] border-t border-white/10 pt-[6px] xl:gap-6 xl:pt-6">
          <div className="flex flex-col gap-[6px] md:flex-row md:items-center md:justify-between xl:flex-row xl:items-center xl:justify-between">
            <p className="flex flex-col gap-[2px] text-xs md:flex-row md:flex-wrap md:items-center md:gap-x-2 xl:text-[13px]">
              <span className="opacity-50">{t("copyright")}</span>
              <span aria-hidden="true" className="hidden opacity-30 md:inline">·</span>
              {/* Developer credit: small and muted. */}
              <span className="text-[11px] opacity-50 xl:text-xs">
                {t.rich("credit", {
                  link: (chunks) => (
                    <a
                      href={DEVELOPER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="underline-offset-2 hover:underline"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </span>
            </p>
            <div className="flex items-center gap-2 xl:gap-3">
              <p className="text-xs font-semibold opacity-70 xl:text-sm">{t("goodbye")}</p>
              <Image
                src="/images/illustrations/footer-character-goodbye.png"
                alt=""
                width={48}
                height={48}
                className="size-8 rounded-full xl:size-12"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-1 xl:flex-none xl:gap-4 ${className}`}>
      <h3 className="text-sm font-bold text-gold xl:text-base">{title}</h3>
      <ul className="flex flex-col text-[13px] leading-[1.2] opacity-80 [&>li]:flex [&>li]:min-h-10 [&>li]:items-center [&_a]:flex [&_a]:min-h-10 [&_a]:w-full [&_a]:items-center xl:gap-4 xl:text-sm xl:leading-normal xl:[&>li]:block xl:[&>li]:min-h-0 xl:[&_a]:inline xl:[&_a]:min-h-0 xl:[&_a]:w-auto">
        {children}
      </ul>
    </div>
  );
}
