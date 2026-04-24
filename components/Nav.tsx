import Link from "next/link";
import { SITE } from "@/lib/site";

export function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-white focus-visible:outline-offset-4"
          aria-label={`${SITE.brand} home`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="24" height="24" rx="5" fill="#d68f27" />
            <path
              d="M9 14.5 L12.5 18 L19 10"
              stroke="#111b2e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="text-sm font-bold uppercase tracking-widest">
            {SITE.brand}
          </span>
        </Link>

        <Link
          href="/scan"
          className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-ink-900 transition hover:bg-gold-400"
        >
          Start scan
        </Link>
      </nav>
    </header>
  );
}
