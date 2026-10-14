import type { Metadata } from "next";
import { Boogaloo, Chewy, Dancing_Script, Nunito, Sora } from "next/font/google";
import "./globals.css";

// next/font self-hosts these at build time — no external request to
// fonts.googleapis.com at runtime, better performance + no layout shift.
const chewy = Chewy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

// Design-system fonts (docs/design-system.md). Loaded alongside Chewy and
// Nunito until the last old component is replaced.
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
    "Speech, ABA, occupational, psychomotor, and psychological therapy for children, teens, and adults — under one warm roof.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${chewy.variable} ${nunito.variable} ${sora.variable} ${boogaloo.variable} ${dancingScript.variable} font-body bg-cream text-navy`}
      >
        {children}
      </body>
    </html>
  );
}
