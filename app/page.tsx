import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScallopDivider from "@/components/ScallopDivider";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowWeReachYou from "@/components/HowWeReachYou";
import TherapyShop from "@/components/TherapyShop";
import type { Product } from "@/lib/types";
import Team from "@/components/Team";
import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

// Shop products come from the database (admin panel). None yet, so the shop
// section is hidden.
const products: Product[] = [];

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ScallopDivider fill="#FFFDF8" />
      <Services />
      <Stats />
      <ScallopDivider fill="#FBDFE9" />
      <WhyChooseUs />
      <HowWeReachYou />
      <TherapyShop products={products} />
      <Team />
      <Testimonial />
      <CTA />
      <Footer />
    </>
  );
}
