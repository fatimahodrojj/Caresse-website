import { Service } from "@/lib/types";

// The "Our Services" cards. Text lives in messages/*.json under
// Services.items.<id>; dot colours follow Figma (docs/design-system.md).
export const services: Service[] = [
  { id: "autism", image: "/images/illustrations/service-autism.png", dot: "purple" },
  { id: "speechLanguage", image: "/images/illustrations/service-speech-language.png", dot: "pink" },
  {
    id: "neuroDevelopmental",
    image: "/images/illustrations/service-neuro-developmental.png",
    dot: "purple",
  },
  { id: "feeding", image: "/images/illustrations/service-feeding.png", dot: "purple" },
  { id: "familySupport", image: "/images/illustrations/service-family-support.png", dot: "pink" },
  { id: "coTherapy", image: "/images/illustrations/service-co-therapy.png", dot: "purple" },
];
