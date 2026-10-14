import { TeamMember } from "@/lib/types";

// Names and roles from docs/homepage-content.md (Meet Our Team).
export const team: TeamMember[] = [
  {
    name: "Rawan Cherry",
    role: "Founder | Speech-Language Therapist | Feeding Therapist | Family Coach",
    photo: "/images/team/rawan-cherry.jpg",
    character: "/images/illustrations/team-character-rawan-cherry.png",
  },
  {
    name: "Ali Atie",
    role: "Applied Behavior Analysis Technician (ABAT)",
    photo: "/images/team/ali-atie.jpg",
    // Tall full-body portrait: zoom in on head and shoulders to match Rawan.
    photoCrop: { position: "50% 19%", zoom: 1.15, origin: "50% 30%" },
    character: "/images/illustrations/team-character-ali-atie.png",
  },
  {
    name: "Mariam Al-Itawi",
    role: "Occupational Therapist",
    photo: "/images/team/mariam-al-itawi.jpg",
    character: "/images/illustrations/team-character-mariam-al-itawi.png",
  },
];
