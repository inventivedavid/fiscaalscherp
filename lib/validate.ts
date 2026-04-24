// Zod-schema voor de scan submit — single source of truth tussen client & server.
import { z } from "zod";

const emailSchema = z
  .string()
  .email("Vul een geldig e-mailadres in")
  .max(200);

export const submitSchema = z.object({
  // Blok 1
  role: z.enum(["dga", "co_dga", "other"]),
  sector: z.enum([
    "tech",
    "productie",
    "ecommerce",
    "dienstverlening",
    "horeca",
    "retail",
    "bouw",
    "zorg",
    "anders",
  ]),
  revenue: z.enum(["lt_200k", "200_500k", "500k_1m", "1_2m", "2_5m", "gt_5m"]),
  profit: z.enum(["lt_50k", "50_100k", "100_250k", "250_500k", "500k_1m", "gt_1m"]),
  employees: z.enum(["0", "1_5", "6_20", "gt_20"]),

  // Blok 2
  has_holding: z.enum(["yes", "no", "unsure"]),
  dividend_flow: z
    .enum(["structural", "incidental", "none"])
    .optional(),
  direct_shares_in_bv: z.enum(["yes", "no", "na"]),

  // Blok 3
  dga_salary: z.enum(["lt_30k", "30_50k", "50_70k", "70_100k", "gt_100k"]),
  salary_last_reviewed: z.enum(["this_year", "1_2y", "3y_plus", "never"]),
  lease_car: z.enum(["ev", "ice", "none"]),

  // Blok 4
  liquid_funds: z.enum(["lt_25k", "25_100k", "100_250k", "250k_1m", "gt_1m"]),
  dividend_last_3y: z.enum(["planned", "ad_hoc", "none"]),
  current_account: z.enum(["none", "lt_25k", "25_100k", "gt_100k"]),

  // Blok 5
  pension_type: z.enum(["lijfrente", "peb_old", "none", "other"]),
  succession: z.enum(["lt_5y", "5_10y", "none"]),

  // Blok 6
  satisfaction: z.enum(["very", "satisfied", "neutral", "unsatisfied", "none"]),
  proactive_freq: z.enum(["quarterly", "yearly", "seldom", "never"]),
  software: z.enum([
    "twinfield",
    "exact",
    "moneybird",
    "eboekhouden",
    "other",
    "none",
  ]),

  // Blok 7 — contact
  full_name: z.string().min(2, "Vul je naam in").max(120),
  company_name: z.string().min(2, "Vul je bedrijfsnaam in").max(160),
  email: emailSchema,
  phone: z.string().max(40).optional().or(z.literal("")),
  consent: z.literal("true", {
    errorMap: () => ({ message: "Je moet akkoord gaan met de privacyvoorwaarden." }),
  }),

  // Verzameld op de client, niet door gebruiker ingevuld
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  hero_variant: z.string().max(20).optional(),

  // Honeypot — moet leeg zijn, anders is het een bot.
  website: z.string().max(0).optional(),
});

export type SubmitInput = z.infer<typeof submitSchema>;
