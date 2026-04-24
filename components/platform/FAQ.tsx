// Herschreven FAQ — geen persoonlijke vragen, geen verkopende toon.
// Vragen zijn gericht op de bezwaren die een sceptische DGA daadwerkelijk heeft.

import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "Is de scan werkelijk gratis?",
    a: "Ja. We vragen je contactgegevens om het persoonlijke rapport te kunnen versturen. Geen creditcard, geen abonnement dat automatisch doorloopt. Je ontvangt na de scan maximaal vijf inhoudelijke vervolgmails — uitschrijven gaat met één klik.",
  },
  {
    q: "Wat wordt er met mijn antwoorden gedaan?",
    a: "De antwoorden genereren je persoonlijke rapport en worden in geaggregeerde, niet-herleidbare vorm gebruikt voor benchmarks. Geen deling met derden, geen commerciële doorverkoop. Zie het privacybeleid voor de volledige lijst aan verwerkers.",
  },
  {
    q: "Op welke regelgeving is de engine gebaseerd?",
    a: "Op de actuele Wet IB, Wet VPB, Wet LB (art. 12a gebruikelijk loon), Wet excessief lenen (2023), het Besluit bedrijfsopvolging, relevante Kennisgroep-standpunten en besluiten. Bij elke bevinding wordt de bron vermeld. Zie 'Methodologie' voor de volledige lijst.",
  },
  {
    q: "Vervangt dit rapport mijn huidige boekhouder of accountant?",
    a: "Nee. Het rapport is een diagnose — geen uitvoerende adviesrelatie. Je kunt het zonder enig bezwaar voorleggen aan je huidige kantoor, en het is zelfs zo opgezet dat die dat productief kan gebruiken. Pas bij een expliciete, betaalde vervolgstap (bijvoorbeeld de Optimalisatiesessie) ontstaat er een adviesrelatie.",
  },
  {
    q: "Hoe kan een geautomatiseerde scan weten wat voor mijn situatie geldt?",
    a: "Dat kan hij niet volledig — en dat claimt hij ook niet. De engine detecteert patronen die op basis van de door jou opgegeven indicatoren statistisch vaak op optimalisatieruimte wijzen. Welke bevindingen voor jouw volledige situatie werkelijk gelden, vereist altijd gesprek met een adviseur die alle context kent.",
  },
  {
    q: "Waarom is deze dienst nieuw, terwijl het onderwerp niet nieuw is?",
    a: "Fiscaal advies is historisch schaars en duur, omdat het per situatie handmatig gebeurt. De engine maakt een eerste, indicatieve doorlichting tegen nul marginale kosten mogelijk — waardoor DGA's die anders nooit een herijking zouden doen, dat wél doen. Dat is de kern van het platform.",
  },
  {
    q: "Wat als er geen bevindingen uit de scan komen?",
    a: "Dan krijg je dat ook als uitkomst. Een leeg rapport is geen mislukking — het betekent dat de structuur op de gemeten indicatoren geen signalen geeft. Soms is 'goed zoals het is' de conclusie.",
  },
  {
    q: "Is er een KvK-inschrijving en beroepsaansprakelijkheidsverzekering?",
    a: `Ja${SITE.kvkNumber ? `, KvK ${SITE.kvkNumber}` : ""}. De dienstverlening valt onder een beroepsaansprakelijkheidsverzekering voor fiscaal-administratieve werkzaamheden. Details op aanvraag.`,
  },
];

export function FAQ() {
  return (
    <section id="faq" className="hairline-b bg-canvas-50 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
            Veelgestelde vragen
          </p>
          <h2 className="mt-4 font-display text-display-lg text-ink text-balance">
            Zonder geruststellingen — de inhoudelijke antwoorden.
          </h2>
        </div>

        <div className="mt-12 border-t border-line">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group border-b border-line py-6 open:bg-canvas/60"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                <span className="font-display text-lg text-ink md:text-xl">
                  {f.q}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 text-ink-subtle transition group-open:rotate-45"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 2v12M2 8h12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
