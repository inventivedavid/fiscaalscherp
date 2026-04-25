"use client";

// VaultOpen — eindscherm. De volledige kluis is open.
// Grote centrale dial met alle VI arcs geëtst. Reference-string als
// gegraveerde regel onder de dial. Bevindingen onder de dial in een
// rustig 2-koloms grid; verzegelde bevindingen tonen lock-glyphs in
// plaats van redact-balken.

import { useCockpit } from "./store";
import { BarcodeID } from "./BarcodeID";
import { VaultDial } from "./VaultDial";
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

function LockGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0 text-bone/40"
    >
      <rect
        x="3.2"
        y="7.2"
        width="9.6"
        height="6.6"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M5.4 7.2 V5.4 a2.6 2.6 0 0 1 5.2 0 V7.2"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="8" cy="10.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function DossierFinal() {
  const { findings, totalRange, gotoActivate, state } = useCockpit();
  const caseRef = caseRefFromAnswers(state.answers as Record<string, string>);

  const open = findings.slice(0, 2);
  const sealed = findings.slice(2);

  return (
    <div className="min-h-[100dvh] bg-obsidian-900 pt-safe">
      {/* Slim status-strip — kluis volledig open. */}
      <div className="flex h-7 items-center justify-between border-b border-white/[0.05] bg-obsidian-900/80 px-4 font-mono text-[9.5px] uppercase tracking-stamp text-bone/45 backdrop-blur">
        <span>Kluis · volledig open</span>
        <span className="font-mono tabular-nums text-bone/45">VI / VI</span>
      </div>

      <main className="mx-auto max-w-3xl px-5 pb-32 pt-10 md:px-6 md:pt-14">
        {/* Centrale dial. */}
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-[10px] uppercase tracking-stamp text-emerald-300 etch-emerald">
            Dossier opgesteld · klaar voor strateeg
          </p>

          <div className="mt-8 animate-chamber-open">
            <VaultDial
              done={6}
              active={null}
              min={totalRange.min}
              max={totalRange.max}
              size="lg"
              label="Optimalisatie · jaar"
              sublabel="VI / VI · vastgelegd"
            />
          </div>

          {/* Gegraveerde reference + barcode-ets. */}
          <div className="mt-10 flex flex-col items-center gap-2">
            <p className="font-mono text-[10px] uppercase tracking-stamp text-bone/40">
              Dossier-referentie
            </p>
            <p className="font-mono text-base tabular-nums text-bone etch md:text-lg">
              {caseRef}
            </p>
            <BarcodeID
              seed={caseRef}
              bars={48}
              className="mt-1 h-3 w-48 opacity-50"
            />
            <p className="mt-2 max-w-md font-mono text-[10px] uppercase tracking-stamp text-bone/35">
              {state.persistedEmail
                ? `houder · ${state.persistedEmail}`
                : "houder · in te vullen bij activatie"}
            </p>
          </div>

          <h1 className="mt-10 max-w-2xl font-display text-balance text-3xl text-bone etch md:text-5xl">
            Je dossier is in beeld — een deel blijft verzegeld tot activatie.
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-bone/60">
            Op basis van {findings.length} bevinding
            {findings.length === 1 ? "" : "en"}. Het volledige rapport en de
            concrete vervolgstappen worden ontsloten in het strateeg-gesprek.
          </p>
        </div>

        {/* Bevindingen — open. */}
        <section className="mt-14">
          <p className="font-mono text-[10px] uppercase tracking-stamp text-bone/45">
            Bevindingen — geprioriteerd
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {open.map((f) => (
              <article
                key={f.id}
                className="brushed-deep ring-hairline rounded-2xl p-5 shadow-engrave md:p-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-stamp text-emerald-300">
                    {severityLabel(f.severity)} · {f.shortLabel}
                  </p>
                  <p className="font-mono text-[12px] tabular-nums text-emerald-400 etch-emerald">
                    {euro(f.savingsMinEur)} – {euro(f.savingsMaxEur)} / jr
                  </p>
                </div>
                <h3 className="mt-2 font-display text-xl text-bone etch md:text-2xl">
                  {f.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-bone/65">
                  {f.body.slice(0, 220)}
                  {f.body.length > 220 ? "…" : ""}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Verzegeld blok. */}
        {sealed.length > 0 ? (
          <section className="mt-6">
            <div className="brushed ring-hairline rounded-2xl p-5 shadow-engrave md:p-6">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[10px] uppercase tracking-stamp text-bone/45">
                  Verzegeld · vereist strateeg
                </p>
                <p className="font-mono text-[10px] tabular-nums text-bone/40">
                  {sealed.length} bevinding{sealed.length === 1 ? "" : "en"}
                </p>
              </div>
              <ul className="mt-4 space-y-2.5">
                {sealed.map((f) => (
                  <li key={f.id} className="flex items-center gap-3">
                    <LockGlyph />
                    <span
                      aria-hidden
                      className="h-px flex-1 bg-gradient-to-r from-white/15 via-white/5 to-transparent"
                    />
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
          </section>
        ) : null}

        {/* Sectie-overzicht. */}
        <section className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-stamp text-bone/45">
            Secties · vastgelegd
          </p>
          <ol className="mt-4 grid gap-2 md:grid-cols-2">
            {state.completedSections.map((id) => {
              const s = findSectionById(id);
              return (
                <li
                  key={id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.015] px-4 py-2.5"
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="font-display text-[15px] leading-none text-emerald-300/90 etch-emerald"
                      style={{ letterSpacing: "0.06em" }}
                    >
                      {s.ordinal}
                    </span>
                    <span className="text-[13px] text-bone/85">{s.title}</span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-stamp text-emerald-300/85">
                    Geëtst
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </main>

      {/* Sticky activatie-CTA. */}
      <div className="brushed fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] px-5 pb-safe pt-5 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.7)]">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="hidden md:block">
            <p className="font-mono text-[10px] uppercase tracking-stamp text-bone/40">
              Volgende stap · kluis-toegang
            </p>
            <p className="text-[13px] text-bone/65">
              Strateeg activeren · kennismakingsgesprek 15 min, vrijblijvend
            </p>
          </div>
          <button
            type="button"
            onClick={gotoActivate}
            className={[
              "group inline-flex w-full items-center justify-center gap-3 rounded-2xl border py-4 text-[15px] font-medium transition md:w-auto md:px-7",
              "border-emerald-400/60 bg-emerald-400/[0.10] text-bone",
              "hover:border-emerald-400 hover:bg-emerald-400/[0.16]",
              "shadow-[0_0_30px_-12px_rgba(62,207,148,0.6)]",
            ].join(" ")}
          >
            Activeer mijn strateeg
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center font-mono text-[10px] uppercase tracking-stamp text-bone/35 md:text-left">
          Geen verplichting · alleen jouw bevindingen in context
        </p>
      </div>
    </div>
  );
}
