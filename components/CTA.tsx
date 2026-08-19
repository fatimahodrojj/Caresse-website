export default function CTA() {
  return (
    <section
      id="book"
      className="bg-gradient-to-r from-sky to-pink py-20 text-center text-white"
    >
      <div className="max-w-[1180px] mx-auto px-8">
        <h2 className="font-display text-3xl md:text-4xl mb-3">
          Let&apos;s find the right therapist for you.
        </h2>
        <p className="text-lg opacity-95 max-w-md mx-auto mb-8">
          Book a free 15-minute consultation — no pressure, just a
          conversation about what your family needs.
        </p>
        <a
          href="#contact"
          className="inline-block font-display text-sm px-8 py-3.5 rounded-full bg-white text-pink shadow-lg hover:text-sky hover:-translate-y-0.5 transition-all"
        >
          Book a Free Consultation
        </a>
      </div>
    </section>
  );
}
