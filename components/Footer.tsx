import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white py-12 text-sm text-ink-600">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-ink-900">
            {SITE.brand}
          </p>
          <p className="mt-3 text-ink-500">
            Fiscale optimalisatie voor DGA's in het MKB.
          </p>
        </div>

        <nav aria-label="Pagina's">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink-500">
            Paginas
          </h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/#hoe" className="hover:text-ink-900">
                Hoe het werkt
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-ink-900">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/scan" className="hover:text-ink-900">
                Start scan
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Juridisch">
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink-500">
            Juridisch
          </h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/privacy" className="hover:text-ink-900">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-ink-900">
                Disclaimer
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-ink-500">
            Contact
          </h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="hover:text-ink-900"
              >
                {SITE.contactEmail}
              </a>
            </li>
            {SITE.kvkNumber ? (
              <li className="text-ink-500">KvK {SITE.kvkNumber}</li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-6 text-xs text-ink-500">
        © {new Date().getFullYear()} {SITE.brand}. Alle rechten voorbehouden. Dit
        rapport is indicatief en vervangt geen fiscaal advies.
      </div>
    </footer>
  );
}
