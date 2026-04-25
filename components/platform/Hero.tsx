"use client";

// Hero — landing-anker met de VaultDial als signatuur.
// Drie inputs van MiniCalculator etsen één-voor-één een arc op de dial.
// Zodra de drie zijn ingevuld is een live bedrag in het centrum geëtst.
// De CTA verwijst naar de cockpit (`/`) voor het volle dossier.

import { useMemo, useState } from "react";
import { runFlagEngine, totalSavingsRange } from "@/lib/flags";
import { VaultDial } from "@/components/cockpit/VaultDial";
import { MiniCalculator, buildAnswers } from "./MiniCalculator";
import type { Answers } from "@/lib/questions";

type Sector = Answers["sector"];
type Revenue = Answers["revenue"];
type Salary = Answers["dga_salary"];

export function Hero() {
  const [sector, setSector] = useState<Sector | "">("");
  const [revenue, setRevenue] = useState<Revenue | "">("");
  const [salary, setSalary] = useState<Salary | "">("");

  const filled = [sector, revenue, salary].filter(Boolean).length;
  const allFilled = filled === 3;

  // Welke arc-index pulseert als 'next'?
  const activeIndex = allFilled ? null : filled;

  const result = useMemo(() => {
    if (!allFilled) return null;
    const ans = buildAnswers(
      sector as Sector,
      revenue as Revenue,
      salary as Salary,
    );
    const findings = runFlagEngine(ans);
    return { findings, total: totalSavingsRange(findings) };
  }, [sector, revenue, salary, allFilled]);

  return (
    <section className="relative overflow-hidden bg-obsidian-900 pb-20 pt-28 md:pt-36">
      {/* Subtiel emerald glow-licht aan de rechterkant — accent achter de dial. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 50% at 75% 30%, rgba(62,207,148,0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-14 md:grid-cols-12 md:gap-12">
          {/* Linker kolom — copy + selects. */}
          <div className="md:col-span-6 md:pt-6">
            <p className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-stamp text-bone/45">
              <span aria-hidden className="inline-block h-px w-8 bg-bone/30" />
              Vault · fiscaal dossier voor DGA's
            </p>
            <h1 className="mt-6 font-display text-display-xl text-bone text-balance etch">
              Een kluis voor je fiscale positie. Eén dial, zes secties — en
              alleen jij ziet wat erin zit.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/65 md:text-xl">
              Fiscaalscherp etst per sectie één arc op je persoonlijke kluis.
              Begin met drie velden — de engine doet de rest.
            </p>

            <div className="mt-10">
              <MiniCalculator
                sector={sector}
                revenue={revenue}
                salary={salary}
                onSector={setSector}
                onRevenue={setRevenue}
                onSalary={setSalary}
                findingsCount={result ? result.findings.length : null}
              />
            </div>
          </div>

          {/* Rechter kolom — de dial zelf. */}
          <div className="md:col-span-6">
            <div className="flex flex-col items-center gap-6">
              <VaultDial
                done={filled}
                active={activeIndex}
                min={result?.total.min ?? 0}
                max={result?.total.max ?? 0}
                size="lg"
                label={allFilled ? "Optimalisatie · jaar" : "Kluis ontgrendelen"}
                sublabel={
                  allFilled
                    ? "Indicatief · profielcombinatie"
                    : `${filled} / 03 · etsen`
                }
              />
              <p className="max-w-[300px] text-center font-mono text-[10px] uppercase tracking-stamp text-bone/35">
                Elk veld etst één arc.
                <br />
                Drie etsen openen de dial.
              </p>
            </div>
          </div>
        </div>

        {/* Drie principes onder de hero — rustig, geen kaarten meer. */}
        <div className="mt-24 grid gap-10 border-t border-white/[0.06] pt-10 md:grid-cols-3">
          <Principle
            ordinal="I"
            title="Meetbare uitkomst"
            body="Elke bevinding komt met een indicatieve bandbreedte, een complexiteitsscore en een verwijzing naar de onderliggende regelgeving."
          />
          <Principle
            ordinal="II"
            title="Neutrale diagnose"
            body="De engine trekt geen conclusies voor je — hij legt de structuur bloot. Interpretatie en besluit blijven bij jou en je adviseur."
          />
          <Principle
            ordinal="III"
            title="Geen e-mailgate"
            body="De mini-dial werkt anoniem. Pas voor het volledige, persoonlijke rapport laat je contactgegevens achter."
          />
        </div>
      </div>
    </section>
  );
}

function Principle({
  ordinal,
  title,
  body,
}: {
  ordinal: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4">
      <span
        aria-hidden
        className="font-display text-3xl leading-none text-emerald-300/85 etch-emerald"
        style={{ letterSpacing: "0.04em" }}
      >
        {ordinal}
      </span>
      <div className="flex-1">
        <h3 className="font-display text-xl text-bone etch">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-bone/60">{body}</p>
      </div>
    </div>
  );
}
