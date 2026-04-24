// Volledige definitie van de vragenlijst, in blokken zoals in de blueprint (§4.2).
// Elke vraag heeft een strongly-typed key, zodat flags.ts er veilig tegen kan matchen.

export type OptionValue = string;

export type Option = {
  value: OptionValue;
  label: string;
  // Optioneel: korte hint onder de keuze, bv. uitleg van een range.
  hint?: string;
};

export type QuestionBase = {
  key: QuestionKey;
  block: BlockId;
  label: string;
  help?: string;
  options: Option[];
  // Conditioneel tonen o.b.v. eerder antwoord.
  showIf?: (answers: Partial<Answers>) => boolean;
  // "Anders"-takken kunnen de scan afbreken met een vriendelijke boodschap.
  terminateIf?: {
    whenValue: OptionValue;
    title: string;
    message: string;
  };
};

export type BlockId =
  | "profile"
  | "structure"
  | "compensation"
  | "capital"
  | "future"
  | "current_service"
  | "contact";

export const BLOCKS: { id: BlockId; title: string; subtitle: string }[] = [
  {
    id: "profile",
    title: "Bedrijfsprofiel",
    subtitle: "Wat voor BV hebben we hier met je te maken?",
  },
  {
    id: "structure",
    title: "Structuur",
    subtitle: "Hoe zit je juridische opzet in elkaar?",
  },
  {
    id: "compensation",
    title: "DGA-beloning",
    subtitle: "Hoe haal je geld uit de BV naar privé?",
  },
  {
    id: "capital",
    title: "Vermogen & uitkeringen",
    subtitle: "Wat zit er in de BV en hoe komt het eruit?",
  },
  { id: "future", title: "Pensioen & toekomst", subtitle: "Waar ga je naartoe?" },
  {
    id: "current_service",
    title: "Huidige dienstverlening",
    subtitle: "Hoe word je nu begeleid?",
  },
  {
    id: "contact",
    title: "Contactgegevens",
    subtitle: "Waar sturen we je rapport naartoe?",
  },
];

// -----------------------------------------------------------------
// Antwoorden-type — één bron van waarheid.
// Key = vraagnaam; value = geselecteerde optie-waarde (string).
// -----------------------------------------------------------------
export type Answers = {
  role: "dga" | "co_dga" | "other";
  sector:
    | "tech"
    | "productie"
    | "ecommerce"
    | "dienstverlening"
    | "horeca"
    | "retail"
    | "bouw"
    | "zorg"
    | "anders";
  revenue: "lt_200k" | "200_500k" | "500k_1m" | "1_2m" | "2_5m" | "gt_5m";
  profit: "lt_50k" | "50_100k" | "100_250k" | "250_500k" | "500k_1m" | "gt_1m";
  employees: "0" | "1_5" | "6_20" | "gt_20";

  has_holding: "yes" | "no" | "unsure";
  dividend_flow: "structural" | "incidental" | "none";
  direct_shares_in_bv: "yes" | "no" | "na";

  dga_salary: "lt_30k" | "30_50k" | "50_70k" | "70_100k" | "gt_100k";
  salary_last_reviewed: "this_year" | "1_2y" | "3y_plus" | "never";
  lease_car: "ev" | "ice" | "none";

  liquid_funds: "lt_25k" | "25_100k" | "100_250k" | "250k_1m" | "gt_1m";
  dividend_last_3y: "planned" | "ad_hoc" | "none";
  current_account: "none" | "lt_25k" | "25_100k" | "gt_100k";

  pension_type: "lijfrente" | "peb_old" | "none" | "other";
  succession: "lt_5y" | "5_10y" | "none";

  satisfaction: "very" | "satisfied" | "neutral" | "unsatisfied" | "none";
  proactive_freq: "quarterly" | "yearly" | "seldom" | "never";
  software:
    | "twinfield"
    | "exact"
    | "moneybird"
    | "eboekhouden"
    | "other"
    | "none";

  // Contact
  full_name: string;
  company_name: string;
  email: string;
  phone?: string;
  consent: "true";
};

export type QuestionKey = keyof Omit<
  Answers,
  "full_name" | "company_name" | "email" | "phone" | "consent"
>;

// -----------------------------------------------------------------
// De vragen, in de volgorde zoals in de blueprint.
// -----------------------------------------------------------------
export const QUESTIONS: QuestionBase[] = [
  // --- Blok 1: Bedrijfsprofiel ---
  {
    key: "role",
    block: "profile",
    label: "Wat is je functie?",
    options: [
      { value: "dga", label: "DGA (100% of meerderheid)" },
      { value: "co_dga", label: "Mede-DGA" },
      { value: "other", label: "Anders" },
    ],
    terminateIf: {
      whenValue: "other",
      title: "Deze scan is specifiek voor DGA's",
      message:
        "Op dit moment richten we ons uitsluitend op DGA's met een eigen BV. Geen zorgen — we denken graag een keer vrijblijvend met je mee als je situatie anders is. Stuur een mailtje.",
    },
  },
  {
    key: "sector",
    block: "profile",
    label: "In welke sector is je BV actief?",
    help: "We gebruiken dit voor branche-specifieke bevindingen zoals de innovatiebox.",
    options: [
      { value: "tech", label: "Tech / software / SaaS" },
      { value: "productie", label: "Productie / industrie" },
      { value: "ecommerce", label: "E-commerce / webshop" },
      { value: "dienstverlening", label: "Zakelijke dienstverlening" },
      { value: "horeca", label: "Horeca" },
      { value: "retail", label: "Retail / detailhandel" },
      { value: "bouw", label: "Bouw / installatie" },
      { value: "zorg", label: "Zorg / welzijn" },
      { value: "anders", label: "Anders" },
    ],
  },
  {
    key: "revenue",
    block: "profile",
    label: "Wat was de jaaromzet in 2025 (geschat)?",
    help: "Geen zorgen — ranges volstaan.",
    options: [
      { value: "lt_200k", label: "Minder dan € 200.000" },
      { value: "200_500k", label: "€ 200.000 – € 500.000" },
      { value: "500k_1m", label: "€ 500.000 – € 1.000.000" },
      { value: "1_2m", label: "€ 1.000.000 – € 2.000.000" },
      { value: "2_5m", label: "€ 2.000.000 – € 5.000.000" },
      { value: "gt_5m", label: "Meer dan € 5.000.000" },
    ],
  },
  {
    key: "profit",
    block: "profile",
    label: "Wat was de winst vóór vennootschapsbelasting (geschat)?",
    options: [
      { value: "lt_50k", label: "Minder dan € 50.000" },
      { value: "50_100k", label: "€ 50.000 – € 100.000" },
      { value: "100_250k", label: "€ 100.000 – € 250.000" },
      { value: "250_500k", label: "€ 250.000 – € 500.000" },
      { value: "500k_1m", label: "€ 500.000 – € 1.000.000" },
      { value: "gt_1m", label: "Meer dan € 1.000.000" },
    ],
  },
  {
    key: "employees",
    block: "profile",
    label: "Hoeveel werknemers?",
    options: [
      { value: "0", label: "0 (alleen ikzelf)" },
      { value: "1_5", label: "1 – 5" },
      { value: "6_20", label: "6 – 20" },
      { value: "gt_20", label: "Meer dan 20" },
    ],
  },

  // --- Blok 2: Structuur ---
  {
    key: "has_holding",
    block: "structure",
    label: "Heb je een holdingstructuur?",
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nee" },
      { value: "unsure", label: "Weet ik niet precies" },
    ],
  },
  {
    key: "dividend_flow",
    block: "structure",
    label: "Worden dividenden van werk-BV naar holding uitgekeerd?",
    showIf: (a) => a.has_holding === "yes",
    options: [
      { value: "structural", label: "Ja, jaarlijks / structureel" },
      { value: "incidental", label: "Incidenteel" },
      { value: "none", label: "Nee, nog niet" },
    ],
  },
  {
    key: "direct_shares_in_bv",
    block: "structure",
    label: "Houd je privé direct aandelen in een werk-BV (zonder holding ertussen)?",
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nee" },
      { value: "na", label: "Niet van toepassing" },
    ],
  },

  // --- Blok 3: DGA-beloning ---
  {
    key: "dga_salary",
    block: "compensation",
    label: "Hoe hoog is je DGA-salaris per jaar (bruto)?",
    options: [
      { value: "lt_30k", label: "Minder dan € 30.000" },
      { value: "30_50k", label: "€ 30.000 – € 50.000" },
      { value: "50_70k", label: "€ 50.000 – € 70.000" },
      { value: "70_100k", label: "€ 70.000 – € 100.000" },
      { value: "gt_100k", label: "Meer dan € 100.000" },
    ],
  },
  {
    key: "salary_last_reviewed",
    block: "compensation",
    label: "Wanneer heb je je DGA-salaris voor het laatst herzien?",
    options: [
      { value: "this_year", label: "Dit jaar" },
      { value: "1_2y", label: "1 – 2 jaar geleden" },
      { value: "3y_plus", label: "3 jaar of langer geleden" },
      { value: "never", label: "Nog nooit expliciet" },
    ],
  },
  {
    key: "lease_car",
    block: "compensation",
    label: "Rijd je een leaseauto van de zaak?",
    options: [
      { value: "ev", label: "Ja, elektrisch" },
      { value: "ice", label: "Ja, niet-elektrisch" },
      { value: "none", label: "Nee" },
    ],
  },

  // --- Blok 4: Vermogen en uitkeringen ---
  {
    key: "liquid_funds",
    block: "capital",
    label:
      "Hoeveel liquide middelen staat er ongeveer in je BV dat je niet direct nodig hebt?",
    options: [
      { value: "lt_25k", label: "Minder dan € 25.000" },
      { value: "25_100k", label: "€ 25.000 – € 100.000" },
      { value: "100_250k", label: "€ 100.000 – € 250.000" },
      { value: "250k_1m", label: "€ 250.000 – € 1.000.000" },
      { value: "gt_1m", label: "Meer dan € 1.000.000" },
    ],
  },
  {
    key: "dividend_last_3y",
    block: "capital",
    label: "Heb je in de afgelopen 3 jaar dividend uitgekeerd naar privé?",
    options: [
      { value: "planned", label: "Ja, bewust gepland" },
      { value: "ad_hoc", label: "Ja, maar ad hoc" },
      { value: "none", label: "Nee" },
    ],
  },
  {
    key: "current_account",
    block: "capital",
    label: "Heb je een rekening-courant met je BV? Zo ja, ongeveer hoe hoog?",
    help: "Rekening-courant = openstaand bedrag tussen privé en je BV.",
    options: [
      { value: "none", label: "Geen / bijna nul" },
      { value: "lt_25k", label: "Minder dan € 25.000" },
      { value: "25_100k", label: "€ 25.000 – € 100.000" },
      { value: "gt_100k", label: "Meer dan € 100.000" },
    ],
  },

  // --- Blok 5: Pensioen en toekomst ---
  {
    key: "pension_type",
    block: "future",
    label: "Hoe bouw je pensioen op?",
    options: [
      { value: "lijfrente", label: "Lijfrente in privé" },
      { value: "peb_old", label: "Pensioen in eigen beheer (oud)" },
      { value: "none", label: "Niets geregeld" },
      { value: "other", label: "Anders" },
    ],
  },
  {
    key: "succession",
    block: "future",
    label:
      "Oriënteer je je op bedrijfsopvolging of verkoop binnen 10 jaar?",
    options: [
      { value: "lt_5y", label: "Ja, binnen 5 jaar" },
      { value: "5_10y", label: "Ja, over 5 – 10 jaar" },
      { value: "none", label: "Geen concrete plannen" },
    ],
  },

  // --- Blok 6: Huidige dienstverlening ---
  {
    key: "satisfaction",
    block: "current_service",
    label: "Hoe tevreden ben je met je huidige boekhouder / accountant?",
    options: [
      { value: "very", label: "Zeer tevreden" },
      { value: "satisfied", label: "Tevreden" },
      { value: "neutral", label: "Neutraal" },
      { value: "unsatisfied", label: "Ontevreden" },
      { value: "none", label: "Ik heb er geen" },
    ],
  },
  {
    key: "proactive_freq",
    block: "current_service",
    label: "Hoe vaak bespreekt iemand proactief je fiscale positie?",
    options: [
      { value: "quarterly", label: "Elk kwartaal" },
      { value: "yearly", label: "Jaarlijks" },
      { value: "seldom", label: "Zelden" },
      { value: "never", label: "Nooit" },
    ],
  },
  {
    key: "software",
    block: "current_service",
    label: "Welke boekhoudsoftware gebruik je?",
    options: [
      { value: "twinfield", label: "Twinfield" },
      { value: "exact", label: "Exact Online" },
      { value: "moneybird", label: "Moneybird" },
      { value: "eboekhouden", label: "e-Boekhouden" },
      { value: "other", label: "Anders" },
      { value: "none", label: "Geen / op papier" },
    ],
  },
];

// Helper voor progress-indicator + deelformulier.
export function visibleQuestions(answers: Partial<Answers>): QuestionBase[] {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}
