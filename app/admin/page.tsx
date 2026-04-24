// Eenvoudig admin-overzicht van de laatste scans. Basic Auth via middleware.ts.
// Dit is bewust minimaal: voor productie kun je RSC suspense streaming + filtering toevoegen.

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
      <div className="p-10 text-ink-800">
        <h1 className="text-2xl font-bold">Admin niet geconfigureerd</h1>
        <p className="mt-2 text-ink-600">
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
    <div className="min-h-dvh bg-ink-50">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-bold text-ink-900">Admin · Scans</h1>
          <Link href="/" className="text-sm text-ink-600 hover:text-ink-900">
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
            Kon scans niet laden: {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-md border border-ink-200 bg-white p-6 text-ink-600">
            Nog geen scans.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-ink-200 bg-white shadow-soft">
            <table className="min-w-full divide-y divide-ink-200 text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Datum</th>
                  <th className="px-4 py-3 text-left font-semibold">Referentie</th>
                  <th className="px-4 py-3 text-left font-semibold">Naam</th>
                  <th className="px-4 py-3 text-left font-semibold">Bedrijf</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-right font-semibold">Punten</th>
                  <th className="px-4 py-3 text-right font-semibold">Besparing</th>
                  <th className="px-4 py-3 text-left font-semibold">Source</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-ink-50">
                    <td className="px-4 py-3 text-ink-600">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString("nl-NL")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-700">
                      {r.report_id ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {r.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-700">
                      {r.company_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-700">{r.email ?? "—"}</td>
                    <td className="px-4 py-3 text-right text-ink-700">
                      {r.findings_count ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right text-ink-700">
                      {euro(r.savings_min)} – {euro(r.savings_max)}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-500">
                      {r.utm_source ?? "direct"}
                      {r.hero_variant ? ` · v${r.hero_variant}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded px-2 py-0.5 text-xs font-semibold",
                          r.status === "report_sent"
                            ? "bg-green-100 text-green-800"
                            : r.status === "email_pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-ink-100 text-ink-700",
                        ].join(" ")}
                      >
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
