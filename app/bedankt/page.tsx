import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rapport is onderweg",
  robots: { index: false, follow: false },
};

export default async function BedanktPage({
  searchParams,
}: {
  searchParams: Promise<{ rid?: string; n?: string }>;
}) {
  const sp = await searchParams;
  const findings = Number(sp.n ?? "0");

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
              <rect x="3.5" y="3.5" width="21" height="21" rx="3" stroke="#0a0a0a" strokeWidth="1.5" fill="transparent" />
              <path d="M9 17 L13 13 L16 16 L20 10" stroke="#a16207" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-display text-lg tracking-tight">{SITE.brand}</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
          Scan voltooid
        </p>
        <h1 className="mt-5 font-display text-display-xl text-ink text-balance">
          Het rapport is onderweg.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {findings > 0
            ? `De engine signaleerde ${findings} ${findings === 1 ? "aandachtspunt" : "aandachtspunten"}. Deze zijn uitgewerkt in je persoonlijke PDF-rapport — binnen enkele minuten in je inbox.`
            : "De engine vond geen directe signalen op de structuur die je hebt opgegeven. Het persoonlijke PDF-rapport bevestigt dit en documenteert de getoetste punten."}
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          Geen mail binnen 10 minuten? Kijk in je spam, of neem contact op via{" "}
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            {SITE.contactEmail}
          </a>
          .
        </p>
        {sp.rid ? (
          <p className="mt-2 font-mono text-xs text-ink-subtle tabular-nums">
            Referentie: {sp.rid}
          </p>
        ) : null}

        <div className="mt-14 grid gap-0 border border-line md:grid-cols-2">
          <div className="p-8">
            <p className="font-mono text-xs text-ink-subtle tabular-nums">01</p>
            <h2 className="mt-3 font-display text-2xl text-ink">
              Het rapport lezen
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Bevindingen zijn gerangschikt naar impact × complexiteit. Ieder punt verwijst naar het onderliggende artikel of besluit.
            </p>
            <Link
              href="/kennisbank"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
            >
              Achtergrondartikelen →
            </Link>
          </div>
          <div className="border-t border-line bg-canvas-50 p-8 md:border-l md:border-t-0">
            <p className="font-mono text-xs text-ink-subtle tabular-nums">02</p>
            <h2 className="mt-3 font-display text-2xl text-ink">
              Samen doorlopen
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Een gesprek van 30 minuten om de bevindingen in de context van jouw situatie te plaatsen — zonder opvolg-verplichting.
            </p>
            <a
              href={SITE.calUrl}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas hover:bg-ink-soft"
            >
              Plan kennismaking →
            </a>
          </div>
        </div>

        <Link
          href="/"
          className="mt-14 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
        >
          ← Terug naar platform
        </Link>
      </main>
    </div>
  );
}
