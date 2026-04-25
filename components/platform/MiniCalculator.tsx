"use client";

// MiniCalculator — drie hairline selects, geen kaartrand.
// Wordt gevoed door state in <Hero> zodat de VaultDial daar live kan etsen
// op basis van wat hier wordt ingevuld. Logica blijft identiek (flag-engine),
// alleen de presentatie is uitgekleed tot kale typografie + onderlijntjes.

import Link from "next/link";
import type { Answers } from "@/lib/questions";

type Sector = Answers["sector"];
type Revenue = Answers["revenue"];
type Salary = Answers["dga_salary"];

export const SECTORS: { value: Sector; label: string }[] = [
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

export const REVENUES: { value: Revenue; label: string; profit: Answers["profit"] }[] = [
  { value: "200_500k", label: "€ 200k – 500k", profit: "50_100k" },
  { value: "500k_1m", label: "€ 500k – 1M", profit: "100_250k" },
  { value: "1_2m", label: "€ 1M – 2M", profit: "250_500k" },
  { value: "2_5m", label: "€ 2M – 5M", profit: "500k_1m" },
];

export const SALARIES: { value: Salary; label: string }[] = [
  { value: "lt_30k", label: "Minder dan € 30.000" },
  { value: "30_50k", label: "€ 30.000 – 50.000" },
  { value: "50_70k", label: "€ 50.000 – 70.000" },
  { value: "70_100k", label: "€ 70.000 – 100.000" },
  { value: "gt_100k", label: "Meer dan € 100.000" },
];

export function buildAnswers(
  sector: Sector,
  rev: Revenue,
  salary: Salary,
): Answers {
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

type MiniCalculatorProps = {
  sector: Sector | "";
  revenue: Revenue | "";
  salary: Salary | "";
  onSector: (v: Sector) => void;
  onRevenue: (v: Revenue) => void;
  onSalary: (v: Salary) => void;
  /** Aantal bevindingen voor copy onder de selects. */
  findingsCount: number | null;
};

export function MiniCalculator({
  sector,
  revenue,
  salary,
  onSector,
  onRevenue,
  onSalary,
  findingsCount,
}: MiniCalculatorProps) {
  const filled = [sector, revenue, salary].filter(Boolean).length;
  const allFilled = filled === 3;

  return (
    <div className="flex flex-col gap-0">
      <p className="font-mono text-[10px] uppercase tracking-stamp text-bone/45">
        Drie etsen · 30 seconden
      </p>

      <div className="mt-5 grid gap-0">
        <Field
          step="I"
          label="Sector"
          value={sector}
          onChange={(v) => onSector(v as Sector)}
          placeholder="Kies sector"
          options={SECTORS}
        />
        <Field
          step="II"
          label="Jaaromzet BV"
          value={revenue}
          onChange={(v) => onRevenue(v as Revenue)}
          placeholder="Kies range"
          options={REVENUES}
        />
        <Field
          step="III"
          label="DGA-salaris (bruto)"
          value={salary}
          onChange={(v) => onSalary(v as Salary)}
          placeholder="Kies range"
          options={SALARIES}
        />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {allFilled ? (
          <p className="text-[14px] leading-relaxed text-bone/65">
            {findingsCount === 0 ? (
              <>Geen rode regels op dit profielniveau — een volledige scan weegt 20 factoren.</>
            ) : (
              <>
                De engine activeert{" "}
                <span className="text-bone etch">{findingsCount}</span>{" "}
                {findingsCount === 1 ? "aandachtspunt" : "aandachtspunten"} op
                deze combinatie. Het volledige dossier weegt jouw situatie.
              </>
            )}
          </p>
        ) : (
          <p className="text-[14px] leading-relaxed text-bone/55">
            Etst per veld één arc op de dial. Het volledige dossier opent
            zodra je doorklikt — gratis, anoniem, 8 minuten.
          </p>
        )}

        <Link
          href="/"
          className={[
            "group mt-2 inline-flex w-fit items-center gap-3 rounded-full border px-6 py-3 text-[14px] transition",
            allFilled
              ? "border-emerald-400/60 bg-emerald-400/[0.10] text-bone shadow-[0_0_30px_-12px_rgba(62,207,148,0.6)] hover:border-emerald-400 hover:bg-emerald-400/[0.16]"
              : "border-white/15 text-bone/85 hover:border-white/30 hover:text-bone",
          ].join(" ")}
        >
          <span className="font-mono text-[9px] uppercase tracking-stamp text-emerald-400/70">
            ↳
          </span>
          Open je dossier
          <span aria-hidden className="transition group-hover:translate-x-0.5">
            →
          </span>
        </Link>
        <p className="font-mono text-[9.5px] uppercase tracking-stamp text-bone/30">
          Geen e-mailgate · 8 minuten
        </p>
      </div>
    </div>
  );
}

function Field<T extends string>({
  step,
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  step: string;
  label: string;
  value: T | "";
  onChange: (v: T) => void;
  placeholder: string;
  options: readonly { value: T; label: string }[];
}) {
  const filled = Boolean(value);
  return (
    <label
      className={[
        "group relative flex items-center gap-4 border-b border-white/[0.07] py-4 transition-colors",
        filled ? "" : "hover:bg-white/[0.015]",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "shrink-0 font-display text-xl leading-none transition-colors",
          filled ? "text-emerald-300/95 etch-emerald" : "text-bone/30",
        ].join(" ")}
        style={{ letterSpacing: "0.04em", width: "1.5rem" }}
      >
        {step}
      </span>

      <span className="flex flex-1 flex-col">
        <span className="font-mono text-[10px] uppercase tracking-stamp text-bone/40">
          {label}
        </span>
        <div className="relative mt-1">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className={[
              "w-full appearance-none bg-transparent pr-8 text-[15px] outline-none",
              filled ? "text-bone etch" : "text-bone/55",
            ].join(" ")}
          >
            <option value="" disabled className="bg-obsidian-900">
              {placeholder}
            </option>
            {options.map((o) => (
              <option key={o.value} value={o.value} className="bg-obsidian-900">
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-1 top-1/2 size-4 -translate-y-1/2 text-bone/30"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </span>
    </label>
  );
}
