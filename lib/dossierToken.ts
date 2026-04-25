// Signed dossier-tokens. We slaan de hele draft niet op de server op —
// we coderen 'm in een base64url payload + HMAC-SHA256 handtekening.
// Daardoor blijft de magic-link self-contained en hebben we geen DB-lookup
// nodig om hem te valideren.
//
// Geheim: DOSSIER_SECRET (env). Fallback: CRON_SECRET zodat hij in dev
// werkt zonder dat we voor één feature aparte env-vars nodig hebben.

import crypto from "node:crypto";
import type { AnswerState } from "@/components/cockpit/store";
import type { SectionId } from "@/components/cockpit/sections";

const SECRET =
  process.env.DOSSIER_SECRET ||
  process.env.CRON_SECRET ||
  "fiscaalscherp-dev-secret";

const TOKEN_VERSION = 1;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 dagen

export type DossierPayload = {
  v: number;
  email: string;
  iat: number;
  answers: AnswerState;
  completedSections: SectionId[];
  questionIndex: number;
};

function base64urlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function sign(data: string): string {
  return base64urlEncode(
    crypto.createHmac("sha256", SECRET).update(data).digest(),
  );
}

export function createDossierToken(payload: Omit<DossierPayload, "v" | "iat">): string {
  const full: DossierPayload = {
    v: TOKEN_VERSION,
    iat: Date.now(),
    ...payload,
  };
  const json = JSON.stringify(full);
  const body = base64urlEncode(Buffer.from(json, "utf8"));
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifyDossierToken(token: string): DossierPayload | null {
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = sign(body);
  // Constant-time vergelijking
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }

  let payload: DossierPayload;
  try {
    payload = JSON.parse(base64urlDecode(body).toString("utf8"));
  } catch {
    return null;
  }

  if (payload.v !== TOKEN_VERSION) return null;
  if (typeof payload.iat !== "number") return null;
  if (Date.now() - payload.iat > MAX_AGE_MS) return null;

  return payload;
}
