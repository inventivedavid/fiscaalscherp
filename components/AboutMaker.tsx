// §2.8 Over de maker — leeftijd/achtergrond eerlijk + reframed.

export function AboutMaker() {
  return (
    <section id="over" className="bg-white py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-ink-100">
            {/* Vervang /public/portrait.jpg door jouw professionele foto. */}
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900 p-8 text-center text-sm text-white/60">
              <div>
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mx-auto"
                >
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="mt-3">Plaats hier uw professionele portretfoto (/public/portrait.jpg)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
            Over de maker
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            De persoon achter de scan
          </h2>

          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
            <p>
              Ik ben <strong>[naam]</strong>, geboren en getogen ondernemer-in-spé.
              Al 4 jaar werk ik binnen een accountantskantoor van 600 klanten,
              waar ik verantwoordelijk ben voor complexe samensteldossiers en de
              fiscale aanpak van MKB-bedrijven.
            </p>
            <p>
              Naast mijn studie Accountancy (4e jaar) bouw ik een eigen praktijk
              op — speciaal voor DGA's die proactief advies willen in plaats van
              alleen hun aangifte.
            </p>
            <p>
              Wat mij onderscheidt: ik ben digitaal opgegroeid, werk standaard met
              moderne cloud-accounting, en heb de luxe dat ik niet 600 klanten
              door de molen hoef te jagen. Dus is er per klant tijd om mee te
              denken.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
