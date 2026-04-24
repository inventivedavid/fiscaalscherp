import type { Metadata } from "next";
import { PageShell, PageIntro } from "@/components/platform/PageShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
};

export default function DisclaimerPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Disclaimer"
        title="Voorwaarden voor het gebruik van scan, tools en rapporten."
      />

      <section className="hairline-b bg-canvas py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-10">
          <Block title="Indicatief karakter">
            <p>
              Alle uitkomsten — besparingsbandbreedtes, signaleringen, benchmarkwaarden — zijn indicatief en gepresenteerd als ranges. De werkelijke impact op een individuele situatie is afhankelijk van factoren die buiten deze toetsing vallen: volledige fiscale historie, privé-situatie, sectorspecifieke regelingen en samenhang met andere structuren.
            </p>
          </Block>

          <Block title="Geen adviesrelatie uit scan of tools">
            <p>
              Het invullen van de scan, het gebruik van een tool of het lezen van een kennisbank-artikel schept geen adviesrelatie. Pas op basis van een expliciete, betaalde opdracht (Optimalisatiesessie, jaarplan of volledige administratie) ontstaat een adviesrelatie in de zin van art. 7:400 BW.
            </p>
          </Block>

          <Block title="Aansprakelijkheid">
            <p>
              {SITE.brand} is niet aansprakelijk voor schade die voortvloeit uit handelen of nalaten op basis van de bevindingen in rapporten of tools, tenzij sprake is van opzet of grove nalatigheid. Voor implementatie — dividendbesluiten, salarisaanpassing, herstructurering, bedrijfsopvolging — blijft betrokkenheid van een adviseur die de volledige context kent vereist.
            </p>
          </Block>

          <Block title="Wet- en regelgeving">
            <p>
              De fiscale informatie op het platform is gebaseerd op openbare bronnen en regelgeving zoals die bekend is op het moment van publicatie. Wetswijzigingen, nieuwe jurisprudentie of gewijzigd beleid kunnen de juistheid van specifieke bevindingen beïnvloeden. Bij materiële wijzigingen wordt de engine herkalibreerd.
            </p>
          </Block>

          <Block title="Contact">
            <p>
              Vragen over deze voorwaarden:{" "}
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
      <div className="mt-4 space-y-3 text-base leading-relaxed text-ink-soft">
        {children}
      </div>
    </div>
  );
}
