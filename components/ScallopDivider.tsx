interface ScallopDividerProps {
  /** Fill color of the divider — should match the section BELOW it. */
  fill: string;
}

/**
 * Recurring wave/arch motif lifted from the Caresse logo's arch shapes.
 * Used between full-bleed sections instead of a plain straight edge,
 * so the brand identity shows up structurally, not just in the header.
 */
export default function ScallopDivider({ fill }: ScallopDividerProps) {
  return (
    <svg
      className="block w-full h-[60px] -mt-px"
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,0 C50,60 100,60 150,0 C200,60 250,60 300,0 C350,60 400,60 450,0 C500,60 550,60 600,0 C650,60 700,60 750,0 C800,60 850,60 900,0 C950,60 1000,60 1050,0 C1100,60 1150,60 1200,0 L1200,60 L0,60 Z"
        fill={fill}
      />
    </svg>
  );
}
