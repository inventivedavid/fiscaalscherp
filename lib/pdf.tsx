// Server-side PDF generatie met @react-pdf/renderer.
// Draait op Vercel Node runtime (niet edge) — geen Chromium nodig.

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Answers } from "./questions";
import type { Finding } from "./flags";
import { totalSavingsRange } from "./flags";
import { SITE } from "./site";

// ──────────────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────────────
const COLORS = {
  ink: "#111b2e",
  inkSoft: "#2f4268",
  inkMuted: "#6278a1",
  gold: "#b9721d",
  goldSoft: "#faf0d4",
  border: "#e4e9f2",
  bg: "#f4f6fa",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: COLORS.ink,
    padding: 56,
    lineHeight: 1.5,
  },
  h1: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginBottom: 4,
  },
  h2: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginBottom: 8,
    marginTop: 20,
  },
  h3: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginBottom: 4,
  },
  muted: { color: COLORS.inkMuted },
  small: { fontSize: 9 },

  brand: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.gold,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  coverBox: {
    marginTop: 180,
    paddingTop: 24,
    paddingBottom: 24,
    borderTop: `2pt solid ${COLORS.gold}`,
    borderBottom: `1pt solid ${COLORS.border}`,
  },

  card: {
    backgroundColor: COLORS.bg,
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  severityPill: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginRight: 6,
    textTransform: "uppercase",
  },

  findingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  findingTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    flex: 1,
    paddingRight: 10,
  },
  findingSaving: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.gold,
    textAlign: "right",
    minWidth: 90,
  },

  matrixBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 12,
  },
  matrixRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 4,
  },
  matrixCell: { flex: 1, fontSize: 9 },
  matrixCellBold: { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold" },

  footer: {
    position: "absolute",
    left: 56,
    right: 56,
    bottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    color: COLORS.inkMuted,
    fontSize: 8,
  },
});

// ──────────────────────────────────────────────────────────────────────────────
// Small components
// ──────────────────────────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: Finding["severity"] }) {
  const map = {
    critical: { label: "Kritiek", bg: "#8a1d1d" },
    high: { label: "Hoog", bg: "#b9721d" },
    medium: { label: "Middel", bg: "#425a85" },
    info: { label: "Signaal", bg: "#95a5c2" },
  } as const;
  const { label, bg } = map[severity];
  return <Text style={[styles.severityPill, { backgroundColor: bg }]}>{label}</Text>;
}

function Footer({ clientName }: { clientName: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text>
        {SITE.brand} · Indicatief rapport voor {clientName}
      </Text>
      <Text
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

function euro(n: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

// ──────────────────────────────────────────────────────────────────────────────
// Document
// ──────────────────────────────────────────────────────────────────────────────
export type ReportProps = {
  answers: Answers;
  findings: Finding[];
  reportId: string;
  generatedAt: Date;
};

export function ReportDocument({
  answers,
  findings,
  reportId,
  generatedAt,
}: ReportProps) {
  const total = totalSavingsRange(findings);
  const firstName = answers.full_name.split(" ")[0] ?? answers.full_name;
  const dateStr = generatedAt.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document
      title={`Belastingscan — ${answers.full_name}`}
      author={SITE.brand}
      creator={SITE.brand}
    >
      {/* COVER */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>{SITE.brand}</Text>
        <View style={styles.coverBox}>
          <Text style={styles.h1}>Persoonlijke fiscale scan</Text>
          <Text style={{ fontSize: 14, color: COLORS.inkSoft, marginBottom: 16 }}>
            Opgesteld voor {answers.full_name} · {answers.company_name}
          </Text>
          <Text style={styles.muted}>Datum: {dateStr}</Text>
          <Text style={styles.muted}>Referentie: {reportId}</Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={styles.h3}>In dit rapport</Text>
          <Text style={styles.muted}>1. Samenvatting</Text>
          <Text style={styles.muted}>2. Bevindingen in detail</Text>
          <Text style={styles.muted}>3. Prioriteringsmatrix</Text>
          <Text style={styles.muted}>4. Vervolgmogelijkheden</Text>
          <Text style={styles.muted}>5. Methodologie en disclaimer</Text>
        </View>

        <Footer clientName={firstName} />
      </Page>

      {/* 1. SAMENVATTING */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>1 · Samenvatting</Text>
        <Text style={styles.h1}>Diagnose</Text>

        <View style={{ flexDirection: "row", marginTop: 18, gap: 10 }}>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.muted}>Aandachtspunten gesignaleerd</Text>
            <Text style={{ fontSize: 32, fontFamily: "Helvetica-Bold" }}>
              {findings.length}
            </Text>
          </View>
          <View style={[styles.card, { flex: 1, backgroundColor: COLORS.goldSoft }]}>
            <Text style={styles.muted}>Indicatieve jaarlijkse bandbreedte</Text>
            <Text
              style={{
                fontSize: 22,
                fontFamily: "Helvetica-Bold",
                color: COLORS.gold,
              }}
            >
              {euro(total.min)} – {euro(total.max)}
            </Text>
          </View>
        </View>

        <Text style={styles.h2}>Meest significante bevinding</Text>
        {findings[0] ? (
          <View>
            <Text style={styles.h3}>{findings[0].title}</Text>
            <Text style={{ color: COLORS.inkSoft }}>{findings[0].body}</Text>
          </View>
        ) : (
          <Text style={styles.muted}>
            De engine heeft op basis van de opgegeven gegevens geen directe
            aandachtspunten gesignaleerd. Dit betekent dat de structuur op de
            gemeten indicatoren geen rode vlaggen afgeeft — het betekent niet dat
            er niets te optimaliseren valt. Een volledige beoordeling met een
            adviseur die de hele context kent, kan dieper gaan dan een
            geautomatiseerde toets.
          </Text>
        )}

        <Text style={styles.h2}>Leeswijzer</Text>
        <Text style={styles.muted}>
          Elke bevinding wordt gepresenteerd met een toelichting, een
          indicatieve bandbreedte en een complexiteitsinschatting. De
          prioriteringsmatrix ordent de bevindingen op impact tegen
          complexiteit. Alle bedragen zijn indicatief en gebaseerd op de
          opgegeven ranges — implementatie vereist gesprek met een adviseur die
          de volledige context kent.
        </Text>

        <Footer clientName={firstName} />
      </Page>

      {/* 2. BEVINDINGEN IN DETAIL */}
      {findings.length > 0 ? (
        <Page size="A4" style={styles.page}>
          <Text style={styles.brand}>2 · Bevindingen in detail</Text>
          <Text style={styles.h1}>Per punt, wat en waarom</Text>

          {findings.map((f, idx) => (
            <View
              key={f.id}
              style={styles.card}
              wrap={false}
              break={idx > 0 && idx % 2 === 0}
            >
              <View style={styles.findingHeader}>
                <Text style={styles.findingTitle}>
                  {idx + 1}. {f.title}
                </Text>
                <Text style={styles.findingSaving}>
                  {f.savingsMaxEur === 0
                    ? "Procesadvies"
                    : `${euro(f.savingsMinEur)} – ${euro(f.savingsMaxEur)}`}
                </Text>
              </View>
              <View style={styles.pill}>
                <SeverityBadge severity={f.severity} />
                <Text style={styles.small}>Complexiteit: {f.complexity}</Text>
              </View>
              <Text>{f.body}</Text>
              <Text
                style={{
                  marginTop: 8,
                  color: COLORS.gold,
                  fontFamily: "Helvetica-Oblique",
                  fontSize: 9.5,
                }}
              >
                ➜ {f.nextStepHint}
              </Text>
            </View>
          ))}

          <Footer clientName={firstName} />
        </Page>
      ) : null}

      {/* 3. PRIORITERINGSMATRIX */}
      {findings.length > 0 ? (
        <Page size="A4" style={styles.page}>
          <Text style={styles.brand}>3 · Prioriteringsmatrix</Text>
          <Text style={styles.h1}>Waar begin je?</Text>
          <Text style={styles.muted}>
            Hieronder staan de bevindingen geordend op impact (severity) versus
            complexiteit. De ideale startpunten zijn hoge impact + lage
            complexiteit: daar haal je snel zichtbare winst.
          </Text>

          <View style={[styles.matrixBox, { marginTop: 14 }]}>
            <View style={styles.matrixRow}>
              <Text style={styles.matrixCellBold}>Bevinding</Text>
              <Text style={styles.matrixCellBold}>Impact</Text>
              <Text style={styles.matrixCellBold}>Complexiteit</Text>
              <Text style={styles.matrixCellBold}>Indicatie (p.j.)</Text>
            </View>
            {findings.map((f) => (
              <View style={styles.matrixRow} key={`m-${f.id}`}>
                <Text style={styles.matrixCell}>{f.shortLabel}</Text>
                <Text style={styles.matrixCell}>{f.severity}</Text>
                <Text style={styles.matrixCell}>{f.complexity}</Text>
                <Text style={styles.matrixCell}>
                  {f.savingsMaxEur === 0
                    ? "—"
                    : `${euro(f.savingsMinEur)}–${euro(f.savingsMaxEur)}`}
                </Text>
              </View>
            ))}
          </View>

          <Footer clientName={firstName} />
        </Page>
      ) : null}

      {/* 4. VERVOLGMOGELIJKHEDEN */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>4 · Vervolgmogelijkheden</Text>
        <Text style={styles.h1}>Opties</Text>

        <Text style={[styles.muted, { marginBottom: 16 }]}>
          Dit rapport kan zelfstandig worden gelezen en is geschikt om met een
          bestaande adviseur te bespreken. Wie de bevindingen op het platform
          zelf wil doorwerken, heeft vier lagen ter beschikking:
        </Text>

        <View style={styles.card}>
          <Text style={styles.h3}>Scan · Gratis</Text>
          <Text>
            Huidig rapport. Jaarlijks herhalen is zinvol om veranderingen in de
            positie te meten.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h3}>Optimalisatiesessie · € 495 eenmalig</Text>
          <Text>
            90 minuten diepgaand gesprek met uitgewerkt schriftelijk advies
            binnen 5 werkdagen. Geen doorlopende verplichting.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h3}>Jaaroptimalisatie · € 95 / maand</Text>
          <Text>
            Kwartaalreview fiscale positie, signalering bij wetswijzigingen,
            onbeperkte korte vragen per e-mail. Los van de huidige boekhouding.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h3}>Volledige administratie · € 295 / maand</Text>
          <Text>
            Boekhouding, aangiftes en proactief advies in één aanpak. Start
            uitsluitend na kennismaking.
          </Text>
        </View>

        <Text style={[styles.muted, { marginTop: 14 }]}>
          Kosteloze kennismaking (30 minuten, geen verplichting): {SITE.calUrl}
        </Text>

        <Footer clientName={firstName} />
      </Page>

      {/* 5. METHODOLOGIE / DISCLAIMER */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>5 · Methodologie & disclaimer</Text>
        <Text style={styles.h1}>Over dit rapport</Text>
        <Text style={styles.muted}>
          Dit rapport is opgesteld door een geautomatiseerde engine op basis
          van de opgegeven antwoorden. De engine toetst tegen de actuele Wet
          IB, Wet VPB, Wet LB (art. 12a), Wet excessief lenen, Besluit
          bedrijfsopvolging, en relevante Kennisgroep-standpunten. Peildatum
          voor tarieven en normen: kalenderjaar ten tijde van het opstellen.
        </Text>

        <Text style={[styles.h3, { marginTop: 18 }]}>Indicatief karakter</Text>
        <Text style={styles.muted}>
          Alle bedragen zijn bandbreedtes, geen puntschattingen. De
          werkelijkheid hangt af van factoren die buiten deze geautomatiseerde
          toets vallen (volledige fiscale historie, privé-situatie, specifieke
          sectorregelingen). Implementatie vereist altijd betrokkenheid van een
          adviseur die de volledige context kent. Dit rapport vormt geen
          fiscaal advies in de zin van art. 53 AWR.
        </Text>

        <Text style={[styles.h3, { marginTop: 14 }]}>Open methodologie</Text>
        <Text style={styles.muted}>
          De methodologie van de engine is openbaar en reproduceerbaar.
          Uitgebreide beschrijving: {SITE.url}/methodologie
        </Text>

        <Text style={[styles.muted, { marginTop: 18 }]}>
          {SITE.brand} · {SITE.contactEmail}
          {SITE.kvkNumber ? ` · KvK ${SITE.kvkNumber}` : ""}
        </Text>

        <Footer clientName={firstName} />
      </Page>
    </Document>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Public API: render to Buffer (Node) zodat we 'm kunnen hashen/mailen/uploaden.
// ──────────────────────────────────────────────────────────────────────────────
export async function renderReportPdf(props: ReportProps): Promise<Buffer> {
  return renderToBuffer(<ReportDocument {...props} />);
}
