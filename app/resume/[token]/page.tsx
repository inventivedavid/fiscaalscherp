import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { CockpitShell } from "@/components/cockpit/CockpitShell";
import { verifyDossierToken } from "@/lib/dossierToken";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Dossier hervatten",
  robots: { index: false, follow: false },
};

export default async function ResumePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const decoded = verifyDossierToken(decodeURIComponent(token));

  if (!decoded) {
    return <ExpiredScreen />;
  }

  return (
    <Suspense fallback={null}>
      <CockpitShell
        initialState={{
          phase: "section",
          questionIndex: decoded.questionIndex,
          answers: decoded.answers,
          completedSections: decoded.completedSections,
          persisted: true,
          persistedEmail: decoded.email,
          persistDeclined: true,
          resumeToken: token,
        }}
      />
    </Suspense>
  );
}

function ExpiredScreen() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-obsidian-900 px-6">
      <div className="glass mx-auto max-w-md rounded-2xl p-8 text-center">
        <p className="font-mono text-[10px] tracking-stamp uppercase text-gold-300">
          Hervat-link niet geldig
        </p>
        <h2 className="mt-3 font-display text-2xl text-bone md:text-3xl">
          Deze link werkt niet meer.
        </h2>
        <p className="mt-4 text-[14px] leading-relaxed text-bone/70">
          De link is verlopen, gewijzigd of nooit door ons uitgegeven.
          Je kunt een nieuw dossier starten — het duurt minder dan vijf
          minuten en je antwoorden van eerder zijn alleen bij jou bekend
          gebleven.
        </p>
        <div className="mt-8 flex flex-col gap-2.5">
          <Link
            href="/"
            className="rounded-2xl bg-emerald-500 px-5 py-3 text-[13px] font-medium text-obsidian-900 transition hover:bg-emerald-400"
          >
            Nieuw dossier starten
          </Link>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="rounded-2xl border border-white/10 px-5 py-3 text-[13px] text-bone/80 transition hover:border-white/20 hover:text-bone"
          >
            Stuur ons een mailtje
          </a>
        </div>
      </div>
    </div>
  );
}
