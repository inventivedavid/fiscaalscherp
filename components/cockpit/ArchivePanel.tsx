"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ARCHIVE_LINKS = [
  { href: "/methodologie", label: "Methodologie" },
  { href: "/kennisbank", label: "Kennisbank" },
  { href: "/benchmarks", label: "Benchmark-cijfers" },
  { href: "/tools", label: "Tools" },
  { href: "/voor", label: "Voor wie" },
  { href: "/prijzen", label: "Prijsstructuur" },
  { href: "/privacy", label: "Privacy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

// Een discreet archief-paneeltje. Geen top-nav, geen footer; bezoekers
// die specifiek iets opzoeken vinden hier de officiële randpagina's.
export function ArchivePanel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Archief openen"
        className="fixed right-3 top-3 z-40 inline-flex items-center gap-2 rounded-full border border-white/10 bg-obsidian-800/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-stamp text-bone/55 backdrop-blur transition hover:border-white/20 hover:text-bone/85"
      >
        <span aria-hidden>≡</span> Archief
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Archief"
          className="fixed inset-0 z-50 flex items-stretch justify-end"
        >
          <button
            type="button"
            aria-label="Archief sluiten"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm"
          />
          <aside className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-obsidian-800 hairline border-l p-6 pt-safe">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/40">
                Archief · randdocumenten
              </p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-stamp text-bone/55 transition hover:text-bone"
              >
                Sluiten
              </button>
            </div>

            <h2 className="mt-6 font-display text-3xl text-bone">Archief</h2>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-bone/55">
              Methodologie, kennisbank en publieke documentatie. Niet nodig om
              je dossier te vullen, wel beschikbaar als je de basis wil
              naslaan.
            </p>

            <ul className="mt-8 space-y-3">
              {ARCHIVE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex items-center justify-between border-b border-white/5 py-2 text-[14px] text-bone/80 transition hover:text-bone"
                    onClick={() => setOpen(false)}
                  >
                    <span>{l.label}</span>
                    <span className="font-mono text-[11px] text-bone/30 transition group-hover:text-emerald-400">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 text-[11px] text-bone/40">
              Klik op het kruisje of druk op <kbd className="font-mono">Esc</kbd> om
              terug te keren naar je dossier.
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
