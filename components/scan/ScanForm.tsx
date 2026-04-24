"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BLOCKS,
  visibleQuestions,
  type Answers,
  type QuestionBase,
} from "@/lib/questions";

const STORAGE_KEY = "dga_scan_draft_v1";

// Type helper: het interne antwoordobject gebruikt losse strings tijdens bewerken.
type AnswerState = Partial<Record<keyof Answers, string>>;

// ────────────────────────────────────────────────────────────────
// Stappen: eerst één vraag per scherm (commitment-psych), dan contact.
// ────────────────────────────────────────────────────────────────
function useScanState() {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as {
          answers: AnswerState;
          stepIndex: number;
        };
        setAnswers(data.answers ?? {});
        setStepIndex(typeof data.stepIndex === "number" ? data.stepIndex : 0);
      }
    } catch {
      /* silently ignore corrupt drafts */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, stepIndex }),
      );
    } catch {
      /* e.g. storage full, ignore */
    }
  }, [answers, stepIndex, hydrated]);

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setAnswers({});
    setStepIndex(0);
  }

  return { answers, setAnswers, stepIndex, setStepIndex, hydrated, reset };
}

// ────────────────────────────────────────────────────────────────
function TerminationScreen({
  title,
  message,
  onRestart,
}: {
  title: string;
  message: string;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-ink-200 bg-white p-10 text-center shadow-soft">
      <h2 className="text-2xl font-bold text-ink-900">{title}</h2>
      <p className="mt-4 text-ink-700">{message}</p>
      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={onRestart}
          className="rounded-md border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-ink-50"
        >
          Scan opnieuw starten
        </button>
        <Link
          href="/"
          className="rounded-md bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
        >
          Terug naar home
        </Link>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
export function ScanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const heroVariant = searchParams.get("v") ?? "";
  const utm = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") ?? "",
      utm_medium: searchParams.get("utm_medium") ?? "",
      utm_campaign: searchParams.get("utm_campaign") ?? "",
    }),
    [searchParams],
  );

  const { answers, setAnswers, stepIndex, setStepIndex, hydrated, reset } =
    useScanState();

  // Bepaal dynamisch de zichtbare vragen o.b.v. conditionele logic.
  const visible: QuestionBase[] = useMemo(
    () => visibleQuestions(answers as Partial<Answers>),
    [answers],
  );

  // Totaal aantal stappen = zichtbare vragen + 1 contact-stap.
  const totalSteps = visible.length + 1;
  const clampedIndex = Math.min(stepIndex, totalSteps - 1);
  const isContactStep = clampedIndex === visible.length;
  const current = visible[clampedIndex];

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [terminated, setTerminated] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // Focus management voor toegankelijkheid.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [clampedIndex, terminated]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-ink-500">
        <p>Scan wordt geladen…</p>
      </div>
    );
  }

  if (terminated) {
    return (
      <TerminationScreen
        {...terminated}
        onRestart={() => {
          reset();
          setTerminated(null);
        }}
      />
    );
  }

  // ── Handlers ────────────────────────────────────────────────
  function setAnswer(key: keyof Answers, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  function goNext() {
    if (current) {
      const val = answers[current.key];
      if (!val) {
        setError("Kies een optie om verder te gaan.");
        return;
      }
      const term = current.terminateIf;
      if (term && term.whenValue === val) {
        setTerminated({ title: term.title, message: term.message });
        return;
      }
    }
    setError(null);
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }

  function goBack() {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const body: Record<string, string> = {
      ...(answers as Record<string, string>),
      full_name: String(formData.get("full_name") ?? "").trim(),
      company_name: String(formData.get("company_name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      consent: formData.get("consent") === "on" ? "true" : "",
      website: String(formData.get("website") ?? ""), // honeypot
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

  const progress = Math.round(((clampedIndex + 1) / totalSteps) * 100);
  const blockInfo = current
    ? BLOCKS.find((b) => b.id === current.block)
    : BLOCKS.find((b) => b.id === "contact");

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress header */}
      <div className="mb-6 flex items-center justify-between text-sm">
        <span className="font-semibold text-ink-500">
          Stap {clampedIndex + 1} van {totalSteps}
        </span>
        <span className="text-ink-500">
          {blockInfo?.title ?? ""}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-gold-500 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="mt-10 rounded-xl border border-ink-100 bg-white p-8 shadow-soft md:p-10">
        {isContactStep ? (
          <ContactStep
            onSubmit={handleSubmit}
            onBack={goBack}
            submitting={submitting}
            error={error}
            headingRef={headingRef}
          />
        ) : current ? (
          <QuestionStep
            question={current}
            value={answers[current.key] ?? ""}
            onChange={(v) => setAnswer(current.key, v)}
            onNext={goNext}
            onBack={clampedIndex > 0 ? goBack : undefined}
            error={error}
            headingRef={headingRef}
          />
        ) : null}
      </div>

      <p className="mt-6 text-center text-xs text-ink-500">
        Uw voortgang wordt automatisch bewaard op dit apparaat.
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
function QuestionStep({
  question,
  value,
  onChange,
  onNext,
  onBack,
  error,
  headingRef,
}: {
  question: QuestionBase;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack?: () => void;
  error: string | null;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-ink-900 outline-none md:text-3xl"
      >
        {question.label}
      </h2>
      {question.help ? (
        <p className="mt-2 text-ink-600">{question.help}</p>
      ) : null}

      <div className="mt-8 space-y-2.5">
        {question.options.map((opt) => {
          const id = `${question.key}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={[
                "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition",
                checked
                  ? "border-gold-500 bg-gold-50"
                  : "border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50",
              ].join(" ")}
            >
              <input
                id={id}
                type="radio"
                name={question.key}
                value={opt.value}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
                className="size-4 accent-gold-600"
              />
              <span className="flex-1">
                <span className="block font-medium text-ink-900">{opt.label}</span>
                {opt.hint ? (
                  <span className="mt-0.5 block text-xs text-ink-500">
                    {opt.hint}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-ink-600 hover:text-ink-900"
          >
            ← Vorige
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
        >
          Volgende →
        </button>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function ContactStep({
  onSubmit,
  onBack,
  submitting,
  error,
  headingRef,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-ink-900 outline-none md:text-3xl"
      >
        Laatste stap — waar sturen we uw rapport naartoe?
      </h2>
      <p className="mt-2 text-ink-600">
        We gebruiken uw gegevens alleen om het rapport te versturen en uw situatie
        te begrijpen. Nooit gedeeld met derden.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field
          name="full_name"
          label="Uw naam"
          autoComplete="name"
          required
          placeholder="Voornaam Achternaam"
        />
        <Field
          name="company_name"
          label="Bedrijfsnaam"
          autoComplete="organization"
          required
          placeholder="Uw BV"
        />
        <Field
          name="email"
          type="email"
          label="E-mailadres"
          autoComplete="email"
          required
          placeholder="u@bedrijf.nl"
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
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-ink-700">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 size-4 accent-gold-600"
        />
        <span>
          Ik ga akkoord met{" "}
          <Link href="/privacy" className="underline hover:text-ink-900">
            het privacybeleid
          </Link>{" "}
          en begrijp dat de bevindingen in dit rapport indicatief zijn en geen
          fiscaal advies vormen.
        </span>
      </label>

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-ink-600 hover:text-ink-900"
          disabled={submitting}
        >
          ← Vorige
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gold-500 px-7 py-3 text-sm font-semibold text-ink-900 transition hover:bg-gold-400 disabled:opacity-60"
        >
          {submitting
            ? "Rapport wordt aangemaakt…"
            : "Stuur mijn persoonlijke rapport →"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-800">
        {label}
        {required ? <span className="text-gold-600"> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="block w-full rounded-md border border-ink-200 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
      />
    </label>
  );
}
