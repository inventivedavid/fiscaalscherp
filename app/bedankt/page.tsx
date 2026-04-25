import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dossier overgedragen",
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
    <div className="min-h-[100dvh] bg-obsidian-900 pt-safe text-bone">
      <div className="classified-banner flex items-center justify-between px-4 py-1.5">
        <span>Vertrouwelijk · Overgedragen</span>
        <span className="font-mono tabular-nums text-bone/55">
          {sp.rid ?? "—"}
        </span>
      </div>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-12 md:px-6 md:pt-20">
        <p className="font-mono text-[10px] tracking-stamp uppercase text-emerald-300">
          Dossier ontvangen · stap voltooid
        </p>
        <h1 className="mt-4 font-display text-display-xl text-bone text-balance">
          Het dossier ligt klaar bij je strateeg.
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-bone/70">
          {findings > 0
            ? `De engine markeerde ${findings} ${findings === 1 ? "bevinding" : "bevindingen"}. Het volledige rapport — met onderbouwing en concrete vervolgvragen — is binnen enkele minuten in je inbox.`
            : "De engine vond geen directe rode regels op de structuur die je hebt vastgelegd. Het rapport bevestigt dit en documenteert de getoetste punten."}
        </p>
        <p className="mt-3 text-[13px] text-bone/55">
          Geen mail binnen tien minuten? Kijk in je spam, of stuur ons een
          bericht via{" "}
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="text-bone underline decoration-emerald-400/60 underline-offset-4 hover:decoration-emerald-400"
          >
            {SITE.contactEmail}
          </a>
          .
        </p>
        {sp.rid ? (
          <p className="mt-2 font-mono text-[11px] tracking-mark text-bone/35 tabular-nums">
            Referentie: {sp.rid}
          </p>
        ) : null}

        <div className="mt-12 grid gap-3 md:grid-cols-2">
          <article className="glass rounded-2xl p-6 md:p-7">
            <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/45">
              01 · Wat nu gebeurt
            </p>
            <h2 className="mt-3 font-display text-2xl text-bone">
              Strateeg neemt het dossier door
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-bone/65">
              Binnen één werkdag krijg je een persoonlijk voorstel voor een
              kennismakingsgesprek van vijftien minuten. Vrijblijvend en
              zonder verkooppraatje.
            </p>
          </article>

          <article className="glass rounded-2xl p-6 md:p-7">
            <p className="font-mono text-[10px] tracking-stamp uppercase text-bone/45">
              02 · Direct inplannen
            </p>
            <h2 className="mt-3 font-display text-2xl text-bone">
              Liever zelf een tijdslot kiezen?
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-bone/65">
              Reserveer direct vijftien minuten op een moment dat schikt.
            </p>
            <a
              href={SITE.calUrl}
              target="_blank"
              rel="noopener"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-[13px] font-medium text-obsidian-900 transition hover:bg-emerald-400"
            >
              Kennismaking inplannen
              <span aria-hidden>→</span>
            </a>
          </article>
        </div>

        <Link
          href="/"
          className="mt-12 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-stamp text-bone/45 transition hover:text-bone"
        >
          ← terug naar dossier
        </Link>
      </main>
    </div>
  );
}
