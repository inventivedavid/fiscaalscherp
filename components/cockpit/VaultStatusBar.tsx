"use client";

// VaultStatusBar — vervangt de oude classified gold-banner.
// Slanke hairline strip bovenin de cockpit met:
//   - een fijn slot-glyph (kluis-symbool)
//   - de dossier-referentie of 'anoniem' indicator
//   - voortgang (II / VI) in mono.
//
// Bewust 28px hoog, géén kleuren, geen overschreeuw — de dial is de show.

import { useCockpit } from "./store";

function SlotGlyph() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="glyph-slot shrink-0"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M8 4.5 L8 6.2 M8 9.8 L8 11.5 M4.5 8 L6.2 8 M9.8 8 L11.5 8"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function VaultStatusBar() {
  const { state, progress } = useCockpit();
  const ref = state.persistedEmail ?? "anoniem";

  return (
    <div
      className={[
        "relative flex h-7 items-center justify-between gap-4 px-4 pt-safe",
        "border-b border-white/[0.05] bg-obsidian-900/80 backdrop-blur",
      ].join(" ")}
    >
      <span className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-stamp text-bone/45">
        <SlotGlyph />
        Kluis · vertrouwelijk
      </span>

      <span className="hidden font-mono text-[10px] tracking-mark text-bone/40 sm:block">
        {ref}
      </span>

      <span className="font-mono text-[10px] tabular-nums tracking-mark text-bone/45">
        {String(progress.sectionsDone).padStart(2, "0")}{" "}
        <span className="text-bone/25">/</span>{" "}
        {String(progress.sectionsTotal).padStart(2, "0")}
      </span>
    </div>
  );
}
