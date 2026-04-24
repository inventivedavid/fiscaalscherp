import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { ScanForm } from "@/components/scan/ScanForm";

export const metadata: Metadata = {
  title: "Scan",
  description:
    "Een gestructureerde diagnose van je fiscale positie in 20 gerichte vragen. Persoonlijk PDF-rapport, direct per e-mail.",
  robots: { index: false, follow: false },
};

export default function ScanPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="hairline-b bg-canvas">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            aria-label={`${SITE.brand} home`}
            className="flex items-center gap-2.5 text-ink"
          >
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect
                x="3.5"
                y="3.5"
                width="21"
                height="21"
                rx="3"
                stroke="#0a0a0a"
                strokeWidth="1.5"
                fill="transparent"
              />
              <path
                d="M9 17 L13 13 L16 16 L20 10"
                stroke="#a16207"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-display text-lg tracking-tight">
              {SITE.brand}
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-ink-muted hover:text-ink"
          >
            Terug
          </Link>
        </div>
      </header>

      <main className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
            Scan · 20 vragen · 8 min
          </p>
          <h1 className="mt-5 font-display text-display-lg text-ink text-balance">
            Een gestructureerde diagnose van je fiscale positie.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            De engine werkt met ranges — geen enkele vraag vereist dat je cijfers opzoekt. Je voortgang wordt automatisch opgeslagen. Na afronding ontvang je het persoonlijke PDF-rapport per e-mail.
          </p>
        </div>

        <div className="mt-12">
          <Suspense
            fallback={
              <div className="mx-auto flex min-h-[400px] max-w-2xl items-center justify-center text-ink-muted">
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
