export type NavLink = {
  label: string;
  href: string;
};

// Labels from docs/homepage-content.md. Section links include "/" so they
// also work from other pages (e.g. /book).
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "About Us", href: "/#about" },
  { label: "Team", href: "/#team" },
  { label: "Contact", href: "/#contact" },
];
