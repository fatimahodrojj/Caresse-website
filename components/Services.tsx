import { services } from "@/data/services";
import { BrandAccent } from "@/lib/types";

const accentBg: Record<BrandAccent, string> = {
  gold: "bg-gold-soft",
  sky: "bg-sky-soft",
  pink: "bg-pink-soft",
};

export default function Services() {
  return (
    <section id="services" className="bg-cream-light py-24">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="inline-block bg-white px-4 py-2 rounded-full font-extrabold text-xs text-pink shadow-sm mb-4">
            What we offer
          </span>
          <h2 className="font-display text-3xl md:text-4xl mb-3">
            Six ways we help you thrive
          </h2>
          <p className="text-navy-soft text-lg leading-relaxed">
            Every plan starts with an assessment — because no two people
            communicate, move, or grow the same way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((service) => (
            <article
              key={service.slug}
              className="bg-white rounded-xl2 p-8 shadow-md border-2 border-transparent hover:border-pink hover:-translate-y-2 transition-all"
            >
              <div
                className={`w-16 h-16 rounded-2xl mb-5 flex items-center justify-center ${
                  accentBg[service.accent]
                }`}
                aria-hidden="true"
              >
                {/* Icon slot — swap for a small blob mascot icon per
                    the illustration brief once assets exist. */}
                <span className="w-6 h-6 rounded-full bg-navy/10" />
              </div>
              <h3 className="font-display text-xl mb-2">{service.title}</h3>
              <p className="text-navy-soft text-sm leading-relaxed">
                {service.description}
              </p>
              <span className="inline-block mt-4 font-extrabold text-sm text-pink">
                Learn more →
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
