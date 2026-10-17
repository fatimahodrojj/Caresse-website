import { Service } from "@/lib/types";

// Text from docs/homepage-content.md (Our Services). Dot colours follow
// Figma (docs/design-system.md, Core palette).
export const services: Service[] = [
  {
    title: "Autism",
    description:
      "Personalized therapy plans tailored to each case based on the child's unique condition, strengths, and developmental needs.",
    image: "/images/illustrations/service-autism.png",
    dot: "purple",
  },
  {
    title: "Speech & Language Disorders",
    description:
      "Comprehensive assessment and targeted intervention for speech delays, articulation difficulties, and language development challenges.",
    image: "/images/illustrations/service-speech-language.png",
    dot: "pink",
  },
  {
    title: "Neuro Developmental Disorder",
    description:
      "Specialized rehabilitation and support for cerebral palsy and other neurological conditions affecting motor and cognitive development.",
    image: "/images/illustrations/service-neuro-developmental.png",
    dot: "purple",
  },
  {
    title: "Feeding Disorders",
    description:
      "Expert evaluation and therapy for children experiencing feeding difficulties, oral motor challenges, and food aversions.",
    image: "/images/illustrations/service-feeding.png",
    dot: "purple",
  },
  {
    title: "Family Support",
    description:
      "Empowering parents and caregivers with guidance, strategies, and resources to create a nurturing and supportive home environment.",
    image: "/images/illustrations/service-family-support.png",
    dot: "pink",
  },
  {
    title: "Co-Therapy",
    description:
      "Collaborative, multidisciplinary therapy sessions combining specialists to deliver integrated and holistic treatment plans.",
    image: "/images/illustrations/service-co-therapy.png",
    dot: "purple",
  },
];
