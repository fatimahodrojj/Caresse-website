import Image from "next/image";
import Carousel from "@/components/Carousel";
import { services } from "@/data/services";
import type { Service } from "@/lib/types";

const dotColor: Record<Service["dot"], string> = {
  pink: "bg-pink",
  purple: "bg-purple",
};

/**
 * Our Services. Mobile: one card at a time in a carousel.
 * Desktop (xl): 3-column grid of all six cards.
 */
export default function Services() {
  return (
    <section id="services" className="bg-cream px-4 py-4 xl:px-20 xl:pb-[120px] xl:pt-12">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 xl:gap-[88px]">
        <h2 className="text-center font-heading text-[32px] xl:text-[56px]">Our Services</h2>
        <Carousel
          label="Our Services"
          itemClassName="basis-full md:basis-[calc((100%-12px)/2)] xl:basis-auto"
          listClassName="py-1 xl:grid xl:grid-cols-3 xl:gap-6 xl:overflow-visible xl:py-0"
          arrowClassName="size-10"
          hideArrowsFrom="xl"
        >
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex w-full flex-col gap-2 rounded-panel bg-white p-3 font-sans drop-shadow-card xl:gap-5 xl:rounded-card xl:p-8">
      <div className="flex items-center justify-between">
        <Image
          src={service.image}
          alt=""
          width={70}
          height={70}
          className="size-8 rounded-full xl:size-[70px]"
        />
        <span
          aria-hidden="true"
          className={`size-3 rounded-full xl:size-4 ${dotColor[service.dot]}`}
        />
      </div>
      <div className="flex flex-col gap-1 xl:gap-2">
        <h3 className="font-heading text-xl xl:text-[28px]">{service.title}</h3>
        <p className="text-xs leading-[1.45] opacity-80 xl:text-[15px] xl:leading-[1.5]">
          {service.description}
        </p>
      </div>
    </article>
  );
}
