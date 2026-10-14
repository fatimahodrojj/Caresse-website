"use client";

import { useEffect } from "react";

/**
 * Fades elements marked with `data-reveal` (each section's content, so the
 * section backgrounds stay solid) in and up 20px the first time
 * they enter the viewport. Renders nothing.
 *
 * Sections are only hidden once this has run (the `reveal-ready` class on
 * <html>), so the server HTML stays fully visible if JavaScript fails.
 * Sections already on screen, or above it, are shown immediately so nothing
 * visible flickers. Does nothing when the user prefers reduced motion.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (element.getBoundingClientRect().top < window.innerHeight) {
        element.classList.add("is-revealed");
      } else {
        observer.observe(element);
      }
    }
    document.documentElement.classList.add("reveal-ready");

    return () => observer.disconnect();
  }, []);

  return null;
}
