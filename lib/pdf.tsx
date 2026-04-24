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
          <Text style={styles.muted}>
            1. Managementsamenvatting
          </Text>
          <Text style={styles.muted}>2. Bevindingen in detail</Text>
          <Text style={styles.muted}>3. Prioriteringsmatrix</Text>
          <Text style={styles.muted}>4. Vervolgstappen</Text>
          <Text style={styles.muted}>5. Over ons en disclaimer</Text>
        </View>

        <Footer clientName={firstName} />
      </Page>

      {/* 1. MANAGEMENTSAMENVATTING */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>1 · Managementsamenvatting</Text>
        <Text style={styles.h1}>Wat we hebben gevonden</Text>

        <View style={{ flexDirection: "row", marginTop: 18, gap: 10 }}>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.muted}>Optimalisatiepunten gevonden</Text>
            <Text style={{ fontSize: 32, fontFamily: "Helvetica-Bold" }}>
              {findings.length}
            </Text>
          </View>
          <View style={[styles.card, { flex: 1, backgroundColor: COLORS.goldSoft }]}>
            <Text style={styles.muted}>Indicatieve jaarlijkse besparing</Text>
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

        <Text style={styles.h2}>De grootste kans in jouw situatie</Text>
        {findings[0] ? (
          <View>
            <Text style={styles.h3}>{findings[0].title}</Text>
            <Text style={{ color: COLORS.inkSoft }}>{findings[0].body}</Text>
          </View>
        ) : (
          <Text style={styles.muted}>
            Er zijn geen directe optimalisatiepunten aangetroffen op basis van je
            antwoorden. Dat kan wijzen op een al sterk ingerichte structuur, of op
            een beperking van een snelle scan. Een gesprek van 30 minuten geeft
            altijd meer uitsluitsel.
          </Text>
        )}

        <Text style={styles.h2}>Hoe je dit rapport leest</Text>
        <Text style={styles.muted}>
          Elke bevinding komt met een toelichting, een indicatieve besparingsrange
          en een complexiteitsinschatting. De prioriteringsmatrix achterin helpt je
          om te beslissen waar je als eerste mee aan de slag wilt. Alle bedragen
          zijn indicatief — concreet advies vereist een volledig beeld van je
          situatie.
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

      {/* 4. VERVOLGSTAPPEN */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>4 · Vervolgstappen</Text>
        <Text style={styles.h1}>Wat je nu kunt doen</Text>

        <View style={styles.card}>
          <Text style={styles.h3}>Optie 1 — Gratis bespreking (30 minuten)</Text>
          <Text>
            We lopen dit rapport telefonisch met je door en beantwoorden je
            vragen. Geen verkoopgesprek — echt even samen naar de bevindingen
            kijken. Plan een moment dat je uitkomt:
          </Text>
          <Text style={{ color: COLORS.gold, marginTop: 4 }}>{SITE.calUrl}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h3}>Optie 2 — Fiscale Optimalisatiesessie · € 495</Text>
          <Text>
            90 minuten diepgaand gesprek met uitgewerkt adviesrapport en concrete
            implementatiestappen. Geen doorlopende relatie vereist. Dit is de
            logische vervolgstap als je de bevindingen concreet wilt uitwerken.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h3}>
            Optie 3 — Jaaroptimalisatie-abonnement · vanaf € 95 / maand
          </Text>
          <Text>
            Kwartaalcheck op je fiscale positie, proactieve signalering bij
            wetswijzigingen, onbeperkte korte vragen per e-mail. Los van je
            huidige boekhouding — precies die proactieve laag die nu ontbreekt.
          </Text>
        </View>

        <Footer clientName={firstName} />
      </Page>

      {/* 5. DISCLAIMER */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>5 · Over dit rapport</Text>
        <Text style={styles.h1}>Disclaimer en voorwaarden</Text>
        <Text style={styles.muted}>
          Dit rapport is een geautomatiseerde indicatie op basis van de door jou
          verstrekte antwoorden. Het vervangt geen fiscaal advies. De genoemde
          besparingen zijn indicatieve ranges en afhankelijk van je volledige
          fiscale situatie. Voor concrete implementatie is nader onderzoek en
          persoonlijk advies vereist. Tarieven en regelingen (zoals gebruikelijk
          loon, box 2, BOR, innovatiebox, Wet excessief lenen) zijn gebaseerd op
          openbare bronnen en regelgeving zoals die bekend was op het moment van
          opstellen van dit rapport; wetswijzigingen kunnen van invloed zijn.
        </Text>
        <Text style={[styles.muted, { marginTop: 10 }]}>
          {SITE.brand} · Contact: {SITE.contactEmail}
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
