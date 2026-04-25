"use client";

import { useState } from "react";
import { useCockpit } from "./store";

export function PersistDossierGate() {
  const { state, persistSaved, persistDeclined, totalRange, progress } =
    useCockpit();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/dossier/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          answers: state.answers,
          completedSections: state.completedSections,
          questionIndex: state.questionIndex,
          totalRange,
          progressPct: progress.pct,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setError(
          json?.error ??
            "Het bewaren lukte niet. Probeer het opnieuw of sla deze stap over.",
        );
        setSubmitting(false);
        return;
      }
      persistSaved(email.trim());
    } catch {
      setError("Netwerkfout. Probeer het opnieuw of sla deze stap over.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-obsidian-900 pt-safe">
      <div className="classified-banner flex items-center justify-between px-4 py-1.5">
        <span>Vertrouwelijk</span>
        <span className="font-mono tabular-nums text-bone/55">tussenstap</span>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-5 pb-12 pt-12 md:pt-20">
        <div className="w-full max-w-md">
          <p className="font-mono text-[10px] tracking-stamp uppercase text-gold-300">
            Dossier · bewaar punt
          </p>
          <h2 className="mt-3 font-display text-3xl text-bone md:text-4xl">
            Dit dossier bestaat nu alleen in dit venster.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-bone/65">
            Je hebt twee secties vastgelegd. Sluit je dit tabblad zonder e-mail
            achter te laten, dan begint het dossier morgen weer leeg. Geef je
            e-mail en we leggen hem op je naam vast — je ontvangt een privé
            link waarmee je later op elk apparaat verder gaat.
          </p>

          <form onSubmit={handleSave} className="mt-7 space-y-3">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] tracking-stamp uppercase text-bone/45">
                E-mailadres
              </span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="je@bedrijf.nl"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] text-bone placeholder:text-bone/30 focus:border-emerald-400 focus:outline-none"
                required
              />
            </label>

            {error ? (
              <p
                role="alert"
                className="font-mono text-[11px] tracking-mark text-gold-300"
              >
                ⚠ {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-[15px] font-medium text-obsidian-900 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {submitting
                ? "Dossier wordt vastgelegd…"
                : "Bewaar dossier op mijn naam"}
              {!submitting ? <span aria-hidden>→</span> : null}
            </button>
          </form>

          <button
            type="button"
            onClick={persistDeclined}
            disabled={submitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-stamp text-bone/45 transition hover:text-bone/80"
          >
            zonder bewaren verder gaan ↵
          </button>

          <p className="mt-8 border-t border-white/5 pt-5 text-[11px] leading-relaxed text-bone/40">
            We gebruiken je e-mail uitsluitend om je dossier vast te leggen en
            de link te sturen. Geen marketing, geen doorverkoop, één klik
            uitschrijven uit alles.
          </p>
        </div>
      </div>
    </div>
  );
}
