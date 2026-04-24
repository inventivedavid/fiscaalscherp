# DGA Belastingscan — landing page, engine & acquisitiesysteem

Complete uitwerking van de blueprint in `blueprint.md`. Next.js 15 (App Router) met:

- Volledige landing page in 9 secties (§2 van de blueprint)
- Multi-step scan (20 vragen, 7 blokken) met auto-save en conditionele logica
- Server-side PDF-rapport (React-PDF, werkt direct op Vercel serverless)
- Baserow als database (CRUD via REST API)
- Resend voor e-mailverzending (rapport-mail met bijlage + follow-up sequence)
- **Vercel Cron** voor geautomatiseerde follow-up-mails op dag 2 / 5 / 10 / 20 / 30
- Hero A/B-varianten via URL, UTM-capture, honeypot, rate-limit
- Admin-dashboard met Basic Auth op `/admin`

## Snel starten

```bash
# 1. Dependencies
npm install

# 2. Environment
cp .env.example .env.local
# → vul alle waarden in (zie secties hieronder)

# 3. Dev
npm run dev
# → http://localhost:3000
```

## Baserow-setup

Maak een Baserow-database en drie tabellen aan. Gebruik **user field names** (mensvriendelijke kolomnamen) — de code verwacht onderstaande namen exact.

### Tabel: `Scans`

| Veldnaam               | Type             | Opmerking                                         |
| ---------------------- | ---------------- | ------------------------------------------------- |
| `report_id`            | Single line text | Unieke referentie (e.g. `RPT-1A2B3C-XYZ`)         |
| `status`               | Single line text | `report_generated` · `report_sent` · `email_pending` |
| `created_at`           | Date             | ISO-string                                         |
| `full_name`            | Single line text |                                                    |
| `company_name`         | Single line text |                                                    |
| `email`                | Email            |                                                    |
| `phone`                | Phone number     |                                                    |
| `role`                 | Single line text |                                                    |
| `sector`               | Single line text |                                                    |
| `revenue`              | Single line text |                                                    |
| `profit`               | Single line text |                                                    |
| `employees`            | Single line text |                                                    |
| `has_holding`          | Single line text |                                                    |
| `dividend_flow`        | Single line text |                                                    |
| `direct_shares_in_bv`  | Single line text |                                                    |
| `dga_salary`           | Single line text |                                                    |
| `salary_last_reviewed` | Single line text |                                                    |
| `lease_car`            | Single line text |                                                    |
| `liquid_funds`         | Single line text |                                                    |
| `dividend_last_3y`     | Single line text |                                                    |
| `current_account`      | Single line text |                                                    |
| `pension_type`         | Single line text |                                                    |
| `succession`           | Single line text |                                                    |
| `satisfaction`         | Single line text |                                                    |
| `proactive_freq`       | Single line text |                                                    |
| `software`             | Single line text |                                                    |
| `findings_count`       | Number           |                                                    |
| `savings_min`          | Number           |                                                    |
| `savings_max`          | Number           |                                                    |
| `utm_source`           | Single line text |                                                    |
| `utm_medium`           | Single line text |                                                    |
| `utm_campaign`         | Single line text |                                                    |
| `hero_variant`         | Single line text |                                                    |
| `ip`                   | Single line text |                                                    |
| `email_sent_at`        | Date             |                                                    |
| `email_error`          | Long text        |                                                    |
| `followup_day2`        | Boolean          |                                                    |
| `followup_day2_sent_at`| Date             |                                                    |
| `followup_day5`        | Boolean          |                                                    |
| `followup_day5_sent_at`| Date             |                                                    |
| `followup_day10`       | Boolean          |                                                    |
| `followup_day10_sent_at`| Date            |                                                    |
| `followup_day20`       | Boolean          |                                                    |
| `followup_day20_sent_at`| Date            |                                                    |
| `followup_day30`       | Boolean          |                                                    |
| `followup_day30_sent_at`| Date            |                                                    |
| `unsubscribed`         | Boolean          | zet handmatig of via webhook                       |

### Tabel: `Findings` (optioneel maar handig voor analytics)

| Veldnaam       | Type             |
| -------------- | ---------------- |
| `scan_row_id`  | Number           |
| `report_id`    | Single line text |
| `finding_id`   | Single line text |
| `title`        | Single line text |
| `severity`     | Single line text |
| `complexity`   | Single line text |
| `savings_min`  | Number           |
| `savings_max`  | Number           |

### Tabel: `Events` (reserveveld, optioneel)

Kun je gebruiken voor custom logging, webhook-relay enz. De code schrijft hier niet naar — je kunt hem leeg laten.

### Token

Maak in Baserow een **Database Token** met `Create`, `Read` en `Update`-rechten op bovenstaande database en zet die in `BASEROW_TOKEN`.

## Resend-setup

1. Maak een account op [resend.com](https://resend.com)
2. Verifieer je eigen domein (DKIM/SPF/DMARC)
3. Maak een API-key en zet die in `RESEND_API_KEY`
4. Stel `EMAIL_FROM` en `EMAIL_REPLY_TO` in

## Deployment naar Vercel

```bash
# 1. Installeer Vercel CLI (eenmalig)
npm i -g vercel

# 2. Link project
vercel link

# 3. Zet alle env vars in Vercel
vercel env pull .env.local  # of via Vercel Dashboard

# 4. Deploy
vercel --prod
```

### Vereiste environment variables in Vercel

Alle variabelen uit `.env.example`. Let extra op:

- `CRON_SECRET` — random string. Vercel Cron moet ingeschakeld zijn (gebeurt automatisch bij eerste deploy via `vercel.json`).
- `ADMIN_PASSWORD` — wordt gebruikt door `middleware.ts` voor het `/admin`-pad.

## Architectuur

```
app/
  page.tsx                   Landing page (server component, leest ?v=)
  scan/page.tsx              Scan-wrapper
  bedankt/page.tsx           Thank-you pagina
  admin/page.tsx             Admin-dashboard (basic auth)
  privacy/page.tsx           Privacybeleid
  disclaimer/page.tsx        Juridische disclaimer
  api/scan/route.ts          POST endpoint — validatie, flag-engine, PDF, email, Baserow
  api/cron/followups/route.ts  Vercel Cron — follow-up mails
  api/health/route.ts        Healthcheck
  sitemap.ts · robots.ts     SEO

lib/
  site.ts                    Publieke config
  baserow.ts                 REST client
  email.ts                   Resend + templates (rapport + 5 follow-ups)
  pdf.tsx                    React-PDF rapport
  questions.ts               Vragen + conditionele logic
  flags.ts                   Flag-engine (pure functies)
  validate.ts                Zod-schema
  rateLimit.ts               In-memory rate limiter

components/
  Hero.tsx                   §2.2 — 3 varianten
  ProblemRecognition.tsx     §2.3
  Solution.tsx               §2.4
  HowItWorks.tsx             §2.5
  WhatYouGet.tsx             §2.6
  SocialProof.tsx            §2.7
  AboutMaker.tsx             §2.8
  FAQ.tsx                    §2.9
  FinalCTA.tsx               §2.10
  Footer.tsx · Nav.tsx
  scan/ScanForm.tsx          Multi-step form (auto-save, conditional, a11y)

middleware.ts                Basic Auth voor /admin
vercel.json                  Cron + function limits
```

## Hoe de schaalbaarheid is ingericht

1. **Pure flag-engine** — nieuwe regels zijn één functie; geen state, geen DB-calls. Testbaar in isolatie.
2. **Baserow als single source of truth** — je kunt Make.com, n8n of Zapier direct laten triggeren op nieuwe rows in `Scans`. Externe automatisering zonder code-wijziging.
3. **Follow-up cron is idempotent** — elke stap heeft een eigen boolean veld, dus dubbele triggers versturen niets.
4. **Email-fallback** — faalt Resend, dan blijft de rij status `email_pending`. Draai de cron en vang het opnieuw (of bouw een `resend_pending` job).
5. **A/B-meetbaar vanaf dag 1** — hero-variant en UTM's worden per scan opgeslagen, dus je kunt conversieratios per variant berekenen in Baserow zelf.
6. **Upgrade-pad voor rate-limiting**: vervang `lib/rateLimit.ts` door Upstash Ratelimit als je cross-region nodig hebt. Interface blijft gelijk.
7. **PDF-hosting** — nu wordt het rapport direct als bijlage verstuurd. Wil je rapporten later opnieuw kunnen serveren? Voeg een Vercel Blob of S3-upload toe in `/api/scan` en sla de URL op in Baserow.

## Wat er NIET in zit en bewust een later-keuze is

- **Cal.com / Calendly embed** — ik link er naar toe (volgens de blueprint), maar embed hem niet. Embed werkt beter zodra je weet welke CTA's converteren.
- **Echte testimonials** — placeholder-cases in `SocialProof.tsx`. Vervang zodra je 3-5 echte scans hebt.
- **Beroepsaansprakelijkheidsverzekering** — moet jij zelf afsluiten (blueprint §7.1).
- **Betaalde marketing** — scope van deze repo is acquisitie-infrastructuur; campagnes tuig je extern op.

## Contact & bijdragen

Zie `blueprint.md` voor de complete strategische context. Code: aanpassen bij de bron (die zijn altijd de `lib/*`-bestanden), niet in meerdere componenten tegelijk.
