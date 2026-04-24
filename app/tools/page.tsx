import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageIntro } from "@/components/platform/PageShell";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Specifieke fiscale calculators voor DGA's: gebruikelijk-loontoets, holding-beslisboom en box 2-dividendplanning.",
};

const TOOLS = [
  {
    slug: "dga-salaris-check",
    number: "01",
    name: "Gebruikelijk-loontoets",
    summary:
      "Toets je DGA-salaris direct aan de norm van art. 12a LB. Drie factoren: afgeleide, vergelijkingsloon, 75%-grens. Output: concreet bedrag plus juridische context.",
    meta: "2 min · Anoniem",
    status: "Beschikbaar",
    available: true,
  },
  {
    slug: "holding-check",
    number: "02",
    name: "Holdingstructuur-beslisboom",
    summary:
      "Beoordeelt of een tussenholding fiscaal relevant is voor jouw situatie: deelnemingsvrijstelling, fiscale eenheid, aansprakelijkheidsrisico, toekomstige verkoop.",
    meta: "3 min · Anoniem",
    status: "Binnenkort",
    available: false,
  },
  {
    slug: "box2-planner",
    number: "03",
    name: "Box 2-dividendplanner",
    summary:
      "Simuleert de fiscaal meest efficiënte dividendvolgorde over meerdere jaren, inclusief het 24,5 %- en 31 %-schijvensysteem vanaf 2024.",
    meta: "4 min · Anoniem",
    status: "Binnenkort",
    available: false,
  },
];

export default function ToolsPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Tools"
        title="Calculators voor de onderwerpen waar DGA's vaakst op hangen."
        description="Elke tool beantwoordt één specifieke vraag. Geen formulier vooraf, geen e-mailgate, geen opvolg-mail. Bruikbaar als werkdocument; referenties inbegrepen."
      />

      <section className="hairline-b bg-canvas py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="border border-line">
            {TOOLS.map((t, i) => {
              const inner = (
                <div
                  className={[
                    "flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:p-10",
                    i > 0 ? "border-t border-line" : "",
                    t.available ? "hover:bg-canvas-50 transition" : "opacity-70",
                  ].join(" ")}
                >
                  <div className="w-full md:w-16">
                    <p className="font-mono text-xs text-ink-subtle tabular-nums">
                      {t.number}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-2xl text-ink md:text-3xl">
                        {t.name}
                      </h3>
                      {!t.available ? (
                        <span className="rounded-full border border-line px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-eyebrow text-ink-muted">
                          {t.status}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
                      {t.summary}
                    </p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-eyebrow text-ink-subtle">
                      {t.meta}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {t.available ? (
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                        Openen
                        <svg
                          className="size-4"
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
                      </span>
                    ) : (
                      <span className="text-sm text-ink-subtle">
                        In ontwikkeling
                      </span>
                    )}
                  </div>
                </div>
              );

              return t.available ? (
                <Link key={t.slug} href={`/tools/${t.slug}`} className="block group">
                  {inner}
                </Link>
              ) : (
                <div key={t.slug}>{inner}</div>
              );
            })}
          </div>
          <p className="mt-6 text-xs text-ink-subtle">
            De tools zijn een uitbreiding op de scan, niet een vervanging. Voor een overzicht van je hele fiscale positie is de scan de aangewezen ingang.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
