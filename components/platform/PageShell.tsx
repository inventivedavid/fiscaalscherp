import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="hairline-b bg-canvas pb-16 pt-24 md:pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
          {eyebrow}
        </p>
        <h1 className="mt-5 font-display text-display-xl text-ink text-balance md:max-w-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
