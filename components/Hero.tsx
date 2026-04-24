import Link from "next/link";

// Drie hero-varianten uit de blueprint (§2.2).
// Activeer via URL: /?v=a · /?v=b · /?v=c. Default = b (aanvaller van status quo).
type Variant = "a" | "b" | "c";

const VARIANTS: Record<
  Variant,
  { headline: string; subhead: string }
> = {
  a: {
    headline: "Betaalt u als DGA te veel belasting? Check het in 8 minuten.",
    subhead:
      "Gratis persoonlijk rapport met concrete optimalisatiepunten voor uw BV-structuur. Geen verkoopgesprek, geen verplichtingen.",
  },
  b: {
    headline:
      "Uw boekhouder doet uw aangifte. Wij checken of uw structuur überhaupt klopt.",
    subhead:
      "Gratis scan voor DGA's met een BV. In 8 minuten ontdekt u welke fiscale optimalisaties uw huidige kantoor mogelijk over het hoofd ziet.",
  },
  c: {
    headline:
      "De gemiddelde DGA laat jaarlijks € 8.000 aan fiscale optimalisatie liggen. Kijk of u erbij zit.",
    subhead:
      "Gratis scan. 8 minuten. Persoonlijk rapport met úw specifieke optimalisatiepunten.",
  },
};

export function Hero({ variant = "b" }: { variant?: Variant }) {
  const v = VARIANTS[variant] ?? VARIANTS.b;

  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      <div className="bg-noise absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-32 md:grid-cols-5 md:gap-16 md:pt-40">
        <div className="md:col-span-3 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-gold-300">
            <span className="size-1.5 rounded-full bg-gold-400" />
            Voor DGA's · BV tot € 5M omzet
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight md:text-[56px]">
            {v.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75 md:text-xl">
            {v.subhead}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/scan?v=${variant}`}
              className="group inline-flex items-center gap-2 rounded-md bg-gold-500 px-6 py-4 text-base font-semibold text-ink-900 shadow-soft transition hover:translate-y-[-1px] hover:bg-gold-400"
            >
              Start mijn gratis belastingscan
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <p className="text-sm text-white/60">
              Gratis · Geen account · 8 minuten
            </p>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 text-sm text-white/60">
            <div>
              <dt className="text-white/40">Gemiddelde scantijd</dt>
              <dd className="mt-1 font-semibold text-white">8 min</dd>
            </div>
            <div>
              <dt className="text-white/40">Rapport-omvang</dt>
              <dd className="mt-1 font-semibold text-white">6–10 pagina's</dd>
            </div>
            <div>
              <dt className="text-white/40">Verplichtingen</dt>
              <dd className="mt-1 font-semibold text-white">Geen</dd>
            </div>
          </dl>
        </div>

        {/* Visueel ankerpunt: een stylized rapport-mockup — geen stock. */}
        <div className="md:col-span-2">
          <div className="relative mx-auto max-w-sm animate-fade-up [animation-delay:150ms]">
            <div className="absolute -inset-6 -z-10 rounded-2xl bg-gold-500/20 blur-3xl" />
            <ReportMock />
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportMock() {
  return (
    <div className="rotate-[-2deg] rounded-lg bg-white p-5 text-ink-900 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-ink-100 pb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600">
          Persoonlijke scan · RPT-2X4Q
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold">Voor: Jansen Beheer B.V.</h3>
      <p className="mt-1 text-xs text-ink-500">5 optimalisatiepunten gevonden</p>

      <div className="mt-4 rounded-md bg-gold-50 p-3">
        <p className="text-[11px] uppercase tracking-wider text-gold-700">
          Indicatieve jaarlijkse besparing
        </p>
        <p className="mt-1 text-xl font-bold text-gold-700">
          € 6.400 – € 14.200
        </p>
      </div>

      <ul className="mt-4 space-y-2">
        {[
          ["Gebruikelijk loon", "Hoog"],
          ["Holdingstructuur", "Hoog"],
          ["Dividendplanning", "Middel"],
          ["Rekening-courant", "Middel"],
          ["Auto-optimalisatie", "Signaal"],
        ].map(([t, s]) => (
          <li
            key={t}
            className="flex items-center justify-between rounded border border-ink-100 bg-ink-50 px-3 py-2 text-xs"
          >
            <span className="font-medium text-ink-800">{t}</span>
            <span className="rounded bg-ink-900/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-600">
              {s}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[10px] text-ink-500 italic">
        Indicatief rapport · geen fiscaal advies
      </p>
    </div>
  );
}
