// Vercel Cron endpoint — draait dagelijks om 09:00 UTC.
// Stuurt follow-up emails op dag 2 / 5 / 10 / 20 / 30 na submit.
//
// Beveiligd via CRON_SECRET (Vercel Cron stuurt Authorization: Bearer <secret>).

import { NextResponse } from "next/server";
import { baserow, TABLES } from "@/lib/baserow";
import { sendFollowupEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type ScanRow = {
  id: number;
  email?: string;
  full_name?: string;
  company_name?: string;
  created_at?: string;
  email_sent_at?: string;
  status?: string;
  followup_day2?: boolean;
  followup_day5?: boolean;
  followup_day10?: boolean;
  followup_day20?: boolean;
  followup_day30?: boolean;
  unsubscribed?: boolean;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const SCHEDULE = [
  { day: 2, field: "followup_day2", kind: "day2" as const },
  { day: 5, field: "followup_day5", kind: "day5" as const },
  { day: 10, field: "followup_day10", kind: "day10" as const },
  { day: 20, field: "followup_day20", kind: "day20" as const },
  { day: 30, field: "followup_day30", kind: "day30" as const },
];

function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / MS_PER_DAY);
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET niet geconfigureerd." },
      { status: 500 },
    );
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const table = TABLES.scans();
  if (!table) {
    return NextResponse.json(
      { error: "BASEROW_SCANS_TABLE_ID ontbreekt." },
      { status: 500 },
    );
  }

  const now = new Date();
  const counters = { processed: 0, sent: 0, failed: 0, skipped: 0 };

  // Haal een batch recent-actieve scans (laatste 40 dagen is voldoende voor de hele sequence).
  const { results } = await baserow.listRows<ScanRow>(table, {
    size: 200,
    orderBy: "-created_at",
  });

  for (const scan of results) {
    counters.processed += 1;

    if (!scan.email || scan.unsubscribed) {
      counters.skipped += 1;
      continue;
    }
    if (scan.status !== "report_sent") {
      counters.skipped += 1;
      continue;
    }
    const createdAtRaw = scan.email_sent_at ?? scan.created_at;
    if (!createdAtRaw) {
      counters.skipped += 1;
      continue;
    }
    const createdAt = new Date(createdAtRaw);
    if (Number.isNaN(createdAt.getTime())) {
      counters.skipped += 1;
      continue;
    }
    const age = daysBetween(createdAt, now);
    if (age > 35) {
      counters.skipped += 1;
      continue;
    }

    // Kies welke follow-ups getriggerd moeten worden.
    const toSend = SCHEDULE.filter(
      (s) =>
        age >= s.day &&
        !(scan as unknown as Record<string, boolean>)[s.field],
    );

    for (const step of toSend) {
      const res = await sendFollowupEmail({
        to: scan.email,
        fullName: scan.full_name ?? "",
        companyName: scan.company_name ?? "",
        kind: step.kind,
      });

      if (res.ok) {
        counters.sent += 1;
        try {
          await baserow.updateRow(table, scan.id, {
            [step.field]: true,
            [`${step.field}_sent_at`]: new Date().toISOString(),
          });
        } catch (e) {
          console.error("[cron] update row faalde:", e);
        }
        // Slechts één follow-up per scan per cron-run, zodat we geen burst veroorzaken.
        break;
      } else {
        counters.failed += 1;
        console.error("[cron] followup faalde:", res.error);
      }
    }
  }

  return NextResponse.json({ ok: true, ...counters, at: now.toISOString() });
}
