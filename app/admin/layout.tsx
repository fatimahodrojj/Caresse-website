import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

// Admin panel root layout (separate from the public site: English only, no
// public header or footer). Never indexed.
export const metadata: Metadata = {
  title: { default: "Caresse Admin", template: "%s · Caresse Admin" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#2A3B4D" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${fontVariables.en} bg-cream font-sans text-navy antialiased`}>{children}</body>
    </html>
  );
}
