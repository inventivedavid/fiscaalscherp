"use client";

import Link from "next/link";
import { useCockpit } from "./store";
import { SITE } from "@/lib/site";

export function TerminationScreen() {
  const { state, reset } = useCockpit();
  if (!state.terminated) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-obsidian-900 px-6">
      <div className="glass mx-auto max-w-md rounded-2xl p-8 text-center">
        <p className="font-mono text-[10px] tracking-stamp uppercase text-gold-300">
          Dossier afgesloten
        </p>
        <h2 className="mt-3 font-display text-2xl text-bone md:text-3xl">
          {state.terminated.title}
        </h2>
        <p className="mt-4 text-[14px] leading-relaxed text-bone/70">
          {state.terminated.message}
        </p>

        <div className="mt-8 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl bg-emerald-500 px-5 py-3 text-[13px] font-medium text-obsidian-900 transition hover:bg-emerald-400"
          >
            Dossier opnieuw starten
          </button>
          <Link
            href={`mailto:${SITE.contactEmail}`}
            className="rounded-2xl border border-white/10 px-5 py-3 text-[13px] text-bone/80 transition hover:border-white/20 hover:text-bone"
          >
            Stuur een mailtje aan {SITE.brand}
          </Link>
        </div>
      </div>
    </div>
  );
}
