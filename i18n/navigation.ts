import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

// Language-aware Link and hooks: links keep the current language
// (e.g. "/book" becomes "/ar/book" on Arabic pages).
export const { Link, usePathname, useRouter, getPathname } = createNavigation(routing);
