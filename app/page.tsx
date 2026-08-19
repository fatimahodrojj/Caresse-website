import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScallopDivider from "@/components/ScallopDivider";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Team from "@/components/Team";
import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ScallopDivider fill="#FFFDF8" />
      <Services />
      <Stats />
      <ScallopDivider fill="#FBDFE9" />
      <About />
      <Team />
      <Testimonial />
      <CTA />
      <Footer />
    </>
  );
}
