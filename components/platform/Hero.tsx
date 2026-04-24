import { MiniCalculator } from "./MiniCalculator";

export function Hero() {
  return (
    <section className="relative hairline-b bg-canvas pb-16 pt-24 md:pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              <span className="inline-block h-px w-8 bg-ink-muted" />
              Fiscaal platform voor DGA's
            </p>
            <h1 className="mt-6 font-display text-display-xl text-ink text-balance">
              Een kwantitatieve kijk op je fiscale positie — gebaseerd op de actuele wet&shy;geving.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft md:text-xl">
              Fiscaalscherp is een onderzoeks&shy;platform dat de fiscale structuur van Nederlandse DGA's methodisch doorlicht. Je begint met drie velden — de engine doet de rest.
            </p>
          </div>

          <div className="md:col-span-5">
            <MiniCalculator />
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Feature
            number="01"
            title="Meetbare uitkomst"
            body="Elke bevinding komt met een indicatieve bandbreedte, een complexiteitsscore en een verwijzing naar de onderliggende regelgeving."
          />
          <Feature
            number="02"
            title="Neutrale diagnose"
            body="De engine trekt geen conclusies voor je — hij legt de structuur bloot. Interpretatie en besluit blijven bij jou en je adviseur."
          />
          <Feature
            number="03"
            title="Geen e-mailgate voor de eerste blik"
            body="De mini-calculator werkt anoniem. Pas voor het volledige, persoonlijke rapport laat je contactgegevens achter."
          />
        </div>
      </div>
    </section>
  );
}

function Feature({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border-t border-line pt-5">
      <p className="font-mono text-xs text-ink-subtle tabular-nums">{number}</p>
      <h3 className="mt-2 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
