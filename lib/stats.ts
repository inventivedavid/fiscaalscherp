// Geaggregeerde statistieken voor de live-strook op de homepage en /benchmarks.
// Haalt data uit Baserow Scans-tabel, valt terug op vaste baseline-cijfers bij falen
// of leeg. Cached per edge-request (2 min) zodat we niet bij elke page-view polle.

import { baserow, TABLES } from "./baserow";

export type PlatformStats = {
  totalScans: number;
  avgFindingsPerScan: number;
  indicativeSavingsMax: number;
  source: "baserow" | "baseline";
};

// Sensible defaults — voorkomt "0 scans uitgevoerd" in week 1 (ziet er dood uit).
// Wordt automatisch vervangen door echte data zodra Baserow-data beschikbaar is.
const BASELINE: PlatformStats = {
  totalScans: 0,
  avgFindingsPerScan: 0,
  indicativeSavingsMax: 0,
  source: "baseline",
};

export async function getPlatformStats(): Promise<PlatformStats> {
  const table = TABLES.scans();
  if (!table) return BASELINE;

  try {
    const res = await baserow.listRows<{
      id: number;
      findings_count?: number;
      savings_max?: number;
    }>(table, { size: 200, orderBy: "-created_at" });

    if (res.count === 0) return BASELINE;

    const findingsCounts = res.results
      .map((r) => Number(r.findings_count ?? 0))
      .filter((n) => Number.isFinite(n));
    const savingsMaxes = res.results
      .map((r) => Number(r.savings_max ?? 0))
      .filter((n) => Number.isFinite(n));

    const totalScans = res.count;
    const avgFindingsPerScan =
      findingsCounts.length === 0
        ? 0
        : findingsCounts.reduce((a, b) => a + b, 0) / findingsCounts.length;
    const indicativeSavingsMax = savingsMaxes.reduce((a, b) => a + b, 0);

    return {
      totalScans,
      avgFindingsPerScan: Math.round(avgFindingsPerScan * 10) / 10,
      indicativeSavingsMax,
      source: "baserow",
    };
  } catch {
    return BASELINE;
  }
}
