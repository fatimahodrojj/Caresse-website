import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowWeReachYou from "@/components/HowWeReachYou";
import TherapyShop from "@/components/TherapyShop";
import Team from "@/components/Team";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import type { Product } from "@/lib/types";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

// Shop products come from the database (admin panel). None yet, so the shop
// section shows its "coming soon" message.
const products: Product[] = [];

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Services />
        <Stats />
        <WhyChooseUs />
        <HowWeReachYou />
        <TherapyShop products={products} />
        <Team />
        <CTA />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
