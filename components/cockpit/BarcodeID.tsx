"use client";

// Een puur visuele "barcode" — deterministisch op basis van een seed,
// zodat hetzelfde dossier altijd dezelfde streep-patroon laat zien.

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
}

function pseudoRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export function BarcodeID({
  seed,
  bars = 56,
  className,
}: {
  seed: string;
  bars?: number;
  className?: string;
}) {
  const rnd = pseudoRandom(hashSeed(seed));
  const widths = Array.from({ length: bars }, () => 0.6 + rnd() * 2.2);

  return (
    <div
      className={["flex items-end gap-[2px]", className ?? ""].join(" ")}
      aria-hidden
    >
      {widths.map((w, i) => (
        <span
          key={i}
          style={{
            width: `${w}px`,
            height: i % 11 === 0 ? "100%" : `${60 + (i % 5) * 8}%`,
            background: i % 17 === 0 ? "rgba(229,201,125,0.85)" : "rgba(232,226,212,0.85)",
          }}
        />
      ))}
    </div>
  );
}
