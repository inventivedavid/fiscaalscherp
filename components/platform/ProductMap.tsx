// De "product" van het platform — vier componenten als navigatie-landmarks.
// Elk heeft zijn eigen pagina; op de homepage fungeert dit als het primaire

import Link from "next/link";

type Product = {
  number: string;
  title: string;
  summary: string;
  href: string;
  meta: string;
};

const PRODUCTS: Product[] = [
  {
    number: "01",
    title: "De Scan",
    summary:
      "Gestructureerde diagnose van je fiscale positie in 20 gerichte vragen. Output: een persoonlijk PDF-rapport met indicatieve besparingsruimte en prioriteringsmatrix.",
    href: "/scan",
    meta: "8 min · Gratis · Direct rapport",
  },
  {
    number: "02",
    title: "Tools",
    summary:
      "Afzonderlijke calculators voor specifieke vraagstukken: gebruikelijk-loonnorm, holdingtoets, box 2-planning. Elk werkt anoniem, zonder e-mailgate.",
    href: "/tools",
    meta: "3 calculators · Geen e-mail vereist",
  },
  {
    number: "03",
    title: "Benchmarks",
    summary:
      "Geaggregeerde data: hoe verhoudt jouw sector zich op fiscale structuurkeuzes? Welke regelingen worden binnen je branche structureel onbenut gelaten?",
    href: "/benchmarks",
    meta: "Maandelijks bijgewerkt",
  },
  {
    number: "04",
    title: "Kennisbank",
    summary:
      "Diepgaande dossiers over de onderwerpen waar DGA's fouten op maken: gebruikelijk loon, holdingstructuur, dividendvolgorde, innovatiebox, bedrijfsopvolging.",
    href: "/kennisbank",
    meta: "Geactualiseerd bij wetswijzigingen",
  },
];

export function ProductMap() {
  return (
    <section className="hairline-b bg-canvas py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
            Wat het platform bevat
          </p>
          <h2 className="mt-4 font-display text-display-lg text-ink text-balance">
            Vier componenten, één samenhangend beeld van je fiscale positie.
          </h2>
        </div>

        <div className="mt-14 grid gap-0 md:grid-cols-2">
          {PRODUCTS.map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              className={[
                "group relative block p-8 transition hover:bg-canvas-50 md:p-10",
                "border-t border-line",
                i % 2 === 0 ? "md:border-r md:border-line" : "",
                // Maak eerste twee rijen geen dubbele border
                i < 2 ? "md:border-t" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-6">
                <p className="font-mono text-xs text-ink-subtle tabular-nums">
                  {p.number}
                </p>
                <svg
                  className="size-4 text-ink-subtle transition group-hover:translate-x-0.5 group-hover:text-ink"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-3xl text-ink">{p.title}</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
                {p.summary}
              </p>
              <p className="mt-5 text-xs font-medium uppercase tracking-eyebrow text-ink-subtle">
                {p.meta}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
