import { cache } from "react";
import { getDb } from "@/lib/db";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/lib/types";

/** Visible shop products in display order, in the given language. */
export const getShopProducts = cache(async (locale: Locale): Promise<Product[]> => {
  const rows = await getDb().product.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } });
  const ar = locale === "ar";
  return rows.map((row) => ({
    id: row.id,
    name: ar ? row.nameAr : row.nameEn,
    description: ar ? row.descriptionAr : row.descriptionEn,
    price: row.priceCents / 100,
    imageUrl: row.imageUrl,
  }));
});
