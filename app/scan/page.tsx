import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { ScanForm } from "@/components/scan/ScanForm";

export const metadata: Metadata = {
  title: "Start uw fiscale scan",
  description: `In 8 minuten uw persoonlijke DGA-rapport. Gratis.`,
  robots: { index: false, follow: false }, // scan pagina hoeft niet in search.
};

export default function ScanPage() {
  return (
    <div className="min-h-dvh bg-ink-50">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-ink-900"
            aria-label={`${SITE.brand} home`}
          >
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="24" height="24" rx="5" fill="#d68f27" />
              <path
                d="M9 14.5 L12.5 18 L19 10"
                stroke="#111b2e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="text-sm font-bold uppercase tracking-widest">
              {SITE.brand}
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-ink-600 hover:text-ink-900"
          >
            ← Terug naar home
          </Link>
        </div>
      </header>

      <main className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
            Persoonlijke DGA-scan
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            In 8 minuten uw persoonlijke rapport
          </h1>
          <p className="mt-4 text-ink-700">
            20 korte vragen. Geen cijfers opzoeken — ranges volstaan. We sturen
            het rapport direct naar uw mailbox.
          </p>
        </div>

        <div className="mt-12">
          <Suspense
            fallback={
              <div className="mx-auto flex min-h-[400px] max-w-2xl items-center justify-center text-ink-500">
                Scan wordt geladen…
              </div>
            }
          >
            <ScanForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
