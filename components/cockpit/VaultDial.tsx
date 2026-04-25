"use client";

// VaultDial — de signatuur van het platform.
// Eén ronde, hairline-gegraveerde kluis-dial met VI arcs (één per sectie).
// Voltooide secties etsen een emerald arc; de actieve sectie pulseert subtiel.
// Een fijne pointer wijst de volgende sectie aan en draait per voltooiing 60° verder.
// Centrum: het live geanimeerde bedrag — "Optimalisatie · jaar".
//
// Twee varianten:
//   - desktop / sticky (size = 'lg'): linker rail in de cockpit, ~320px.
//   - hero (size = 'md', interactive): kleiner, anders gelabeld, geen status-rij.
//   - rail-mobile (size = 'rail'): smalle horizontale variant bovenin op telefoon.

import { useEffect, useMemo, useRef, useState } from "react";

type DialProps = {
  /** Hoeveel arcs zijn voltooid (0..6). */
  done: number;
  /** Welke arc-index (0..5) is momenteel actief — pulseert. */
  active?: number | null;
  /** Bedrag-range in centrum. */
  min: number;
  max: number;
  size?: "lg" | "md" | "rail";
  /** Toont 'Optimalisatie · jaar' in het centrum. */
  label?: string;
  /** Tweede regel onder de cijfers. */
  sublabel?: string;
};

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"] as const;
const ARC_GAP_DEG = 6; // visuele scheiding tussen arcs in graden

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function useAnimatedNumber(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/** Describe an SVG arc path between two angles (in deg, 0 = top). */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const toXY = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x1, y1] = toXY(startDeg);
  const [x2, y2] = toXY(endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

/** Kleine compacte rail-variant voor mobiel — horizontale arc-strip + bedrag. */
function VaultDialRail({ done, active, min, max, label }: DialProps) {
  const animatedMin = useAnimatedNumber(min);
  const animatedMax = useAnimatedNumber(max);
  return (
    <div className="brushed ring-hairline relative flex items-center gap-3 rounded-2xl px-3 py-2.5 shadow-engrave">
      <div className="flex items-center gap-1" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => {
          const isDone = i < done;
          const isActive = active === i && !isDone;
          return (
            <span
              key={i}
              className={[
                "h-2 w-6 rounded-full transition-colors duration-500",
                isDone
                  ? "bg-emerald-400"
                  : isActive
                    ? "bg-emerald-400/40 animate-arc-pulse"
                    : "bg-white/8",
              ].join(" ")}
            />
          );
        })}
      </div>
      <div className="ml-auto text-right">
        <p className="font-mono text-[8.5px] uppercase tracking-stamp text-bone/45">
          {label ?? "Optimalisatie · jaar"}
        </p>
        <p
          key={`${animatedMin}-${animatedMax}`}
          className="font-mono text-[12px] tabular-nums text-emerald-400 etch-emerald"
        >
          {euro(animatedMin)} <span className="text-bone/40">–</span>{" "}
          {euro(animatedMax)}
        </p>
      </div>
    </div>
  );
}

export function VaultDial(props: DialProps) {
  const {
    done,
    active = null,
    min,
    max,
    size = "lg",
    label = "Optimalisatie · jaar",
    sublabel,
  } = props;

  if (size === "rail") return <VaultDialRail {...props} />;

  // Geometrie. ViewBox is 200×200, alles relatief zodat we zonder pixels
  // schalen via de SVG-container.
  const RIM_R = 96;
  const ARC_R = 88;
  const NUMERAL_R = 74;
  const POINTER_OUTER = 92;
  const POINTER_INNER = 80;

  const animatedMin = useAnimatedNumber(min);
  const animatedMax = useAnimatedNumber(max);

  // Totaal voltooid → pointer-rotation.
  const pointerDeg = useMemo(() => done * 60, [done]);

  // Per-arc rendering.
  const arcs = useMemo(() => {
    return NUMERALS.map((numeral, i) => {
      const start = i * 60 + ARC_GAP_DEG / 2;
      const end = (i + 1) * 60 - ARC_GAP_DEG / 2;
      const path = describeArc(0, 0, ARC_R, start, end);

      // Numeraal-positie op rand.
      const midDeg = i * 60 + 30;
      const rad = ((midDeg - 90) * Math.PI) / 180;
      const nx = NUMERAL_R * Math.cos(rad);
      const ny = NUMERAL_R * Math.sin(rad);

      const isDone = i < done;
      const isActive = active === i && !isDone;
      return { numeral, path, nx, ny, isDone, isActive, midDeg };
    });
  }, [done, active]);

  const containerSize =
    size === "lg" ? "h-[320px] w-[320px] md:h-[340px] md:w-[340px]" : "h-[260px] w-[260px]";
  const amountClass =
    size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl";

  return (
    <div className={["relative", containerSize].join(" ")}>
      {/* Diepe put-schaduw rond de dial. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full shadow-dialRim animate-dial-breathe"
      />

      <svg
        viewBox="-100 -100 200 200"
        className="relative h-full w-full"
        aria-hidden
      >
        <defs>
          {/* Brushed-metal centrumvlak. */}
          <radialGradient id="vd-center" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="55%" stopColor="rgba(20,22,26,1)" />
            <stop offset="100%" stopColor="rgba(8,9,11,1)" />
          </radialGradient>
          {/* Buitenrand-gradient — lichte top-left, donker rechtsonder. */}
          <linearGradient id="vd-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </linearGradient>
        </defs>

        {/* Outer rim — twee dunne ringen voor depth. */}
        <circle r={RIM_R} fill="none" stroke="url(#vd-rim)" strokeWidth="1" />
        <circle
          r={RIM_R - 4}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />

        {/* Centrumvlak. */}
        <circle r={68} fill="url(#vd-center)" />
        {/* Subtiele inner ring. */}
        <circle
          r={68}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />

        {/* VI arcs. */}
        <g strokeLinecap="round" fill="none">
          {arcs.map((a, i) => (
            <path
              key={`arc-${i}`}
              d={a.path}
              strokeWidth={a.isActive ? 2.4 : 1.6}
              stroke={
                a.isDone
                  ? "rgba(62,207,148,0.85)"
                  : a.isActive
                    ? "rgba(62,207,148,0.55)"
                    : "rgba(255,255,255,0.10)"
              }
              className={a.isActive ? "animate-arc-pulse" : ""}
              style={
                a.isDone
                  ? { filter: "drop-shadow(0 0 6px rgba(62,207,148,0.45))" }
                  : undefined
              }
            />
          ))}
        </g>

        {/* Romeinse cijfers. */}
        <g>
          {arcs.map((a, i) => (
            <text
              key={`n-${i}`}
              x={a.nx}
              y={a.ny}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-display), Georgia, serif"
              fontSize="10"
              fill={
                a.isDone
                  ? "rgba(232,226,212,0.85)"
                  : a.isActive
                    ? "rgba(232,226,212,0.95)"
                    : "rgba(232,226,212,0.35)"
              }
              style={{ letterSpacing: "0.08em" }}
            >
              {a.numeral}
            </text>
          ))}
        </g>

        {/* Pointer — fijne emerald lijn die naar de actieve sectie wijst. */}
        <g
          style={{
            transform: `rotate(${pointerDeg + 30}deg)`,
            transformOrigin: "0 0",
            transition: "transform 0.7s cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <line
            x1="0"
            y1={-POINTER_OUTER}
            x2="0"
            y2={-POINTER_INNER}
            stroke="rgba(62,207,148,0.9)"
            strokeWidth="1.4"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 4px rgba(62,207,148,0.6))" }}
          />
        </g>

        {/* Tikjes op rand — 12 fijne markers, decoratief. */}
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
          {Array.from({ length: 12 }).map((_, i) => {
            const deg = i * 30;
            const rad = ((deg - 90) * Math.PI) / 180;
            const x1 = (RIM_R - 1) * Math.cos(rad);
            const y1 = (RIM_R - 1) * Math.sin(rad);
            const x2 = (RIM_R - 5) * Math.cos(rad);
            const y2 = (RIM_R - 5) * Math.sin(rad);
            return <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
      </svg>

      {/* Centrum-overlay (HTML voor scherpe typografie). */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="font-mono text-[9px] uppercase tracking-stamp text-bone/40">
          {label}
        </p>
        <p
          key={`${animatedMin}-${animatedMax}`}
          className={[
            "mt-1 font-mono tabular-nums text-emerald-400 etch-emerald animate-counter",
            amountClass,
          ].join(" ")}
        >
          {euro(animatedMin)}
        </p>
        <p className="font-mono text-[10px] tabular-nums text-bone/45">
          <span className="text-bone/35">–</span> {euro(animatedMax)}
        </p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-stamp text-bone/35">
          {sublabel ?? `${done.toString().padStart(2, "0")} / 06`}
        </p>
      </div>
    </div>
  );
}
