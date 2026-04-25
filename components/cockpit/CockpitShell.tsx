"use client";

import { Suspense } from "react";
import { CockpitProvider, useCockpit, type State } from "./store";
import { VaultStatusBar } from "./VaultStatusBar";
import { VaultDial } from "./VaultDial";
import { VaultGate } from "./VaultGate";
import { SectionCard } from "./SectionCard";
import { SectionReveal } from "./SectionReveal";
import { PersistDossierGate } from "./PersistDossierGate";
import { DossierFinal } from "./DossierFinal";
import { ActivateGate } from "./ActivateGate";
import { TerminationScreen } from "./TerminationScreen";
import { ArchivePanel } from "./ArchivePanel";
import { SECTIONS } from "./sections";

export function CockpitShell({
  initialState,
}: {
  initialState?: Partial<State>;
}) {
  return (
    <CockpitProvider initial={initialState}>
      <ArchivePanel />
      <Suspense fallback={null}>
        <CockpitInner />
      </Suspense>
      <TerminationScreen />
    </CockpitProvider>
  );
}

function CockpitInner() {
  const { state, currentSectionId, totalRange, progress } = useCockpit();

  if (state.phase === "boot") {
    return <VaultGate />;
  }

  if (state.phase === "final") {
    return <DossierFinal />;
  }

  if (state.phase === "activate" || state.phase === "submitted") {
    return <ActivateGate />;
  }

  const activeIndex = currentSectionId
    ? SECTIONS.findIndex((s) => s.id === currentSectionId)
    : null;

  return (
    <div className="relative min-h-[100dvh]">
      <VaultStatusBar />

      {/* Subtiel vignet-licht achter de dial — geen scan-grid meer. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]"
        style={{
          background:
            "radial-gradient(40% 60% at 22% 30%, rgba(62,207,148,0.05), transparent 70%)",
        }}
      />

      {/* Layout: dial sticky links (desktop), chamber rechts. */}
      <div className="mx-auto max-w-6xl gap-10 px-2 md:grid md:grid-cols-[360px_1fr] md:px-6 md:pt-10">
        <aside className="hidden md:block">
          <div className="sticky top-10 flex flex-col items-center gap-4">
            <VaultDial
              done={progress.sectionsDone}
              active={activeIndex}
              min={totalRange.min}
              max={totalRange.max}
              size="lg"
            />
            <p className="max-w-[280px] text-center font-mono text-[10px] uppercase tracking-stamp text-bone/35">
              Elke sectie etst één arc.
              <br />
              Voltooid · {String(progress.sectionsDone).padStart(2, "0")} / 06
            </p>
          </div>
        </aside>

        <main className="relative">
          {/* Mobiele rail-variant van de dial. */}
          <div className="px-3 pt-3 md:hidden">
            <VaultDial
              done={progress.sectionsDone}
              active={activeIndex}
              min={totalRange.min}
              max={totalRange.max}
              size="rail"
            />
          </div>

          <SectionCard />
        </main>
      </div>

      {state.phase === "reveal" ? <SectionReveal /> : null}
      {state.phase === "persist" ? <PersistDossierGate /> : null}
    </div>
  );
}
