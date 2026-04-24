import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "dga-belastingscan",
    ts: new Date().toISOString(),
    env: {
      resend: Boolean(process.env.RESEND_API_KEY),
      baserow: Boolean(process.env.BASEROW_TOKEN),
      scans_table: Boolean(process.env.BASEROW_SCANS_TABLE_ID),
    },
  });
}
