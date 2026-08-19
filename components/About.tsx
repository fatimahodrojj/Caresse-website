const reasons = [
  {
    emoji: "🧩",
    title: "Cross-discipline care plans",
    body: "Speech, ABA, and OT therapists collaborate on shared goals — not isolated sessions.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Family-first approach",
    body: "Parents get progress notes and home practice tools after every session.",
  },
  {
    emoji: "🌱",
    title: "Ages 2 to adult",
    body: "From early intervention toddlers to adults recovering communication after injury.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-pink-soft py-24">
      <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-14 items-center">
        {/* Illustration placeholder — same brief as Hero */}
        <div className="h-64 md:h-96 rounded-xl2 border-2 border-dashed border-navy/20 flex items-center justify-center text-center text-navy-soft text-sm px-6">
          Illustration slot — blob characters celebrating/reacting
        </div>

        <div>
          <span className="inline-block bg-white px-4 py-2 rounded-full font-extrabold text-xs text-pink shadow-sm mb-4">
            Why families choose Caresse
          </span>
          <h2 className="font-display text-2xl md:text-3xl mb-3">
            One team, every stage of growth
          </h2>
          <p className="text-navy-soft leading-relaxed mb-7">
            Instead of juggling separate clinics, families get one
            coordinated care team — therapists who actually talk to each
            other about your child&apos;s progress.
          </p>

          <div className="flex flex-col gap-6">
            {reasons.map((reason) => (
              <div key={reason.title} className="flex gap-4 items-start">
                <div
                  className="min-w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm"
                  aria-hidden="true"
                >
                  {reason.emoji}
                </div>
                <div>
                  <h4 className="font-display text-lg mb-1">{reason.title}</h4>
                  <p className="text-sm text-navy-soft leading-relaxed">
                    {reason.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
