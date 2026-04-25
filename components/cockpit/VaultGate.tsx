"use client";

// VaultGate — vervangt de oude terminal-boot.
// Een dunne ring traceert in één lijn de cirkel rond, klikt vast,
// splitst dan in zes arcs (één-voor-één geëtst), en in het centrum
// pulseert kort een emerald punt. Daarna verschijnt "Dossier geopend".
// Klikbaar om over te slaan; respecteert prefers-reduced-motion.

import { useEffect, useState } from "react";
import { useCockpit } from "./store";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"] as const;
const ARC_GAP = 6;
const ARC_R = 88;

function describeArc(r: number, startDeg: number, endDeg: number): string {
  const toXY = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [r * Math.cos(rad), r * Math.sin(rad)];
  };
  const [x1, y1] = toXY(startDeg);
  const [x2, y2] = toXY(endDeg);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
}

export function VaultGate() {
  const { bootDone } = useCockpit();
  const [stage, setStage] = useState<"trace" | "split" | "ready">("trace");
  const [arcsLit, setArcsLit] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setStage("ready");
      setArcsLit(6);
      const t = window.setTimeout(bootDone, 500);
      return () => window.clearTimeout(t);
    }

    // Stage 1: ring traceert (~900ms via CSS).
    const splitTimer = window.setTimeout(() => setStage("split"), 950);

    // Stage 2: arcs één-voor-één lichten op (80ms uit elkaar).
    const arcTimers: number[] = [];
    for (let i = 1; i <= 6; i++) {
      arcTimers.push(
        window.setTimeout(() => setArcsLit(i), 950 + 80 + i * 90),
      );
    }

    // Stage 3: ready.
    const readyTimer = window.setTimeout(() => setStage("ready"), 950 + 80 + 6 * 90 + 200);

    // Auto-doorklik na een korte adem.
    const autoTimer = window.setTimeout(bootDone, 950 + 80 + 6 * 90 + 1100);

    return () => {
      window.clearTimeout(splitTimer);
      arcTimers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(readyTimer);
      window.clearTimeout(autoTimer);
    };
  }, [bootDone]);

  // Ring-omtrek voor stroke-dasharray-traceer-effect.
  const circumference = 2 * Math.PI * ARC_R;

  return (
    <div
      className="relative flex h-[100dvh] flex-col items-center justify-center bg-obsidian-900 px-6"
      role="status"
      aria-live="polite"
    >
      {/* Ultra-subtiel vignet rond het centrum. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(62,207,148,0.05), transparent 70%)",
        }}
      />

      <div className="relative h-[320px] w-[320px]">
        <svg
          viewBox="-100 -100 200 200"
          className="h-full w-full"
          aria-hidden
        >
          {/* Trace-ring — verschijnt als één getekende lijn. */}
          {stage === "trace" ? (
            <circle
              r={ARC_R}
              fill="none"
              stroke="rgba(62,207,148,0.7)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              style={{
                animation: "vaultGateTrace 0.95s cubic-bezier(.5,0,.2,1) forwards",
                transform: "rotate(-90deg)",
                filter: "drop-shadow(0 0 6px rgba(62,207,148,0.4))",
              }}
            />
          ) : null}

          {/* Splitsing — VI arcs lichten één voor één op. */}
          {stage !== "trace" ? (
            <g strokeLinecap="round" fill="none">
              {NUMERALS.map((_, i) => {
                const start = i * 60 + ARC_GAP / 2;
                const end = (i + 1) * 60 - ARC_GAP / 2;
                const isLit = i < arcsLit;
                return (
                  <path
                    key={i}
                    d={describeArc(ARC_R, start, end)}
                    stroke={
                      isLit
                        ? "rgba(62,207,148,0.85)"
                        : "rgba(255,255,255,0.08)"
                    }
                    strokeWidth={isLit ? 2 : 1.4}
                    style={
                      isLit
                        ? {
                            filter: "drop-shadow(0 0 5px rgba(62,207,148,0.4))",
                            transition: "stroke 0.3s ease-out",
                          }
                        : undefined
                    }
                  />
                );
              })}
            </g>
          ) : null}

          {/* Romeinse cijfers — verschijnen samen met arcs. */}
          {stage !== "trace" ? (
            <g>
              {NUMERALS.map((numeral, i) => {
                const midDeg = i * 60 + 30;
                const rad = ((midDeg - 90) * Math.PI) / 180;
                const r = 74;
                const x = r * Math.cos(rad);
                const y = r * Math.sin(rad);
                const isLit = i < arcsLit;
                return (
                  <text
                    key={`n-${i}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--font-display), Georgia, serif"
                    fontSize="10"
                    fill={
                      isLit
                        ? "rgba(232,226,212,0.85)"
                        : "rgba(232,226,212,0.2)"
                    }
                    style={{
                      letterSpacing: "0.08em",
                      transition: "fill 0.3s ease-out",
                    }}
                  >
                    {numeral}
                  </text>
                );
              })}
            </g>
          ) : null}

          {/* Centrumpunt — pulseert op 'ready'. */}
          <circle
            r="2.2"
            fill="rgba(62,207,148,0.95)"
            style={{
              filter: "drop-shadow(0 0 6px rgba(62,207,148,0.7))",
              opacity: stage === "trace" ? 0 : 1,
              transition: "opacity 0.3s ease-out",
            }}
          />
        </svg>

        <style>{`
          @keyframes vaultGateTrace {
            0% { stroke-dashoffset: ${circumference}; }
            100% { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <p
          className="font-mono text-[10px] uppercase tracking-stamp text-bone/45 etch"
          style={{
            opacity: stage === "ready" ? 1 : 0.35,
            transition: "opacity 0.5s ease-out 0.1s",
          }}
        >
          {stage === "ready" ? "Dossier geopend" : "Kluis ontgrendelen"}
        </p>

        <button
          type="button"
          onClick={bootDone}
          aria-label="Dossier nu openen"
          className={[
            "font-display text-2xl text-bone transition md:text-3xl",
            "etch hover:text-emerald-300",
          ].join(" ")}
          style={{
            opacity: stage === "ready" ? 1 : 0,
            transform: stage === "ready" ? "translateY(0)" : "translateY(6px)",
            transition: "all 0.5s cubic-bezier(.2,.8,.2,1)",
          }}
        >
          Open dossier <span aria-hidden>→</span>
        </button>

        <p className="mt-1 font-mono text-[9px] uppercase tracking-stamp text-bone/30">
          fiscaalscherp · v2026.1
        </p>
      </div>
    </div>
  );
}
