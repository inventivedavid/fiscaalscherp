"use client";

// De mini-calculator is het anker van de homepage.
// Drie inputs → directe indicatie, gebaseerd op dezelfde flag-engine als de volle scan.
// Géén e-mailgate: dit is een trust-instrument, geen lead-vang.
// Wie hier een concreet getal ziet, doet de volle scan vrijwel zeker.

import { useMemo, useState } from "react";
import Link from "next/link";
import { runFlagEngine, totalSavingsRange } from "@/lib/flags";
import type { Answers } from "@/lib/questions";

type Sector = Answers["sector"];
type Revenue = Answers["revenue"];
type Salary = Answers["dga_salary"];

const SECTORS: { value: Sector; label: string }[] = [
  { value: "tech", label: "Tech / SaaS" },
  { value: "productie", label: "Productie / industrie" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "dienstverlening", label: "Zakelijke dienstverlening" },
  { value: "horeca", label: "Horeca" },
  { value: "retail", label: "Retail" },
  { value: "bouw", label: "Bouw / installatie" },
  { value: "zorg", label: "Zorg" },
  { value: "anders", label: "Anders" },
];

const REVENUES: { value: Revenue; label: string; profit: Answers["profit"] }[] = [
  { value: "200_500k", label: "€ 200k – 500k", profit: "50_100k" },
  { value: "500k_1m", label: "€ 500k – 1M", profit: "100_250k" },
  { value: "1_2m", label: "€ 1M – 2M", profit: "250_500k" },
  { value: "2_5m", label: "€ 2M – 5M", profit: "500k_1m" },
];

const SALARIES: { value: Salary; label: string }[] = [
  { value: "lt_30k", label: "Minder dan € 30.000" },
  { value: "30_50k", label: "€ 30.000 – 50.000" },
  { value: "50_70k", label: "€ 50.000 – 70.000" },
  { value: "70_100k", label: "€ 70.000 – 100.000" },
  { value: "gt_100k", label: "Meer dan € 100.000" },
];

// Bouw een "representatief" Answers-object: de 3 gekozen inputs, en voor de rest
// neutrale defaults die geen flags triggeren — zo meten we specifiek wat deze
// combinatie signaleert.
function buildAnswers(sector: Sector, rev: Revenue, salary: Salary): Answers {
  const revMap = REVENUES.find((r) => r.value === rev);
  return {
    role: "dga",
    sector,
    revenue: rev,
    profit: revMap?.profit ?? "100_250k",
    employees: "1_5",
    has_holding: "no",
    dividend_flow: "none",
    direct_shares_in_bv: "yes",
    dga_salary: salary,
    salary_last_reviewed: "3y_plus",
    lease_car: "none",
    liquid_funds: "25_100k",
    dividend_last_3y: "none",
    current_account: "none",
    pension_type: "none",
    succession: "none",
    satisfaction: "neutral",
    proactive_freq: "yearly",
    software: "moneybird",
    full_name: "",
    company_name: "",
    email: "",
    consent: "true",
  };
}

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function MiniCalculator() {
  const [sector, setSector] = useState<Sector | "">("");
  const [revenue, setRevenue] = useState<Revenue | "">("");
  const [salary, setSalary] = useState<Salary | "">("");

  const canCompute = sector && revenue && salary;

  const result = useMemo(() => {
    if (!canCompute) return null;
    const ans = buildAnswers(sector as Sector, revenue as Revenue, salary as Salary);
    const findings = runFlagEngine(ans);
    const total = totalSavingsRange(findings);
    return { findings, total };
  }, [sector, revenue, salary, canCompute]);

  return (
    <div className="rounded-2xl border border-line bg-canvas-50 p-6 shadow-card md:p-8">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium uppercase tracking-eyebrow text-ink-muted">
          Indicatie · 30 seconden
        </h3>
        <span className="text-xs text-ink-subtle">Geen e-mail vereist</span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Select
          label="Sector"
          value={sector}
          onChange={(v) => setSector(v as Sector)}
          placeholder="Kies sector"
          options={SECTORS}
        />
        <Select
          label="Jaaromzet BV"
          value={revenue}
          onChange={(v) => setRevenue(v as Revenue)}
          placeholder="Kies range"
          options={REVENUES}
        />
        <Select
          label="DGA-salaris (bruto)"
          value={salary}
          onChange={(v) => setSalary(v as Salary)}
          placeholder="Kies range"
          options={SALARIES}
        />
      </div>

      <div className="mt-6 rounded-xl border border-line bg-canvas p-5 md:p-6">
        {result ? (
          <Result findings={result.findings.length} total={result.total} />
        ) : (
          <div className="text-sm text-ink-muted">
            Vul de drie velden in. We tonen direct een indicatie op basis van de
            fiscale structuur die typisch bij dit profiel hoort.
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-ink-subtle">
        Indicatief, op basis van profielcombinatie. Een volledige scan (20 vragen,
        gratis) weegt je specifieke situatie en levert een persoonlijk rapport op.
      </p>
    </div>
  );
}

function Result({
  findings,
  total,
}: {
  findings: number;
  total: { min: number; max: number };
}) {
  if (findings === 0) {
    return (
      <div className="animate-fade-up">
        <p className="font-display text-2xl text-ink md:text-3xl">
          Geen directe signalen op dit profielniveau.
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Dit betekent niet dat er niets te optimaliseren valt — alleen dat de
          drie indicatoren samen geen rode vlaggen geven. Een volledige scan
          weegt 20 factoren en detecteert ook minder voor de hand liggende punten.
        </p>
        <ScanLink />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
          Indicatieve optimalisatieruimte per jaar
        </p>
      </div>
      <p className="mt-2 font-display text-[2.4rem] leading-none tracking-tight text-ink tabular-nums md:text-5xl">
        {euro(total.min)} <span className="text-ink-subtle">–</span> {euro(total.max)}
      </p>
      <p className="mt-3 text-sm text-ink-muted">
        Op basis van dit profiel activeert de engine{" "}
        <span className="font-medium text-ink">{findings}</span>{" "}
        {findings === 1 ? "aandachtspunt" : "aandachtspunten"}. Welke punten dit
        zijn, en hoe ze zich tot jouw specifieke situatie verhouden, staat in het
        volledige rapport.
      </p>
      <ScanLink />
    </div>
  );
}

function ScanLink() {
  return (
    <Link
      href="/scan"
      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink underline decoration-accent-500 decoration-2 underline-offset-4 hover:decoration-ink"
    >
      Volledige scan invullen (8 min, gratis) →
    </Link>
  );
}

function Select<T extends string>({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: T | "";
  onChange: (v: T) => void;
  placeholder: string;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none rounded-lg border border-line bg-canvas px-4 py-3 pr-10 text-sm text-ink shadow-sm focus:border-ink focus:outline-none focus:ring-0"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </label>
  );
}
