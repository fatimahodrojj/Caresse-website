import { revalidatePath } from "next/cache";

// Public pages are generated ahead of time; these regenerate the ones that
// show what the admin changed (both languages).

/** Homepage (Meet Our Team) and /team. */
export function revalidateTeamPages() {
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/team", "page");
}

/** Homepage (Our Therapy Shop). */
export function revalidateShopPages() {
  revalidatePath("/[locale]", "page");
}

/** Every public page (footer and contact details). */
export function revalidateAllPages() {
  revalidatePath("/[locale]", "layout");
}
