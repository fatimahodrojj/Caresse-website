"use client";

import { useRouter } from "next/navigation";
import { ImageField, SubmitButton, TextArea, TextField, Toggle } from "@/components/admin/forms";
import { useAdminForm } from "@/components/admin/useAdminForm";
import { saveProduct } from "@/lib/admin/actions/products";

export type ProductFormValues = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  priceCents: number;
  imageUrl: string;
  visible: boolean;
};

function Section({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-card border border-line bg-white p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">{title}</h2>
        {text && <p className="text-[13px] opacity-70">{text}</p>}
      </div>
      {children}
    </section>
  );
}

export default function ProductForm({ product }: { product?: ProductFormValues }) {
  const router = useRouter();
  const { pending, onSubmit, errors } = useAdminForm(saveProduct, () => router.refresh());
  const price = product ? (product.priceCents / 100).toFixed(product.priceCents % 100 === 0 ? 0 : 2) : "";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {product && <input type="hidden" name="id" value={product.id} />}

      <Section title="Photo" text="Square photos look best.">
        <ImageField name="photo" label="Photo" currentUrl={product?.imageUrl} error={errors.photo} required />
      </Section>

      <Section title="Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField name="nameEn" label="Name (English)" defaultValue={product?.nameEn} error={errors.nameEn} required />
          <TextField name="nameAr" label="Name (Arabic)" dir="rtl" defaultValue={product?.nameAr} error={errors.nameAr} required />
          <TextArea name="descriptionEn" label="Description (English)" rows={3} defaultValue={product?.descriptionEn} error={errors.descriptionEn} />
          <TextArea name="descriptionAr" label="Description (Arabic)" rows={3} dir="rtl" defaultValue={product?.descriptionAr} error={errors.descriptionAr} />
        </div>
        <div className="md:w-1/2">
          <TextField name="price" label="Price (US dollars)" inputMode="decimal" defaultValue={price} error={errors.price} hint="For example 25 or 12.50" required />
        </div>
        <Toggle name="visible" label="Show on the website" hint="Hidden products stay here but are not shown." defaultChecked={product?.visible ?? true} />
      </Section>

      <div className="sticky bottom-[76px] z-30 -mx-4 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <SubmitButton pending={pending} pendingLabel="Saving…" className="w-full md:w-auto">
          {product ? "Save changes" : "Add product"}
        </SubmitButton>
      </div>
    </form>
  );
}
