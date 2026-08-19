export default function Footer() {
  return (
    <footer id="contact" className="bg-navy text-white/70 pt-16 pb-7">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 mb-12">
          <div>
            <span className="font-display text-xl text-white">Caresse</span>
            <p className="text-sm text-white/50 mt-3 max-w-xs leading-relaxed">
              Multitherapeutic services for speech, behavioral, and
              developmental growth — under one warm roof.
            </p>
          </div>

          <FooterColumn
            title="Services"
            links={[
              "Speech Therapy",
              "ABA Therapy",
              "Occupational Therapy",
              "Psychological Support",
            ]}
          />
          <FooterColumn
            title="Company"
            links={["About Us", "Our Team", "Stories"]}
          />
          <FooterColumn
            title="Get in touch"
            links={["hello@caresse.com", "+961 00 000 000", "Beirut, Lebanon"]}
          />
        </div>

        <div className="border-t border-white/10 pt-6 flex justify-between flex-wrap gap-2.5 text-xs text-white/50">
          <span>© 2026 Caresse Multitherapeutic Services. All rights reserved.</span>
          <span>Made with care, for every kind of mind.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h5 className="font-display text-sm text-white mb-4">{title}</h5>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm hover:text-gold transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
