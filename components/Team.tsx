import { team } from "@/data/team";
import { BrandAccent } from "@/lib/types";

const accentBg: Record<BrandAccent, string> = {
  gold: "bg-gold-soft",
  sky: "bg-sky-soft",
  pink: "bg-pink-soft",
};

export default function Team() {
  return (
    <section id="team" className="bg-sky-soft py-24">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="inline-block bg-white px-4 py-2 rounded-full font-extrabold text-xs text-pink shadow-sm mb-4">
            Meet the team
          </span>
          <h2 className="font-display text-3xl md:text-4xl mb-3">
            Specialists who show up with warmth
          </h2>
          <p className="text-navy-soft text-lg leading-relaxed">
            Every therapist at Caresse is licensed, background-checked, and
            trained across multiple disciplines.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl2 overflow-hidden shadow-md"
            >
              <div
                className={`h-40 flex items-center justify-center ${
                  accentBg[member.accent]
                }`}
              >
                {/* Photo or blob-mascot placeholder */}
                <span className="w-14 h-14 rounded-full bg-navy/10" />
              </div>
              <div className="p-5">
                <h4 className="font-display text-base mb-0.5">
                  {member.name}
                </h4>
                <span className="text-xs font-bold text-pink">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
