"use client";

import { Suspense } from "react";
import { CockpitProvider, useCockpit, type State } from "./store";
import { ClassifiedHeader } from "./ClassifiedHeader";
import { DossierSpine } from "./DossierSpine";
import { LiveGauge } from "./LiveGauge";
import { BootSequence } from "./BootSequence";
import { SectionCard } from "./SectionCard";
import { SectionReveal } from "./SectionReveal";
import { PersistDossierGate } from "./PersistDossierGate";
import { DossierFinal } from "./DossierFinal";
import { ActivateGate } from "./ActivateGate";
import { TerminationScreen } from "./TerminationScreen";
import { ArchivePanel } from "./ArchivePanel";

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
  const { state } = useCockpit();

  if (state.phase === "boot") {
    return <BootSequence />;
  }

  if (state.phase === "final") {
    return <DossierFinal />;
  }

  if (state.phase === "activate" || state.phase === "submitted") {
    return <ActivateGate />;
  }

  return (
    <div className="relative min-h-[100dvh]">
      <ClassifiedHeader />

      {/* Op desktop: zijpaneel met dossier-ruggetje + live gauge */}
      <div className="mx-auto max-w-6xl gap-8 px-2 md:grid md:grid-cols-[280px_1fr] md:px-6 md:pt-6">
        <aside className="hidden md:block">
          <div className="sticky top-6 space-y-3">
            <DossierSpine />
            <LiveGauge />
          </div>
        </aside>

        <main className="relative">
          {/* Mobiel: compactte ruggetje + gauge bovenin */}
          <div className="space-y-2 px-3 pt-3 md:hidden">
            <DossierSpine />
            <LiveGauge />
          </div>

          <SectionCard />
        </main>
      </div>

      {state.phase === "reveal" ? <SectionReveal /> : null}
      {state.phase === "persist" ? <PersistDossierGate /> : null}
    </div>
  );
}
