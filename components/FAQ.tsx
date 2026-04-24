// §2.9 FAQ — de 7 echte vragen. <details> werkt zonder JS, is toegankelijk.

import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "Is de scan echt gratis?",
    a: "Ja, zonder verborgen voorwaarden. We vragen uw e-mail om het rapport te versturen, verder niets. Geen creditcard, geen abonnementsval.",
  },
  {
    q: "Wie ziet mijn antwoorden?",
    a: "Alleen wij. Uw antwoorden worden gebruikt om uw rapport te genereren en worden niet gedeeld met derden. We sturen u hooguit een paar follow-up e-mails met aanvullende inzichten — u kunt daar altijd uit.",
  },
  {
    q: "Moet ik cijfers paraat hebben?",
    a: "Nee. De scan werkt met ranges en inschattingen. Als u globaal weet wat uw omzet en winst zijn, kunt u hem invullen.",
  },
  {
    q: "Wat als ik tevreden ben met mijn huidige boekhouder?",
    a: "Dan blijft u daar. De scan is geen overstap-tool; het is een diagnose. U kunt het rapport zelfs aan uw huidige boekhouder geven om er samen mee aan de slag te gaan.",
  },
  {
    q: "Hoe weet ik dat het rapport iets waard is?",
    a: "Het rapport is gebaseerd op dezelfde methodiek die in een betaalde fiscale-optimalisatiesessie wordt gehanteerd. We geven het gratis weg omdat we erop vertrouwen dat wie de kwaliteit ziet, bij ons terugkomt voor vervolgstappen. Niet iedereen doet dat — en dat is prima.",
  },
  {
    q: "Is dit wel zorgvuldig voor zo'n snelle scan?",
    a: "Het rapport geeft indicaties op basis van uw antwoorden — geen definitief fiscaal advies. Voor concrete implementatie geldt altijd: bespreek met een adviseur die uw volledige situatie kent. De scan laat zien wáár het zinvol is om dat gesprek te voeren.",
  },
  {
    q: "Wie zit er achter deze tool?",
    a: `Een eigen praktijk gericht op fiscale optimalisatie voor DGA's${
      SITE.kvkNumber ? `. Ingeschreven bij de KvK onder ${SITE.kvkNumber}` : ""
    }. Contact: ${SITE.contactEmail}.`,
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-ink-50 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
            Veelgestelde vragen
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            Eerlijke antwoorden op wat u waarschijnlijk denkt
          </h2>
        </div>

        <div className="mt-12 divide-y divide-ink-200 overflow-hidden rounded-xl border border-ink-200 bg-white">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group p-6 open:bg-ink-50 transition"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-ink-900">
                <span>{f.q}</span>
                <span
                  aria-hidden="true"
                  className="flex size-7 flex-none items-center justify-center rounded-full border border-ink-200 text-ink-600 transition group-open:rotate-45 group-open:bg-gold-500 group-open:text-ink-900 group-open:border-gold-500"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-ink-700 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
