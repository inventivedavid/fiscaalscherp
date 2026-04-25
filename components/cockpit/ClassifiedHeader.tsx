"use client";

import { useCockpit } from "./store";

export function ClassifiedHeader() {
  const { state, progress } = useCockpit();
  const ref = state.persistedEmail
    ? `dossier · ${state.persistedEmail}`
    : "dossier · anoniem";

  return (
    <div className="classified-banner flex items-center justify-between gap-4 px-4 py-1.5 pt-safe text-[10px]">
      <span className="truncate">Vertrouwelijk</span>
      <span className="hidden font-mono tracking-mark text-bone/55 sm:block">
        {ref}
      </span>
      <span className="font-mono tabular-nums text-bone/55">
        {progress.sectionsDone}/{progress.sectionsTotal}
      </span>
    </div>
  );
}
