// "Hoe werkt de engine" — vervangt de oude AboutMaker.
// Geen persoonlijke branding; wel institutionele autoriteit via bronnen.

import Link from "next/link";

const PILLARS = [
  {
    title: "Regelgeving als uitgangspunt",
    body:
      "Elke flag in de engine is verbonden aan een concrete bron: een wetsartikel, een Kennisgroep-standpunt, of een besluit van de staatssecretaris. De uitkomst is daarmee herleidbaar — en reviewbaar door elke adviseur die je erbij wilt betrekken.",
    refs: [
      "Wet op de loonbelasting 1964, art. 12a",
      "Wet excessief lenen (2023)",
      "Wet IB 2001, box 2",
      "Besluit gebruikelijk loon 2025",
    ],
  },
  {
    title: "Conservatieve bandbreedtes",
    body:
      "De engine geeft geen enkele bevinding als enkel getal. Iedere indicatie is een range, gebaseerd op voor het betreffende profiel plausibele onder- en bovengrenzen. Dit maakt de output aannemelijk in plaats van gretig.",
    refs: [
      "Branche-specifieke kalibratie",
      "Peildatum tarieven: 2025",
      "Jaarlijkse herziening engine",
    ],
  },
  {
    title: "Onafhankelijk van software of partij",
    body:
      "De scan maakt geen onderscheid tussen gebruikers van welke boekhoudsoftware dan ook, en werkt los van enig accountantskantoor. De output is een zelfstandig document dat je met elke adviseur kunt bespreken.",
    refs: [
      "Geen software-integratie",
      "Geen partij-afhankelijke logica",
      "Open methodologie",
    ],
  },
];

export function Methodology() {
  return (
    <section className="hairline-b bg-canvas-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              Methodologie
            </p>
            <h2 className="mt-4 font-display text-display-lg text-ink text-balance">
              Hoe de engine tot een bevinding komt.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-soft">
              De engine is geen blackbox. Iedere regel is gedocumenteerd, gekoppeld aan bronmateriaal en onafhankelijk te reviewen.
            </p>
            <Link
              href="/methodologie"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-accent-500 decoration-2 underline-offset-4 hover:decoration-ink"
            >
              Volledige methodologie →
            </Link>
          </div>

          <div className="md:col-span-8">
            <ol className="space-y-8">
              {PILLARS.map((p, i) => (
                <li
                  key={p.title}
                  className="grid gap-4 border-t border-line pt-8 md:grid-cols-12"
                >
                  <div className="md:col-span-1">
                    <p className="font-mono text-xs text-ink-subtle tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="md:col-span-7">
                    <h3 className="font-display text-2xl text-ink">{p.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-soft">
                      {p.body}
                    </p>
                  </div>
                  <div className="md:col-span-4">
                    <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-subtle">
                      Bronnen
                    </p>
                    <ul className="mt-2 space-y-1">
                      {p.refs.map((r) => (
                        <li key={r} className="text-xs text-ink-muted">
                          ↳ {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
