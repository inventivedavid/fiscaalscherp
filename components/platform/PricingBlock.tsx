// Transparante prijzen, inline op de homepage + als zelfstandige /prijzen pagina.
// Geen "Most popular" badge, geen gimmicks.

import Link from "next/link";
import { PRICING } from "@/lib/site";

export function PricingBlock({
  compact = false,
  showHeader = true,
}: {
  compact?: boolean;
  showHeader?: boolean;
}) {
  return (
    <section className="hairline-b bg-canvas py-24">
      <div className="mx-auto max-w-6xl px-6">
        {showHeader ? (
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              Prijzen
            </p>
            <h2 className="mt-4 font-display text-display-lg text-ink text-balance">
              Vier lagen, van gratis tot volledige administratie.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              De scan is en blijft kosteloos. De betaalde lagen dekken steeds meer van wat je nodig hebt, zonder dat je verplicht bent om te groeien in die richting.
            </p>
          </div>
        ) : null}

        <div className="mt-12 grid gap-0 border border-line md:grid-cols-4">
          {PRICING.map((tier, idx) => (
            <div
              key={tier.id}
              className={[
                "flex flex-col p-7",
                idx > 0 ? "border-t border-line md:border-l md:border-t-0" : "",
                tier.accent ? "bg-canvas-50" : "bg-canvas",
              ].join(" ")}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl text-ink">{tier.name}</h3>
                {tier.accent ? (
                  <span className="text-[10px] font-medium uppercase tracking-eyebrow text-accent-700">
                    Meest gekozen
                  </span>
                ) : null}
              </div>
              <p className="mt-4 font-display text-4xl tracking-tight text-ink tabular-nums">
                {tier.price}
                {tier.period ? (
                  <span className="ml-1 text-base font-sans text-ink-muted">
                    {tier.period}
                  </span>
                ) : null}
              </p>
              <p className="mt-4 text-sm text-ink-soft">{tier.summary}</p>

              {!compact ? (
                <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-sm text-ink-soft">
                  {tier.details.map((d) => (
                    <li key={d} className="flex gap-2">
                      <svg
                        className="mt-0.5 size-4 flex-none text-accent-500"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8.5L6.5 12L13 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-auto pt-7">
                <Link
                  href={tier.cta.href}
                  className={[
                    "inline-flex items-center gap-2 text-sm font-medium",
                    tier.accent
                      ? "rounded-full bg-ink px-5 py-2.5 text-canvas hover:bg-ink-soft"
                      : "text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink",
                  ].join(" ")}
                >
                  {tier.cta.label} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-ink-subtle">
          Prijzen zijn exclusief BTW. Abonnementen zijn maandelijks opzegbaar; de eerste drie maanden dienen als proefperiode.
        </p>
      </div>
    </section>
  );
}
