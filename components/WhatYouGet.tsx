// §2.6 Wat je krijgt — waarde tastbaar.

const ITEMS = [
  "Analyse van uw DGA-salaris t.o.v. de gebruikelijk-loonnorm.",
  "Check op uw holdingstructuur: aanwezig, gebruikt, optimaal?",
  "Dividendstromen en box 2-planning richting 2027.",
  "Innovatiebox, WBSO en andere regelingen die vaak onbenut blijven.",
  "Pensioenopbouw — nog passend na de wetswijzigingen rond PEB?",
  "Indicatieve jaarlijkse besparing per punt + totaal.",
  "Prioriteringsmatrix: impact versus complexiteit.",
];

export function WhatYouGet() {
  return (
    <section id="rapport" className="bg-ink-900 py-24 text-white">
      <div className="bg-noise absolute inset-0 -z-10 opacity-40" />
      <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-gold-400">
            In uw rapport
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Een serieus adviesdocument —<br />
            geen stukje marketingflauwekul.
          </h2>
          <p className="mt-5 text-white/70 leading-relaxed">
            Elke bevinding wordt uitgelegd, met indicatieve besparingsrange én
            complexiteitsinschatting. Geen algemene tips, maar bevindingen die op
            uw situatie zijn afgestemd.
          </p>

          <ul className="mt-8 space-y-3">
            {ITEMS.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  className="mt-0.5 flex-none"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="11" fill="#d68f27" />
                  <path
                    d="M6 11.5 L9.5 14.5 L16 7.5"
                    stroke="#111b2e"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span className="text-white/90">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Voorbeeld van de prioriteringsmatrix uit het rapport */}
        <div className="relative">
          <div className="rounded-xl border border-white/10 bg-white p-6 text-ink-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
                Prioriteringsmatrix
              </span>
              <span className="text-xs text-ink-500">pagina 4 / 8</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div className="col-span-3 grid grid-cols-3 gap-3 text-center font-semibold text-ink-500">
                <span />
                <span>Lage complexiteit</span>
                <span>Hoge complexiteit</span>
              </div>
              <div className="flex items-center justify-end pr-2 font-semibold text-ink-500">
                Hoge impact
              </div>
              <div className="rounded-md bg-gold-100 p-3 text-gold-800">
                <p className="font-semibold">Gebruikelijk loon</p>
                <p className="text-gold-700">€ 1.500 – 6.000</p>
              </div>
              <div className="rounded-md bg-gold-50 p-3 text-gold-700">
                <p className="font-semibold">Holdingstructuur</p>
                <p className="text-gold-600">€ 2.000 – 15.000</p>
              </div>

              <div className="flex items-center justify-end pr-2 font-semibold text-ink-500">
                Lage impact
              </div>
              <div className="rounded-md bg-ink-50 p-3 text-ink-700">
                <p className="font-semibold">Auto-keuze</p>
                <p className="text-ink-600">€ 500 – 3.500</p>
              </div>
              <div className="rounded-md bg-ink-50 p-3 text-ink-700">
                <p className="font-semibold">Innovatiebox</p>
                <p className="text-ink-600">€ 2.000 – 25.000</p>
              </div>
            </div>
            <p className="mt-4 text-[11px] italic text-ink-500">
              Indicatief rapport · geen fiscaal advies
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
