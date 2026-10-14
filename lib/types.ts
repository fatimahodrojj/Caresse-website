export type BrandAccent = "gold" | "sky" | "pink";

export type Service = {
  title: string;
  description: string;
  /** Path under public/ to the service character illustration. */
  image: string;
  /** Colour of the small dot in the card's top-right corner. */
  dot: "pink" | "purple";
};

export interface TeamMember {
  name: string;
  role: string;
  accent: BrandAccent;
}

export interface Stat {
  value: string;
  label: string;
}
