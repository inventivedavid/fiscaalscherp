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

type AnswerState = Partial<Record<keyof Answers, string>>;

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
    <div className="mx-auto max-w-xl rounded-2xl border border-line bg-canvas-50 p-10 text-center shadow-card">
      <h2 className="font-display text-3xl text-ink">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-soft">{message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRestart}
          className="rounded-full border border-line bg-canvas px-5 py-2.5 text-sm text-ink hover:bg-canvas-100"
        >
          Scan opnieuw starten
        </button>
        <Link
          href="/"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas hover:bg-ink-soft"
        >
          Terug naar home
        </Link>
      </div>
    </div>
  );
}

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

  const visible: QuestionBase[] = useMemo(
    () => visibleQuestions(answers as Partial<Answers>),
    [answers],
  );

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

  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [clampedIndex, terminated]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-ink-muted">
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
      website: String(formData.get("website") ?? ""),
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
      <div className="mb-4 flex items-center justify-between text-xs font-medium uppercase tracking-eyebrow">
        <span className="text-ink-muted tabular-nums">
          Stap {clampedIndex + 1} / {totalSteps}
        </span>
        <span className="text-ink-muted">{blockInfo?.title ?? ""}</span>
      </div>
      <div className="h-px w-full overflow-hidden bg-line">
        <div
          className="h-full bg-ink transition-[width] duration-300"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-canvas-50 p-8 shadow-card md:p-10">
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

      <p className="mt-5 text-center text-xs text-ink-subtle">
        Je voortgang wordt automatisch bewaard op dit apparaat.
      </p>
    </div>
  );
}

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
        className="font-display text-2xl text-ink outline-none md:text-3xl"
      >
        {question.label}
      </h2>
      {question.help ? (
        <p className="mt-3 text-base text-ink-muted">{question.help}</p>
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
                "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition",
                checked
                  ? "border-ink bg-canvas"
                  : "border-line bg-canvas hover:border-line-strong hover:bg-canvas",
              ].join(" ")}
            >
              <input
                id={id}
                type="radio"
                name={question.key}
                value={opt.value}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
                className="mt-0.5 size-4 accent-ink"
              />
              <span className="flex-1">
                <span className="block text-sm font-medium text-ink">
                  {opt.label}
                </span>
                {opt.hint ? (
                  <span className="mt-0.5 block text-xs text-ink-subtle">
                    {opt.hint}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {error ? (
        <p className="mt-4 text-sm text-accent-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-ink-muted hover:text-ink"
          >
            ← Vorige
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition hover:bg-ink-soft"
        >
          Volgende
        </button>
      </div>
    </>
  );
}

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
        className="font-display text-2xl text-ink outline-none md:text-3xl"
      >
        Waar sturen we je rapport naartoe?
      </h2>
      <p className="mt-3 text-base text-ink-muted">
        Enkel nodig om het persoonlijke rapport te versturen. Geen commerciële doorverkoop, geen deling met derden. Uitschrijven uit eventuele vervolg-mails gaat met één klik.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
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
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 size-4 accent-ink"
        />
        <span>
          Ik ga akkoord met het{" "}
          <Link
            href="/privacy"
            className="underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            privacybeleid
          </Link>{" "}
          en begrijp dat de bevindingen indicatief zijn en geen fiscaal advies vormen.
        </span>
      </label>

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-accent-300 bg-accent-50 p-4 text-sm text-accent-700"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-ink-muted hover:text-ink disabled:opacity-50"
          disabled={submitting}
        >
          ← Vorige
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-canvas transition hover:bg-ink-soft disabled:opacity-60"
        >
          {submitting ? "Rapport wordt aangemaakt…" : "Stuur mijn rapport"}
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
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
        {label}
        {required ? <span className="text-accent-500"> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-line bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
      />
    </label>
  );
}
