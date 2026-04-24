import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
};

export default function DisclaimerPage() {
  return (
    <>
      <Nav />
      <main className="bg-white pb-20 pt-36">
        <div className="mx-auto max-w-3xl px-6 prose-custom">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
            Disclaimer
          </p>
          <h1 className="mt-3 text-4xl font-bold text-ink-900">
            Voorwaarden voor gebruik van de scan en het rapport
          </h1>

          <p className="mt-8">
            De {SITE.brand} en het daaruit voortvloeiende rapport zijn een
            geautomatiseerde indicatie op basis van door u verstrekte antwoorden.
            Het rapport vervangt geen fiscaal advies.
          </p>

          <h2 className="mt-8 text-xl font-bold text-ink-900">
            Indicatief karakter
          </h2>
          <p>
            Alle besparingsbedragen en bevindingen in het rapport zijn
            indicatief en gepresenteerd als bandbreedte. De werkelijke impact
            voor uw situatie kan hoger of lager uitvallen en hangt af van
            factoren die buiten deze scan vallen, zoals uw volledige fiscale
            historie, privé-situatie en specifieke sectorregelingen.
          </p>

          <h2 className="mt-8 text-xl font-bold text-ink-900">
            Geen advies-relatie
          </h2>
          <p>
            Het gebruik van de scan en het downloaden van het rapport schept
            geen advies- of opdrachtrelatie tussen u en {SITE.brand}. Pas op basis
            van een expliciete, betaalde opdracht (bijvoorbeeld een Fiscale
            Optimalisatiesessie of een abonnementsovereenkomst) ontstaat een
            formele adviesrelatie.
          </p>

          <h2 className="mt-8 text-xl font-bold text-ink-900">
            Geen aansprakelijkheid
          </h2>
          <p>
            {SITE.brand} is niet aansprakelijk voor schade die voortvloeit uit
            handelen of nalaten op basis van de bevindingen in het rapport,
            tenzij er sprake is van opzet of grove nalatigheid. Voor concrete
            implementatie van fiscale structuren, dividendbesluiten,
            salarisaanpassingen of bedrijfsopvolging raden wij u altijd aan om
            een adviseur te betrekken die uw volledige situatie kent.
          </p>

          <h2 className="mt-8 text-xl font-bold text-ink-900">
            Wijzigingen in wet- en regelgeving
          </h2>
          <p>
            De fiscale informatie in het rapport is gebaseerd op openbare
            bronnen en regelgeving zoals die bekend was op het moment van
            opstellen. Wetswijzigingen, nieuwe jurisprudentie of gewijzigd
            beleid kunnen invloed hebben op de juistheid van specifieke
            bevindingen.
          </p>

          <h2 className="mt-8 text-xl font-bold text-ink-900">Contact</h2>
          <p>
            Vragen over deze voorwaarden? Mail ons op{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
