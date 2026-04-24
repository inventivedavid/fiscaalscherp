import Link from "next/link";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Scan", href: "/scan" },
      { label: "Tools", href: "/tools" },
      { label: "Benchmarks", href: "/benchmarks" },
      { label: "Kennisbank", href: "/kennisbank" },
      { label: "Prijzen", href: "/prijzen" },
    ],
  },
  {
    title: "Voor sector",
    links: [
      { label: "Tech & SaaS", href: "/voor/tech" },
      { label: "Productie & industrie", href: "/voor/productie" },
      { label: "E-commerce", href: "/voor/ecommerce" },
    ],
  },
  {
    title: "Over",
    links: [
      { label: "Methodologie", href: "/methodologie" },
      { label: "Privacy", href: "/privacy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-canvas py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-2xl text-ink">{SITE.brand}</p>
            <p className="mt-3 max-w-xs text-sm text-ink-muted">
              Fiscaal platform voor Nederlandse DGA's. Scan, tools, benchmarks en kennisbank — open methodologie.
            </p>
            <p className="mt-6 text-xs text-ink-subtle">
              Contact:{" "}
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="text-ink-muted underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                {SITE.contactEmail}
              </a>
              {SITE.kvkNumber ? (
                <>
                  <span className="mx-2">·</span>
                  KvK {SITE.kvkNumber}
                </>
              ) : null}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
              Aansluiten
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/scan" className="text-sm text-ink-soft hover:text-ink">
                  Scan starten
                </Link>
              </li>
              <li>
                <a
                  href={SITE.calUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-ink-soft hover:text-ink"
                >
                  Kennismaken
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-ink-subtle md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {SITE.brand}. Alle rechten voorbehouden.</p>
          <p>
            Indicaties op dit platform zijn geen fiscaal advies in de zin van
            art. 53 AWR. Implementatie vereist gesprek met een adviseur die de
            volledige context kent.
          </p>
        </div>
      </div>
    </footer>
  );
}
