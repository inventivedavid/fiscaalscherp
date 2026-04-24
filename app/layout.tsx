import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand} — Gratis fiscale scan voor DGA's`,
    template: `%s · ${SITE.brand}`,
  },
  description:
    "In 8 minuten ontdek je als DGA welke fiscale optimalisaties jouw boekhouder mogelijk over het hoofd ziet. Persoonlijk PDF-rapport. Gratis, zonder verplichtingen.",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE.url,
    siteName: SITE.brand,
    title: `${SITE.brand} — Gratis fiscale scan voor DGA's`,
    description:
      "Gratis persoonlijk rapport met concrete optimalisatiepunten voor jouw BV-structuur. In 8 minuten.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.brand} — Gratis fiscale scan voor DGA's`,
    description:
      "Gratis rapport met concrete fiscale optimalisatiepunten voor jouw BV.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE.url,
  },
};

export const viewport: Viewport = {
  themeColor: "#111b2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
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
