// Afsluitende CTA — nuchter, geen schaarste-claims of urgentie.

import Link from "next/link";

export function ClosingCTA() {
  return (
    <section className="hairline-b bg-ink py-24 text-canvas">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-canvas/50">
          Begin met de diagnose
        </p>
        <h2 className="mt-5 font-display text-display-xl text-canvas text-balance">
          Een compleet beeld van je fiscale positie — in acht minuten.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-canvas/75">
          De scan stelt 20 gerichte vragen en levert een persoonlijk PDF-rapport. Je hoeft geen cijfers op te zoeken — ranges volstaan.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-full bg-canvas px-6 py-3.5 text-sm font-medium text-ink transition hover:bg-canvas-100"
          >
            Scan openen →
          </Link>
          <Link
            href="/methodologie"
            className="text-sm text-canvas/70 underline decoration-canvas/30 underline-offset-4 hover:decoration-canvas"
          >
            Eerst de methodologie lezen
          </Link>
        </div>

        <div className="mt-16 grid gap-6 border-t border-canvas/10 pt-8 text-sm text-canvas/60 md:grid-cols-3">
          <div>
            <p className="font-mono text-xs tabular-nums">01</p>
            <p className="mt-1 text-canvas">Geen verplichtingen</p>
            <p className="text-canvas/60">Het rapport is van jou; deel het met wie je wilt.</p>
          </div>
          <div>
            <p className="font-mono text-xs tabular-nums">02</p>
            <p className="mt-1 text-canvas">Direct in je mailbox</p>
            <p className="text-canvas/60">Persoonlijk PDF-rapport, 6–10 pagina's.</p>
          </div>
          <div>
            <p className="font-mono text-xs tabular-nums">03</p>
            <p className="mt-1 text-canvas">Indicatief, niet bindend</p>
            <p className="text-canvas/60">Voor implementatie blijft adviesgesprek vereist.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
