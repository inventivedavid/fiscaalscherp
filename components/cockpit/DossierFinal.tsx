"use client";

import { useCockpit } from "./store";
import { BarcodeID } from "./BarcodeID";
import { findSectionById } from "./sections";
import type { Severity } from "@/lib/flags";

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function severityLabel(s: Severity): string {
  switch (s) {
    case "critical":
      return "Kritisch";
    case "high":
      return "Hoog";
    case "medium":
      return "Aandacht";
    case "info":
      return "Signaal";
  }
}

function caseRefFromAnswers(answers: Record<string, string>): string {
  // Stabiele referentie — we hashen een paar vrijwel altijd ingevulde keys.
  const seed = `${answers.sector ?? "x"}-${answers.revenue ?? "x"}-${answers.dga_salary ?? "x"}-${answers.has_holding ?? "x"}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const code = (h % 9000) + 1000;
  const year = new Date().getFullYear();
  const week = Math.ceil(
    ((Date.now() - Date.UTC(year, 0, 1)) / 86_400_000 + 1) / 7,
  );
  return `FS-${year}-W${String(week).padStart(2, "0")}-${code}`;
}

export function DossierFinal() {
  const { findings, totalRange, gotoActivate, state } = useCockpit();
  const caseRef = caseRefFromAnswers(state.answers as Record<string, string>);

  // Eerste twee findings tonen we open. De rest wordt op het eindscherm
  // bewust deels verzegeld weergegeven — toegang tot de volledige
  // uitwerking gebeurt via strateeg-activatie.
  const open = findings.slice(0, 2);
  const sealed = findings.slice(2);

  return (
    <div className="min-h-[100dvh] bg-obsidian-900 pt-safe">
      <div className="classified-banner flex items-center justify-between px-4 py-1.5">
        <span>Vertrouwelijk · Dossier compleet</span>
        <span className="font-mono tabular-nums text-bone/55">VI/VI</span>
      </div>

      <main className="mx-auto max-w-3xl px-5 pb-32 pt-10 md:px-6 md:pt-16">
        <p className="font-mono text-[10px] tracking-stamp uppercase text-gold-300">
          Dossier opgesteld · klaar voor strateeg
        </p>
        <h1 className="mt-4 font-display text-display-xl text-bone text-balance">
          Je dossier is in beeld — een deel blijft verzegeld tot activatie.
        </h1>

        {/* Boarding-pass-achtige header */}
        <div className="mt-10 glass relative overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_auto]">
            <div className="p-6 md:p-8">
              <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/40">
                Dossier-referentie
              </p>
              <p className="mt-1 font-mono text-lg tabular-nums text-bone">
                {caseRef}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/40">
                    Houder
                  </p>
                  <p className="mt-1 text-[14px] text-bone/80">
                    {state.persistedEmail ? state.persistedEmail : "— in te vullen bij activatie"}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/40">
                    Bedrijf
                  </p>
                  <p className="mt-1 text-[14px] text-bone/80">
                    — in te vullen bij activatie
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-white/8 pt-5">
                <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/40">
                  Optimalisatieruimte · jaarbasis · indicatief
                </p>
                <p
                  className="mt-2 font-mono text-mono-stat text-emerald-400 tabular-nums"
                  style={{ textShadow: "0 0 22px rgba(62,207,148,0.4)" }}
                >
                  {euro(totalRange.min)}{" "}
                  <span className="text-bone/40">–</span>{" "}
                  {euro(totalRange.max)}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-mark text-bone/40">
                  Op basis van {findings.length} bevinding{findings.length === 1 ? "" : "en"}.
                </p>
              </div>
            </div>

            {/* Stempel-kolom */}
            <div className="relative flex flex-col items-center justify-center gap-5 border-t border-white/8 px-6 py-6 md:border-l md:border-t-0 md:px-8">
              <div className="stamp stamp-rotate inline-flex flex-col items-center gap-1 rounded-md px-3.5 py-2 font-mono text-[10px] tracking-stamp uppercase">
                <span>Vastgelegd</span>
                <span className="text-bone/55">VI / VI</span>
              </div>
              <BarcodeID seed={caseRef} bars={32} className="h-8" />
            </div>
          </div>
        </div>

        {/* Bevindingen — open + verzegeld */}
        <section className="mt-10">
          <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/45">
            Bevindingen — geprioriteerd
          </p>
          <div className="mt-4 grid gap-3">
            {open.map((f) => (
              <article
                key={f.id}
                className="glass rounded-2xl p-5 md:p-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-stamp uppercase text-emerald-300">
                    {severityLabel(f.severity)} · {f.shortLabel}
                  </p>
                  <p className="font-mono text-[12px] tabular-nums text-emerald-400">
                    {euro(f.savingsMinEur)} – {euro(f.savingsMaxEur)} / jr
                  </p>
                </div>
                <h3 className="mt-2 font-display text-xl text-bone md:text-2xl">
                  {f.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-bone/70">
                  {f.body.slice(0, 240)}
                  {f.body.length > 240 ? "…" : ""}
                </p>
              </article>
            ))}

            {sealed.length > 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-5 md:p-6">
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[10px] tracking-stamp uppercase text-gold-300">
                    Verzegeld · vereist strateeg
                  </p>
                  <p className="font-mono text-[10px] tabular-nums text-bone/40">
                    {sealed.length} bevinding{sealed.length === 1 ? "" : "en"}
                  </p>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {sealed.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-3"
                    >
                      <span className="redact h-3 w-32 max-w-[60%] flex-1" />
                      <span className="font-mono text-[10px] tabular-nums text-bone/35">
                        € ███ – € ███ / jr
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[12px] leading-relaxed text-bone/45">
                  Volledige titels, onderbouwing en concrete vervolgstappen
                  worden ontsloten in het strateeg-gesprek.
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {/* Sectie-overzicht */}
        <section className="mt-10">
          <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/45">
            Secties · vastgelegd
          </p>
          <ol className="mt-4 grid gap-2">
            {state.completedSections.map((id) => {
              const s = findSectionById(id);
              return (
                <li
                  key={id}
                  className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.015] px-4 py-2.5"
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="seal-disc inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] text-gold-100"
                    >
                      {s.ordinal}
                    </span>
                    <span className="text-[13px] text-bone/85">{s.title}</span>
                  </span>
                  <span className="font-mono text-[10px] tracking-stamp uppercase text-gold-300">
                    Vastgelegd
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </main>

      {/* Sticky activatie-CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-obsidian-900 via-obsidian-900/95 to-transparent px-5 pb-safe pt-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="hidden md:block">
            <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/40">
              Volgende stap
            </p>
            <p className="text-[13px] text-bone/70">
              Strateeg activeren · kennismakingsgesprek 15 min, vrijblijvend
            </p>
          </div>
          <button
            type="button"
            onClick={gotoActivate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-[15px] font-medium text-obsidian-900 transition hover:bg-emerald-400 md:w-auto md:px-7"
          >
            Activeer mijn strateeg
            <span aria-hidden>→</span>
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] leading-relaxed text-bone/40 md:text-left">
          Tijdens het gesprek bespreken we je dossier en of een
          optimalisatiesessie (€ 495) zinvol is. Geen verplichting, geen
          verkooppraatje — alleen jouw bevindingen in context.
        </p>
      </div>
    </div>
  );
}
