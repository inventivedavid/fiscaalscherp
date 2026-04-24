// Publieke runtime-configuratie — veilig om in de client te gebruiken.
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jouwdomein.nl",
  brand: process.env.NEXT_PUBLIC_BRAND_NAME ?? "DGA Belastingscan",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hallo@jouwdomein.nl",
  calUrl:
    process.env.NEXT_PUBLIC_CAL_URL ?? "https://cal.com/jouwnaam/30min",
  kvkNumber: process.env.NEXT_PUBLIC_KVK_NUMBER ?? "",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
} as const;
