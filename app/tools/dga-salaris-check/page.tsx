import type { Metadata } from "next";
import { PageShell, PageIntro } from "@/components/platform/PageShell";
import { SalarisCheckTool } from "./SalarisCheckTool";

export const metadata: Metadata = {
  title: "Gebruikelijk-loontoets",
  description:
    "Toets je DGA-salaris anoniem aan de norm van art. 12a LB. Drie factoren, direct resultaat, met juridische context.",
};

export default function SalarisCheckPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Tool 01 · Gebruikelijk-loontoets"
        title="Voldoet je DGA-salaris aan art. 12a Wet LB?"
        description="De fiscus hanteert voor DGA's een verplicht minimumloon op basis van de hoogste van drie referentiepunten. Deze tool past de toets toe op basis van jouw drie inputs — zonder e-mail, direct resultaat."
      />

      <section className="hairline-b bg-canvas py-20">
        <div className="mx-auto max-w-4xl px-6">
          <SalarisCheckTool />
        </div>
      </section>

      <section className="hairline-b bg-canvas-50 py-20">
        <div className="mx-auto max-w-3xl px-6 space-y-8">
          <div>
            <h2 className="font-display text-display-md text-ink">
              Juridische context
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Artikel 12a Wet op de loonbelasting 1964 bepaalt dat een werknemer die een aanmerkelijk belang heeft in zijn eigen vennootschap een loon geniet dat ten minste gelijk is aan het hoogste van:
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-base text-ink-soft">
              <li>het loon uit de meest vergelijkbare dienstbetrekking;</li>
              <li>het hoogste loon van de werknemers die in dienst zijn van de BV of een verbonden lichaam;</li>
              <li>een wettelijk minimum (€ 56.000 voor 2025, jaarlijks geïndexeerd).</li>
            </ol>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              De 75 %-toepassing op het vergelijkingsloon is met ingang van 2023 afgeschaft (Wet Belastingplan 2023).
              Afwijken naar beneden kan alleen op basis van concrete feiten en omstandigheden — bewijslast ligt bij de inhoudingsplichtige.
            </p>
          </div>
          <div className="border-t border-line pt-6">
            <h3 className="text-sm font-medium uppercase tracking-eyebrow text-ink-muted">
              Bronnen
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
              <li>↳ Wet op de loonbelasting 1964, art. 12a</li>
              <li>↳ Besluit DGA-loon 2025</li>
              <li>↳ Belastingplan 2023 (afschaffing 75 %-regel)</li>
              <li>↳ Kennisgroep Loonheffingen, standpunt KG:204:2023:3</li>
            </ul>
          </div>
          <p className="border-t border-line pt-6 text-xs text-ink-subtle">
            Deze toets geeft een indicatie. De Belastingdienst kan op basis van concrete dossiergegevens anders oordelen. Voor implementatie is gesprek met een adviseur die de volledige context kent noodzakelijk.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
