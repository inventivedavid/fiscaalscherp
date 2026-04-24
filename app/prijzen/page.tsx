import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageIntro } from "@/components/platform/PageShell";
import { PricingBlock } from "@/components/platform/PricingBlock";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prijzen",
  description:
    "Transparante prijzen: scan gratis, optimalisatiesessie eenmalig € 495, jaaroptimalisatie vanaf € 95/maand, volledige administratie vanaf € 295/maand.",
};

export default function PrijzenPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Prijzen"
        title="Vier lagen, geen verborgen kosten, maandelijks opzegbaar."
        description="De scan is en blijft kosteloos. De betaalde lagen bouwen op — zonder dat je verplicht bent erin mee te groeien. Alle bedragen zijn exclusief BTW."
      />

      <PricingBlock showHeader={false} />

      <section className="hairline-b bg-canvas-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-display-md text-ink">
            Wat zit er precies in elke laag?
          </h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm tabular-nums">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-4 pr-4 font-medium text-ink-muted"></th>
                  <th className="py-4 pr-4 font-medium text-ink">Scan</th>
                  <th className="py-4 pr-4 font-medium text-ink">Sessie</th>
                  <th className="py-4 pr-4 font-medium text-ink">Jaarplan</th>
                  <th className="py-4 pr-4 font-medium text-ink">Volledig</th>
                </tr>
              </thead>
              <tbody className="[&_tr]:border-b [&_tr]:border-line [&_td]:py-4 [&_td]:pr-4 [&_td]:align-top">
                <Row label="Aantal vragen / vragenronde" values={["20", "90 min", "Kwartaal", "Doorlopend"]} />
                <Row label="Schriftelijk rapport" values={["PDF", "Uitgewerkt", "Per kwartaal", "Realtime"]} />
                <Row label="Proactieve signalering" values={["—", "Eenmalig", "Ja", "Ja"]} />
                <Row label="Vragen tussendoor" values={["—", "Tijdens sessie", "Onbeperkt (e-mail)", "Onbeperkt"]} />
                <Row label="Boekhouding inbegrepen" values={["—", "—", "—", "Volledig"]} />
                <Row label="Aangifte VPB / IB" values={["—", "—", "Indicatief", "Uitgevoerd"]} />
                <Row label="Kosten" values={["Gratis", "€ 495 eenmalig", "€ 95 /mnd", "€ 295 /mnd"]} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="hairline-b bg-canvas py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-display-md text-ink">
            Liever eerst kennismaken?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            Een kort gesprek van 30 minuten om te beoordelen of het platform bij je situatie past — kosteloos, geen opvolg-mailstroom.
          </p>
          <div className="mt-8 flex flex-wrap gap-5">
            <a
              href={SITE.calUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas hover:bg-ink-soft"
            >
              Plan een kennismaking →
            </a>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink"
            >
              Of begin direct met de scan
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <td className="text-ink-muted">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="text-ink">
          {v}
        </td>
      ))}
    </tr>
  );
}
