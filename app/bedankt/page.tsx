import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bedankt — uw rapport is onderweg",
  robots: { index: false, follow: false },
};

export default async function BedanktPage({
  searchParams,
}: {
  searchParams: Promise<{ rid?: string; n?: string }>;
}) {
  const sp = await searchParams;
  const findings = Number(sp.n ?? "0");

  return (
    <div className="min-h-dvh bg-ink-900 text-white">
      <div className="bg-noise absolute inset-0 -z-10" />
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          className="mb-6"
          aria-hidden="true"
        >
          <circle cx="36" cy="36" r="34" stroke="#d68f27" strokeWidth="2" fill="none" />
          <path
            d="M22 36 L32 46 L52 26"
            stroke="#d68f27"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        <p className="text-sm font-bold uppercase tracking-widest text-gold-400">
          Bedankt
        </p>
        <h1 className="mt-3 text-balance text-4xl font-bold md:text-5xl">
          Uw rapport is onderweg naar uw mailbox
        </h1>
        <p className="mt-6 text-lg text-white/80">
          We hebben {findings > 0 ? findings : ""} {findings === 1 ? "bevinding" : "bevindingen"}
          {findings > 0 ? " verwerkt in uw persoonlijke PDF-rapport" : " opgesteld in uw persoonlijke PDF"}. Het zou binnen enkele minuten bij u moeten zijn.
          Geen mail ontvangen? Check uw spam-folder of laat het ons weten.
        </p>
        {sp.rid ? (
          <p className="mt-3 text-sm text-white/50">
            Referentie: <span className="font-mono text-white/70">{sp.rid}</span>
          </p>
        ) : null}

        <div className="mt-10 w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 text-left">
          <h2 className="text-lg font-semibold">Volgende stap (optioneel)</h2>
          <p className="mt-2 text-sm text-white/70">
            Wilt u de bevindingen samen doornemen? Plan vrijblijvend een gesprek
            van 30 minuten. Geen verkooppraatje — we lopen het rapport met u door.
          </p>
          <a
            href={SITE.calUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-3 text-sm font-semibold text-ink-900 transition hover:bg-gold-400"
          >
            Plan gratis gesprek →
          </a>
        </div>

        <Link
          href="/"
          className="mt-10 text-sm text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white"
        >
          ← Terug naar home
        </Link>
      </div>
    </div>
  );
}
