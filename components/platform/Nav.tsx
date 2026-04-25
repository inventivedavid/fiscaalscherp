"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/lib/site";

const PRIMARY = [
  { label: "Scan", href: "/scan" },
  { label: "Tools", href: "/tools" },
  { label: "Benchmarks", href: "/benchmarks" },
  { label: "Kennisbank", href: "/kennisbank" },
  { label: "Prijzen", href: "/prijzen" },
];

export function Nav({ variant = "light" }: { variant?: "light" | "transparent" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const wrapperClass =
    variant === "transparent"
      ? "absolute inset-x-0 top-0 z-30"
      : "sticky top-0 z-30 bg-canvas/85 backdrop-blur-md hairline-b";

  return (
    <header className={wrapperClass}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          aria-label={`${SITE.brand} home`}
          className="flex items-center gap-2.5 text-ink"
        >
          <LogoMark />
          <span className="font-display text-xl tracking-tight">
            {SITE.brand}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 md:flex">
          {PRIMARY.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "text-sm transition",
                    active ? "text-ink" : "text-ink-muted hover:text-ink",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-full border border-emerald-400/50 bg-emerald-400/[0.08] px-5 py-2 text-sm text-bone transition hover:border-emerald-400 hover:bg-emerald-400/[0.14] shadow-[0_0_24px_-12px_rgba(62,207,148,0.6)]"
          >
            <span className="font-mono text-[9px] uppercase tracking-stamp text-emerald-400/70">
              ↳
            </span>
            Open dossier
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="hairline-t bg-canvas md:hidden">
          <ul className="mx-auto max-w-6xl px-6 py-4">
            {PRIMARY.map((item) => (
              <li key={item.href} className="border-b border-line last:border-0">
                <Link
                  href={item.href}
                  className="block py-3 text-sm text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-400/[0.10] px-5 py-3 text-sm text-bone shadow-[0_0_24px_-12px_rgba(62,207,148,0.6)]"
                onClick={() => setOpen(false)}
              >
                Open dossier <span aria-hidden>→</span>
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}

// LogoMark — micro-VaultDial-glyph. Match met de dial in de hero/cockpit:
// een hairline ring met VI fijne tikjes en één emerald arc als 'eerste ets'.
function LogoMark() {
  const ARCS = 6;
  const arcGap = 12; // graden
  return (
    <svg
      width="28"
      height="28"
      viewBox="-14 -14 28 28"
      fill="none"
      aria-hidden="true"
    >
      <circle r="11" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1" />
      <circle r="9" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />

      {/* VI arcs — een hint van de dial. */}
      <g strokeLinecap="round" fill="none">
        {Array.from({ length: ARCS }).map((_, i) => {
          const start = i * 60 + arcGap / 2 - 90;
          const end = (i + 1) * 60 - arcGap / 2 - 90;
          const r = 10;
          const sx = r * Math.cos((start * Math.PI) / 180);
          const sy = r * Math.sin((start * Math.PI) / 180);
          const ex = r * Math.cos((end * Math.PI) / 180);
          const ey = r * Math.sin((end * Math.PI) / 180);
          const isLit = i === 0;
          return (
            <path
              key={i}
              d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
              stroke={isLit ? "#3ecf94" : "currentColor"}
              strokeOpacity={isLit ? 1 : 0.35}
              strokeWidth={isLit ? 1.6 : 1}
            />
          );
        })}
      </g>

      {/* Centrumpunt. */}
      <circle r="1.4" fill="#3ecf94" />
    </svg>
  );
}
