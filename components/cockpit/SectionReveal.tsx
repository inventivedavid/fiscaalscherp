"use client";

import { useEffect, useMemo } from "react";
import { useCockpit } from "./store";
import { findSectionById } from "./sections";
import type { Finding, Severity } from "@/lib/flags";

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

const SECTION_TO_FINDINGS: Record<string, string[]> = {
  profile: ["innovation_box"],
  structure: ["holding_missing", "holding_unused"],
  compensation: ["dga_salary_below_norm", "lease_ice"],
  capital: ["current_account_risk", "hoarded_cash"],
  future: ["peb_legacy", "succession_no_holding"],
  current_service: ["advisory_gap", "software_unused"],
};

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

export function SectionReveal() {
  const { state, findings, revealDone, totalRange } = useCockpit();

  // Vergrendel scroll tijdens reveal — voelt als een eigen scherm.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const sectionId = state.revealSectionId;
  const section = useMemo(
    () => (sectionId ? findSectionById(sectionId) : null),
    [sectionId],
  );

  // Welke bevindingen "horen" bij deze sectie en zijn ook daadwerkelijk
  // getriggerd? We tonen er max één openlijk; eventuele overige worden
  // geredigeerd weergegeven (meer reveal bij verdere voortgang of
  // pas bij activatie).
  const sectionFindings = useMemo(() => {
    if (!sectionId) return [];
    const ids = SECTION_TO_FINDINGS[sectionId] ?? [];
    return findings.filter((f) => ids.includes(f.id));
  }, [findings, sectionId]);

  const open: Finding | null = sectionFindings[0] ?? null;
  const sealed = sectionFindings.slice(1);

  if (!section) return null;

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-obsidian-900 pt-safe">
      <div className="classified-banner flex items-center justify-between px-4 py-1.5">
        <span>Vertrouwelijk</span>
        <span className="font-mono tabular-nums text-bone/55">
          {section.ordinal}/VI
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-start overflow-y-auto px-5 pb-32 pt-10 md:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-scan-grid opacity-[0.18]"
        />

        <div className="relative w-full max-w-xl">
          <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/45">
            Vastgelegd · {section.classified}
          </p>

          <div className="mt-3 flex items-start gap-4">
            <h2 className="flex-1 font-display text-3xl text-bone md:text-5xl">
              {section.title}
            </h2>
            <div
              className="stamp stamp-rotate animate-stamp-in mt-1 inline-flex shrink-0 items-center justify-center rounded-md px-3 py-1.5 font-mono text-[10px] tracking-stamp uppercase"
              aria-hidden
            >
              Vastgelegd
            </div>
          </div>

          {open ? (
            <div className="mt-8 animate-lift-in glass rounded-2xl p-5 md:p-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-[10px] tracking-stamp uppercase text-emerald-300">
                  Bevinding · {severityLabel(open.severity)}
                </p>
                <p className="font-mono text-[12px] tabular-nums text-emerald-400">
                  {euro(open.savingsMinEur)} – {euro(open.savingsMaxEur)} / jr
                </p>
              </div>
              <h3 className="mt-3 font-display text-xl text-bone md:text-2xl">
                {open.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-bone/70">
                {open.body.slice(0, 280)}
                {open.body.length > 280 ? "…" : ""}
              </p>
              <p className="mt-4 font-mono text-[11px] tracking-mark text-bone/40">
                Volledige uitwerking volgt in het rapport.
              </p>
            </div>
          ) : (
            <div className="mt-8 glass animate-lift-in rounded-2xl p-5 md:p-6">
              <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/45">
                Geen directe bevinding op deze sectie
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-bone/70">
                Op de combinatie die je hier hebt vastgelegd activeert de
                engine geen rode regel. Dat is iets, maar geen alles — het
                volledige dossier weegt mee hoe deze sectie zich tot de
                andere verhoudt.
              </p>
            </div>
          )}

          {sealed.length > 0 ? (
            <div className="mt-4 grid gap-2">
              {sealed.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.015] px-4 py-3"
                >
                  <span
                    aria-hidden
                    className="font-mono text-[10px] tracking-stamp uppercase text-gold-300"
                  >
                    Verzegeld
                  </span>
                  <span className="redact h-3 flex-1" />
                  <span className="font-mono text-[10px] tabular-nums text-bone/35">
                    € ███ – € ███ / jr
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8 rounded-xl border border-white/8 bg-white/[0.015] px-4 py-3">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/45">
                Dossier-totaal in beeld
              </p>
              <p className="font-mono text-[11px] tracking-mark text-bone/40">
                indicatief · jaar
              </p>
            </div>
            <p
              className="mt-1.5 font-mono text-2xl text-emerald-400 tabular-nums"
              style={{ textShadow: "0 0 14px rgba(62,207,148,0.3)" }}
            >
              {euro(totalRange.min)} <span className="text-bone/40">–</span>{" "}
              {euro(totalRange.max)}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-obsidian-900 via-obsidian-900/95 to-transparent px-5 pb-safe pt-6">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-stamp text-bone/40">
            Verder met dossier
          </span>
          <button
            type="button"
            onClick={revealDone}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-[14px] font-medium text-obsidian-900 transition hover:bg-emerald-400"
          >
            Volgende sectie
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
