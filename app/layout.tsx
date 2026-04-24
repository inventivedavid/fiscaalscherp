import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand} — Fiscaal platform voor DGA's`,
    template: `%s · ${SITE.brand}`,
  },
  description:
    "Een onderzoeksplatform voor fiscale optimalisatie van Nederlandse DGA's. Scan, tools, benchmarks en kennisbank — gebouwd op de actuele wet- en regelgeving.",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE.url,
    siteName: SITE.brand,
    title: `${SITE.brand} — Fiscaal platform voor DGA's`,
    description:
      "Scan, tools, benchmarks en kennisbank voor fiscale optimalisatie van Nederlandse DGA's.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.brand} — Fiscaal platform voor DGA's`,
    description:
      "Scan, tools, benchmarks en kennisbank voor fiscale optimalisatie van Nederlandse DGA's.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}
        {SITE.plausibleDomain ? (
          <Script
            defer
            data-domain={SITE.plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
      </body>
    </html>
  );
}
