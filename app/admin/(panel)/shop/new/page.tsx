import type { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add product" back={{ href: "/admin/shop", label: "Shop" }} />
      <ProductForm />
    </>
  );
}
