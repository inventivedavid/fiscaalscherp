"use client";

// SectionCard — de "Chamber" rechts van de dial.
// Geen kaartrand met afgeronde glass — wel een brushed-metal vlak met een
// hairline aan top/right/bottom; de linker-flank is open richting de dial,
// zodat het visueel aan de kluis vasthangt.
//
// Romeins cijfer in groot, gegraveerde serif boven de vraag.
// Optierijen zijn hairline-rijen met emerald spoor links bij selectie.

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
      key={currentQuestion.key}
      aria-labelledby={`q-${currentQuestion.key}`}
      className={[
        "relative mx-auto flex h-full w-full max-w-2xl flex-col px-5 pb-32 pt-6 md:px-8 md:pb-12 md:pt-10",
        "brushed ring-hairline-open-l shadow-engrave md:rounded-r-2xl md:rounded-l-none",
        "animate-chamber-open",
      ].join(" ")}
    >
      {/* Sectie-kop: groot Romeins cijfer + sectietitel naast de teller */}
      <div className="mb-6 flex items-baseline gap-4">
        <span
          aria-hidden
          className="font-display text-4xl leading-none text-emerald-300/90 etch-emerald md:text-5xl"
          style={{ letterSpacing: "0.04em" }}
        >
          {section.ordinal}
        </span>
        <div className="flex flex-1 flex-col">
          <span className="font-mono text-[10px] uppercase tracking-stamp text-bone/45">
            Sectie · {section.classified.replace(/^Sectie\s\w+\s·\s/, "")}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-mark text-bone/30">
            {blockTitle.toLowerCase()} · vraag {indexInSection.cur} / {indexInSection.total}
          </span>
        </div>
      </div>

      {/* Framing-regel — niet-vergelijkend, eerste persoon */}
      <p className="mb-6 max-w-xl text-[13px] leading-relaxed text-bone/55">
        {framing}
      </p>

      <h2
        id={`q-${currentQuestion.key}`}
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-3xl text-bone outline-none etch md:text-[2.5rem] md:leading-[1.05]"
      >
        {currentQuestion.label}
      </h2>
      {currentQuestion.help ? (
        <p className="mt-3 max-w-xl text-[14px] text-bone/55">
          {currentQuestion.help}
        </p>
      ) : null}

      {/* Optierijen — hairline rows, emerald spoor links bij selectie. */}
      <div className="mt-8 flex flex-col">
        {currentQuestion.options.map((opt, i) => {
          const id = `${currentQuestion.key}-${opt.value}`;
          const checked = value === opt.value;
          const isFirst = i === 0;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={[
                "group relative flex cursor-pointer items-start gap-4 px-2 py-4 text-left transition-colors",
                isFirst ? "border-t border-white/[0.06]" : "",
                "border-b border-white/[0.06]",
                checked
                  ? "bg-emerald-400/[0.04]"
                  : "hover:bg-white/[0.02]",
              ].join(" ")}
            >
              {/* Emerald spoor links als 'checked'-indicator. */}
              <span
                aria-hidden
                className={[
                  "absolute left-0 top-0 h-full w-[2px] transition-all",
                  checked
                    ? "bg-emerald-400 shadow-[0_0_10px_rgba(62,207,148,0.5)]"
                    : "bg-transparent group-hover:bg-white/10",
                ].join(" ")}
              />

              <input
                id={id}
                type="radio"
                name={currentQuestion.key}
                value={opt.value}
                checked={checked}
                onChange={(e) => setAnswer(currentQuestion.key, e.target.value)}
                className="sr-only"
              />

              {/* Mini cirkel-indicator. */}
              <span
                aria-hidden
                className={[
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
                  checked
                    ? "border-emerald-400 bg-emerald-400/20"
                    : "border-white/15 bg-transparent group-hover:border-white/35",
                ].join(" ")}
              >
                {checked ? (
                  <span className="block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ) : null}
              </span>

              <span className="flex-1">
                <span
                  className={[
                    "block text-[15px] leading-snug",
                    checked
                      ? "font-medium text-bone etch"
                      : "text-bone/85",
                  ].join(" ")}
                >
                  {opt.label}
                </span>
                {opt.hint ? (
                  <span className="mt-1 block text-[12px] text-bone/40">
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

      {/* Navigatie — desktop inline, mobiel sticky bottom */}
      <div className="mt-10 hidden items-center justify-between md:flex">
        {state.questionIndex > 0 ? (
          <button
            type="button"
            onClick={back}
            className="font-mono text-[11px] uppercase tracking-stamp text-bone/40 transition hover:text-bone"
          >
            ← vorige
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleAdvance}
          className={[
            "group inline-flex items-center gap-3 rounded-full border px-7 py-3 text-[13px] font-medium transition",
            "border-emerald-400/60 bg-emerald-400/[0.08] text-emerald-200",
            "hover:border-emerald-400 hover:bg-emerald-400/[0.14] hover:text-bone",
            "shadow-[0_0_24px_-12px_rgba(62,207,148,0.6)]",
          ].join(" ")}
        >
          <span className="font-mono text-[9px] uppercase tracking-stamp text-emerald-400/70">
            etch
          </span>
          Vastleggen
          <span aria-hidden className="transition group-hover:translate-x-0.5">
            →
          </span>
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
      <div className="brushed border-t border-white/[0.06] px-5 pb-safe pt-4 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.7)]">
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
            "flex w-full items-center justify-center gap-3 rounded-2xl border py-4 text-[15px] font-medium transition",
            canAdvance
              ? "border-emerald-400/60 bg-emerald-400/[0.10] text-bone shadow-[0_0_30px_-12px_rgba(62,207,148,0.6)] active:scale-[0.99]"
              : "border-white/10 bg-white/[0.02] text-bone/35",
          ].join(" ")}
        >
          {canAdvance ? (
            <>
              <span className="font-mono text-[9px] uppercase tracking-stamp text-emerald-400/70">
                etch
              </span>
              Vastleggen
              <span aria-hidden>→</span>
            </>
          ) : (
            "Kies een optie"
          )}
        </button>
        <p className="mt-2 text-center font-mono text-[8.5px] uppercase tracking-stamp text-bone/30">
          Vastleggen tikt de dial één arc verder
        </p>
      </div>
    </div>
  );
}
