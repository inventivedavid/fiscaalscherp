"use client";

import { SECTIONS } from "./sections";
import { useCockpit } from "./store";

export function DossierSpine() {
  const { state, currentSectionId } = useCockpit();

  return (
    <nav
      aria-label="Dossier-secties"
      className="glass relative overflow-hidden rounded-2xl px-3 py-3"
    >
      <p className="px-2 font-mono text-[10px] tracking-stamp uppercase text-bone/40">
        Dossier-index
      </p>
      <ol className="mt-2 grid grid-cols-6 gap-1.5 md:grid-cols-1 md:gap-1">
        {SECTIONS.map((s) => {
          const done = state.completedSections.includes(s.id);
          const active = currentSectionId === s.id && !done;
          return (
            <li
              key={s.id}
              className={[
                "relative flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-center md:flex-row md:items-center md:gap-3 md:text-left",
                done
                  ? "bg-gold/[0.06] text-gold-300"
                  : active
                    ? "bg-emerald-400/[0.07] text-emerald-300"
                    : "text-bone/50",
              ].join(" ")}
            >
              <span
                className={[
                  "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-medium tabular-nums",
                  done
                    ? "seal-disc text-gold-100 animate-seal-ring"
                    : active
                      ? "border border-emerald-400/40 bg-emerald-400/[0.07] text-emerald-300"
                      : "border border-white/10 bg-white/[0.02] text-bone/55",
                ].join(" ")}
                aria-hidden
              >
                {done ? "✓" : s.ordinal}
              </span>

              <span className="hidden text-[12px] font-medium leading-tight md:block">
                {s.classified.replace(/^Sectie\s\w+\s·\s/, "")}
              </span>
              <span className="block font-mono text-[9px] uppercase tracking-mark text-bone/40 md:hidden">
                {s.ordinal}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
