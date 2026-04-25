"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCockpit } from "./store";

export function ActivateGate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, totalRange, findings, backFromActivate, markSubmitted, reset } =
    useCockpit();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroVariant = searchParams.get("v") ?? "";
  const utm = {
    utm_source: searchParams.get("utm_source") ?? "",
    utm_medium: searchParams.get("utm_medium") ?? "",
    utm_campaign: searchParams.get("utm_campaign") ?? "",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const body: Record<string, string> = {
      ...(state.answers as Record<string, string>),
      full_name: String(form.get("full_name") ?? "").trim(),
      company_name: String(form.get("company_name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      consent: form.get("consent") === "on" ? "true" : "",
      website: String(form.get("website") ?? ""),
      hero_variant: heroVariant,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    };

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Er ging iets mis. Probeer het opnieuw.");
        setSubmitting(false);
        return;
      }
      markSubmitted();
      reset();
      const params = new URLSearchParams({
        rid: json.reportId ?? "",
        n: String(json.findings ?? 0),
      });
      router.push(`/bedankt?${params.toString()}`);
    } catch {
      setError("Netwerkfout. Probeer het opnieuw.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-obsidian-900 pt-safe">
      <div className="classified-banner flex items-center justify-between px-4 py-1.5">
        <span>Strateeg-activatie</span>
        <span className="font-mono tabular-nums text-bone/55">overdracht</span>
      </div>

      <main className="mx-auto max-w-xl px-5 pb-12 pt-10 md:px-6 md:pt-16">
        <button
          type="button"
          onClick={backFromActivate}
          className="font-mono text-[11px] uppercase tracking-stamp text-bone/45 transition hover:text-bone"
        >
          ← terug naar dossier
        </button>

        <p className="mt-6 font-mono text-[10px] tracking-stamp uppercase text-gold-300">
          Activatie · stap 1 van 1
        </p>
        <h1 className="mt-3 font-display text-display-lg text-bone text-balance">
          Geef je strateeg toegang tot dit dossier.
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-bone/65">
          Je dossier wordt vastgelegd onder je naam. Binnen één werkdag
          reageert een strateeg met een voorstel voor een vrijblijvend
          kennismakingsgesprek van 15 minuten. Tijdens dat gesprek lopen we de
          bevindingen samen door en bespreken we óf — en hoe — een
          optimalisatiesessie zinvol is.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              name="full_name"
              label="Naam"
              autoComplete="name"
              required
              placeholder="Voornaam Achternaam"
            />
            <Field
              name="company_name"
              label="Bedrijfsnaam"
              autoComplete="organization"
              required
              placeholder="Je BV"
            />
            <Field
              name="email"
              type="email"
              label="E-mailadres"
              autoComplete="email"
              required
              defaultValue={state.persistedEmail ?? ""}
              placeholder="je@bedrijf.nl"
            />
            <Field
              name="phone"
              type="tel"
              label="Telefoon (optioneel)"
              autoComplete="tel"
              placeholder="06 …"
            />
          </div>

          {/* Honeypot — onzichtbaar voor mensen, bots vullen het in. */}
          <div aria-hidden="true" className="hidden">
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <label className="mt-6 flex items-start gap-3 text-[13px] text-bone/70">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 size-4 accent-emerald-500"
            />
            <span>
              Ik ga akkoord met het{" "}
              <Link
                href="/privacy"
                className="text-bone underline decoration-emerald-400/60 underline-offset-4 hover:decoration-emerald-400"
              >
                privacybeleid
              </Link>{" "}
              en begrijp dat de bevindingen indicatief zijn en geen fiscaal
              advies vormen.
            </span>
          </label>

          {error ? (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-gold-300/40 bg-gold-300/[0.06] p-4 text-[13px] text-gold-100"
            >
              ⚠ {error}
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            <p className="hidden font-mono text-[10px] tracking-stamp uppercase text-bone/40 md:block">
              {findings.length} bevinding{findings.length === 1 ? "" : "en"} ·{" "}
              indicatief jaarrange in beeld
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="ml-auto inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-7 py-3.5 text-[14px] font-medium text-obsidian-900 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {submitting
                ? "Dossier wordt overgedragen…"
                : "Dossier vrijgeven aan strateeg"}
              {!submitting ? <span aria-hidden>→</span> : null}
            </button>
          </div>
        </form>

        <p className="mt-10 border-t border-white/5 pt-5 text-[11px] leading-relaxed text-bone/40">
          {totalRange.max > 0
            ? `Indicatieve range op basis van je dossier: tussen € ${totalRange.min.toLocaleString("nl-NL")} en € ${totalRange.max.toLocaleString("nl-NL")} per jaar. Concrete invulling vereist altijd nader onderzoek met een adviseur die de volledige context kent.`
            : "Geen directe rode regels — wel een uitgewerkt rapport dat de getoetste punten documenteert. Een gesprek plaatst de uitkomsten in context."}
        </p>
      </main>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] tracking-stamp uppercase text-bone/45">
        {label}
        {required ? <span className="text-emerald-400"> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="block w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] text-bone placeholder:text-bone/30 focus:border-emerald-400 focus:outline-none"
      />
    </label>
  );
}
