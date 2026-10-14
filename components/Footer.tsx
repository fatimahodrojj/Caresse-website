import Image from "next/image";
import Link from "next/link";
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

// The design has the icons but no profile URLs yet, so they are not links.
const socials = [
  { name: "Instagram", icon: "/images/icons/instagram.svg" },
  { name: "Facebook", icon: "/images/icons/facebook.svg" },
  { name: "YouTube", icon: "/images/icons/youtube.svg" },
];

const quickLinks = [
  { label: "Home", href: homeHref },
  { label: "Services", href: "/#services" },
  { label: "About Us", href: "/#about" },
  { label: "Our Team", href: "/#team" },
];

const serviceLinks = ["Speech Therapy", "ABA Therapy", "Occupational Therapy", "Psychomotor Support"];

/**
 * Footer. One Contact Info column (Figma desktop repeats it).
 * Mobile: brand block, then three narrow columns. Desktop (xl): one row.
 */
export default function Footer() {
  return (
    <footer id="contact" className="bg-navy p-3 font-sans text-white md:px-8 md:py-8 xl:px-20 xl:pb-10 xl:pt-6">
      <div data-reveal className="mx-auto flex max-w-[1280px] flex-col gap-2 md:gap-8 xl:gap-16">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:gap-8 xl:flex-row xl:justify-between xl:gap-2">
          <div className="flex flex-col gap-[6px] md:w-[280px] md:shrink-0 md:gap-4 xl:w-[360px] xl:shrink xl:gap-6">
            <p className="flex gap-[2px] font-heading text-2xl md:text-3xl xl:text-4xl" aria-label="Caresse">
              {wordmark.map((item, index) => (
                <span key={index} aria-hidden="true" className={item.color}>
                  {item.letter}
                </span>
              ))}
            </p>
            <p className="text-xs leading-[1.35] opacity-70 md:text-sm md:leading-[1.5] xl:text-sm xl:leading-[1.5]">
              Multitherapeutic services empowering children, teens, and adults to express, develop,
              and thrive with confidence.
            </p>
            <ul className="flex gap-[6px] xl:gap-3">
              {socials.map((social) => (
                <li
                  key={social.name}
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 xl:size-9"
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={18}
                    height={18}
                    className="size-4 xl:size-[18px]"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 md:flex-1 md:gap-6 xl:flex-none xl:gap-[67px]">
            <FooterColumn title="Quick Links" className="xl:w-[160px]">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Services" className="xl:w-[180px]">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <Link href="/#services">{label}</Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Contact Info" className="xl:w-[240px]">
              <li>Airport Road, Zaarour Center, Third floor</li>
              <li>
                <a href="tel:+96171056803">+961 71056803</a>
              </li>
              <li>
                {/* Break only after the "@" on narrow screens. */}
                <a href="mailto:caresseclinic@gmail.com">
                  caresseclinic@
                  <wbr />
                  gmail.com
                </a>
              </li>
            </FooterColumn>
          </div>
        </div>

        <div className="flex flex-col gap-[6px] border-t border-white/10 pt-[6px] xl:gap-6 xl:pt-6">
          <div className="flex flex-col gap-[6px] md:flex-row md:items-center md:justify-between xl:flex-row xl:items-center xl:justify-between">
            <p className="text-xs opacity-50 xl:text-[13px]">
              © 2026 Caresse Clinic. All rights reserved.
            </p>
            <div className="flex items-center gap-2 xl:gap-3">
              <p className="text-xs font-semibold opacity-70 xl:text-sm">Goodbye from Caresse!</p>
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
