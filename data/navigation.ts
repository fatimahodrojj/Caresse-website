export type NavKey = "home" | "services" | "about" | "team" | "contact";

export type NavLink = {
  /** Translation key under "Nav" in messages/*.json. */
  key: NavKey;
  href: string;
};

// Section links include "/" so they also work from other pages (e.g. /book).

// "Home" targets <main id="top"> so it scrolls to the top even when you are
// already on the homepage (a plain "/" link keeps the scroll position).
export const homeHref = "/#top";

export const navLinks: NavLink[] = [
  { key: "home", href: homeHref },
  { key: "services", href: "/#services" },
  { key: "about", href: "/#about" },
  { key: "team", href: "/#team" },
  { key: "contact", href: "/#contact" },
];
