"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function ProjectHero() {
  const ref = useScrollReveal();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-coral/18 blur-[130px] floaty" />
      <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-mustard/20 blur-[130px]" />
      <div className="relative mx-auto max-w-[1200px] px-6 pb-12 pt-14 md:pt-20">
        <p ref={ref} data-hero="" className="mb-6 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-chalk px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-coral">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Brand Identity System · 2025
        </p>
        <h1 data-hero="" className="max-w-4xl font-display text-[11vw] font-extrabold leading-[0.9] tracking-[-0.04em] md:text-[5.6rem]">
          <span className="grad-text">ARVA</span>
        </h1>
        <p data-hero="" className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/65">
          Identitas visual menyeluruh: logo suite, sistem warna dan tipografi, stationery,
          signage toko, sampai template konten sosial media yang bisa dijalankan sendiri oleh tim.
        </p>
        <dl data-hero="" className="mt-14 grid gap-8 border-t border-ink/10 pt-8 sm:grid-cols-4">
          <div><dt className="text-xs uppercase tracking-[0.18em] text-ink/40">Klien</dt><dd className="mt-2 font-display text-sm font-semibold">ARVA</dd></div>
          <div><dt className="text-xs uppercase tracking-[0.18em] text-ink/40">Layanan</dt><dd className="mt-2 font-display text-sm font-semibold">Identity &amp; Brand System</dd></div>
          <div><dt className="text-xs uppercase tracking-[0.18em] text-ink/40">Durasi</dt><dd className="mt-2 font-display text-sm font-semibold">6 minggu</dd></div>
          <div><dt className="text-xs uppercase tracking-[0.18em] text-ink/40">Peran</dt><dd className="mt-2 font-display text-sm font-semibold">Designer &amp; Art Direction</dd></div>
        </dl>
      </div>
    </section>
  );
}
