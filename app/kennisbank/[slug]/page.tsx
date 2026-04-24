import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/platform/PageShell";
import { ARTICLES, getArticle } from "@/lib/articles";
import { ArticleBody } from "./ArticleBody";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Niet gevonden" };
  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <PageShell>
      <article>
        <header className="hairline-b bg-canvas pb-14 pt-24 md:pt-28">
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              <Link href="/kennisbank" className="hover:text-ink">
                ← Kennisbank
              </Link>
              <span>·</span>
              <span>{article.category}</span>
              <span>·</span>
              <span>{article.readingTime}</span>
            </div>
            <h1 className="mt-6 font-display text-display-lg text-ink text-balance">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {article.summary}
            </p>
            <p className="mt-6 text-xs text-ink-subtle">
              Bijgewerkt op{" "}
              {new Date(article.updatedAt).toLocaleDateString("nl-NL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </header>

        <div className="hairline-b bg-canvas py-16">
          <div className="mx-auto max-w-3xl px-6">
            <ArticleBody slug={article.slug} />
          </div>
        </div>

        <section className="hairline-b bg-canvas-50 py-16">
          <div className="mx-auto max-w-3xl px-6">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              Logische vervolgstap
            </p>
            <h2 className="mt-4 font-display text-display-md text-ink">
              Zie hoe dit onderwerp zich tot jouw situatie verhoudt.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              De volledige scan weegt 20 factoren waaronder de hier behandelde punten. Het resulterende rapport is persoonlijk, specifiek en geschikt om met je eigen adviseur door te nemen.
            </p>
            <Link
              href="/scan"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas hover:bg-ink-soft"
            >
              Start de scan (8 min, gratis) →
            </Link>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
