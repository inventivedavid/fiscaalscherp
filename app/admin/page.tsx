import type { Metadata } from "next";
import Link from "next/link";
import { baserow, TABLES } from "@/lib/baserow";

export const metadata: Metadata = {
  title: "Admin — Scans",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type ScanRow = {
  id: number;
  report_id?: string;
  full_name?: string;
  company_name?: string;
  email?: string;
  created_at?: string;
  status?: string;
  findings_count?: number;
  savings_min?: number;
  savings_max?: number;
  utm_source?: string;
  hero_variant?: string;
};

function euro(n: number | undefined) {
  if (typeof n !== "number") return "—";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function AdminPage() {
  const table = TABLES.scans();
  if (!table) {
    return (
      <div className="p-10 text-ink">
        <h1 className="font-display text-2xl">Admin niet geconfigureerd</h1>
        <p className="mt-2 text-ink-muted">
          Stel <code>BASEROW_SCANS_TABLE_ID</code> in.
        </p>
      </div>
    );
  }

  let rows: ScanRow[] = [];
  let error: string | null = null;
  try {
    const res = await baserow.listRows<ScanRow>(table, {
      size: 100,
      orderBy: "-created_at",
    });
    rows = res.results;
  } catch (e) {
    error = e instanceof Error ? e.message : "Onbekende fout";
  }

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="hairline-b bg-canvas">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="font-display text-lg text-ink">Admin · Scans</h1>
          <Link href="/" className="text-sm text-ink-muted hover:text-ink">
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {error ? (
          <div className="rounded-lg border border-accent-300 bg-accent-50 p-4 text-accent-700">
            Kon scans niet laden: {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-line bg-canvas-50 p-6 text-ink-muted">
            Nog geen scans.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-line bg-canvas shadow-card">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-canvas-50 text-xs uppercase tracking-eyebrow text-ink-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Datum</th>
                  <th className="px-4 py-3 text-left font-medium">Referentie</th>
                  <th className="px-4 py-3 text-left font-medium">Naam</th>
                  <th className="px-4 py-3 text-left font-medium">Bedrijf</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-right font-medium">Punten</th>
                  <th className="px-4 py-3 text-right font-medium">Besparing</th>
                  <th className="px-4 py-3 text-left font-medium">Source</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-canvas-50">
                    <td className="px-4 py-3 text-ink-muted">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString("nl-NL")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-soft tabular-nums">
                      {r.report_id ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {r.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {r.company_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{r.email ?? "—"}</td>
                    <td className="px-4 py-3 text-right text-ink-soft tabular-nums">
                      {r.findings_count ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right text-ink-soft tabular-nums">
                      {euro(r.savings_min)} – {euro(r.savings_max)}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-subtle">
                      {r.utm_source ?? "direct"}
                      {r.hero_variant ? ` · v${r.hero_variant}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-line bg-canvas-50 px-2 py-0.5 text-xs text-ink-soft">
                        {r.status ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
