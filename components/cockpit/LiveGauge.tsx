"use client";

import { useEffect, useRef, useState } from "react";
import { useCockpit } from "./store";

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

export function LiveGauge({ compact = false }: { compact?: boolean }) {
  const { totalRange, progress, state } = useCockpit();
  const isWarmedUp = Object.keys(state.answers).length > 0;
  const min = useAnimatedNumber(isWarmedUp ? totalRange.min : 0);
  const max = useAnimatedNumber(isWarmedUp ? totalRange.max : 0);

  if (compact) {
    return (
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-mark text-bone/65">
        <span className="text-bone/40">Optimalisatie</span>
        <span className="tabular-nums text-emerald-400">
          {euro(min)} – {euro(max)}
        </span>
      </div>
    );
  }

  return (
    <div className="glass relative overflow-hidden rounded-2xl px-5 py-4">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/45">
          Optimalisatieruimte in beeld
        </p>
        <p className="font-mono text-[10px] tracking-mark text-bone/40 tabular-nums">
          dossier {Math.round(progress.pct)}%
        </p>
      </div>
      <p
        key={`${min}-${max}`}
        className="mt-2 font-mono text-2xl text-emerald-400 tabular-nums animate-counter md:text-3xl"
        style={{ textShadow: "0 0 18px rgba(62,207,148,0.35)" }}
      >
        {euro(min)} <span className="text-bone/40">–</span> {euro(max)}
      </p>
      <p className="mt-2 text-[12px] leading-snug text-bone/55">
        {isWarmedUp
          ? "Indicatieve jaarbasis op basis van wat je tot nu toe hebt vastgelegd."
          : "De teller start zodra je eerste antwoord is vastgelegd."}
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent"
      />
    </div>
  );
}
