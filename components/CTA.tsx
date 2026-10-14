import Image from "next/image";
import Link from "next/link";

/**
 * "Ready to Take the First Step?" call to action on the CTA gradient.
 * Mobile: stacked, buttons side by side at half width, characters below.
 * Desktop (xl): text left, characters right.
 */
export default function CTA() {
  return (
    <section className="bg-cta px-4 py-5 font-sans text-white xl:px-20 xl:py-[120px]">
      <div data-reveal className="mx-auto flex max-w-[1280px] flex-col gap-3 xl:flex-row xl:items-center xl:gap-20">
        <div className="flex flex-col gap-4 xl:flex-1 xl:gap-8">
          <h2 className="font-heading text-[32px] xl:text-[64px]">Ready to Take the First Step?</h2>
          <p className="text-sm leading-[1.6] opacity-90 xl:text-lg">
            Book a free initial consultation session and let us create a supportive, personalized
            therapeutic plan for your family.
          </p>
          <div className="flex gap-3 xl:gap-4">
            <Link
              href="/book"
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-gold px-[18px] text-[15px] font-bold text-navy xl:h-auto xl:flex-none xl:px-9 xl:py-4 xl:text-lg"
            >
              Book Now
            </Link>
            <a
              href="tel:+96171056803"
              className="flex h-12 flex-1 items-center justify-center rounded-full border-2 border-white px-[18px] text-[15px] font-bold xl:h-auto xl:flex-none xl:px-9 xl:py-4 xl:text-lg"
            >
              Call Us
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center xl:w-[400px] xl:shrink-0">
          <Image
            src="/images/illustrations/cta-character-gold.png"
            alt=""
            width={154}
            height={160}
            className="mr-[-20px] h-[124px] w-[120px] rounded-[60px] xl:mr-[-30px] xl:h-40 xl:w-[154px] xl:rounded-[80px]"
          />
          <Image
            src="/images/illustrations/cta-character-blue.png"
            alt=""
            width={149}
            height={140}
            className="h-[110px] w-[116px] rounded-[55px] object-cover xl:h-[140px] xl:w-[149px] xl:rounded-[70px]"
          />
        </div>
      </div>
    </section>
  );
}
