"use client";

// ChamberReveal — vervangt de oude full-screen reveal met scan-grid + stempel.
// Een drawer schuift open uit de dial: brushed achtergrond, gegraveerde
// romeinse ets, kleine wax-glyph als 'vastgelegd'-marker, en lock-glyphs
// voor verzegelde bevindingen (geen redact-balken meer).

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

function WaxGlyph() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="wax-rad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="rgba(62,207,148,0.55)" />
          <stop offset="60%" stopColor="rgba(62,207,148,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#wax-rad)" />
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="rgba(62,207,148,0.55)"
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="12" cy="12" r="5" stroke="rgba(62,207,148,0.4)" strokeWidth="0.6" fill="none" />
      <path
        d="M9.5 12 L11.2 13.7 L14.7 10.2"
        stroke="rgba(232,226,212,0.85)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function LockGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0 text-bone/35"
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
      {/* Slim status-strip blijft consistent met de cockpit. */}
      <div className="flex h-7 items-center justify-between border-b border-white/[0.05] bg-obsidian-900/80 px-4 font-mono text-[9.5px] uppercase tracking-stamp text-bone/45 backdrop-blur">
        <span>Kluis · arc geëtst</span>
        <span className="font-mono tabular-nums text-bone/45">
          {section.ordinal} / VI
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-start overflow-y-auto px-5 pb-32 pt-12 md:pt-20">
        {/* Subtiel emerald glow op centrum — geen scan-grid. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(40% 40% at 50% 30%, rgba(62,207,148,0.06), transparent 70%)",
          }}
        />

        <div className="relative w-full max-w-xl animate-chamber-open">
          {/* Gegraveerde sectie-kop. */}
          <div className="flex items-baseline gap-4">
            <span
              className="font-display text-5xl leading-none text-emerald-300/95 etch-emerald md:text-6xl"
              style={{ letterSpacing: "0.04em" }}
              aria-hidden
            >
              {section.ordinal}
            </span>
            <div className="flex flex-1 items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-stamp text-bone/45">
                  Vastgelegd · arc geëtst
                </p>
                <h2 className="mt-1 font-display text-2xl text-bone etch md:text-4xl">
                  {section.title}
                </h2>
              </div>
              <WaxGlyph />
            </div>
          </div>

          {open ? (
            <div
              className="brushed-deep ring-hairline mt-8 rounded-2xl p-5 shadow-engrave md:p-6"
              style={{ animation: "chamberOpen 0.7s 0.15s cubic-bezier(.2,.8,.2,1) both" }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-stamp text-emerald-300">
                  Bevinding · {severityLabel(open.severity)}
                </p>
                <p className="font-mono text-[12px] tabular-nums text-emerald-400 etch-emerald">
                  {euro(open.savingsMinEur)} – {euro(open.savingsMaxEur)} / jr
                </p>
              </div>
              <h3 className="mt-3 font-display text-xl text-bone etch md:text-2xl">
                {open.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-bone/65">
                {open.body.slice(0, 280)}
                {open.body.length > 280 ? "…" : ""}
              </p>
              <p className="mt-4 font-mono text-[10.5px] uppercase tracking-stamp text-bone/35">
                Volledige uitwerking volgt in het rapport.
              </p>
            </div>
          ) : (
            <div
              className="brushed-deep ring-hairline mt-8 rounded-2xl p-5 shadow-engrave md:p-6"
              style={{ animation: "chamberOpen 0.7s 0.15s cubic-bezier(.2,.8,.2,1) both" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-stamp text-bone/45">
                Geen directe bevinding op deze sectie
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-bone/65">
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
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3"
                >
                  <LockGlyph />
                  <span
                    aria-hidden
                    className="font-mono text-[10px] uppercase tracking-stamp text-bone/45"
                  >
                    Verzegeld
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 bg-gradient-to-r from-white/15 via-white/5 to-transparent"
                  />
                  <span className="font-mono text-[10px] tabular-nums text-bone/35">
                    € ███ – € ███ / jr
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="brushed mt-8 rounded-xl px-4 py-3 ring-hairline">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10px] uppercase tracking-stamp text-bone/45">
                Dossier-totaal in beeld
              </p>
              <p className="font-mono text-[10px] tracking-mark text-bone/35">
                indicatief · jaar
              </p>
            </div>
            <p className="mt-1.5 font-mono text-2xl tabular-nums text-emerald-400 etch-emerald">
              {euro(totalRange.min)} <span className="text-bone/40">–</span>{" "}
              {euro(totalRange.max)}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA. */}
      <div className="brushed fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] px-5 pb-safe pt-5 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.7)]">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-stamp text-bone/40">
            Volgende arc · sectie wacht
          </span>
          <button
            type="button"
            onClick={revealDone}
            className={[
              "group inline-flex items-center gap-3 rounded-2xl border px-6 py-3.5 text-[14px] font-medium transition",
              "border-emerald-400/60 bg-emerald-400/[0.10] text-bone",
              "hover:border-emerald-400 hover:bg-emerald-400/[0.16]",
              "shadow-[0_0_30px_-12px_rgba(62,207,148,0.6)]",
            ].join(" ")}
          >
            Volgende sectie
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
