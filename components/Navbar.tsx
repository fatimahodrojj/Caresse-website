const links = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#team", label: "Our Team" },
  { href: "#testimonials", label: "Stories" },
  { href: "#contact", label: "Contact" },
];

/**
 * Transparent/floating navbar per feedback: no solid bar behind it,
 * it sits directly on top of the hero's colored background.
 * `absolute` (not `sticky`) is deliberate — a transparent bar that
 * stays fixed while scrolling over non-hero content would lose
 * contrast. If sticky-on-scroll is wanted later, swap this for a
 * scroll-listener that fades in a solid background past the hero.
 */
export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-[1180px] mx-auto px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="font-display text-2xl text-white drop-shadow-sm">
            Caresse
          </span>
        </div>

        <div className="hidden md:flex gap-9 font-display text-white text-sm">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 hover:text-pink-soft transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#book"
          className="inline-flex items-center gap-2 font-display text-sm px-6 py-3 rounded-full bg-pink text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
        >
          Book a Session
        </a>
      </div>
    </nav>
  );
}

function LogoMark() {
  return (
    <svg width="42" height="32" viewBox="0 0 120 90" fill="none" aria-hidden="true">
      <circle cx="24" cy="12" r="9" fill="#EA6E9C" />
      <circle cx="68" cy="12" r="9" fill="#EA6E9C" />
      <path d="M4 62 C4 30 44 30 44 62" stroke="#F0C349" strokeWidth="16" strokeLinecap="round" />
      <path d="M40 62 C40 30 80 30 80 62" stroke="#4A9FE0" strokeWidth="16" strokeLinecap="round" />
      <circle cx="41" cy="46" r="8" fill="#EA6E9C" />
      <path d="M25 68 C25 58 41 58 41 68" stroke="#F0C349" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
