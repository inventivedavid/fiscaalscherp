"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  QUESTIONS,
  visibleQuestions,
  type Answers,
  type QuestionKey,
} from "@/lib/questions";
import { runFlagEngine, totalSavingsRange, type Finding } from "@/lib/flags";
import { SECTIONS, type SectionId } from "./sections";

const STORAGE_KEY = "fs.dossier.v1";

export type Phase =
  | "boot"
  | "section"
  | "reveal"
  | "persist"
  | "final"
  | "activate"
  | "submitted";

export type AnswerState = Partial<Record<QuestionKey, string>>;

export type State = {
  phase: Phase;
  /** Index in de zichtbare-vragen-lijst die we momenteel afnemen. */
  questionIndex: number;
  /** Welke sectie we het laatst voltooiden — voor de reveal-fase. */
  revealSectionId: SectionId | null;
  /** Sectie-ids die volledig zijn beantwoord en een stempel hebben gekregen. */
  completedSections: SectionId[];
  /** Alle antwoorden tot nu toe. */
  answers: AnswerState;
  /** Heeft de DGA email achtergelaten om het dossier te bewaren? */
  persisted: boolean;
  persistedEmail: string | null;
  /** Heeft de DGA de persist-stap afgewezen? */
  persistDeclined: boolean;
  /** Heeft de DGA de scan beëindigd door 'role: other'? */
  terminated: { title: string; message: string } | null;
  /** Hervat-token: indien deze flow is geopend via /resume/[token]. */
  resumeToken: string | null;
};

const INITIAL_STATE: State = {
  phase: "boot",
  questionIndex: 0,
  revealSectionId: null,
  completedSections: [],
  answers: {},
  persisted: false,
  persistedEmail: null,
  persistDeclined: false,
  terminated: null,
  resumeToken: null,
};

type Action =
  | { type: "BOOT_DONE" }
  | { type: "SET_ANSWER"; key: QuestionKey; value: string }
  | { type: "ADVANCE" }
  | { type: "BACK" }
  | { type: "TERMINATE"; title: string; message: string }
  | { type: "REVEAL_DONE" }
  | { type: "PERSIST_OPEN" }
  | { type: "PERSIST_SAVED"; email: string }
  | { type: "PERSIST_DECLINED" }
  | { type: "GOTO_FINAL" }
  | { type: "GOTO_ACTIVATE" }
  | { type: "BACK_FROM_ACTIVATE" }
  | { type: "MARK_SUBMITTED" }
  | { type: "RESET" }
  | { type: "HYDRATE"; partial: Partial<State> };

function visibleList(answers: AnswerState) {
  return visibleQuestions(answers as Partial<Answers>);
}

function questionAt(answers: AnswerState, index: number) {
  return visibleList(answers)[index] ?? null;
}

function sectionForQuestionIndex(
  answers: AnswerState,
  index: number,
): SectionId | null {
  const list = visibleList(answers);
  const q = list[index];
  if (!q) return null;
  if (q.block === "contact") return null;
  return q.block as SectionId;
}

function isLastQuestionInSection(answers: AnswerState, index: number): boolean {
  const list = visibleList(answers);
  const cur = list[index];
  const next = list[index + 1];
  if (!cur) return true;
  if (cur.block === "contact") return false;
  if (!next) return true;
  return next.block !== cur.block;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "BOOT_DONE":
      return { ...state, phase: "section" };

    case "SET_ANSWER": {
      const next: AnswerState = { ...state.answers, [action.key]: action.value };
      // Als een eerder antwoord een conditie sloot waardoor latere vragen
      // verschijnen of verdwijnen, normaliseer questionIndex.
      const list = visibleList(next);
      const safeIndex = Math.min(state.questionIndex, Math.max(0, list.length - 1));
      return { ...state, answers: next, questionIndex: safeIndex };
    }

    case "ADVANCE": {
      const cur = questionAt(state.answers, state.questionIndex);
      if (!cur) return state;

      // Termination check via questions.ts (bv. role=other).
      const term = cur.terminateIf;
      const val = state.answers[cur.key];
      if (term && val === term.whenValue) {
        return {
          ...state,
          terminated: { title: term.title, message: term.message },
        };
      }

      const list = visibleList(state.answers);
      const isLast = state.questionIndex >= list.length - 1;
      const lastInSection = isLastQuestionInSection(state.answers, state.questionIndex);

      if (lastInSection) {
        const sectionId = cur.block as SectionId;
        const completed = state.completedSections.includes(sectionId)
          ? state.completedSections
          : [...state.completedSections, sectionId];
        return {
          ...state,
          phase: "reveal",
          revealSectionId: sectionId,
          completedSections: completed,
          questionIndex: isLast ? state.questionIndex : state.questionIndex + 1,
        };
      }

      return { ...state, questionIndex: state.questionIndex + 1 };
    }

    case "BACK": {
      if (state.phase === "section") {
        return { ...state, questionIndex: Math.max(0, state.questionIndex - 1) };
      }
      if (state.phase === "reveal") {
        // Terug betekent: ga terug naar de laatst beantwoorde vraag van de sectie.
        return { ...state, phase: "section" };
      }
      return state;
    }

    case "TERMINATE":
      return {
        ...state,
        terminated: { title: action.title, message: action.message },
      };

    case "REVEAL_DONE": {
      // Na de reveal: persist-prompt na sectie 2 als nog niet gedaan,
      // anders door naar volgende sectie of eindscherm.
      const allSections = SECTIONS.map((s) => s.id);
      const allDone = allSections.every((id) =>
        state.completedSections.includes(id),
      );

      if (allDone) {
        return { ...state, phase: "final", revealSectionId: null };
      }

      const completedCount = state.completedSections.length;
      const shouldPromptPersist =
        completedCount === 2 && !state.persisted && !state.persistDeclined;

      if (shouldPromptPersist) {
        return { ...state, phase: "persist", revealSectionId: null };
      }

      return { ...state, phase: "section", revealSectionId: null };
    }

    case "PERSIST_OPEN":
      return { ...state, phase: "persist" };

    case "PERSIST_SAVED":
      return {
        ...state,
        persisted: true,
        persistedEmail: action.email,
        phase: "section",
      };

    case "PERSIST_DECLINED":
      return { ...state, persistDeclined: true, phase: "section" };

    case "GOTO_FINAL":
      return { ...state, phase: "final", revealSectionId: null };

    case "GOTO_ACTIVATE":
      return { ...state, phase: "activate" };

    case "BACK_FROM_ACTIVATE":
      return { ...state, phase: "final" };

    case "MARK_SUBMITTED":
      return { ...state, phase: "submitted" };

    case "RESET":
      return { ...INITIAL_STATE, phase: "section" };

    case "HYDRATE":
      return { ...state, ...action.partial };

    default:
      return state;
  }
}

type CockpitContextValue = {
  state: State;
  dispatch: React.Dispatch<Action>;
  // Afgeleide waardes — handig voor componenten zonder eigen rekenwerk.
  visibleQuestionList: ReturnType<typeof visibleList>;
  currentQuestion: ReturnType<typeof questionAt>;
  currentSectionId: SectionId | null;
  findings: Finding[];
  totalRange: { min: number; max: number };
  progress: { sectionsDone: number; sectionsTotal: number; pct: number };
  setAnswer: (key: QuestionKey, value: string) => void;
  advance: () => void;
  back: () => void;
  bootDone: () => void;
  revealDone: () => void;
  persistSaved: (email: string) => void;
  persistDeclined: () => void;
  gotoActivate: () => void;
  backFromActivate: () => void;
  markSubmitted: () => void;
  reset: () => void;
};

const CockpitContext = createContext<CockpitContextValue | null>(null);

export function CockpitProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Partial<State>;
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...initial,
  });

  // Hydrateer uit localStorage bij mount (alleen client-side).
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    // Als er een resume-token is meegegeven, sla localStorage over —
    // de SSR/initial heeft het al gehydreerd.
    if (initial?.resumeToken) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<State> & { v?: number };
      if (parsed.v !== 1) return;
      dispatch({
        type: "HYDRATE",
        partial: {
          phase: parsed.phase ?? "boot",
          questionIndex: parsed.questionIndex ?? 0,
          completedSections: parsed.completedSections ?? [],
          answers: parsed.answers ?? {},
          persisted: parsed.persisted ?? false,
          persistedEmail: parsed.persistedEmail ?? null,
          persistDeclined: parsed.persistDeclined ?? false,
          revealSectionId: null,
        },
      });
    } catch {
      /* corrupt draft, negeer */
    }
  }, [initial?.resumeToken]);

  // Persist naar localStorage bij iedere relevante wijziging.
  useEffect(() => {
    try {
      const toStore = {
        v: 1,
        phase: state.phase === "reveal" ? "section" : state.phase,
        questionIndex: state.questionIndex,
        completedSections: state.completedSections,
        answers: state.answers,
        persisted: state.persisted,
        persistedEmail: state.persistedEmail,
        persistDeclined: state.persistDeclined,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      /* storage vol of geweigerd */
    }
  }, [
    state.phase,
    state.questionIndex,
    state.completedSections,
    state.answers,
    state.persisted,
    state.persistedEmail,
    state.persistDeclined,
  ]);

  const visibleQuestionList = useMemo(
    () => visibleList(state.answers),
    [state.answers],
  );
  const currentQuestion = useMemo(
    () => questionAt(state.answers, state.questionIndex),
    [state.answers, state.questionIndex],
  );
  const currentSectionId = useMemo(
    () => sectionForQuestionIndex(state.answers, state.questionIndex),
    [state.answers, state.questionIndex],
  );

  // Live findings: draaien zodra alle keys ingevuld zijn die een regel
  // nodig heeft. We bouwen een 'optimistisch' Answers-object met defaults
  // voor nog niet beantwoorde keys, zodat de teller mee kan stijgen.
  const { findings, totalRange } = useMemo(() => {
    const optimistic = optimisticAnswers(state.answers);
    const fs = runFlagEngine(optimistic);
    return { findings: fs, totalRange: totalSavingsRange(fs) };
  }, [state.answers]);

  const progress = useMemo(() => {
    const total = SECTIONS.length;
    const done = state.completedSections.length;
    return { sectionsDone: done, sectionsTotal: total, pct: (done / total) * 100 };
  }, [state.completedSections]);

  const setAnswer = useCallback(
    (key: QuestionKey, value: string) =>
      dispatch({ type: "SET_ANSWER", key, value }),
    [],
  );
  const advance = useCallback(() => dispatch({ type: "ADVANCE" }), []);
  const back = useCallback(() => dispatch({ type: "BACK" }), []);
  const bootDone = useCallback(() => dispatch({ type: "BOOT_DONE" }), []);
  const revealDone = useCallback(() => dispatch({ type: "REVEAL_DONE" }), []);
  const persistSaved = useCallback(
    (email: string) => dispatch({ type: "PERSIST_SAVED", email }),
    [],
  );
  const persistDeclined = useCallback(
    () => dispatch({ type: "PERSIST_DECLINED" }),
    [],
  );
  const gotoActivate = useCallback(() => dispatch({ type: "GOTO_ACTIVATE" }), []);
  const backFromActivate = useCallback(
    () => dispatch({ type: "BACK_FROM_ACTIVATE" }),
    [],
  );
  const markSubmitted = useCallback(() => dispatch({ type: "MARK_SUBMITTED" }), []);
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    dispatch({ type: "RESET" });
  }, []);

  const value: CockpitContextValue = {
    state,
    dispatch,
    visibleQuestionList,
    currentQuestion,
    currentSectionId,
    findings,
    totalRange,
    progress,
    setAnswer,
    advance,
    back,
    bootDone,
    revealDone,
    persistSaved,
    persistDeclined,
    gotoActivate,
    backFromActivate,
    markSubmitted,
    reset,
  };

  return (
    <CockpitContext.Provider value={value}>{children}</CockpitContext.Provider>
  );
}

export function useCockpit(): CockpitContextValue {
  const ctx = useContext(CockpitContext);
  if (!ctx) throw new Error("useCockpit moet binnen <CockpitProvider> gebruikt worden");
  return ctx;
}

// ──────────────────────────────────────────────────────────────────────────────
// Optimistische Answers — vult nog niet beantwoorde keys met "neutrale" waardes
// zodat de flag-engine al mag draaien op partiële invoer. We mappen de in
// QUESTIONS gedefinieerde defaults; voor keys die per definitie niet kunnen,
// laten we een veilig default-object meelopen.
// ──────────────────────────────────────────────────────────────────────────────
const NEUTRAL_DEFAULTS: Answers = {
  role: "dga",
  sector: "anders",
  revenue: "200_500k",
  profit: "50_100k",
  employees: "0",
  has_holding: "no",
  dividend_flow: "none",
  direct_shares_in_bv: "no",
  dga_salary: "50_70k",
  salary_last_reviewed: "1_2y",
  lease_car: "none",
  liquid_funds: "lt_25k",
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

function optimisticAnswers(partial: AnswerState): Answers {
  const out = { ...NEUTRAL_DEFAULTS };
  for (const q of QUESTIONS) {
    const v = partial[q.key];
    if (v !== undefined && v !== "") {
      // Type assertion is safe — Answers' value-types zijn allemaal string-unions.
      (out as Record<string, string>)[q.key] = v;
    }
  }
  return out;
}
