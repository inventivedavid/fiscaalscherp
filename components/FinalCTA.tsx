// §2.10 Finale CTA.
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 py-24 text-white">
      <div className="bg-noise absolute inset-0 -z-10" />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-gold-400">
          Klaar voor de scan?
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-5xl">
          In 8 minuten weet u waar u staat.
        </h2>
        <p className="mt-6 text-lg text-white/80">
          U krijgt direct een persoonlijk rapport. Kosteloos, geen verplichtingen.
          We beoordelen momenteel maximaal 20 scans per week zorgvuldig — een
          plek bemachtigen kost u niets.
        </p>

        <div className="mt-10">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-8 py-5 text-lg font-semibold text-ink-900 shadow-soft transition hover:translate-y-[-1px] hover:bg-gold-400"
          >
            Ik doe de scan →
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/50">
          Gratis · Geen account · 8 minuten · Geen verkoopgesprek verplicht
        </p>
      </div>
    </section>
  );
}
