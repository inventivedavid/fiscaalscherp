// §2.3 Probleemherkenning — pain stacking, oplopend.

const ITEMS = [
  "U hoort eens per jaar van uw boekhouder — meestal in maart, als de aangifte erdoor moet.",
  "Vraagt u of er nog fiscale mogelijkheden zijn, dan krijgt u 'het zit wel goed zo' — zonder onderbouwing.",
  "U heeft een holding 'omdat het zo moest', maar u weet niet wat die u oplevert of kost.",
  "U keert amper dividend uit omdat u niet zeker weet wat fiscaal slim is — en er komt nooit iemand proactief bij u langs om dit te bespreken.",
  "Uw DGA-salaris is al drie jaar hetzelfde, omdat niemand u ooit heeft uitgelegd hoe je dat optimaliseert.",
  "U werkt met moderne cloudsoftware, maar uw boekhouder gebruikt die nog als 'invoermodule' — niet om echt met u mee te denken.",
];

export function ProblemRecognition() {
  return (
    <section
      id="probleem"
      className="bg-white py-24"
      aria-labelledby="probleem-title"
    >
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
          Herkent u dit?
        </p>
        <h2
          id="probleem-title"
          className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-4xl"
        >
          De pijn zit niet in wat uw boekhouder doet —<br className="hidden md:block" />
          maar in wat er <em className="not-italic text-gold-700">niet</em> gebeurt.
        </h2>

        <ul className="mt-12 space-y-5">
          {ITEMS.map((text, i) => (
            <li
              key={i}
              className="group flex gap-4 rounded-lg border border-ink-100 bg-ink-50 p-5 transition hover:border-gold-300 hover:bg-white"
            >
              <span className="mt-0.5 flex size-7 flex-none items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-gold-400">
                {i + 1}
              </span>
              <p className="text-ink-800 leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-balance text-center text-lg italic text-ink-600">
          Als u er minstens drie herkent, is deze scan voor u bedoeld.
        </p>
      </div>
    </section>
  );
}
