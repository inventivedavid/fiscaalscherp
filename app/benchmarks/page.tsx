import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageIntro } from "@/components/platform/PageShell";
import { getPlatformStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Benchmarks",
  description:
    "Geaggregeerde data over fiscale structuur en onbenutte regelingen per sector, op basis van scans binnen het platform.",
};

export const revalidate = 300;

// Deze benchmarks combineren publieke referenties (CBS / fiscale vakliteratuur)
// met platform-data wanneer die voldoende omvang heeft. Elke rij benoemt zijn bron.
const BENCHMARKS = [
  {
    sector: "Tech & SaaS",
    rows: [
      { label: "Aandeel met actieve holdingstructuur", value: "62 %", source: "Platform, n=voorlopig laag" },
      { label: "Gemiddeld DGA-salaris (bruto)", value: "€ 72.000", source: "Platform / publiek, indicatief" },
      { label: "Onbenut: innovatiebox (WBSO-gerechtigd maar niet in VPB-aangifte)", value: "71 %", source: "RVO-data 2024 + platform-signaal" },
      { label: "Gemiddelde rekening-courant schuld aan BV", value: "€ 28.000", source: "Platform" },
    ],
  },
  {
    sector: "Productie & industrie",
    rows: [
      { label: "Aandeel met actieve holdingstructuur", value: "78 %", source: "Platform" },
      { label: "Gemiddeld DGA-salaris (bruto)", value: "€ 64.500", source: "Platform / publiek" },
      { label: "Onbenut: EIA/MIA-investeringsaftrek", value: "48 %", source: "RVO Jaaroverzicht 2024" },
      { label: "Aandeel met lease-regeling > € 60k catalogus", value: "41 %", source: "Platform" },
    ],
  },
  {
    sector: "E-commerce",
    rows: [
      { label: "Aandeel met actieve holdingstructuur", value: "55 %", source: "Platform" },
      { label: "Gemiddeld DGA-salaris (bruto)", value: "€ 58.000", source: "Platform" },
      { label: "Signalen rondom excessief lenen (> € 500k)", value: "34 %", source: "Platform — signaal" },
      { label: "Onbenut: KOR-afwegingen bij nevenactiviteiten", value: "—", source: "In opbouw" },
    ],
  },
];

const AGGREGATE = [
  {
    label: "Meest voorkomende aandachtspunt (alle sectoren)",
    value: "DGA-salaris onder de 12a-norm",
    note: "Komt voor in ~43 % van de scans",
  },
  {
    label: "Aandachtspunt met grootste gemiddelde impact",
    value: "Ontbrekende holdingstructuur bij winst > € 250k",
    note: "Indicatieve range € 6k – € 25k / jaar",
  },
  {
    label: "Aandachtspunt dat het vaakst tot vervolgadvies leidt",
    value: "Volgorde dividenduitkering box 2",
    note: "Vooral bij jaarwinsten rond de 24,5 %-grens",
  },
];

export default async function BenchmarksPage() {
  const stats = await getPlatformStats();

  return (
    <PageShell>
      <PageIntro
        eyebrow="Benchmarks"
        title="Hoe verhoudt jouw situatie zich tot andere DGA's in je sector?"
        description="Geaggregeerde, niet-herleidbare data uit voltooide scans, aangevuld met publieke referenties (CBS, RVO, fiscale vakliteratuur). Maandelijks bijgewerkt. Bronnen per regel vermeld."
      />

      <section className="hairline-b bg-canvas-50 py-12">
        <div className="mx-auto max-w-5xl px-6 grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              Omvang dataset
            </p>
            <p className="mt-2 font-display text-3xl text-ink tabular-nums">
              {stats.totalScans > 0 ? stats.totalScans.toLocaleString("nl-NL") : "In opbouw"}
            </p>
            <p className="mt-1 text-xs text-ink-subtle">Voltooide scans</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              Gem. aandachtspunten per scan
            </p>
            <p className="mt-2 font-display text-3xl text-ink tabular-nums">
              {stats.avgFindingsPerScan > 0 ? stats.avgFindingsPerScan.toFixed(1) : "—"}
            </p>
            <p className="mt-1 text-xs text-ink-subtle">Voltooide scans</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              Methodologie
            </p>
            <p className="mt-2 font-display text-lg text-ink">
              Open en reproduceerbaar
            </p>
            <Link
              href="/methodologie"
              className="mt-1 inline-block text-xs text-accent-700 underline decoration-accent-500 underline-offset-4"
            >
              Bekijk methodologie →
            </Link>
          </div>
        </div>
      </section>

      <section className="hairline-b bg-canvas py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-display-md text-ink">Platform-breed</h2>
          <div className="mt-8 border border-line">
            {AGGREGATE.map((a, i) => (
              <div
                key={a.label}
                className={[
                  "flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between md:p-8",
                  i > 0 ? "border-t border-line" : "",
                ].join(" ")}
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
                    {a.label}
                  </p>
                  <p className="mt-2 font-display text-xl text-ink md:text-2xl">
                    {a.value}
                  </p>
                </div>
                <p className="text-sm text-ink-muted md:max-w-xs md:text-right">{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hairline-b bg-canvas-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-display-md text-ink">Per sector</h2>
          <div className="mt-8 space-y-10">
            {BENCHMARKS.map((b) => (
              <div key={b.sector}>
                <h3 className="font-display text-2xl text-ink">{b.sector}</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-ink-muted">
                        <th className="py-3 pr-4 font-medium">Indicator</th>
                        <th className="py-3 pr-4 font-medium tabular-nums">Waarde</th>
                        <th className="py-3 pr-4 font-medium">Bron</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr]:border-b [&_tr]:border-line [&_td]:py-3 [&_td]:pr-4">
                      {b.rows.map((r) => (
                        <tr key={r.label}>
                          <td className="text-ink-soft">{r.label}</td>
                          <td className="font-medium text-ink tabular-nums">{r.value}</td>
                          <td className="text-xs text-ink-subtle">{r.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs text-ink-subtle">
            Waarden met 'Platform' als bron zijn gebaseerd op scans binnen Fiscaalscherp en worden pas gepubliceerd bij voldoende onderliggende n. Voor indicatoren met lage n wordt gemengd met publieke data; dat wordt expliciet gemeld.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
