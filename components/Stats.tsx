import { stats } from "@/data/team";

export default function Stats() {
  return (
    <section className="bg-navy text-white py-14">
      <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <h3 className="font-display text-3xl md:text-4xl text-gold mb-1">
              {stat.value}
            </h3>
            <span className="text-sm text-white/70 font-semibold">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
