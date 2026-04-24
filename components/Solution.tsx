// §2.4 Oplossing — diagnose vóór verandering.

import Link from "next/link";

export function Solution() {
  return (
    <section id="oplossing" className="bg-ink-50 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
          De oplossing
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          U heeft niet meteen een nieuwe boekhouder nodig.
          <br />
          U heeft eerst <span className="text-gold-700">inzicht</span> nodig.
        </h2>

        <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink-700">
          <p>
            Daarom hebben we de <strong>DGA Belastingscan</strong> ontwikkeld: een
            diagnostisch rapport dat binnen 8 minuten laat zien waar in úw specifieke
            situatie fiscale optimalisatie mogelijk is.
          </p>
          <p>
            Gratis. Zonder verplichtingen. Het rapport is van u — u kunt het zelfs
            doorgeven aan uw huidige boekhouder.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-ink-800"
          >
            Ik wil mijn persoonlijke rapport →
          </Link>
        </div>
      </div>
    </section>
  );
}
