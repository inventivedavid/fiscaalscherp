import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell, PageIntro } from "@/components/platform/PageShell";

type SectorContent = {
  slug: string;
  label: string;
  lede: string;
  characteristics: string[];
  focusPoints: { title: string; body: string; law: string }[];
  benchmarks: { label: string; value: string; note?: string }[];
};

const SECTOR_CONTENT: Record<string, SectorContent> = {
  tech: {
    slug: "tech",
    label: "Tech & SaaS",
    lede:
      "In tech-BV's spelen specifieke fiscale thema's: innovatiebox, WBSO-doorwerking in de aangifte, hoge vergelijkingslonen voor 12a en de wisselende cashflow tussen runway-fases. De scan en de engine houden rekening met dit profiel.",
    characteristics: [
      "Vergelijkingsloon vaak hoog (senior engineering / CTO-niveau)",
      "WBSO meestal aanwezig — innovatiebox te weinig toegepast",
      "R&D-kosten en activering immateriële activa rondom product",
      "Bij buitenlandse klanten: btw-positie complex",
    ],
    focusPoints: [
      {
        title: "Innovatiebox-toets",
        body:
          "WBSO-verklaring is vaak wel aanwezig, maar het effectief benutten in de VPB-aangifte (9 %-box) gebeurt bij een groot deel van de tech-DGA's niet. Het verschil is structureel en meetbaar.",
        law: "Art. 12b Wet Vpb · Besluit innovatiebox 2024",
      },
      {
        title: "Gebruikelijk loon met CTO-benchmark",
        body:
          "Het vergelijkingsloon voor een tech-DGA ligt vaak boven € 90.000. Afwijken naar beneden mag, maar vereist een gedocumenteerde onderbouwing — zeker in de 12a-post-2023-context.",
        law: "Art. 12a Wet LB",
      },
      {
        title: "Activering vs. direct ten laste",
        body:
          "Ontwikkelkosten van eigen software kunnen in bepaalde gevallen worden geactiveerd. Dit heeft verschuivende impact op het resultaat en daarmee op dividendplanning.",
        law: "RJ 210 · fiscale pendant in art. 3.30 Wet IB",
      },
    ],
    benchmarks: [
      { label: "Aandeel met holdingstructuur", value: "62 %", note: "Platform-data" },
      { label: "Gem. DGA-salaris bruto", value: "€ 72.000" },
      { label: "Onbenutte innovatiebox", value: "71 %", note: "Signaal platform + RVO" },
    ],
  },
  productie: {
    slug: "productie",
    label: "Productie & industrie",
    lede:
      "Voor productiebedrijven zijn investeringsaftrek (EIA, MIA), lease-regelingen en de fiscale behandeling van onroerend goed dominant. Holdingstructuren zijn hier meestal noodzaak en geen keuze.",
    characteristics: [
      "Investeringsgedreven — EIA/MIA/Vamil vaak onbenut",
      "Machine-park en onroerend goed structurele balansposten",
      "Aansprakelijkheidsrisico hoog — holdingafscherming relevant",
      "Meerjarige cycli, volatiele winsten → dividendvolgorde belangrijk",
    ],
    focusPoints: [
      {
        title: "EIA/MIA op investeringen",
        body:
          "Een aanzienlijk deel van de investeringen in productieapparatuur kwalificeert zich voor energie- of milieu-investeringsaftrek. In onze signalering is dit structureel onderbenut.",
        law: "Wet IB art. 3.40 e.v. · RVO EIA/MIA-lijst 2025",
      },
      {
        title: "Onroerend goed in de BV vs. privé",
        body:
          "De fiscale behandeling van bedrijfsonroerendgoed is zelden één keer optimaal ingeregeld. Jaarlijkse herziening (zeker rondom WOZ-wijzigingen) is aangewezen.",
        law: "Art. 4.5 Wet IB · Wet op de overdrachtsbelasting",
      },
      {
        title: "Holding als aansprakelijkheidsbuffer",
        body:
          "Voor productie met materiële aansprakelijkheidsrisico's is de structuur zonder tussenholding zelden verdedigbaar.",
        law: "BW 2 · Besluit deelnemingsvrijstelling",
      },
    ],
    benchmarks: [
      { label: "Aandeel met holdingstructuur", value: "78 %", note: "Platform-data" },
      { label: "Gem. DGA-salaris bruto", value: "€ 64.500" },
      { label: "Onbenutte EIA/MIA", value: "48 %" },
    ],
  },
  ecommerce: {
    slug: "ecommerce",
    label: "E-commerce",
    lede:
      "E-commerce kent hoge omzet met smalle marges, grensoverschrijdende btw-plichten (OSS), en regelmatig excessief-leen-signalen door private trekkingen uit de BV. De scan weegt dit profiel expliciet.",
    characteristics: [
      "Smalle marges, volume-gedreven",
      "Grensoverschrijdende btw (OSS/IOSS)",
      "Voorraadwaardering en retouren → resultaatsvolatiliteit",
      "Rekening-courant aan BV vaak grensoverschrijdend naar de € 500k-limiet",
    ],
    focusPoints: [
      {
        title: "Rekening-courant en excessief lenen",
        body:
          "De wet excessief lenen (2023) trekt een harde grens bij € 500.000 — cumulatief. In onze signalering zit e-commerce rond en boven deze grens vaker dan andere sectoren.",
        law: "Wet excessief lenen (2023)",
      },
      {
        title: "OSS- en IOSS-regime",
        body:
          "Grensoverschrijdende B2C-leveringen vallen onder het One-Stop-Shop-regime. De positie is zelden optimaal ingericht — met name rond de € 10.000-drempel.",
        law: "Art. 28a Wet OB · EU-BTW 2024",
      },
      {
        title: "Voorraadwaardering",
        body:
          "Fiscale waardering van voorraad (lifo/fifo/kostprijs-min) heeft meetbare impact op het resultaat én op dividendruimte.",
        law: "Art. 3.30 Wet IB",
      },
    ],
    benchmarks: [
      { label: "Aandeel met holdingstructuur", value: "55 %", note: "Platform-data" },
      { label: "Gem. DGA-salaris bruto", value: "€ 58.000" },
      { label: "Signalen rondom excessief lenen", value: "34 %" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(SECTOR_CONTENT).map((sector) => ({ sector }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  const { sector } = await params;
  const c = SECTOR_CONTENT[sector];
  if (!c) return { title: "Niet gevonden" };
  return {
    title: `${c.label} — Fiscale scan en benchmarks`,
    description: c.lede,
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector } = await params;
  const c = SECTOR_CONTENT[sector];
  if (!c) notFound();

  return (
    <PageShell>
      <PageIntro
        eyebrow={`Voor · ${c.label}`}
        title={`Fiscale scan voor DGA's in ${c.label.toLowerCase()}.`}
        description={c.lede}
      />

      <section className="hairline-b bg-canvas-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-display-md text-ink">Kenmerken van deze sector</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {c.characteristics.map((ch) => (
              <li key={ch} className="flex gap-4 border-t border-line pt-5">
                <span className="mt-2 size-1.5 flex-none rounded-full bg-accent-500" />
                <p className="text-base text-ink-soft">{ch}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hairline-b bg-canvas py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-display-md text-ink">
            Aandachtspunten waar de engine op let
          </h2>
          <div className="mt-8 space-y-6">
            {c.focusPoints.map((f, i) => (
              <div
                key={f.title}
                className="grid gap-4 border-t border-line pt-6 md:grid-cols-12"
              >
                <div className="md:col-span-1">
                  <p className="font-mono text-xs text-ink-subtle tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </div>
                <div className="md:col-span-7">
                  <h3 className="font-display text-2xl text-ink">{f.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-ink-soft">
                    {f.body}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-subtle">
                    Bron
                  </p>
                  <p className="mt-1.5 text-xs text-ink-muted">↳ {f.law}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hairline-b bg-canvas-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-display-md text-ink">
            Sector-benchmarks
          </h2>
          <div className="mt-8 grid gap-0 border border-line md:grid-cols-3">
            {c.benchmarks.map((b, i) => (
              <div
                key={b.label}
                className={[
                  "p-6 md:p-8",
                  i > 0 ? "border-t border-line md:border-l md:border-t-0" : "",
                ].join(" ")}
              >
                <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
                  {b.label}
                </p>
                <p className="mt-3 font-display text-3xl text-ink tabular-nums md:text-4xl">
                  {b.value}
                </p>
                {b.note ? (
                  <p className="mt-2 text-xs text-ink-subtle">{b.note}</p>
                ) : null}
              </div>
            ))}
          </div>
          <Link
            href="/benchmarks"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink"
          >
            Volledige benchmark-tabel →
          </Link>
        </div>
      </section>

      <section className="bg-ink py-20 text-canvas">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-medium uppercase tracking-eyebrow text-canvas/50">
            Volgende stap
          </p>
          <h2 className="mt-4 font-display text-display-lg text-canvas text-balance">
            Toets je eigen positie tegen deze sector-baselines.
          </h2>
          <p className="mt-5 max-w-xl text-canvas/75">
            De scan weegt je antwoorden tegen de sector-specifieke kalibratie en levert een persoonlijk rapport.
          </p>
          <Link
            href="/scan"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-canvas px-6 py-3.5 text-sm font-medium text-ink hover:bg-canvas-100"
          >
            Start scan →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
