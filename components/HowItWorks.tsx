// §2.5 Hoe het werkt — 3 stappen, angst voor onbekende weg.

const STEPS = [
  {
    title: "Beantwoord 20 vragen",
    desc: "Over uw BV, DGA-salaris, vermogen en toekomstplannen. Duurt 8 minuten. U hoeft geen cijfers op te zoeken — ranges volstaan.",
  },
  {
    title: "Ontvang uw rapport",
    desc: "Direct in uw mailbox. Persoonlijk, 6–10 pagina's, met concrete bevindingen en indicatieve besparingen per punt.",
  },
  {
    title: "Plan (optioneel) een gesprek",
    desc: "Wilt u de bevindingen bespreken? Plan kosteloos een gesprek van 30 minuten. Geen verkooppraatje — we lopen het rapport met u door.",
  },
];

export function HowItWorks() {
  return (
    <section id="hoe" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
            Hoe het werkt
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
            Van invullen tot rapport — binnen 8 minuten
          </h2>
        </div>

        <ol className="mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="relative rounded-xl border border-ink-100 bg-ink-50 p-7 transition hover:border-gold-300 hover:bg-white"
            >
              <span className="absolute -top-4 left-5 flex size-10 items-center justify-center rounded-full bg-ink-900 text-lg font-bold text-gold-400 shadow-soft">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink-900">
                {s.title}
              </h3>
              <p className="mt-2 text-ink-700 leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
