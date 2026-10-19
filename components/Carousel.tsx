"use client";

import Image from "next/image";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type CarouselProps = {
  /** Accessible name for the carousel region. */
  label: string;
  children: ReactNode;
  /** Width of each slide, per breakpoint (e.g. "basis-full md:basis-1/2"). */
  itemClassName: string;
  /**
   * Extra classes for the slide list. Use xl: classes here to turn the
   * carousel into a grid on desktop (and set hideArrowsFrom="xl").
   */
  listClassName?: string;
  /** Arrow button size per breakpoint (Figma: 40, 44 or 56px). */
  arrowClassName: string;
  /** Hide the arrows from this breakpoint up (when the list becomes a grid). */
  hideArrowsFrom?: "md" | "xl";
};

/**
 * Horizontal carousel: native scroll with snapping (so it can be swiped),
 * plus previous/next buttons as in the Figma mobile frame.
 */
export default function Carousel({
  label,
  children,
  itemClassName,
  listClassName = "",
  arrowClassName,
  hideArrowsFrom,
}: CarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setCanPrev(list.scrollLeft > 1);
    setCanNext(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      list.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  function scrollByPage(direction: -1 | 1) {
    const list = listRef.current;
    if (!list) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({
      left: direction * list.clientWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  const arrowVisibility =
    hideArrowsFrom === "md" ? "md:hidden" : hideArrowsFrom === "xl" ? "xl:hidden" : "";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="flex items-center gap-3"
    >
      <ArrowButton
        direction="previous"
        disabled={!canPrev}
        onClick={() => scrollByPage(-1)}
        className={`${arrowClassName} ${arrowVisibility}`}
      />
      <ul
        ref={listRef}
        className={`scrollbar-none flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto ${listClassName}`}
      >
        {Children.map(children, (child) => (
          <li className={`flex shrink-0 snap-start ${itemClassName}`}>{child}</li>
        ))}
      </ul>
      <ArrowButton
        direction="next"
        disabled={!canNext}
        onClick={() => scrollByPage(1)}
        className={`${arrowClassName} ${arrowVisibility}`}
      />
    </div>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
  className,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
  className: string;
}) {
  const icon = direction === "previous" ? "chevron-left" : "chevron-right";
  return (
    <button
      type="button"
      aria-label={direction === "previous" ? "Previous" : "Next"}
      disabled={disabled}
      onClick={onClick}
      className={`flex shrink-0 items-center justify-center rounded-full border border-navy/10 bg-white drop-shadow-control transition-opacity disabled:opacity-40 ${className}`}
    >
      <Image
        src={`/images/icons/${icon}.svg`}
        alt=""
        width={20}
        height={20}
        className="size-[18px] xl:size-5"
      />
    </button>
  );
}
