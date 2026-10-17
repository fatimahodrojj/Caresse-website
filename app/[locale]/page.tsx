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
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getTeam } from "@/lib/therapists";
import { getShopProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  return pageMetadata((await params).locale, "home");
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  // Team and shop products come from the database (admin panel).
  const [team, products] = await Promise.all([getTeam(locale), getShopProducts(locale)]);

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
        <Team members={team} />
        <CTA />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
