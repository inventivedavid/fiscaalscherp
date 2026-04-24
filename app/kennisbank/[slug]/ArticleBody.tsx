// Hier staan de daadwerkelijke artikelteksten. Voor één artikel (gebruikelijk-loon-2025)
// is de volledige content geschreven; de overige zijn stub-versies die duidelijk maken
// dat het artikel in publicatie is. Later eenvoudig om te zetten naar MDX.

import Link from "next/link";

export function ArticleBody({ slug }: { slug: string }) {
  if (slug === "gebruikelijk-loon-2025") return <GebruikelijkLoon />;
  return <StubBody />;
}

function StubBody() {
  return (
    <div className="space-y-6 text-base leading-relaxed text-ink-soft">
      <p>
        Dit artikel wordt op dit moment geschreven. Een samenvatting en bronvermeldingen zijn
        hierboven beschikbaar; de volledige tekst verschijnt binnenkort.
      </p>
      <p>
        Wil je niet wachten? De <Link href="/scan" className="underline decoration-accent-500 decoration-2 underline-offset-4">scan</Link> toetst dit onderwerp al op persoonlijk niveau.
      </p>
    </div>
  );
}

// Volledig uitgewerkt artikel — dient als voorbeeld voor de tone of voice
// van de kennisbank: afstandelijk, precies, met voetnoten.
function GebruikelijkLoon() {
  return (
    <Prose>
      <H2>Inleiding</H2>
      <P>
        Voor wie een aanmerkelijk belang houdt in zijn eigen BV — doorgaans omdat hij er ten minste 5 % van houdt — schrijft art. 12a van de Wet op de loonbelasting een <em>minimum-loon</em> voor. Dit is het zogenaamde gebruikelijk loon. In dit dossier zetten we de norm voor 2025 volledig uiteen: de drie referentiepunten, de afgeschafte doelmatigheidsmarge, de bewijsvolgorde, en de meest gemaakte interpretatiefouten.
      </P>

      <H2>1. De drie referentiepunten</H2>
      <P>
        De regeling bepaalt dat het loon ten minste gelijk is aan het <em>hoogste</em> van drie bedragen
        <Ref n={1} />:
      </P>
      <Ul>
        <li>
          <strong>(a)</strong> het loon uit de meest vergelijkbare dienstbetrekking;
        </li>
        <li>
          <strong>(b)</strong> het hoogste loon van de werknemers die in dienst zijn van de BV of een verbonden lichaam;
        </li>
        <li>
          <strong>(c)</strong> het wettelijk minimum: <strong>€ 56.000</strong> voor 2025, jaarlijks geïndexeerd<Ref n={2} />.
        </li>
      </Ul>
      <P>
        Het hoogste van deze drie is het uitgangspunt. Dat uitgangspunt is niet absoluut — afwijken naar beneden mag, mits goed onderbouwd (zie hoofdstuk 3).
      </P>

      <H2>2. Wat is "de meest vergelijkbare dienstbetrekking"?</H2>
      <P>
        Het gaat om een dienstbetrekking waarin een werknemer <em>zonder</em> aanmerkelijk belang dezelfde werkzaamheden zou verrichten onder vergelijkbare omstandigheden. De fiscus hanteert dit criterium ruim: het hoeft geen identieke functie te zijn, maar wel een <em>functionele en inhoudelijke</em> parallel.
      </P>
      <P>
        In de praktijk wordt hiervoor vaak gekeken naar:
      </P>
      <Ul>
        <li>Salarisenquêtes per branche en regio (bijvoorbeeld Hays, Robert Walters, Berenschot)</li>
        <li>CAO-schalen van vergelijkbare functies</li>
        <li>Interne benchmarks binnen de branche</li>
      </Ul>
      <P>
        Belangrijk: het is aan de DGA om de onderbouwing te bewaren. Bij een controle zal de Belastingdienst vragen om het dossier waarmee de keuze is onderbouwd.
      </P>

      <H2>3. De afgeschafte doelmatigheidsmarge (75 %)</H2>
      <P>
        Tot en met 2022 mocht een DGA het vergelijkingsloon met 25 % naar beneden aanpassen (de zogenaamde doelmatigheidsmarge). Met ingang van 1 januari 2023 is deze marge afgeschaft<Ref n={3} />. De volledige 100 % van het vergelijkingsloon geldt nu als uitgangspunt.
      </P>
      <P>
        Deze wijziging betekent in de praktijk dat veel DGA's hun salaris hebben moeten bijstellen. Wie dat nog niet heeft gedaan, loopt een fiscaal risico — met loonheffing, premies en mogelijke boete.
      </P>

      <H2>4. Afwijken naar beneden: wanneer mag dat?</H2>
      <P>
        Art. 12a lid 2 biedt ruimte om aan te tonen dat het hoogste referentiepunt niet passend is. Gronden die in de rechtspraak zijn geaccepteerd:
      </P>
      <Ul>
        <li>Structureel verlieslijdende onderneming (aantoonbaar, meerdere jaren)</li>
        <li>Deeltijd of beperkte feitelijke arbeidstijd, uitgedrukt in uren</li>
        <li>Startende BV waarvoor het redelijk is dat salaris in de opbouwfase lager ligt</li>
        <li>Objectief lager marktloon dan de drie referentiepunten suggereren</li>
      </Ul>
      <P>
        In alle gevallen geldt: de bewijslast ligt bij de inhoudingsplichtige. Zonder dossier geen afwijking.
      </P>

      <H2>5. Rekenvoorbeeld</H2>
      <P>
        Een DGA in een tech-BV met 3 FTE personeel. Hoogste medewerkersalaris: € 78.000. Vergelijkbaar marktloon (senior softwareontwikkelaar / CTO-rol, afhankelijk van benchmark): € 95.000. Wettelijk minimum: € 56.000.
      </P>
      <Table
        headers={["Referentie", "Bedrag"]}
        rows={[
          ["Wettelijk minimum (art. 12a lid 1c)", "€ 56.000"],
          ["Hoogste medewerkersalaris (art. 12a lid 1b)", "€ 78.000"],
          ["Vergelijkbaar marktloon (art. 12a lid 1a)", "€ 95.000"],
          ["Gebruikelijk loon (hoogste)", "€ 95.000"],
        ]}
      />
      <P>
        Het vereiste bruto-salaris bedraagt daarmee € 95.000. Als de DGA € 70.000 betaalt en geen onderbouwde afwijking heeft gedocumenteerd, loopt hij het risico op een loonheffingscorrectie over € 25.000 per jaar.
      </P>

      <H2>6. De meest gemaakte fouten</H2>
      <Ol>
        <li>
          <strong>Stilzwijgend onder de norm blijven.</strong> De 75 %-marge bestaat niet meer; wie niet heeft bijgesteld na 2023, is vrijwel zeker te laag.
        </li>
        <li>
          <strong>Het vergelijkingsloon alleen op eigen branche-ervaring baseren.</strong> De fiscus verwacht schriftelijke bronnen.
        </li>
        <li>
          <strong>Hoogste medewerkersalaris vergeten mee te wegen</strong>, bijvoorbeeld na een tussentijdse aanname.
        </li>
        <li>
          <strong>Het loon jarenlang niet herzien.</strong> Referentiewaarden wijzigen; een tweejaarlijkse review is gangbaar.
        </li>
      </Ol>

      <H2>Bronnen</H2>
      <Refs
        items={[
          "Wet op de loonbelasting 1964, art. 12a",
          "Besluit DGA-loon 2025 (peildatum 1 januari 2025, indexatie conform art. 12a lid 3)",
          "Belastingplan 2023, MvT p. 18 e.v., afschaffing doelmatigheidsmarge",
          "Kennisgroep Loonheffingen, standpunt KG:204:2023:3",
          "Hoge Raad 11 november 2005, BNB 2006/147 (jurisprudentie rondom afwijken naar beneden)",
        ]}
      />
    </Prose>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5 text-base leading-relaxed text-ink-soft [&_strong]:text-ink">{children}</div>;
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 border-t border-line pt-8 font-display text-2xl text-ink md:text-3xl">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5">{children}</ul>;
}

function Ol({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal space-y-2 pl-5">{children}</ol>;
}

function Ref({ n }: { n: number }) {
  return (
    <sup className="text-xs text-accent-700">
      <a href={`#ref-${n}`} className="underline decoration-accent-500">
        {n}
      </a>
    </sup>
  );
}

function Refs({ items }: { items: string[] }) {
  return (
    <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-ink-muted">
      {items.map((item, i) => (
        <li key={i} id={`ref-${i + 1}`}>
          {item}
        </li>
      ))}
    </ol>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse border border-line text-left text-sm">
        <thead className="bg-canvas-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="border-b border-line px-4 py-3 font-medium text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 ${j === r.length - 1 ? "tabular-nums text-ink" : "text-ink-soft"}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
