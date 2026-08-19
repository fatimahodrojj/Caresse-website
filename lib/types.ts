export type BrandAccent = "gold" | "sky" | "pink";

export interface Service {
  slug: string;
  title: string;
  description: string;
  accent: BrandAccent;
}

export interface TeamMember {
  name: string;
  role: string;
  accent: BrandAccent;
}

export interface Stat {
  value: string;
  label: string;
}
