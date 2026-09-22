"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCounter } from "@/hooks/useCounter";

export function Hero() {
  const heroRef = useScrollReveal();
  const counter120 = useCounter(120);
  const counter60 = useCounter(60);
  const counter6 = useCounter(6);

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-coral/18 blur-[130px] floaty" />
      <div className="pointer-events-none absolute -right-24 top-16 h-96 w-96 rounded-full bg-mustard/22 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/3 top-80 h-72 w-72 rounded-full bg-indigo/12 blur-[130px]" />

      <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-16 md:pt-24">
        <div ref={heroRef} data-hero="" className="mb-8 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-chalk px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-ink/55">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-coral/60" />
            <span className="relative h-2 w-2 rounded-full bg-coral" />
          </span>
          Indonesia · Tersedia untuk project baru
        </div>

        <h1 className="font-display text-[11.5vw] font-extrabold leading-[0.9] tracking-[-0.04em] md:text-[5.6rem]">
          <span data-hero="" className="block">Desain yang bekerja</span>
          <span data-hero="" className="block">untuk brand Anda.</span>
          <span data-hero="" className="block grad-text text-[8.5vw] md:text-[3.7rem]">Bukan sekadar terlihat bagus.</span>
        </h1>

        <div className="mt-9 grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
          <p data-hero="" className="max-w-lg text-[15px] leading-relaxed text-ink/65">
            Saya mengerjakan branding, logo, jersey, campaign, dan kebutuhan visual digital
            untuk membantu sebuah brand tampil lebih jelas dan profesional.
          </p>
          <div data-hero="" className="flex flex-wrap items-center gap-3 md:justify-end">
            <a data-magnetic="" href="#portfolio" className="group inline-flex items-center gap-3 rounded-full bg-coral px-8 py-4 font-display text-sm font-semibold text-white shadow-[0_16px_44px_-16px_rgba(255,90,69,.85)] transition-transform hover:-translate-y-0.5">
              Lihat Portfolio
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </a>
            <a data-magnetic="" href="#contact" className="rounded-full border border-ink/15 bg-chalk px-8 py-4 font-display text-sm font-semibold transition-colors hover:border-coral hover:text-coral">
              Mulai Project
            </a>
          </div>
        </div>

        <div className="mt-16 grid max-w-3xl grid-cols-3 gap-6 border-t border-ink/10 pt-8">
          <div>
            <p className="num font-display text-4xl font-bold tracking-tight">
              <span ref={counter120} className="counter" data-to="120">0</span>
              <span className="text-coral">+</span>
            </p>
            <p className="mt-1 text-xs text-ink/50">Project selesai</p>
          </div>
          <div>
            <p className="num font-display text-4xl font-bold tracking-tight">
              <span ref={counter60} className="counter" data-to="60">0</span>
              <span className="text-mustard">+</span>
            </p>
            <p className="mt-1 text-xs text-ink/50">Brand &amp; bisnis</p>
          </div>
          <div>
            <p className="num font-display text-4xl font-bold tracking-tight">
              <span ref={counter6} className="counter" data-to="6">0</span>
              <span className="text-indigo"> yr</span>
            </p>
            <p className="mt-1 text-xs text-ink/50">Tahun pengalaman</p>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden border-y border-ink/10 bg-ink py-4 text-paper">
        <div className="marquee-track flex w-[200%] items-center gap-8 whitespace-nowrap font-display text-sm uppercase tracking-[0.22em]">
          <span>Logo &amp; Brand Identity</span><span className="text-coral">—</span>
          <span>Jersey &amp; Apparel</span><span className="text-mustard">—</span>
          <span>Social Media</span><span className="text-coral">—</span>
          <span>Banner &amp; Poster</span><span className="text-mustard">—</span>
          <span>Campaign Visual</span><span className="text-coral">—</span>
          <span>Logo &amp; Brand Identity</span><span className="text-coral">—</span>
          <span>Jersey &amp; Apparel</span><span className="text-mustard">—</span>
          <span>Social Media</span><span className="text-coral">—</span>
          <span>Banner &amp; Poster</span><span className="text-mustard">—</span>
          <span>Campaign Visual</span><span className="text-coral">—</span>
        </div>
      </div>
    </section>
  );
}
