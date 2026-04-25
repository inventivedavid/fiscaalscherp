"use client";

import { useEffect, useRef, useState } from "react";
import { useCockpit } from "./store";
import { findSectionById } from "./sections";
import { BLOCKS, type QuestionBase } from "@/lib/questions";

export function SectionCard() {
  const {
    currentQuestion,
    currentSectionId,
    state,
    setAnswer,
    advance,
    back,
    visibleQuestionList,
  } = useCockpit();

  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    setError(null);
  }, [state.questionIndex]);

  if (!currentQuestion || !currentSectionId) return null;

  const section = findSectionById(currentSectionId);
  const framing =
    section.framingByKey[currentQuestion.key] ?? section.brief;

  const blockTitle = BLOCKS.find((b) => b.id === currentQuestion.block)?.title ?? "";
  const value = state.answers[currentQuestion.key] ?? "";
  const indexInSection = computeIndexInSection(visibleQuestionList, state.questionIndex);

  function handleAdvance() {
    if (!value) {
      setError("Kies een optie om verder te gaan.");
      return;
    }
    advance();
  }

  return (
    <section
      aria-labelledby={`q-${currentQuestion.key}`}
      className="relative mx-auto flex h-full w-full max-w-2xl flex-col px-5 pb-32 pt-6 md:px-6 md:pb-12 md:pt-10"
    >
      {/* Sectie-kop */}
      <div className="mb-5 flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-stamp uppercase text-gold-300">
          {section.classified}
        </span>
        <span className="hidden font-mono text-[10px] tracking-mark text-bone/35 md:inline">
          · {blockTitle.toLowerCase()}
        </span>
      </div>

      {/* Framing line — niet-vergelijkend, eerste persoon */}
      <p className="mb-5 max-w-xl text-[13px] leading-relaxed text-bone/60">
        {framing}
      </p>

      <h2
        id={`q-${currentQuestion.key}`}
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-3xl text-bone outline-none md:text-4xl"
      >
        {currentQuestion.label}
      </h2>
      {currentQuestion.help ? (
        <p className="mt-3 max-w-xl text-[14px] text-bone/60">
          {currentQuestion.help}
        </p>
      ) : null}

      <div className="mt-7 grid gap-2.5">
        {currentQuestion.options.map((opt) => {
          const id = `${currentQuestion.key}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={[
                "group relative flex cursor-pointer items-start gap-4 rounded-xl border px-4 py-3.5 text-left transition",
                checked
                  ? "border-emerald-400/60 bg-emerald-400/[0.08] shadow-emeraldGlow"
                  : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <input
                id={id}
                type="radio"
                name={currentQuestion.key}
                value={opt.value}
                checked={checked}
                onChange={(e) => setAnswer(currentQuestion.key, e.target.value)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
                  checked
                    ? "border-emerald-400 bg-emerald-400/30"
                    : "border-white/20 bg-transparent group-hover:border-white/40",
                ].join(" ")}
              >
                {checked ? (
                  <span className="block h-2 w-2 rounded-full bg-emerald-400" />
                ) : null}
              </span>
              <span className="flex-1">
                <span
                  className={[
                    "block text-[15px] font-medium leading-snug",
                    checked ? "text-bone" : "text-bone/85",
                  ].join(" ")}
                >
                  {opt.label}
                </span>
                {opt.hint ? (
                  <span className="mt-1 block text-[12px] text-bone/45">
                    {opt.hint}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {error ? (
        <p
          className="mt-4 font-mono text-[11px] tracking-mark text-gold-300"
          role="alert"
        >
          ⚠ {error}
        </p>
      ) : null}

      {/* Navigatie — desktop inline, mobiel zit primaire CTA in CockpitShell footer */}
      <div className="mt-10 hidden items-center justify-between md:flex">
        {state.questionIndex > 0 ? (
          <button
            type="button"
            onClick={back}
            className="font-mono text-[11px] uppercase tracking-stamp text-bone/45 transition hover:text-bone"
          >
            ← vorige
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleAdvance}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3 text-[13px] font-medium text-obsidian-900 transition hover:bg-emerald-400"
        >
          Vastleggen
          <span aria-hidden>→</span>
        </button>
      </div>

      <CockpitFooterMobile
        canAdvance={Boolean(value)}
        onAdvance={handleAdvance}
        onBack={state.questionIndex > 0 ? back : undefined}
        progressLabel={`Sectie ${section.ordinal} · vraag ${indexInSection.cur} / ${indexInSection.total}`}
      />
    </section>
  );
}

function computeIndexInSection(
  list: QuestionBase[],
  globalIndex: number,
): { cur: number; total: number } {
  const cur = list[globalIndex];
  if (!cur) return { cur: 0, total: 0 };
  const inBlock = list.filter((q) => q.block === cur.block);
  const idx = inBlock.findIndex((q) => q.key === cur.key);
  return { cur: idx + 1, total: inBlock.length };
}

// Mobiel-only sticky bottom bar — duim-zone CTA + minimale terug-link.
function CockpitFooterMobile({
  canAdvance,
  onAdvance,
  onBack,
  progressLabel,
}: {
  canAdvance: boolean;
  onAdvance: () => void;
  onBack?: () => void;
  progressLabel: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 md:hidden">
      <div className="bg-gradient-to-t from-obsidian-900 via-obsidian-900/95 to-transparent px-5 pb-safe pt-6">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-stamp text-bone/40">
          <span>{progressLabel}</span>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="text-bone/55 hover:text-bone"
            >
              ← vorige
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onAdvance}
          disabled={!canAdvance}
          className={[
            "flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-medium transition",
            canAdvance
              ? "bg-emerald-500 text-obsidian-900 active:scale-[0.99]"
              : "border border-white/10 bg-white/[0.02] text-bone/35",
          ].join(" ")}
        >
          {canAdvance ? "Vastleggen" : "Kies een optie"}
          {canAdvance ? <span aria-hidden>→</span> : null}
        </button>
      </div>
    </div>
  );
}
