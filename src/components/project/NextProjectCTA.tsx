"use client";

import Link from "next/link";

export function NextProjectCTA() {
  return (
    <section className="border-t border-ink/10">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <Link data-magnetic="" href="/#works" className="reveal group flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/40">Selanjutnya</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] md:text-6xl">
              Lihat karya<br />
              <span className="grad-text">lainnya.</span>
            </h2>
          </div>
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink text-paper transition-all duration-300 group-hover:scale-110 group-hover:bg-coral">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
