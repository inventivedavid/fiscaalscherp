import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink-900 px-6 text-center text-white">
      <p className="text-sm font-bold uppercase tracking-widest text-gold-400">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold md:text-5xl">
        Deze pagina bestaat (nog) niet
      </h1>
      <p className="mt-4 max-w-md text-white/70">
        De link die u volgde bestaat niet. Geen zorgen, op de homepage vindt u
        wel waar u naar zoekt.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-3 text-sm font-semibold text-ink-900 hover:bg-gold-400"
      >
        ← Terug naar home
      </Link>
    </div>
  );
}
