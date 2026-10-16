import { TeamMember } from "@/lib/types";

// Names and roles are translated (messages/*.json, Team.members.<id>).
export const team: TeamMember[] = [
  {
    id: "rawan",
    photo: "/images/team/rawan-cherry.jpg",
    character: "/images/illustrations/team-character-rawan-cherry.png",
  },
  {
    id: "ali",
    photo: "/images/team/ali-atie.jpg",
    // Tall full-body portrait: zoom in on head and shoulders to match Rawan.
    photoCrop: { position: "50% 19%", zoom: 1.15, origin: "50% 30%" },
    character: "/images/illustrations/team-character-ali-atie.png",
  },
  {
    id: "mariam",
    photo: "/images/team/mariam-al-itawi.jpg",
    character: "/images/illustrations/team-character-mariam-al-itawi.png",
  },
];
