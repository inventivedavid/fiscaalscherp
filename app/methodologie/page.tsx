import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageIntro } from "@/components/platform/PageShell";

export const metadata: Metadata = {
  title: "Methodologie",
  description:
    "Hoe de Fiscaalscherp-engine werkt: welke wetgeving, welke bronnen, welke ijkpunten voor bandbreedtes en wat expliciet buiten de scope valt.",
};

const SOURCES = [
  { law: "Wet IB 2001", topic: "Inkomstenbelasting natuurlijke personen, box 1/2/3, aanmerkelijk belang" },
  { law: "Wet Vpb 1969", topic: "Vennootschapsbelasting, innovatiebox, fiscale eenheid, deelnemingsvrijstelling" },
  { law: "Wet LB 1964, art. 12a", topic: "Gebruikelijk loon DGA" },
  { law: "Wet excessief lenen (2023)", topic: "Bovengrens rekening-courant en lening DGA" },
  { law: "Besluit bedrijfsopvolging (BOR)", topic: "Schenking/vererving van aanmerkelijk belang" },
  { law: "WOZ / Wet overdrachtsbelasting", topic: "Onroerend goed in BV-verband" },
  { law: "Kennisgroep-standpunten Belastingdienst", topic: "Interpretatie van regelingen op detailniveau" },
];

const SCOPE_OUT = [
  "Geen advies over persoonlijke vermogensplanning buiten de ondernemingssfeer",
  "Geen internationale fiscale structuren (buitenlandse holdings, treaty shopping)",
  "Geen strafrechtelijk of fiscaal-procedureel advies",
  "Geen juridische beoordeling van contracten",
  "Geen persoonlijke beleggingsadviezen (vermogensbeheer)",
];

export default function MethodologiePage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Methodologie"
        title="Hoe de engine tot bevindingen komt — en wat hij uitdrukkelijk niet doet."
        description="Open en reproduceerbaar: elke bevinding is herleidbaar naar een regel, de regel naar een bron. Geen proprietary logic achter een black box."
      />

      <section className="hairline-b bg-canvas py-16">
        <div className="mx-auto max-w-4xl px-6 space-y-10">
          <div>
            <h2 className="font-display text-display-md text-ink">Uitgangspunten</h2>
            <ol className="mt-6 space-y-5 text-base leading-relaxed text-ink-soft">
              <li>
                <strong className="text-ink">1. Regelgeving eerst.</strong> Elke regel in de engine is gekoppeld aan een specifieke wetsbepaling, besluit of standpunt. Geen vuistregels zonder bron.
              </li>
              <li>
                <strong className="text-ink">2. Bandbreedtes, geen schijnprecisie.</strong> Bevindingen hebben een onder- en bovengrens. Waar de onderliggende parameters onzeker zijn, wordt dat in de breedte zichtbaar.
              </li>
              <li>
                <strong className="text-ink">3. Indicatief, geen advies.</strong> De uitkomst is een diagnose. Implementatie vereist altijd een adviseur die de volledige context beoordeelt. Dit staat ook bij elke bevinding vermeld.
              </li>
              <li>
                <strong className="text-ink">4. Peildatum vermeld.</strong> Alle tarieven, grensbedragen en normen worden herijkt per kalenderjaar. De peildatum staat in elk rapport.
              </li>
              <li>
                <strong className="text-ink">5. Onafhankelijk.</strong> Geen affiliate-structuur met boekhoudsoftware, banken of adviseurs. De uitkomst is niet gericht op conversie naar een derde partij.
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="hairline-b bg-canvas-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-display-md text-ink">
            Bronnen die de engine raadpleegt
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-ink-muted">
                  <th className="py-3 pr-4 font-medium">Wet / besluit</th>
                  <th className="py-3 pr-4 font-medium">Onderwerp</th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-b [&_tr]:border-line [&_td]:py-3 [&_td]:pr-4">
                {SOURCES.map((s) => (
                  <tr key={s.law}>
                    <td className="font-medium text-ink">{s.law}</td>
                    <td className="text-ink-soft">{s.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="hairline-b bg-canvas py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-display-md text-ink">Buiten de scope</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Expliciet benoemen wat de engine <em>niet</em> doet is een onderdeel van de methodologie. Dit voorkomt dat de scan als verkapt totaaladvies wordt gelezen.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
            {SCOPE_OUT.map((s) => (
              <li key={s} className="flex gap-3">
                <span className="mt-1 size-1.5 flex-none rounded-full bg-line-strong" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hairline-b bg-canvas-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-display-md text-ink">Herziening</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            De engine wordt ten minste één keer per kwartaal doorgelopen op basis van wijzigingen in wetgeving en Kennisgroep-standpunten. Bij een majeure wetswijziging (zoals het Belastingplan) volgt een volledige herkalibratie.
            Wie een actieve scan heeft, krijgt bij relevante wijzigingen een bericht met de implicatie voor het eigen rapport.
          </p>
          <Link
            href="/scan"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-accent-500 decoration-2 underline-offset-4 hover:decoration-ink"
          >
            Naar de scan →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
