"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/lib/site";

const PRIMARY = [
  { label: "Scan", href: "/scan" },
  { label: "Tools", href: "/tools" },
  { label: "Benchmarks", href: "/benchmarks" },
  { label: "Kennisbank", href: "/kennisbank" },
  { label: "Prijzen", href: "/prijzen" },
];

export function Nav({ variant = "light" }: { variant?: "light" | "transparent" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const wrapperClass =
    variant === "transparent"
      ? "absolute inset-x-0 top-0 z-30"
      : "sticky top-0 z-30 bg-canvas/85 backdrop-blur-md hairline-b";

  return (
    <header className={wrapperClass}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          aria-label={`${SITE.brand} home`}
          className="flex items-center gap-2.5 text-ink"
        >
          <LogoMark />
          <span className="font-display text-xl tracking-tight">
            {SITE.brand}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 md:flex">
          {PRIMARY.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "text-sm transition",
                    active ? "text-ink" : "text-ink-muted hover:text-ink",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition hover:bg-ink-soft"
          >
            Start scan
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="hairline-t bg-canvas md:hidden">
          <ul className="mx-auto max-w-6xl px-6 py-4">
            {PRIMARY.map((item) => (
              <li key={item.href} className="border-b border-line last:border-0">
                <Link
                  href={item.href}
                  className="block py-3 text-sm text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/scan"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas"
                onClick={() => setOpen(false)}
              >
                Start scan
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="3.5"
        width="21"
        height="21"
        rx="3"
        stroke="#0a0a0a"
        strokeWidth="1.5"
        fill="transparent"
      />
      <path
        d="M9 17 L13 13 L16 16 L20 10"
        stroke="#a16207"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="9" cy="17" r="1.2" fill="#0a0a0a" />
      <circle cx="20" cy="10" r="1.2" fill="#0a0a0a" />
    </svg>
  );
}
