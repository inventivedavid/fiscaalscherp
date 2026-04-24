import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageIntro } from "@/components/platform/PageShell";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Kennisbank",
  description:
    "Diepgaande artikelen over fiscale onderwerpen die voor DGA's relevant zijn: gebruikelijk loon, holdingstructuur, box 2, excessief lenen en meer.",
};

const CATEGORIES = Array.from(new Set(ARTICLES.map((a) => a.category)));

export default function KennisbankPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Kennisbank"
        title="Artikelen voor wie eerst wil snappen waar het over gaat."
        description="Geen tipsheets of SEO-filler. Elk artikel is een volledig dossier over één onderwerp, met bronvermeldingen, rekenvoorbeelden en verwijzingen naar jurisprudentie waar relevant."
      />

      <section className="hairline-b bg-canvas py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-medium uppercase tracking-eyebrow text-ink-muted">
              Categorieën:
            </span>
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="rounded-full border border-line bg-canvas-50 px-3 py-1 text-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-10 border-t border-line">
            {ARTICLES.map((a) => (
              <article
                key={a.slug}
                className="border-b border-line py-8 transition hover:bg-canvas-50"
              >
                <Link
                  href={`/kennisbank/${a.slug}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-eyebrow text-ink-subtle">
                    <span>{a.category}</span>
                    <span>·</span>
                    <span>{a.readingTime}</span>
                    <span>·</span>
                    <span>Bijgewerkt {new Date(a.updatedAt).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl text-ink md:text-3xl">
                    {a.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-soft">
                    {a.summary}
                  </p>
                  <p className="mt-4 text-xs text-ink-subtle">
                    {a.keywords.map((k) => `#${k}`).join(" · ")}
                  </p>
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-10 text-xs text-ink-subtle">
            Nieuwe artikelen verschijnen bij relevante wetswijzigingen. Oude artikelen worden expliciet gemarkeerd als verouderd wanneer wetgeving verandert.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
