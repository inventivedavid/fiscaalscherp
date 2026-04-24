// E-mail verzending via Resend.
// Alle templates zijn eenvoudige, responsive HTML — geen framework.

import { Resend } from "resend";
import { SITE } from "./site";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM ?? `${SITE.brand} <no-reply@example.com>`;
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? SITE.contactEmail;

function wrap(bodyHtml: string, preheader: string): string {
  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${SITE.brand}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6fa;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#111b2e;">
    <span style="display:none;overflow:hidden;line-height:1;opacity:0;max-height:0;max-width:0;">${preheader}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f6fa;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:8px;box-shadow:0 10px 30px -10px rgba(17,27,46,0.12);overflow:hidden;">
          <tr><td style="padding:20px 28px;border-bottom:1px solid #e4e9f2;">
            <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#b9721d;font-weight:700;">${SITE.brand}</div>
          </td></tr>
          <tr><td style="padding:28px;">
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:16px 28px;background:#f4f6fa;color:#6278a1;font-size:12px;">
            ${SITE.brand} · <a href="mailto:${SITE.contactEmail}" style="color:#425a85;">${SITE.contactEmail}</a>
            ${SITE.kvkNumber ? ` · KvK ${SITE.kvkNumber}` : ""}
          </td></tr>
        </table>
        <p style="color:#6278a1;font-size:11px;margin-top:16px;">
          Je ontvangt deze mail omdat je de ${SITE.brand} hebt ingevuld.
          Wil je geen vervolgmails? <a href="{{unsubscribe_url}}" style="color:#6278a1;">uitschrijven</a>.
        </p>
      </td></tr>
    </table>
  </body>
</html>`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Rapport-mail met PDF bijlage
// ──────────────────────────────────────────────────────────────────────────────
export async function sendReportEmail(args: {
  to: string;
  fullName: string;
  companyName: string;
  findingCount: number;
  savingsRange: { min: number; max: number };
  pdf: Buffer;
  filename: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!resend) return { ok: false, error: "Resend is niet geconfigureerd." };

  const firstName = args.fullName.split(" ")[0] ?? "daar";
  const euro = (n: number) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  const bodyHtml = `
    <h1 style="font-size:24px;margin:0 0 12px 0;color:#111b2e;">Hoi ${firstName},</h1>
    <p style="font-size:15px;line-height:1.6;color:#2f4268;margin:0 0 16px 0;">
      Je persoonlijke fiscale scan is klaar. In de bijlage vind je het rapport.
      We hebben <strong>${args.findingCount}</strong> ${args.findingCount === 1 ? "optimalisatiepunt" : "optimalisatiepunten"} gevonden, met een indicatieve jaarlijkse besparing van
      <strong>${euro(args.savingsRange.min)} – ${euro(args.savingsRange.max)}</strong>.
    </p>
    <p style="font-size:15px;line-height:1.6;color:#2f4268;margin:0 0 16px 0;">
      Neem het rustig door. Wil je de bevindingen samen even bespreken? Plan vrijblijvend een gesprek van 30 minuten — geen verkooppraatje, we lopen het rapport met je door.
    </p>
    <p style="margin:24px 0;">
      <a href="${SITE.calUrl}"
         style="display:inline-block;background:#111b2e;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:6px;font-weight:600;font-size:15px;">
        Plan gratis gesprek (30 min) →
      </a>
    </p>
    <p style="font-size:13px;color:#6278a1;line-height:1.6;">
      Let op: de bevindingen in dit rapport zijn indicatief en gebaseerd op de
      door jou opgegeven ranges. Voor concrete implementatie is nader onderzoek en
      persoonlijk advies vereist.
    </p>
  `;

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: args.to,
      replyTo: REPLY_TO,
      subject: `Je fiscale scan voor ${args.companyName} — ${args.findingCount} aandachtspunten`,
      html: wrap(bodyHtml, `Je persoonlijke rapport — ${args.findingCount} aandachtspunten gevonden.`),
      attachments: [
        {
          filename: args.filename,
          content: args.pdf,
        },
      ],
    });
    if (res.error) return { ok: false, error: res.error.message };
    return { ok: true, id: res.data?.id ?? "unknown" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Follow-up mails (Vercel Cron, dag 2 / 5 / 10 / 20 / 30)
// ──────────────────────────────────────────────────────────────────────────────
type FollowupKind = "day2" | "day5" | "day10" | "day20" | "day30";

const FOLLOWUPS: Record<
  FollowupKind,
  (ctx: { firstName: string; company: string }) => {
    subject: string;
    html: string;
  }
> = {
  day2: ({ firstName }) => ({
    subject: "Eén specifiek DGA-dossier dat ik vaak tegenkom",
    html: `
      <p>Hoi ${firstName},</p>
      <p>Eén van de meest gemiste optimalisaties die ik in DGA-dossiers zie: een holdingstructuur die wél aanwezig is, maar niet actief wordt gebruikt voor dividendplanning. Onze laatste cliënt in een vergelijkbare situatie bespaarde zo indicatief € 4.800 per jaar — niet door méér werk, maar door een andere volgorde in uitkeringen.</p>
      <p>Als je wilt dat ik specifiek naar jouw situatie kijk, plan dan even een kort gesprek:</p>
      <p><a href="${SITE.calUrl}" style="color:#b9721d;font-weight:600;">Plan 30 min →</a></p>
    `,
  }),
  day5: ({ firstName }) => ({
    subject: "Een verdieping op je rapport",
    html: `
      <p>Hoi ${firstName},</p>
      <p>Heb je je rapport al kunnen doornemen? Ik merk vaak dat er één punt uitspringt dat mensen meteen willen bespreken, en een ander punt waar ze eerst nog wat rond moeten lopen.</p>
      <p>Wil je dat ik je bel om de hoofdlijn door te nemen? Geen verkoop, gewoon even samen door de bevindingen — meestal 20 minuten, soms 30.</p>
      <p><a href="${SITE.calUrl}" style="color:#b9721d;font-weight:600;">Plan een moment →</a></p>
    `,
  }),
  day10: ({ firstName }) => ({
    subject: "Heeft je boekhouder hier al iets over gezegd?",
    html: `
      <p>Hoi ${firstName},</p>
      <p>Een eerlijke vraag: heb je de bevindingen uit het rapport al voorgelegd aan je huidige boekhouder of accountant? Nieuwsgierig naar hun reactie — of er dingen ter sprake zijn gekomen die je zelf nog niet op de radar had.</p>
      <p>Antwoord gerust kort op deze mail, daar leer ik ook weer van.</p>
    `,
  }),
  day20: ({ firstName }) => ({
    subject: "Eén wetswijziging die jouw situatie raakt",
    html: `
      <p>Hoi ${firstName},</p>
      <p>Korte update: de box 2-tarieven in 2025 (24,5% tot € 67.804, 31% daarboven per fiscaal partner) maken slimme gefaseerde dividenduitkeringen weer extra aantrekkelijk. Voor DGA's met liquiditeit in de BV is dit vaak het moment om eens door een 3-jaars planning te lopen.</p>
      <p>Als je de komende weken even wilt sparren — <a href="${SITE.calUrl}" style="color:#b9721d;font-weight:600;">plan vrijblijvend 30 min</a>.</p>
    `,
  }),
  day30: ({ firstName }) => ({
    subject: "Nog twee plekken deze maand",
    html: `
      <p>Hoi ${firstName},</p>
      <p>We hebben deze maand nog twee vrije plekken voor een gratis vervolggesprek. Mocht je willen, kun je hieronder een tijd kiezen. Daarna laat ik je met rust — beloofd.</p>
      <p><a href="${SITE.calUrl}" style="color:#b9721d;font-weight:600;">Plan mijn gratis gesprek →</a></p>
    `,
  }),
};

export async function sendFollowupEmail(args: {
  to: string;
  fullName: string;
  companyName: string;
  kind: FollowupKind;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!resend) return { ok: false, error: "Resend is niet geconfigureerd." };
  const firstName = args.fullName.split(" ")[0] ?? "daar";
  const tpl = FOLLOWUPS[args.kind]({
    firstName,
    company: args.companyName,
  });

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: args.to,
      replyTo: REPLY_TO,
      subject: tpl.subject,
      html: wrap(tpl.html, tpl.subject),
    });
    if (res.error) return { ok: false, error: res.error.message };
    return { ok: true, id: res.data?.id ?? "unknown" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
