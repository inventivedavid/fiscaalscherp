// De flag-engine — pure functies die op basis van Answers
// een lijst van Findings produceren.
//
// Elke flag is een kleine, zelfstandige functie: gemakkelijk te testen en
// gemakkelijk uit te breiden. Nieuwe regels toevoegen is één functie.
//
// BELANGRIJK JURIDISCH: alle bedragen zijn INDICATIEF en gepresenteerd als range.
// De teksten vermelden altijd dat concreet advies nader onderzoek vereist.

import type { Answers } from "./questions";

export type Severity = "info" | "medium" | "high" | "critical";
export type Complexity = "laag" | "middel" | "hoog";

export type Finding = {
  // Stabiele sleutel — handig om in Baserow te analyseren welke flags meest triggeren.
  id: string;
  title: string;
  severity: Severity;
  complexity: Complexity;
  /** Indicatieve besparing per jaar, in euro's. */
  savingsMinEur: number;
  savingsMaxEur: number;
  /** Korte kop voor de prioriteringsmatrix. */
  shortLabel: string;
  /** Uitleg-paragraaf voor in het rapport, 100-200 woorden. */
  body: string;
  /** Concrete vervolgvraag — dit is de haak naar het €495-gesprek. */
  nextStepHint: string;
};

type FlagRule = (a: Answers) => Finding | null;

// ──────────────────────────────────────────────────────────────────────────────
// HELPERS — ordinale ranges zodat we "salaris < drempel" kunnen uitdrukken.
// ──────────────────────────────────────────────────────────────────────────────
const revenueOrder = {
  lt_200k: 0,
  "200_500k": 1,
  "500k_1m": 2,
  "1_2m": 3,
  "2_5m": 4,
  gt_5m: 5,
} as const satisfies Record<Answers["revenue"], number>;

const profitOrder = {
  lt_50k: 0,
  "50_100k": 1,
  "100_250k": 2,
  "250_500k": 3,
  "500k_1m": 4,
  gt_1m: 5,
} as const satisfies Record<Answers["profit"], number>;

const salaryOrder = {
  lt_30k: 0,
  "30_50k": 1,
  "50_70k": 2,
  "70_100k": 3,
  gt_100k: 4,
} as const satisfies Record<Answers["dga_salary"], number>;

const liquidOrder = {
  lt_25k: 0,
  "25_100k": 1,
  "100_250k": 2,
  "250k_1m": 3,
  gt_1m: 4,
} as const satisfies Record<Answers["liquid_funds"], number>;

// ──────────────────────────────────────────────────────────────────────────────
// REGELS
// ──────────────────────────────────────────────────────────────────────────────
const rules: FlagRule[] = [
  // DGA-salaris onder gebruikelijk loon
  (a) => {
    const lowSalary = salaryOrder[a.dga_salary] <= 0; // < €30k
    const highProfit = profitOrder[a.profit] >= 2; // ≥ €100k winst
    if (!(lowSalary && highProfit)) return null;
    return {
      id: "dga_salary_below_norm",
      title: "DGA-salaris mogelijk onder de gebruikelijk-loonnorm",
      severity: "high",
      complexity: "middel",
      savingsMinEur: 1500,
      savingsMaxEur: 6000,
      shortLabel: "Gebruikelijk loon",
      body: "Je huidige DGA-salaris lijkt laag gezien de winst die je BV maakt. De Belastingdienst hanteert voor DGA's in jouw situatie een gebruikelijk-loonnorm van minimaal €56.000 (2025) of hoger als je branche of functie dat rechtvaardigt. Een salaris dat structureel onder deze norm zit kan leiden tot een naheffing plus boete — en het laat ook een deel van je fiscale planning liggen. Tegelijk kan een te hoog salaris onnodig veel inkomstenbelasting en premies kosten. De juiste hoogte is een afweging tussen vennootschapsbelasting in de BV en inkomstenbelasting in box 1, en hangt af van je branche en vergelijkbare functies.",
      nextStepHint:
        "Bespreek een herijking: welk salaris ligt fiscaal optimaal en tegelijk binnen de norm?",
    };
  },

  // Geen holding, wel substantiële winst + liquiditeit
  (a) => {
    const noHolding = a.has_holding === "no" || a.has_holding === "unsure";
    const profitableWork = profitOrder[a.profit] >= 2; // ≥ €100k
    const liquidity = liquidOrder[a.liquid_funds] >= 1; // ≥ €25k
    if (!(noHolding && profitableWork && liquidity)) return null;
    return {
      id: "holding_missing",
      title: "Holdingstructuur overwegen — je laat planningsruimte liggen",
      severity: "high",
      complexity: "hoog",
      savingsMinEur: 2000,
      savingsMaxEur: 15000,
      shortLabel: "Holdingstructuur",
      body: "Je hebt een winstgevende werkmaatschappij met liquiditeit, maar geen (actieve) holding daarboven. Een holdingstructuur biedt drie concrete voordelen: risicospreiding (vermogen buiten de werk-BV), fiscaal flexibel dividend (belastingvrij via de deelnemingsvrijstelling van werk-BV naar holding), en een aanzienlijk gunstigere positie bij latere verkoop of opvolging (bedrijfsopvolgingsregeling). Het opzetten vraagt eenmalige kosten en een inbreng- of ruiltraject, maar voor bedrijven in jouw grootte verdient dat zich meestal binnen enkele jaren terug. Dit is geen standaardoplossing voor iedereen — voor sommige DGA's is het beter om eerst de winst te laten toenemen — maar het verdient een expliciete afweging.",
      nextStepHint:
        "Bereken concreet: hoeveel levert een holdingstructuur jou over 5 jaar op?",
    };
  },

  // Holding aanwezig maar niet gebruikt
  (a) => {
    if (!(a.has_holding === "yes" && a.dividend_flow === "none")) return null;
    return {
      id: "holding_unused",
      title: "Holding aanwezig maar dividendstromen onbenut",
      severity: "medium",
      complexity: "laag",
      savingsMinEur: 1000,
      savingsMaxEur: 5000,
      shortLabel: "Dividendplanning",
      body: "Je hebt wel een holding, maar er worden geen dividenden uitgekeerd van werk-BV naar holding. Daarmee laat je de belangrijkste reden om die holding te hebben onbenut. Structurele dividenduitkeringen naar de holding halen overtollig vermogen weg bij de werk-BV (risicospreiding) en positioneren je voor strategische dividenduitkeringen naar privé op fiscaal gunstige momenten. Box 2 kent in 2025 bovendien twee tarieven (24,5% tot €67.804 en 31% daarboven per fiscaal partner) — wie hier slim mee plant kan duizenden euro's per uitkering besparen. Ook voor een eventuele bedrijfsopvolging is een holding mét ingeteerd vermogen waardevoller dan een lege BV.",
      nextStepHint:
        "Analyse: welke dividendplanning over de komende 3-5 jaar maakt het meest verschil?",
    };
  },

  // Rekening-courant substantieel
  (a) => {
    const significant =
      a.current_account === "25_100k" || a.current_account === "gt_100k";
    if (!significant) return null;
    return {
      id: "current_account_risk",
      title: "Rekening-courant-positie — fiscaal en juridisch aandachtspunt",
      severity: a.current_account === "gt_100k" ? "high" : "medium",
      complexity: "middel",
      savingsMinEur: 500,
      savingsMaxEur: 4000,
      shortLabel: "Rekening-courant",
      body: "Je hebt een niet-triviale rekening-courantpositie met je eigen BV. Sinds de Wet excessief lenen (2023) wordt een schuld aan je eigen BV boven een drempel (€500.000 in 2024, verlaagd naar €500.000 / eigen woning afzonderlijk) automatisch als fictief dividend belast in box 2. Maar ook onder die drempel gelden strikte regels: er moet een zakelijke leningsovereenkomst liggen, met zakelijke rente en aflossing, anders loop je het risico dat de Belastingdienst (een deel van) het bedrag aanmerkt als verkapt dividend — met naheffing en boete. Voor de DGA is dit één van de meest onderschatte risico's in het MKB.",
      nextStepHint:
        "Check: staat er een correcte overeenkomst? Moet er een aflossingsplan komen?",
    };
  },

  // Niet-elektrische leaseauto
  (a) => {
    if (a.lease_car !== "ice") return null;
    return {
      id: "lease_ice",
      title: "Leaseauto niet-elektrisch — bijtelling & totale kosten herzien",
      severity: "info",
      complexity: "laag",
      savingsMinEur: 500,
      savingsMaxEur: 3500,
      shortLabel: "Auto-optimalisatie",
      body: "Je rijdt een niet-elektrische leaseauto. De bijtelling voor benzine/diesel bedraagt 22% van de cataloguswaarde; voor volledig elektrisch 17% (tot €30.000 cataloguswaarde in 2025). Daarnaast spelen mee: wegenbelasting, brandstof versus laadkosten, BPM, en de looptijd van je huidige lease. Voor veel DGA's is de kruising punt-voor-punt gunstiger bij EV — maar niet automatisch; het hangt af van gebruikspatroon en duur van het contract. Een vergelijking kost een half uur en geeft je de harde cijfers om een weloverwogen keuze te maken bij de volgende leasevervanging.",
      nextStepHint:
        "Maak een concrete kostenvergelijking voor jouw volgende leasewissel.",
    };
  },

  // Pensioen in eigen beheer (oud)
  (a) => {
    if (a.pension_type !== "peb_old") return null;
    return {
      id: "peb_legacy",
      title: "Pensioen in eigen beheer — uitfasering vraagt om actie",
      severity: "critical",
      complexity: "hoog",
      savingsMinEur: 3000,
      savingsMaxEur: 25000,
      shortLabel: "PEB-uitfasering",
      body: "Je gaf aan nog een pensioen in eigen beheer (PEB) te hebben. Sinds 2017 is PEB formeel uitgefaseerd — opbouw was al niet meer mogelijk, maar bestaande voorzieningen moesten worden afgekocht, omgezet in een oudedagsverplichting (ODV) of bevroren. Als dit bij jou nog hangt, zit er waarschijnlijk een verplichting op de balans die structureel je fiscale positie beïnvloedt (latente belastingdruk) en eventuele dividenduitkeringen blokkeert (dividendtoets). De impact op bedrijfsopvolging, verkoop en pensioeninkomen kan significant zijn. Dit is één van die dossiers die vaak 'erbij blijft hangen' — met iedere jaar stapelt zich verergering op.",
      nextStepHint:
        "Kritisch: op welke manier is het meest fiscaal efficiënt om deze af te wikkelen?",
    };
  },

  // Opvolging binnen 5 jaar + geen holding
  (a) => {
    const soon = a.succession === "lt_5y";
    const noHolding = a.has_holding === "no" || a.has_holding === "unsure";
    if (!(soon && noHolding)) return null;
    return {
      id: "succession_no_holding",
      title: "Bedrijfsopvolging in zicht, geen holding — planningsfase nu",
      severity: "critical",
      complexity: "hoog",
      savingsMinEur: 10000,
      savingsMaxEur: 100000,
      shortLabel: "BOR + holding",
      body: "Je oriënteert je op opvolging of verkoop binnen 5 jaar, maar hebt geen holdingstructuur. Dat is een combinatie die veel fiscaal voordeel kan laten liggen. De Bedrijfsopvolgingsregeling (BOR) biedt bij overdracht aan een opvolger een vrijstelling tot 100% van het ondernemingsvermogen tot €1,5 miljoen en gedeeltelijk daarboven — maar een aantal voorwaarden (onder meer de bezitstermijn van 5 jaar voorafgaand aan overdracht) bepaalt of je in aanmerking komt. Om de structuur op tijd in orde te hebben, moet hij staan vóór je in dat 5-jaars venster valt. Dit is bij uitstek een dossier waar je nu strategisch over moet nadenken, niet twee jaar voor de overdracht.",
      nextStepHint:
        "Strategie: welke stappen moeten vóór welk jaar afgerond zijn?",
    };
  },

  // Innovatiebox / WBSO — tech en productie
  (a) => {
    const eligibleSector = a.sector === "tech" || a.sector === "productie";
    const hasProfit = profitOrder[a.profit] >= 1; // ≥ €50k
    if (!(eligibleSector && hasProfit)) return null;
    return {
      id: "innovation_box",
      title: "Innovatiebox / WBSO mogelijk onbenut",
      severity: "medium",
      complexity: "middel",
      savingsMinEur: 2000,
      savingsMaxEur: 25000,
      shortLabel: "Innovatie-voordelen",
      body: "Je zit in een sector waar de innovatiebox én de WBSO vaak onbenut blijven bij kleinere MKB-bedrijven. De innovatiebox belast winsten uit zelf ontwikkelde, kwalificerende innovaties tegen een effectief tarief van ca. 9% in plaats van het reguliere vpb-tarief. De WBSO geeft een afdrachtvermindering op loonheffingen voor speur- en ontwikkelingswerk. Veel DGA's denken 'dit is voor grote bedrijven' — onterecht. Ook voor een tech- of productiebedrijf met één ontwikkelaar kan dit al lonen. De drempel is vooral administratief: een correcte urenregistratie, een S&O-verklaring, en (voor de innovatiebox) een benadering van de innovatieve winst.",
      nextStepHint:
        "Check: komt jouw ontwikkelwerk in aanmerking? Wat is de administratie-inzet?",
    };
  },

  // Cash oppotten in BV zonder dividendplan
  (a) => {
    const cashRich = liquidOrder[a.liquid_funds] >= 2; // ≥ €100k
    const noDividend = a.dividend_last_3y === "none";
    if (!(cashRich && noDividend)) return null;
    return {
      id: "hoarded_cash",
      title: "Overtollige liquiditeit zonder dividend- of investeringsplan",
      severity: "medium",
      complexity: "middel",
      savingsMinEur: 1500,
      savingsMaxEur: 12000,
      shortLabel: "Cashplanning",
      body: "Er staat substantiële liquiditeit in je BV zonder dat er de afgelopen 3 jaar dividend is uitgekeerd. Geld dat op de BV-rekening blijft staan is niet per se verkeerd — maar het is wél een keuze die je expliciet moet maken. Box 2 kent in 2025 een gesplitst tarief (24,5% tot €67.804, 31% daarboven), wat gefaseerde uitkeringen aantrekkelijker maakt dan één grote klap later. Tegelijk: als je privé grote aankopen overweegt of investeringen buiten de BV, kan een gerichte strategie (dividend, lening, of rekening-courant met een zakelijke overeenkomst) veel schelen ten opzichte van 'laten staan en later beslissen'. Ook Wet excessief lenen (box 2-drempel) maakt planning relevanter.",
      nextStepHint:
        "Samen: een 3-jaars dividend- en investeringsplanning opstellen.",
    };
  },

  // Systematisch gebrek aan proactief advies
  (a) => {
    const unsatisfied = a.satisfaction === "unsatisfied" || a.satisfaction === "neutral";
    const noProactive = a.proactive_freq === "seldom" || a.proactive_freq === "never";
    if (!(unsatisfied && noProactive)) return null;
    return {
      id: "advisory_gap",
      title: "Systematisch gebrek aan proactief fiscaal advies",
      severity: "info",
      complexity: "laag",
      savingsMinEur: 0,
      savingsMaxEur: 0,
      shortLabel: "Adviesritme",
      body: "Dit is geen directe fiscale bevinding, maar een signaal dat de rest verklaart. Als er zelden tot nooit proactief wordt meegedacht over je fiscale positie, is de kans groot dat meerdere bovenstaande punten onbesproken blijven tot ze acuut worden. Een jaarritme (bij voorkeur kwartaalcheck) waarin iemand kort meedenkt over salaris, dividend, liquiditeit en toekomstplannen kost zelden meer dan een uur per kwartaal — maar voorkomt dat er over 3 tot 5 jaar een gestapelde lijst ontstaat met gemiste kansen. Dit is precies het type werk waar onze Jaaroptimalisatie-abonnement voor bedoeld is.",
      nextStepHint:
        "Wil je vrijblijvend bespreken hoe een kwartaalritme er in jouw situatie uit zou zien?",
    };
  },

  // Boekhouder gebruikt software alleen als invoermodule
  (a) => {
    const modernSoftware =
      a.software === "twinfield" ||
      a.software === "exact" ||
      a.software === "moneybird" ||
      a.software === "eboekhouden";
    if (!(modernSoftware && a.proactive_freq === "never")) return null;
    return {
      id: "software_unused",
      title: "Moderne software, maar geen proactieve benutting",
      severity: "info",
      complexity: "laag",
      savingsMinEur: 0,
      savingsMaxEur: 0,
      shortLabel: "Software-benutting",
      body: "Je werkt met moderne cloud-boekhoudsoftware, wat goed nieuws is — de data zit in principe al realtime in beeld. Dat maakt proactieve advisering véél goedkoper dan het klassieke 'wachten op de jaarrekening in maart'. Als dit potentieel niet wordt benut, is dat vrijwel altijd een kwestie van werkwijze van de adviseur, niet van beperkingen in de software. Het verschil tussen een boekhouder die je software gebruikt 'om cijfers op te halen' versus 'om mee te sturen' is in veel gevallen de grootste quick-win die je kunt maken zonder iets aan je structuur te veranderen.",
      nextStepHint:
        "Tip: vraag je huidige boekhouder expliciet wat ze zien in de live cijfers.",
    };
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// RUNNER — alle regels draaien, sorteren op severity + besparing desc.
// ──────────────────────────────────────────────────────────────────────────────
export function runFlagEngine(answers: Answers): Finding[] {
  const findings = rules
    .map((rule) => rule(answers))
    .filter((f): f is Finding => f !== null);

  const severityWeight: Record<Severity, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    info: 1,
  };

  return findings.sort((a, b) => {
    const sev = severityWeight[b.severity] - severityWeight[a.severity];
    if (sev !== 0) return sev;
    return b.savingsMaxEur - a.savingsMaxEur;
  });
}

export function totalSavingsRange(findings: Finding[]): {
  min: number;
  max: number;
} {
  return findings.reduce(
    (acc, f) => ({
      min: acc.min + f.savingsMinEur,
      max: acc.max + f.savingsMaxEur,
    }),
    { min: 0, max: 0 },
  );
}
