import type { Metadata } from "next";
import { Boogaloo, Dancing_Script, Sora } from "next/font/google";
import "./globals.css";

// Design-system fonts (docs/design-system.md). next/font self-hosts them at
// build time: no request to fonts.googleapis.com at runtime and no layout
// shift.
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
});

const boogaloo = Boogaloo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Caresse — Multitherapeutic Services",
  description:
    "Multitherapeutic services empowering children, teens, and adults to express, develop, and thrive with confidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${boogaloo.variable} ${dancingScript.variable} bg-cream font-sans text-navy`}
      >
        {children}
      </body>
    </html>
  );
}
