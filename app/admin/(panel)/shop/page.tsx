import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "@/components/admin/ActionButton";
import { EmptyState, LinkButton, PageHeader } from "@/components/admin/ui";
import { moveProduct } from "@/lib/admin/actions/products";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Shop" };

const price = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);

export default async function ShopPage() {
  await requireAdmin();
  const products = await getDb().product.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, nameEn: true, priceCents: true, imageUrl: true, visible: true },
  });

  return (
    <>
      <PageHeader
        title="Shop"
        description="Products in “Our Therapy Shop” on the homepage, in this order. There is no cart or checkout yet."
        action={
          <LinkButton href="/admin/shop/new" icon="plus">
            Add product
          </LinkButton>
        }
      />
      {products.length === 0 ? (
        <EmptyState
          image="/images/illustrations/why-character-jump-2.png"
          title="No products yet"
          text="Until you add one, the homepage shows “New materials coming soon!”."
          action={<LinkButton href="/admin/shop/new" icon="plus">Add product</LinkButton>}
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {products.map((product, index) => (
            <li key={product.id} className="flex items-center gap-3 rounded-card border border-line bg-white p-3 md:gap-4 md:p-4">
              <Image src={product.imageUrl} alt="" width={64} height={64} className="size-14 shrink-0 rounded-media object-cover md:size-16" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link href={`/admin/shop/${product.id}`} className="flex min-h-11 flex-col justify-center">
                  <span className="truncate text-base font-bold">{product.nameEn}</span>
                  <span className="text-[13px] opacity-70">{price(product.priceCents)}</span>
                </Link>
                {!product.visible && <span className="w-fit rounded-full bg-navy/10 px-2 py-[2px] text-[12px] font-bold">Hidden from the website</span>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <ActionButton
                  action={moveProduct}
                  fields={{ id: product.id, direction: "up" }}
                  label=""
                  icon="up"
                  variant="icon"
                  pendingLabel="…"
                  className={index === 0 ? "invisible" : ""}
                  ariaLabel={`Move ${product.nameEn} up`}
                />
                <ActionButton
                  action={moveProduct}
                  fields={{ id: product.id, direction: "down" }}
                  label=""
                  icon="down"
                  variant="icon"
                  pendingLabel="…"
                  className={index === products.length - 1 ? "invisible" : ""}
                  ariaLabel={`Move ${product.nameEn} down`}
                />
                <LinkButton href={`/admin/shop/${product.id}`} variant="secondary">
                  Edit
                </LinkButton>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
