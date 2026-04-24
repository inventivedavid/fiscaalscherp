// Publieke runtime-configuratie — veilig om in de client te gebruiken.
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiscaalscherp.nl",
  brand: process.env.NEXT_PUBLIC_BRAND_NAME ?? "Fiscaalscherp",
  tagline: "Fiscaal platform voor DGA's",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hallo@fiscaalscherp.nl",
  calUrl: process.env.NEXT_PUBLIC_CAL_URL ?? "https://cal.com/fiscaalscherp/30min",
  kvkNumber: process.env.NEXT_PUBLIC_KVK_NUMBER ?? "",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
} as const;

// Centrale definitie van de prijsbomen — overal gebruikt zodat er maar één bron is.
export const PRICING = [
  {
    id: "scan",
    name: "Scan",
    price: "Gratis",
    period: "",
    summary:
      "Geautomatiseerd rapport met concrete aandachtspunten en indicatieve besparingsranges.",
    details: [
      "20 gestructureerde vragen (8 min)",
      "Persoonlijk PDF-rapport, 6–10 pagina's",
      "Indicatieve jaarlijkse besparing per punt",
      "Prioriteringsmatrix impact × complexiteit",
    ],
    cta: { label: "Start scan", href: "/scan" },
    accent: false,
  },
  {
    id: "sessie",
    name: "Optimalisatiesessie",
    price: "€ 495",
    period: "eenmalig",
    summary:
      "Diepgaand gesprek van 90 minuten, uitgewerkt adviesrapport met concrete implementatiestappen.",
    details: [
      "Vooraf: voorbereiding op basis van scan-input",
      "90 minuten diepgaand gesprek",
      "Uitgewerkt adviesrapport binnen 5 werkdagen",
      "Geen doorlopende verplichting",
    ],
    cta: { label: "Reserveer sessie", href: "/prijzen" },
    accent: true,
  },
  {
    id: "jaar",
    name: "Jaaroptimalisatie",
    price: "€ 95",
    period: "/maand",
    summary:
      "Kwartaalcheck op fiscale positie, proactieve signalering bij wetswijzigingen.",
    details: [
      "Kwartaalreview fiscale positie",
      "Proactieve signalering wetswijzigingen",
      "Onbeperkt korte vragen per e-mail",
      "Jaarlijks bijgewerkte planning (salaris, dividend, liquiditeit)",
    ],
    cta: { label: "Meer informatie", href: "/prijzen" },
    accent: false,
  },
  {
    id: "volledig",
    name: "Volledige administratie",
    price: "€ 295",
    period: "/maand",
    summary:
      "Boekhouding, aangifte en proactief advies — in één samenhangende aanpak.",
    details: [
      "Complete boekhouding en aangiftes",
      "Alles van Jaaroptimalisatie",
      "Vast aanspreekpunt, realtime rapportage",
      "Pas beschikbaar na kennismaking",
    ],
    cta: { label: "Kennismaken", href: "/prijzen" },
    accent: false,
  },
] as const;

export const SECTORS = [
  { slug: "tech", label: "Tech & SaaS" },
  { slug: "productie", label: "Productie & industrie" },
  { slug: "ecommerce", label: "E-commerce" },
] as const;
