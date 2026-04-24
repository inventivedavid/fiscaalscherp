import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacybeleid",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-white pb-20 pt-36">
        <div className="mx-auto max-w-3xl px-6 prose-custom">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
            Privacybeleid
          </p>
          <h1 className="mt-3 text-4xl font-bold text-ink-900">
            Hoe wij met uw gegevens omgaan
          </h1>
          <p className="mt-6 text-ink-600">
            Laatst bijgewerkt:{" "}
            {new Date().toLocaleDateString("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <h2 className="mt-10 text-xl font-bold text-ink-900">
            Welke gegevens verwerken wij?
          </h2>
          <p>
            Bij het invullen van de scan verzamelen wij uw antwoorden op de
            vragenlijst en uw contactgegevens (naam, bedrijfsnaam, e-mailadres
            en — indien opgegeven — telefoonnummer).
          </p>

          <h2 className="mt-8 text-xl font-bold text-ink-900">Waarvoor?</h2>
          <ul>
            <li>Het samenstellen en verzenden van uw persoonlijke rapport.</li>
            <li>
              Het versturen van maximaal 5 inhoudelijke vervolg-e-mails in de 30
              dagen na uw scan. U kunt zich hier op ieder moment voor afmelden
              via de link onderaan elke e-mail.
            </li>
            <li>
              Het verbeteren van onze dienst op geaggregeerd niveau (welke
              bevindingen komen vaak voor, welke teksten resoneren).
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-ink-900">
            Delen we uw gegevens?
          </h2>
          <p>
            Nee, uw persoonlijke antwoorden en contactgegevens worden niet
            gedeeld met derden. Voor technische verwerking maken we gebruik van
            de volgende verwerkers, die onder verwerkersovereenkomsten staan:
          </p>
          <ul>
            <li>Baserow (database, EU-hosting)</li>
            <li>Resend (e-mailverzending)</li>
            <li>Vercel (hosting van deze site)</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-ink-900">Bewaartermijn</h2>
          <p>
            Ingevulde scans bewaren we maximaal 24 maanden, tenzij u klant wordt
            — dan gelden de wettelijke bewaartermijnen. U kunt op ieder moment
            verzoeken om inzage, correctie of verwijdering van uw gegevens.
          </p>

          <h2 className="mt-8 text-xl font-bold text-ink-900">Cookies</h2>
          <p>
            We gebruiken geen tracking-cookies. De scan slaat wél uw voortgang
            lokaal op in uw browser (localStorage), zodat u uw scan kunt
            hervatten als u hem halverwege onderbreekt. Dit gebeurt uitsluitend
            op uw eigen apparaat en wordt niet naar ons verstuurd.
          </p>

          <h2 className="mt-8 text-xl font-bold text-ink-900">
            Contact over uw gegevens
          </h2>
          <p>
            Vragen over dit beleid of uw gegevens? Mail ons op{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
