import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActionButton from "@/components/admin/ActionButton";
import ProductForm from "@/components/admin/ProductForm";
import { Card, PageHeader } from "@/components/admin/ui";
import { deleteProduct } from "@/lib/admin/actions/products";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/shop/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const product = await getDb().product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <>
      <PageHeader title={product.nameEn} back={{ href: "/admin/shop", label: "Shop" }} />
      <ProductForm product={product} />
      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Delete product</h2>
        <p className="text-sm opacity-75">Removes it from the website and from this list. To keep it here, hide it instead.</p>
        <ActionButton
          action={deleteProduct}
          fields={{ id: product.id }}
          label="Delete product"
          icon="trash"
          variant="dangerOutline"
          pendingLabel="Deleting…"
          className="sm:w-fit"
          confirm={{
            title: `Delete ${product.nameEn}?`,
            body: "The product and its photo are removed from the website. This cannot be undone.",
            confirmLabel: "Delete product",
            danger: true,
          }}
        />
      </Card>
    </>
  );
}
