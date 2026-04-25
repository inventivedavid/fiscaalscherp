import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-obsidian-900 px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-stamp text-gold-300">
        404 · niet gevonden
      </p>
      <h1 className="mt-6 font-display text-display-lg text-bone text-balance">
        Deze pagina bestaat niet in dit dossier.
      </h1>
      <p className="mt-4 max-w-md text-[14px] leading-relaxed text-bone/65">
        De gezochte URL is geen onderdeel van Fiscaalscherp. Vanaf de
        startpagina open je je eigen dossier.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-[13px] font-medium text-obsidian-900 transition hover:bg-emerald-400"
      >
        Terug naar dossier
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
