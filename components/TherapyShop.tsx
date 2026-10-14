import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import type { Product } from "@/lib/types";

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

/**
 * Our Therapy Shop. Products come from the database (managed in the admin
 * panel). The heading always shows; with no products the section shows a
 * "coming soon" message instead of the carousel.
 * Mobile: one card at a time. Desktop (xl): four cards visible, with arrows.
 */
export default function TherapyShop({ products }: { products: Product[] }) {
  return (
    <section id="shop" className="bg-mist px-4 py-3 font-sans xl:px-20 xl:py-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 xl:gap-12">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-heading text-[32px] xl:text-[56px]">Our Therapy Shop</h2>
          <p className="text-sm leading-[1.6] opacity-80 xl:text-lg">
            Explore the materials and tools our therapists use - now available for home practice
          </p>
        </div>
        {products.length === 0 ? <EmptyState /> : <ProductList products={products} />}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex w-full max-w-[410px] flex-col items-center gap-3 rounded-card bg-white p-6 text-center drop-shadow-card xl:gap-5 xl:p-8">
      {/* Baked-in corners are #E3F0FF, close to the shop background. */}
      <Image
        src="/images/illustrations/why-character-jump-2.png"
        alt=""
        width={180}
        height={180}
        className="size-[110px] rounded-full xl:size-40"
      />
      <p className="font-heading text-xl xl:text-[28px]">New materials coming soon!</p>
    </div>
  );
}

function ProductList({ products }: { products: Product[] }) {
  return (
    <>
      <Carousel
        label="Our Therapy Shop"
        itemClassName="basis-full md:basis-[calc((100%-12px)/2)] xl:basis-[calc((100%-45px)/4)]"
        listClassName="py-1 xl:gap-[15px]"
        arrowClassName="size-11 xl:size-14"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Carousel>
      <div className="flex flex-col items-center gap-6">
        <Link href="/shop" className="flex items-center gap-2 text-sm font-semibold xl:text-base">
          See All Our Materials
          <Image
            src="/images/icons/arrow-right.svg"
            alt=""
            width={16}
            height={16}
            className="size-[14px] xl:size-4"
          />
        </Link>
        <Link
          href="/shop"
          className="hidden items-center gap-[10px] rounded-full bg-navy px-6 py-[14px] text-[15px] font-bold text-white xl:flex"
        >
          Visit Full Shop
          <Image src="/images/icons/arrow-right-white.svg" alt="" width={18} height={18} />
        </Link>
      </div>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex w-full flex-col gap-2 rounded-card bg-white p-3 drop-shadow-card xl:gap-3 xl:p-5">
      <div className="relative h-[140px] w-full overflow-hidden rounded-media xl:h-[180px]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 229px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <h3 className="font-heading text-xl xl:text-[22px]">{product.name}</h3>
      <p className="text-[13px] leading-[1.5] opacity-80 xl:text-sm">{product.description}</p>
      <p className="mt-auto text-base font-semibold xl:text-lg">{priceFormat.format(product.price)}</p>
      {/* No cart yet: wire this up when the cart exists. */}
      <button
        type="button"
        className="h-10 w-full rounded-control bg-navy text-[13px] font-semibold text-white xl:h-11 xl:text-sm"
      >
        Add to Cart
      </button>
    </article>
  );
}
