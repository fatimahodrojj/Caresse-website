import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScallopDivider from "@/components/ScallopDivider";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowWeReachYou from "@/components/HowWeReachYou";
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
      <WhyChooseUs />
      <HowWeReachYou />
      <Team />
      <Testimonial />
      <CTA />
      <Footer />
    </>
  );
}
