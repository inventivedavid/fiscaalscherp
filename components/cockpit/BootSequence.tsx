"use client";

import { useEffect, useState } from "react";
import { useCockpit } from "./store";

const LINES = [
  "» init fiscaalscherp.engine",
  "» laden: IB · VPB · DGA-regelingen 2026",
  "» kader: vertrouwelijk dossier — enkel voor ingelogde DGA",
  "» dossier wordt aangemaakt …",
];

export function BootSequence() {
  const { bootDone } = useCockpit();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setShown(LINES.length);
      const t = window.setTimeout(bootDone, 200);
      return () => window.clearTimeout(t);
    }

    const interval = window.setInterval(() => {
      setShown((s) => {
        if (s >= LINES.length) {
          window.clearInterval(interval);
          window.setTimeout(bootDone, 280);
          return s;
        }
        return s + 1;
      });
    }, 320);

    return () => window.clearInterval(interval);
  }, [bootDone]);

  return (
    <div
      className="relative flex h-[100dvh] flex-col items-center justify-center bg-obsidian-900 px-6 text-bone"
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-x-0 top-0 classified-banner py-1.5 text-center">
        Vertrouwelijk · Fiscaal dossier · In opbouw
      </div>

      <div className="absolute inset-0 -z-10 bg-scan-grid opacity-[0.2]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -z-10 h-px bg-emerald-glow/50 animate-scan-drift"
        style={{ boxShadow: "0 0 40px 6px rgba(62,207,148,0.18)" }}
      />

      <div className="w-full max-w-md">
        <p className="mb-6 font-mono text-[10px] tracking-stamp text-bone/40">
          fiscaalscherp · v2026.1
        </p>
        <div className="space-y-2 font-mono text-sm leading-relaxed text-bone/85">
          {LINES.slice(0, shown).map((line) => (
            <div key={line} className="animate-boot-reveal">
              {line}
            </div>
          ))}
          {shown < LINES.length ? (
            <div className="text-emerald-400">
              <span className="animate-boot-cursor">▍</span>
            </div>
          ) : (
            <div className="pt-2 text-emerald-400">» gereed.</div>
          )}
        </div>

        <button
          type="button"
          onClick={bootDone}
          className="mt-12 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-stamp text-bone/45 transition hover:text-bone/80"
        >
          dossier nu openen ↵
        </button>
      </div>
    </div>
  );
}
