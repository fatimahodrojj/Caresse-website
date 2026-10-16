import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm, { Characters } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book a Session — Caresse",
  description:
    "Request a consultation session with Caresse's multitherapeutic team. We'll contact you to find the right specialist for your family.",
};

/** Book a Session (Figma 33:5 desktop, 113:709 mobile). */
export default function BookPage() {
  return (
    <>
      <Navbar currentHref={null} />
      <main className="font-sans">
        <section className="bg-cream px-4 pb-4 pt-4 md:px-8 md:pb-10 md:pt-8 xl:px-20 xl:pt-[100px]">
          <div className="mx-auto flex max-w-[800px] flex-col items-center gap-3 text-center md:gap-6">
            <Characters size="large" />
            <div className="flex flex-col gap-[10px] md:gap-4">
              <h1 className="text-balance font-heading text-[44px] leading-[1.1] md:text-[64px] md:leading-normal">
                Start Your Journey with Us
              </h1>
              <p className="text-[15px] leading-[1.5] opacity-80 md:text-lg">
                Fill out the form below to request your consultation session. Our friendly clinical
                intake coordinator will review your needs and connect you with the perfect specialist
                for your family.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-cream-form px-4 pb-5 pt-4 md:px-8 md:pb-20 md:pt-6">
          <div className="mx-auto max-w-[901px]">
            <BookingForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
