export default function Hero() {
  return (
    <header className="relative bg-gradient-to-b from-sky-soft to-gold-soft pt-32 pb-10 overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full font-extrabold text-xs tracking-wide text-pink shadow-sm mb-5">
            Speech · ABA · Occupational · Psychomotor
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-navy mb-5 leading-tight">
            Therapy that feels like <span className="text-pink">play</span>,
            progress that lasts a lifetime.
          </h1>
          <p className="text-lg text-navy-soft max-w-md mb-8 leading-relaxed">
            Caresse brings speech, behavioral, and developmental therapies
            together under one warm roof — for kids, teens, and adults who
            deserve to be understood.
          </p>
          <div className="flex gap-4 flex-wrap mb-9">
            <a
              href="#book"
              className="font-display text-sm px-7 py-3 rounded-full bg-pink text-white shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              Book a Free Consultation
            </a>
            <a
              href="#services"
              className="font-display text-sm px-7 py-3 rounded-full bg-white border-2 border-gold text-navy hover:bg-gold-soft transition-colors"
            >
              Explore Services
            </a>
          </div>
          <div className="flex gap-7 flex-wrap text-sm font-bold">
            <TrustItem color="bg-gold" label="Licensed therapists" />
            <TrustItem color="bg-sky" label="All ages welcome" />
            <TrustItem color="bg-pink" label="1:1 personalized plans" />
          </div>
        </div>

        {/*
          ILLUSTRATION PLACEHOLDER
          Per feedback, this needs hand-drawn "yarn ball" scribble-blob
          characters (Expressable.com style) — talking/interacting near
          the headline — NOT flat geometric shapes.
          Swap this box for <Image src="/images/hero-blobs.svg" .../>
          once the illustration assets are sourced (Figma First Draft,
          an illustrator, or an AI image tool using the brief we wrote).
        */}
        <div className="relative h-64 md:h-[420px] flex items-center justify-center">
          <div className="w-full h-full rounded-xl2 border-2 border-dashed border-navy/20 flex items-center justify-center text-center text-navy-soft text-sm px-6">
            Illustration slot — hand-drawn scribble-blob characters
            (see illustration brief)
          </div>
        </div>
      </div>
    </header>
  );
}

function TrustItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
}
