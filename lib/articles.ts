// Kennisbank-index. Per artikel: slug, metadata en het path naar de content.
// Later eenvoudig uit te breiden met MDX of CMS.

export type Article = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readingTime: string;
  updatedAt: string;
  keywords: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "gebruikelijk-loon-2025",
    title: "Gebruikelijk loon 2025: volledige handleiding voor DGA's",
    summary:
      "De 12a-norm, het afgeschafte doelmatigheidsmarge en de drie referentiepunten — met praktijkvoorbeelden en jurisprudentie.",
    category: "Loonbelasting",
    readingTime: "12 min",
    updatedAt: "2026-01-14",
    keywords: ["art. 12a", "DGA-salaris", "gebruikelijk loon", "loonbelasting"],
  },
  {
    slug: "holding-structuur-afweging",
    title: "Holdingstructuur: wanneer wel, wanneer niet",
    summary:
      "Deelnemingsvrijstelling, fiscale eenheid en aansprakelijkheidsrisico tegen de kosten van een extra rechtspersoon.",
    category: "Structuur",
    readingTime: "9 min",
    updatedAt: "2026-01-10",
    keywords: ["holding", "deelnemingsvrijstelling", "BV-structuur"],
  },
  {
    slug: "box-2-dividend-volgorde",
    title: "Box 2 na 2024: dividendvolgorde over meerdere jaren",
    summary:
      "Het 24,5 %- en 31 %-schijvenstelsel betekent dat timing kwantificeerbaar verschil maakt. Met rekenvoorbeelden.",
    category: "Inkomstenbelasting",
    readingTime: "11 min",
    updatedAt: "2026-01-05",
    keywords: ["box 2", "dividend", "aanmerkelijk belang"],
  },
  {
    slug: "excessief-lenen-2023",
    title: "Wet excessief lenen: wat de grens van € 500.000 in de praktijk betekent",
    summary:
      "De regeling sinds 2023, praktische implicaties en de meest gemaakte interpretatiefouten.",
    category: "Inkomstenbelasting",
    readingTime: "8 min",
    updatedAt: "2025-12-20",
    keywords: ["excessief lenen", "rekening-courant", "aanmerkelijk belang"],
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
