import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-eyebrow text-ink-subtle">404</p>
      <h1 className="mt-6 font-display text-display-lg text-ink text-balance">
        Deze pagina bestaat (nog) niet.
      </h1>
      <p className="mt-4 max-w-md text-base text-ink-soft">
        De gezochte URL is niet beschikbaar. Vanaf de homepage zijn alle onderdelen van het platform eenvoudig te bereiken.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas hover:bg-ink-soft"
      >
        Naar home →
      </Link>
    </div>
  );
}
