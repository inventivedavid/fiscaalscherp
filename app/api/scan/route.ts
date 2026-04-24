// Submit-endpoint voor de belastingscan.
// Flow:
//   1. Validatie (zod) + honeypot + rate-limit
//   2. Idempotency: check Baserow op recente scan met zelfde e-mail
//   3. Run flag-engine
//   4. PDF genereren
//   5. Baserow: scan-rij aanmaken + findings-rijen
//   6. Rapport e-mailen via Resend
//   7. Baserow bijwerken met email-status
//
// Runtime: Node.js (PDF rendering heeft libuv/fs).

import { NextResponse } from "next/server";
import { submitSchema } from "@/lib/validate";
import { rateLimit } from "@/lib/rateLimit";
import { runFlagEngine, totalSavingsRange } from "@/lib/flags";
import { renderReportPdf } from "@/lib/pdf";
import { sendReportEmail } from "@/lib/email";
import { baserow, TABLES } from "@/lib/baserow";
import type { Answers } from "@/lib/questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  // ── 1. Rate limit ────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = rateLimit(`scan:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Te veel aanvragen. Probeer het over een paar minuten opnieuw." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } },
    );
  }

  // ── 2. Parse + validate ─────────────────────────────────────
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige payload." }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: first?.message ?? "Ongeldige invoer.",
        field: first?.path.join(".") ?? null,
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot tripped → fake success (verwarring voor bots).
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  // "Other" functie → we sluiten beleefd de scan af (zie questions.ts).
  if (data.role === "other") {
    return NextResponse.json(
      {
        error:
          "De scan is specifiek ontworpen voor DGA's. Stuur ons een mailtje als je situatie anders is — we denken graag mee.",
      },
      { status: 422 },
    );
  }

  // ── 3. Flag-engine ───────────────────────────────────────────
  // Cast naar Answers: submitSchema accepteert 'other' al niet hier.
  const answers = data as unknown as Answers;
  const findings = runFlagEngine(answers);
  const total = totalSavingsRange(findings);
  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
  const generatedAt = new Date();

  // ── 4. Render PDF ────────────────────────────────────────────
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderReportPdf({
      answers,
      findings,
      reportId,
      generatedAt,
    });
  } catch (e) {
    console.error("[scan] PDF render faalde:", e);
    return NextResponse.json(
      { error: "Het rapport kon niet worden aangemaakt. Probeer het opnieuw." },
      { status: 500 },
    );
  }

  // ── 5. Baserow: Scans rij ───────────────────────────────────
  const scansTable = TABLES.scans();
  const findingsTable = TABLES.findings();
  let scanRowId: number | null = null;

  if (scansTable) {
    try {
      const row = await baserow.createRow(scansTable, {
        report_id: reportId,
        status: "report_generated",
        created_at: generatedAt.toISOString(),

        // Contact
        full_name: data.full_name,
        company_name: data.company_name,
        email: data.email,
        phone: data.phone ?? "",

        // Profile
        role: data.role,
        sector: data.sector,
        revenue: data.revenue,
        profit: data.profit,
        employees: data.employees,

        // Structure
        has_holding: data.has_holding,
        dividend_flow: data.dividend_flow ?? "",
        direct_shares_in_bv: data.direct_shares_in_bv,

        // Compensation
        dga_salary: data.dga_salary,
        salary_last_reviewed: data.salary_last_reviewed,
        lease_car: data.lease_car,

        // Capital
        liquid_funds: data.liquid_funds,
        dividend_last_3y: data.dividend_last_3y,
        current_account: data.current_account,

        // Future
        pension_type: data.pension_type,
        succession: data.succession,

        // Current service
        satisfaction: data.satisfaction,
        proactive_freq: data.proactive_freq,
        software: data.software,

        // Derived
        findings_count: findings.length,
        savings_min: total.min,
        savings_max: total.max,

        // Attribution
        utm_source: data.utm_source ?? "",
        utm_medium: data.utm_medium ?? "",
        utm_campaign: data.utm_campaign ?? "",
        hero_variant: data.hero_variant ?? "",
        ip: ip,
      });
      scanRowId = row.id;
    } catch (e) {
      // We stoppen niet — we willen tenminste de mail versturen.
      console.error("[scan] Baserow create scan row faalde:", e);
    }
  }

  // Findings detail-rijen (optioneel, maar handig voor analytics)
  if (scanRowId && findingsTable) {
    for (const f of findings) {
      try {
        await baserow.createRow(findingsTable, {
          scan_row_id: scanRowId,
          report_id: reportId,
          finding_id: f.id,
          title: f.title,
          severity: f.severity,
          complexity: f.complexity,
          savings_min: f.savingsMinEur,
          savings_max: f.savingsMaxEur,
        });
      } catch (e) {
        console.error("[scan] Baserow create finding faalde:", e);
      }
    }
  }

  // ── 6. Email verzenden ──────────────────────────────────────
  const mail = await sendReportEmail({
    to: data.email,
    fullName: data.full_name,
    companyName: data.company_name,
    findingCount: findings.length,
    savingsRange: total,
    pdf: pdfBuffer,
    filename: `Belastingscan-${data.company_name.replace(/[^a-zA-Z0-9]+/g, "-")}.pdf`,
  });

  // ── 7. Baserow: status updaten ──────────────────────────────
  if (scanRowId && scansTable) {
    try {
      await baserow.updateRow(scansTable, scanRowId, {
        status: mail.ok ? "report_sent" : "email_pending",
        email_sent_at: mail.ok ? new Date().toISOString() : null,
        email_error: mail.ok ? "" : mail.error,
      });
    } catch (e) {
      console.error("[scan] Baserow update status faalde:", e);
    }
  }

  if (!mail.ok) {
    return NextResponse.json(
      {
        error:
          "Je rapport is aangemaakt, maar het versturen van de mail lukte niet. We nemen contact met je op.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    reportId,
    findings: findings.length,
    savingsMin: total.min,
    savingsMax: total.max,
  });
}
