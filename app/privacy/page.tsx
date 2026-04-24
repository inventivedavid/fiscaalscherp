import type { Metadata } from "next";
import { PageShell, PageIntro } from "@/components/platform/PageShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacybeleid",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Privacybeleid"
        title="Hoe we met je gegevens omgaan."
        description={`Laatst bijgewerkt op ${new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}.`}
      />

      <section className="hairline-b bg-canvas py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-10">
          <Block title="Welke gegevens worden verwerkt?">
            <p>
              Bij het invullen van de scan worden de antwoorden op de vragenlijst en de
              opgegeven contactgegevens (naam, bedrijfsnaam, e-mailadres en — indien
              opgegeven — telefoonnummer) verwerkt. Bij het gebruik van de tools
              worden géén persoonsgegevens verwerkt; berekeningen vinden volledig lokaal in de browser plaats.
            </p>
          </Block>

          <Block title="Doelen van de verwerking">
            <ul className="list-disc space-y-2 pl-5">
              <li>Het samenstellen en verzenden van het persoonlijke rapport.</li>
              <li>
                Het versturen van maximaal vijf inhoudelijke vervolg-mails in de 30 dagen
                na de scan. Afmelden gaat via de link onderaan elke mail.
              </li>
              <li>
                Het op geaggregeerd, niet-herleidbaar niveau samenstellen van benchmarks
                (welke bevindingen komen hoe vaak voor per sector).
              </li>
            </ul>
          </Block>

          <Block title="Delen met derden">
            <p>
              Persoonlijke antwoorden en contactgegevens worden niet commercieel gedeeld.
              Voor technische verwerking zijn de volgende verwerkers onder
              verwerkersovereenkomst in gebruik:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Baserow — database-opslag (EU-hosting)</li>
              <li>Resend — transactionele mailverzending</li>
              <li>Vercel — hosting van het platform</li>
            </ul>
          </Block>

          <Block title="Bewaartermijn">
            <p>
              Voltooide scans worden maximaal 24 maanden bewaard. Bij het aangaan van
              een betaalde relatie gelden de wettelijke bewaartermijnen uit het fiscaal
              en administratief recht. Inzage, correctie en verwijdering kunnen op elk
              moment worden aangevraagd.
            </p>
          </Block>

          <Block title="Cookies en lokale opslag">
            <p>
              Er worden geen tracking-cookies geplaatst. De scan bewaart voortgang in
              localStorage op het eigen apparaat — deze data verlaat het apparaat niet.
              Voor statistiek wordt uitsluitend cookieloos Plausible Analytics gebruikt,
              indien geactiveerd.
            </p>
          </Block>

          <Block title="Contact">
            <p>
              Vragen over dit beleid of over persoonsgegevens:{" "}
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                {SITE.contactEmail}
              </a>
              .
            </p>
          </Block>
        </div>
      </section>
    </PageShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-8 first:border-0 first:pt-0">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 space-y-3 text-base leading-relaxed text-ink-soft [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}
