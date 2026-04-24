// §2.7 Social proof — eerlijk gestart + concrete case template.
// De eerste versie gebruikt Variant A (eerlijke schaarste). Zodra je 3-5 scans hebt,
// vervang je de cases door echte geanonimiseerde bevindingen.

const CASES = [
  {
    profile: "E-commerce, omzet € 450.000, 2 werknemers",
    finding: "DGA-salaris € 15.000 te hoog t.o.v. gebruikelijk loon; holdingstructuur aanwezig maar niet gebruikt voor dividenden.",
    savings: "€ 6.800 per jaar",
  },
  {
    profile: "Zakelijke dienstverlening, omzet € 220.000, solo",
    finding: "Geen holding; substantiële liquiditeit in BV zonder dividend- of investeringsplan in afgelopen 3 jaar.",
    savings: "€ 4.200 per jaar",
  },
  {
    profile: "Productie, omzet € 1,8M, 9 werknemers",
    finding: "Innovatiebox + WBSO onbenut; dividendflow naar holding ontbreekt.",
    savings: "€ 18.500 per jaar",
  },
];

export function SocialProof() {
  return (
    <section id="cases" className="bg-ink-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
            Geanonimiseerde bevindingen
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            Zo ziet een bevinding er concreet uit
          </h2>
          <p className="mt-4 text-ink-700">
            Drie voorbeelden van wat een scan oplevert — geanonimiseerd, realistisch.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CASES.map((c) => (
            <article
              key={c.profile}
              className="flex flex-col rounded-xl border border-ink-100 bg-white p-6 shadow-soft"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                {c.profile}
              </p>
              <p className="mt-4 flex-1 text-ink-800 leading-relaxed">
                {c.finding}
              </p>
              <div className="mt-6 rounded-md bg-gold-50 p-3">
                <p className="text-[11px] uppercase tracking-widest text-gold-700">
                  Indicatief jaarlijks
                </p>
                <p className="text-xl font-bold text-gold-700">{c.savings}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 mx-auto max-w-2xl text-center text-sm italic text-ink-500">
          We zijn recent gestart en bouwen aan échte klant-ervaringen. Bovenstaande
          cases zijn illustratieve voorbeelden van typische bevindingen, niet
          specifieke klantsituaties.
        </p>
      </div>
    </section>
  );
}
