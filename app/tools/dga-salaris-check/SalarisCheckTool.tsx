"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// De drie vergelijkingspunten uit art. 12a LB, plus de wettelijke ondergrens (2025).
const MINIMUM_2025 = 56_000;

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function SalarisCheckTool() {
  const [currentSalary, setCurrentSalary] = useState<number | "">("");
  const [comparableSalary, setComparableSalary] = useState<number | "">("");
  const [highestEmployeeSalary, setHighestEmployeeSalary] = useState<number | "">("");

  const result = useMemo(() => {
    const cur = Number(currentSalary);
    const comp = Number(comparableSalary);
    const high = Number(highestEmployeeSalary);
    if (!cur && cur !== 0) return null;

    const references: { label: string; amount: number; legal: string }[] = [
      {
        label: "Wettelijk minimum 2025",
        amount: MINIMUM_2025,
        legal: "art. 12a lid 1 sub c Wet LB",
      },
    ];
    if (comp > 0)
      references.push({
        label: "Meest vergelijkbare dienstbetrekking",
        amount: comp,
        legal: "art. 12a lid 1 sub a Wet LB",
      });
    if (high > 0)
      references.push({
        label: "Hoogste loon medewerkers (incl. verbonden)",
        amount: high,
        legal: "art. 12a lid 1 sub b Wet LB",
      });

    const highest = references.reduce((max, r) => (r.amount > max.amount ? r : max));
    const shortfall = Math.max(0, highest.amount - cur);
    const compliant = cur >= highest.amount;

    return { references, highest, shortfall, compliant, cur };
  }, [currentSalary, comparableSalary, highestEmployeeSalary]);

  return (
    <div className="rounded-2xl border border-line bg-canvas p-6 shadow-card md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <NumberField
          label="Je huidige DGA-salaris (bruto, jaar)"
          value={currentSalary}
          onChange={setCurrentSalary}
          helper="Zoals vermeld op de loonstrook, x 12."
          required
        />
        <NumberField
          label="Vergelijkbaar loon in markt"
          value={comparableSalary}
          onChange={setComparableSalary}
          helper="Wat zou iemand anders in jouw rol verdienen zonder aandelenbelang? Optioneel."
        />
        <NumberField
          label="Hoogste medewerkersalaris"
          value={highestEmployeeSalary}
          onChange={setHighestEmployeeSalary}
          helper="Binnen BV of verbonden lichaam. Optioneel; vul 0 in bij geen personeel."
        />
      </div>

      <div className="mt-8 rounded-xl border border-line bg-canvas-50 p-6 md:p-7">
        {result ? <Outcome {...result} /> : <EmptyState />}
      </div>

      <p className="mt-5 text-xs text-ink-subtle">
        Deze tool werkt anoniem. Er wordt geen input opgeslagen; de berekening vindt volledig in je browser plaats.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <p className="text-sm text-ink-muted">
      Voer in ieder geval je huidige DGA-salaris in. De andere velden scherpen de toets aan — indien beschikbaar.
    </p>
  );
}

function Outcome({
  references,
  highest,
  shortfall,
  compliant,
  cur,
}: {
  references: { label: string; amount: number; legal: string }[];
  highest: { label: string; amount: number; legal: string };
  shortfall: number;
  compliant: boolean;
  cur: number;
}) {
  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
          Vereiste gebruikelijk loon
        </p>
        <p className="mt-2 font-display text-4xl text-ink tabular-nums md:text-5xl">
          {euro(highest.amount)}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Op basis van het hoogste van de drie referentiepunten: <em className="not-italic">{highest.label}</em> ({highest.legal}).
        </p>
      </div>

      <div className="border-t border-line pt-5">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
          Vergelijking
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {references.map((r) => (
            <li key={r.label} className="flex items-baseline justify-between gap-4 tabular-nums">
              <span className="text-ink-soft">
                {r.label}
                <span className="ml-2 text-xs text-ink-subtle">{r.legal}</span>
              </span>
              <span
                className={[
                  "font-medium",
                  r === highest ? "text-ink" : "text-ink-muted",
                ].join(" ")}
              >
                {euro(r.amount)}
              </span>
            </li>
          ))}
          <li className="flex items-baseline justify-between gap-4 border-t border-line pt-2 tabular-nums">
            <span className="text-ink-soft">Jouw huidige salaris</span>
            <span className="font-medium text-ink">{euro(cur)}</span>
          </li>
        </ul>
      </div>

      <div
        className={[
          "border-t border-line pt-5",
          compliant ? "" : "",
        ].join(" ")}
      >
        {compliant ? (
          <div>
            <p className="font-display text-xl text-ink">
              Je salaris voldoet aan de gebruikelijk-loontoets.
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Geen directe bijstelling nodig. Let op dat het vergelijkingsloon jaarlijks kan wijzigen; een tweejaarlijkse herziening is gangbaar.
            </p>
          </div>
        ) : (
          <div>
            <p className="font-display text-xl text-ink">
              Indicatief tekort: <span className="text-accent-500">{euro(shortfall)}</span>
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Zonder onderbouwde afwijking naar beneden verwacht de fiscus een bruto salaris van ten minste {euro(highest.amount)}.
              Afwijken is mogelijk op basis van concrete feiten (bijvoorbeeld structureel verlies, of objectief lager marktloon), maar vereist documentatie.
            </p>
          </div>
        )}

        <Link
          href="/scan"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-accent-500 decoration-2 underline-offset-4 hover:decoration-ink"
        >
          Bekijk in de volledige scan ook de 19 andere aandachtspunten →
        </Link>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  helper,
  required = false,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  helper?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
        {label} {required ? <span className="text-accent-500">*</span> : null}
      </span>
      <div className="flex items-center rounded-lg border border-line bg-canvas focus-within:border-ink">
        <span className="pl-4 text-sm text-ink-subtle">€</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? "" : Number(v));
          }}
          className="w-full bg-transparent px-3 py-3 text-sm text-ink tabular-nums focus:outline-none"
          placeholder="0"
        />
      </div>
      {helper ? (
        <p className="mt-1.5 text-xs text-ink-subtle">{helper}</p>
      ) : null}
    </label>
  );
}
