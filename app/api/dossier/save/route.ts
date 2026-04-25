// "Bewaar je dossier" endpoint.
// Genereert een signed token met de huidige draft-state, stuurt
// de gebruiker een privé hervat-link, en logt een lichte draft-rij
// in Baserow als die geconfigureerd is. Géén PII opslag op de server
// die niet via de signed token al inzichtelijk is.

import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";
import { sendDossierResumeEmail } from "@/lib/email";
import { createDossierToken } from "@/lib/dossierToken";
import { baserow, TABLES } from "@/lib/baserow";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const saveSchema = z.object({
  email: z.string().email("Geldig e-mailadres vereist."),
  answers: z.record(z.string(), z.string()),
  completedSections: z.array(z.string()).default([]),
  questionIndex: z.number().int().min(0).default(0),
  totalRange: z
    .object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
    })
    .default({ min: 0, max: 0 }),
  progressPct: z.number().min(0).max(100).default(0),
});

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = rateLimit(`dossier-save:${ip}`, {
    limit: 6,
    windowMs: 10 * 60_000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Te veel pogingen. Probeer het over een paar minuten opnieuw." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ongeldige payload." },
      { status: 400 },
    );
  }

  const parsed = saveSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Ongeldige invoer." },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Token genereren met de huidige state.
  const token = createDossierToken({
    email: data.email,
    answers: data.answers,
    completedSections: data.completedSections as never,
    questionIndex: data.questionIndex,
  });

  const resumeUrl = `${SITE.url}/resume/${encodeURIComponent(token)}`;

  // Magic-link versturen.
  const mail = await sendDossierResumeEmail({
    to: data.email,
    resumeUrl,
    progressPct: data.progressPct,
    savings: data.totalRange,
  });

  if (!mail.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Het versturen van de bewaar-link lukte niet. Probeer het opnieuw of sla deze stap over — je dossier zit nog steeds in dit venster.",
      },
      { status: 502 },
    );
  }

  // Draft-rij in Baserow scans-tabel als lead-backup. We hergebruiken
  // de scans-tabel met status "draft_saved" — geen aparte tabel nodig.
  const scansTable = TABLES.scans();
  if (scansTable) {
    try {
      await baserow.createRow(scansTable, {
        report_id: `DRAFT-${Date.now().toString(36).toUpperCase()}`,
        status: "draft_saved",
        created_at: new Date().toISOString(),
        email: data.email,
        ...flattenAnswers(data.answers),
        savings_min: data.totalRange.min,
        savings_max: data.totalRange.max,
        ip,
      });
    } catch (e) {
      console.error("[dossier/save] Baserow draft create faalde:", e);
      // Geen blokkade — de magic-link is al onderweg.
    }
  }

  return NextResponse.json({ ok: true });
}

// Vlakke representatie van de answers — de scans-tabel verwacht losse velden
// met dezelfde namen als de Answers-keys. Extra velden negeert Baserow.
function flattenAnswers(answers: Record<string, string>) {
  return {
    role: answers.role ?? "",
    sector: answers.sector ?? "",
    revenue: answers.revenue ?? "",
    profit: answers.profit ?? "",
    employees: answers.employees ?? "",
    has_holding: answers.has_holding ?? "",
    dividend_flow: answers.dividend_flow ?? "",
    direct_shares_in_bv: answers.direct_shares_in_bv ?? "",
    dga_salary: answers.dga_salary ?? "",
    salary_last_reviewed: answers.salary_last_reviewed ?? "",
    lease_car: answers.lease_car ?? "",
    liquid_funds: answers.liquid_funds ?? "",
    dividend_last_3y: answers.dividend_last_3y ?? "",
    current_account: answers.current_account ?? "",
    pension_type: answers.pension_type ?? "",
    succession: answers.succession ?? "",
    satisfaction: answers.satisfaction ?? "",
    proactive_freq: answers.proactive_freq ?? "",
    software: answers.software ?? "",
  };
}
