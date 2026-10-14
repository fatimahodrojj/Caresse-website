export type NavLink = {
  label: string;
  href: string;
};

// Labels from docs/homepage-content.md. Section links include "/" so they
// also work from other pages (e.g. /book).

// "Home" targets <main id="top"> so it scrolls to the top even when you are
// already on the homepage (a plain "/" link keeps the scroll position).
export const homeHref = "/#top";

export const navLinks: NavLink[] = [
  { label: "Home", href: homeHref },
  { label: "Services", href: "/#services" },
  { label: "About Us", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "Contact", href: "/#contact" },
];
