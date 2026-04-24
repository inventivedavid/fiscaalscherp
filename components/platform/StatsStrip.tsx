// Numeriek dashboard-lint. Bronvermelding maakt het geloofwaardig in plaats van gimmick.

import { getPlatformStats } from "@/lib/stats";

function euro(n: number) {
  if (n === 0) return "— ";
  if (n >= 1_000_000)
    return `€ ${(n / 1_000_000).toLocaleString("nl-NL", {
      maximumFractionDigits: 1,
    })}M`;
  if (n >= 1_000)
    return `€ ${(n / 1_000).toLocaleString("nl-NL", {
      maximumFractionDigits: 0,
    })}k`;
  return `€ ${n.toLocaleString("nl-NL")}`;
}

export async function StatsStrip() {
  const stats = await getPlatformStats();

  const items = [
    {
      label: "Scans voltooid",
      value: stats.totalScans > 0 ? stats.totalScans.toLocaleString("nl-NL") : "In opbouw",
      note: stats.source === "baserow" ? "Gemeten op dit platform" : "Platform net actief",
    },
    {
      label: "Gemiddeld aantal aandachtspunten",
      value: stats.avgFindingsPerScan > 0 ? stats.avgFindingsPerScan.toFixed(1) : "—",
      note: "Per voltooide scan",
    },
    {
      label: "Totaal gesignaleerde indicatieve besparing",
      value: stats.indicativeSavingsMax > 0 ? euro(stats.indicativeSavingsMax) : "—",
      note: "Bovenkant van de gesignaleerde bandbreedte",
    },
    {
      label: "Data-bron engine",
      value: "Wet IB · VPB · excessief lenen",
      note: "Plus besluiten & jurisprudentie",
      small: true,
    },
  ];

  return (
    <section className="hairline-b bg-canvas-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="border-l border-line pl-5 first:border-l-0 md:first:border-l md:first:pl-5 md:pl-6">
              <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
                {item.label}
              </p>
              <p
                className={[
                  "mt-2 font-display text-ink tabular-nums",
                  item.small ? "text-xl md:text-2xl" : "text-2xl md:text-3xl",
                ].join(" ")}
              >
                {item.value}
              </p>
              <p className="mt-1 text-xs text-ink-subtle">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
