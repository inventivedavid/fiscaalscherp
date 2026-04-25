// Indeling van het dossier in zes secties.
// Iedere sectie groepeert vragen uit lib/questions.ts en heeft eigen
// dossier-copy: een romeins cijfer, een classified-titel, en een korte
// regel die boven elke vraag verschijnt om context te geven.

import type { BlockId, QuestionKey } from "@/lib/questions";

export type SectionId = BlockId extends infer B
  ? B extends "contact"
    ? never
    : B
  : never;

export type SectionMeta = {
  id: SectionId;
  ordinal: string;
  classified: string;
  title: string;
  brief: string;
  // Regel die op iedere vraag in deze sectie boven de vraag wordt getoond.
  // Niet-vergelijkend, eerste persoon, premium tone.
  framingByKey: Partial<Record<QuestionKey, string>>;
};

export const SECTIONS: SectionMeta[] = [
  {
    id: "profile",
    ordinal: "I",
    classified: "Sectie I · Profiel",
    title: "Wie is de DGA achter de BV?",
    brief:
      "Voor we ergens uitspraken over kunnen doen, vastleggen wat voor onderneming dit is.",
    framingByKey: {
      role: "Het dossier is afgestemd op DGA's. Bevestig dat dit klopt voor jou.",
      sector:
        "Sector bepaalt of regelingen als de innovatiebox überhaupt in beeld zijn.",
      revenue:
        "Omzet plaatst je in een tarief- en optimalisatieprofiel. Een range volstaat.",
      profit:
        "Winst voor vpb is de echte hefboom. Ranges, geen exacte cijfers.",
      employees:
        "Aantal mensen in dienst beïnvloedt subsidies, WBSO en pensioenstructuur.",
    },
  },
  {
    id: "structure",
    ordinal: "II",
    classified: "Sectie II · Structuur",
    title: "Hoe staat de juridische opzet?",
    brief:
      "Holding, deelnemingen, directe aandelen — drie vragen, en de rest van het dossier weet meteen waar je staat.",
    framingByKey: {
      has_holding:
        "Een holding boven je werk-BV opent of sluit een hele waaier aan planning.",
      dividend_flow:
        "Stromen tussen werk-BV en holding bepalen of je structuur écht werkt of alleen op papier staat.",
      direct_shares_in_bv:
        "Privé-aandelen direct in een werk-BV is fiscaal en juridisch een ander spel.",
    },
  },
  {
    id: "compensation",
    ordinal: "III",
    classified: "Sectie III · DGA-beloning",
    title: "Hoe haal je geld uit de BV naar privé?",
    brief:
      "Salaris, dividend, lease — de drie grootste hefbomen voor je netto positie.",
    framingByKey: {
      dga_salary:
        "Je salaris is de eerste plek waar de gebruikelijk-loonnorm meet of je in de pas loopt.",
      salary_last_reviewed:
        "Veel DGA-salarissen zijn nooit formeel herijkt. De doelmatigheidsmarge is per 2023 vervallen.",
      lease_car:
        "Bijtelling voor EV (17%) versus benzine/diesel (22%) maakt jaarlijks duizenden euro's verschil.",
    },
  },
  {
    id: "capital",
    ordinal: "IV",
    classified: "Sectie IV · Vermogen & uitkeringen",
    title: "Wat zit er in de BV en hoe komt het eruit?",
    brief:
      "Liquiditeit, dividendritme en rekening-courant — drie posten die fiscaal dood of springlevend kunnen staan.",
    framingByKey: {
      liquid_funds:
        "Cash die in de BV blijft staan zonder plan is geen veiligheid; het is een uitgestelde beslissing.",
      dividend_last_3y:
        "Box 2 splitst sinds 2024 in twee tarieven (24,5% / 31%). Ritme telt.",
      current_account:
        "Sinds Wet excessief lenen is de rekening-courant een meetpunt geworden, geen administratief randje.",
    },
  },
  {
    id: "future",
    ordinal: "V",
    classified: "Sectie V · Pensioen & toekomst",
    title: "Waar ga je naartoe?",
    brief:
      "Pensioen en opvolging — twee dossiers die jaren van voorbereiding willen, of straks niets meer waard zijn.",
    framingByKey: {
      pension_type:
        "PEB (oud), lijfrente, niets — elk antwoord vraagt om een eigen route.",
      succession:
        "BOR-vrijstelling vereist een bezitstermijn. Wat je nu nalaat is over 5 jaar onmogelijk.",
    },
  },
  {
    id: "current_service",
    ordinal: "VI",
    classified: "Sectie VI · Huidige dienstverlening",
    title: "Hoe word je nu begeleid?",
    brief:
      "Niet om je adviseur te beoordelen. Om te zien of de andere bevindingen ergens al worden opgevangen.",
    framingByKey: {
      satisfaction:
        "Een eerlijk antwoord — alleen wij zien dit, het dient enkel om context te plaatsen.",
      proactive_freq:
        "Veel DGA's horen jaarlijks 'het is goed zo'. Wij meten of er actief wordt meegestuurd.",
      software:
        "Moderne software in handen van een passieve adviseur is verspilde data.",
    },
  },
];

export function findSectionById(id: SectionId): SectionMeta {
  const found = SECTIONS.find((s) => s.id === id);
  if (!found) throw new Error(`Sectie niet gevonden: ${id}`);
  return found;
}
