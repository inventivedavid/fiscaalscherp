// E-mailverzending via Resend.
// Template-toon: institutioneel, niet verkopend, platform-framing ("wij" / merknaam).
// Geen schaarste-claims, geen fake-urgentie, geen "gratis gesprek geen verkooppraatje" retoriek.

import { Resend } from "resend";
import { SITE } from "./site";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM ?? `${SITE.brand} <no-reply@example.com>`;
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? SITE.contactEmail;

// De kleuren matchen het nieuwe platform-palet: warm off-white, near-black ink,
// diepe amber als enkel accent op links.
function wrap(bodyHtml: string, preheader: string): string {
  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${SITE.brand}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0a0a0a;">
    <span style="display:none;overflow:hidden;line-height:1;opacity:0;max-height:0;max-width:0;">${preheader}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f4f0;">
      <tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="background:#fafaf8;border:1px solid #e7e5e0;">
          <tr><td style="padding:24px 32px;border-bottom:1px solid #e7e5e0;">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b6862;font-weight:500;">${SITE.brand}</div>
          </td></tr>
          <tr><td style="padding:32px;font-size:15px;line-height:1.65;color:#2b2a28;">
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:20px 32px;border-top:1px solid #e7e5e0;color:#97938c;font-size:12px;">
            ${SITE.brand} · <a href="mailto:${SITE.contactEmail}" style="color:#6b6862;text-decoration:underline;">${SITE.contactEmail}</a>
            ${SITE.kvkNumber ? ` · KvK ${SITE.kvkNumber}` : ""}
          </td></tr>
        </table>
        <p style="color:#97938c;font-size:11px;margin-top:20px;line-height:1.5;max-width:560px;">
          Deze mail is verstuurd omdat er een scan is ingevuld op ${SITE.url}.
          Geen vervolgmails meer ontvangen? <a href="{{unsubscribe_url}}" style="color:#6b6862;">uitschrijven</a>.
        </p>
      </td></tr>
    </table>
  </body>
</html>`;
}

const linkStyle = "color:#a16207;text-decoration:underline;font-weight:500;";

// ──────────────────────────────────────────────────────────────────────────────
// Rapport-mail met PDF-bijlage
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

  const firstName = args.fullName.split(" ")[0] ?? "";
  const euro = (n: number) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  const greeting = firstName ? `Hallo ${firstName},` : "Hallo,";

  const summary =
    args.findingCount > 0
      ? `De engine heeft <strong>${args.findingCount}</strong> ${
          args.findingCount === 1 ? "aandachtspunt" : "aandachtspunten"
        } gesignaleerd, met een indicatieve jaarlijkse bandbreedte van <strong>${euro(
          args.savingsRange.min
        )} – ${euro(args.savingsRange.max)}</strong>.`
      : `De engine signaleerde op basis van de opgegeven gegevens geen directe aandachtspunten. De volledige toets — inclusief de niet-getriggerde regels — is in het rapport gedocumenteerd.`;

  const bodyHtml = `
    <p style="margin:0 0 16px 0;">${greeting}</p>
    <p style="margin:0 0 16px 0;">
      Het rapport voor <strong>${args.companyName}</strong> is gereed. Het bestand is bijgevoegd als PDF.
    </p>
    <p style="margin:0 0 16px 0;">${summary}</p>
    <p style="margin:0 0 20px 0;">
      Het rapport is zo opgesteld dat het zelfstandig leesbaar is en zonder bezwaar aan een bestaande boekhouder of accountant kan worden voorgelegd.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
      <tr><td style="background:#0a0a0a;">
        <a href="${SITE.calUrl}" style="display:inline-block;color:#fafaf8;text-decoration:none;padding:13px 22px;font-weight:500;font-size:14px;">
          Bevindingen samen doornemen (30 min) →
        </a>
      </td></tr>
    </table>

    <p style="margin:0 0 12px 0;font-size:13px;color:#6b6862;">
      Het gesprek is kosteloos en verplicht tot niets. De lagen daarna (Optimalisatiesessie, jaarplan, volledige administratie) zijn optioneel en staan op <a href="${SITE.url}/prijzen" style="${linkStyle}">de prijzenpagina</a>.
    </p>
    <p style="margin:16px 0 0 0;font-size:12px;color:#97938c;line-height:1.6;">
      Bevindingen zijn indicatief en gebaseerd op de opgegeven ranges. Voor implementatie is betrokkenheid van een adviseur die de volledige context kent noodzakelijk. Zie de <a href="${SITE.url}/disclaimer" style="color:#97938c;text-decoration:underline;">disclaimer</a>.
    </p>
  `;

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: args.to,
      replyTo: REPLY_TO,
      subject:
        args.findingCount > 0
          ? `Rapport — ${args.companyName} (${args.findingCount} ${args.findingCount === 1 ? "aandachtspunt" : "aandachtspunten"})`
          : `Rapport — ${args.companyName}`,
      html: wrap(bodyHtml, `Rapport: ${args.findingCount} ${args.findingCount === 1 ? "aandachtspunt" : "aandachtspunten"}`),
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
// Magic-link voor het hervatten van een dossier. Geen wachtwoord, alleen een
// signed token in de URL. 30 dagen geldig (zie lib/dossierToken.ts).
// ──────────────────────────────────────────────────────────────────────────────
export async function sendDossierResumeEmail(args: {
  to: string;
  resumeUrl: string;
  progressPct: number;
  savings: { min: number; max: number };
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!resend) return { ok: false, error: "Resend is niet geconfigureerd." };

  const euro = (n: number) =>
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  const pct = Math.round(args.progressPct);

  const bodyHtml = `
    <p style="margin:0 0 16px 0;">Hallo,</p>
    <p style="margin:0 0 16px 0;">
      Je fiscaal dossier bij ${SITE.brand} is op je naam vastgelegd. Op dit moment is het voor <strong>${pct}%</strong> ingevuld; de tot nu toe in beeld gekomen optimalisatieruimte ligt op indicatief <strong>${euro(args.savings.min)} – ${euro(args.savings.max)}</strong> per jaar.
    </p>
    <p style="margin:0 0 20px 0;">
      Met de privé-link hieronder ga je verder waar je gebleven was — op elk apparaat, geen wachtwoord nodig.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
      <tr><td style="background:#0a0a0a;">
        <a href="${args.resumeUrl}" style="display:inline-block;color:#fafaf8;text-decoration:none;padding:13px 22px;font-weight:500;font-size:14px;">
          Dossier hervatten →
        </a>
      </td></tr>
    </table>

    <p style="margin:0 0 12px 0;font-size:13px;color:#6b6862;">
      De link is 30 dagen geldig en uitsluitend bestemd voor jou. Bewaar deze mail zorgvuldig — wie de link heeft, kan het dossier openen.
    </p>
    <p style="margin:16px 0 0 0;font-size:12px;color:#97938c;line-height:1.6;">
      Heb je deze mail niet aangevraagd? Verwijder hem dan; er is geen account aangemaakt en zonder de link gebeurt er niets verder.
    </p>
  `;

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: args.to,
      replyTo: REPLY_TO,
      subject: `Je dossier is vastgelegd — link om verder te gaan`,
      html: wrap(bodyHtml, `Je dossier is vastgelegd · ${pct}% ingevuld`),
    });
    if (res.error) return { ok: false, error: res.error.message };
    return { ok: true, id: res.data?.id ?? "unknown" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Follow-up mails — ingepland via Vercel Cron.
// Doel: inhoudelijke waarde bieden, geen druk opbouwen. Wie niet reageert,
// leest ze later alsnog; wie interesse heeft, vindt vanzelf de juiste link.
// ──────────────────────────────────────────────────────────────────────────────
type FollowupKind = "day2" | "day5" | "day10" | "day20" | "day30";

const FOLLOWUPS: Record<
  FollowupKind,
  (ctx: { firstName: string }) => {
    subject: string;
    html: string;
  }
> = {
  day2: ({ firstName }) => ({
    subject: "De meest voorkomende bevinding — en waarom",
    html: `
      <p style="margin:0 0 14px 0;">Hallo ${firstName || "daar"},</p>
      <p style="margin:0 0 14px 0;">
        Platform-breed is het meest geactiveerde aandachtspunt het <strong>gebruikelijk loon</strong>: in ongeveer 43 % van de voltooide scans ligt het DGA-salaris onder de norm van art. 12a LB. De onderliggende oorzaak is vaak geen bewuste keuze, maar het feit dat de doelmatigheidsmarge van 75 % per 2023 is afgeschaft en dat veel salarissen sindsdien niet zijn herzien.
      </p>
      <p style="margin:0 0 14px 0;">
        Het volledige dossier (inclusief rekenvoorbeelden en jurisprudentie) is beschikbaar op
        <a href="${SITE.url}/kennisbank/gebruikelijk-loon-2025" style="${linkStyle}">kennisbank/gebruikelijk-loon-2025</a>.
      </p>
      <p style="margin:0;font-size:13px;color:#6b6862;">
        Staat dit punt op jouw rapport? Dan is het in de context van de overige bevindingen te wegen in een kosteloos gesprek: <a href="${SITE.calUrl}" style="${linkStyle}">inplannen</a>.
      </p>
    `,
  }),
  day5: ({ firstName }) => ({
    subject: "Hoe de engine tot een bevinding komt",
    html: `
      <p style="margin:0 0 14px 0;">Hallo ${firstName || "daar"},</p>
      <p style="margin:0 0 14px 0;">
        Eén van de vragen die we regelmatig krijgen: <em>hoe komt de engine precies tot een bevinding?</em> De methodologie is open en reproduceerbaar. Elke regel is verbonden aan een wetsartikel, Kennisgroep-standpunt of besluit — en de peildatum voor tarieven en grensbedragen staat in elk rapport.
      </p>
      <p style="margin:0 0 14px 0;">
        De volledige methodologie, inclusief wat uitdrukkelijk buiten scope valt, staat op <a href="${SITE.url}/methodologie" style="${linkStyle}">${SITE.url}/methodologie</a>.
      </p>
      <p style="margin:0;font-size:13px;color:#6b6862;">
        Vragen over de toepassing op jouw rapport? Reply op deze mail volstaat.
      </p>
    `,
  }),
  day10: ({ firstName }) => ({
    subject: "Sector-benchmarks — hoe sta je ervoor?",
    html: `
      <p style="margin:0 0 14px 0;">Hallo ${firstName || "daar"},</p>
      <p style="margin:0 0 14px 0;">
        De benchmark-pagina geeft geaggregeerde cijfers per sector: gemiddeld DGA-salaris, aandeel met holdingstructuur, meest onbenutte regelingen. Deze cijfers zijn afkomstig uit voltooide scans (geanonimiseerd) en aangevuld met publieke referenties.
      </p>
      <p style="margin:0 0 14px 0;">
        <a href="${SITE.url}/benchmarks" style="${linkStyle}">Bekijk de benchmark-tabel</a>.
      </p>
      <p style="margin:0;font-size:13px;color:#6b6862;">
        Het rapport plaatst jouw bevindingen in deze context. Wie de cijfers samen wil doornemen: <a href="${SITE.calUrl}" style="${linkStyle}">gesprek inplannen</a>.
      </p>
    `,
  }),
  day20: ({ firstName }) => ({
    subject: "Box 2 na 2024 — timing en volgorde",
    html: `
      <p style="margin:0 0 14px 0;">Hallo ${firstName || "daar"},</p>
      <p style="margin:0 0 14px 0;">
        Sinds 2024 kent box 2 een tweeschijvenstelsel: 24,5 % tot € 67.804 (per partner) en 31 % daarboven. Timing en volgorde van dividenduitkeringen maken daarmee een kwantificeerbaar verschil. Voor DGA's met liquiditeit in de BV is een meerjaarsplanning vaak concreet uit te werken.
      </p>
      <p style="margin:0 0 14px 0;">
        Het volledige dossier: <a href="${SITE.url}/kennisbank/box-2-dividend-volgorde" style="${linkStyle}">kennisbank/box-2-dividend-volgorde</a>.
      </p>
      <p style="margin:0;font-size:13px;color:#6b6862;">
        Wie dit in een 30-min-gesprek concreet wil doorrekenen: <a href="${SITE.calUrl}" style="${linkStyle}">tijd reserveren</a>.
      </p>
    `,
  }),
  day30: ({ firstName }) => ({
    subject: "Laatste bericht uit deze reeks",
    html: `
      <p style="margin:0 0 14px 0;">Hallo ${firstName || "daar"},</p>
      <p style="margin:0 0 14px 0;">
        Dit is de laatste mail in de vervolgreeks na je scan. Het platform blijft actief — de scan kun je jaarlijks herhalen om te zien hoe je positie zich ontwikkelt, en de tools, benchmarks en kennisbank zijn vrij toegankelijk.
      </p>
      <p style="margin:0 0 14px 0;">
        Mocht je op enig moment de bevindingen willen bespreken of een vervolgstap overwegen, de <a href="${SITE.calUrl}" style="${linkStyle}">kennismaking</a> blijft beschikbaar.
      </p>
      <p style="margin:0;font-size:13px;color:#6b6862;">
        Dank voor het gebruiken van ${SITE.brand}.
      </p>
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
  const firstName = args.fullName.split(" ")[0] ?? "";
  const tpl = FOLLOWUPS[args.kind]({ firstName });

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
