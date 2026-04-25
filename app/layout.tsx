import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
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

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand} — Vertrouwelijk fiscaal dossier`,
    template: `%s · ${SITE.brand}`,
  },
  description:
    "Een vertrouwelijk, op jou afgestemd fiscaal dossier voor Nederlandse DGA's. Privé, gefundeerd op de actuele wetgeving, opgebouwd in stappen.",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE.url,
    siteName: SITE.brand,
    title: `${SITE.brand} — Vertrouwelijk fiscaal dossier`,
    description:
      "Persoonlijk fiscaal dossier voor DGA's. Vertrouwelijk, gefundeerd, stapsgewijs opgebouwd.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.brand} — Vertrouwelijk fiscaal dossier`,
    description:
      "Persoonlijk fiscaal dossier voor DGA's. Vertrouwelijk, gefundeerd, stapsgewijs opgebouwd.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${display.variable} ${mono.variable}`}
    >
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
