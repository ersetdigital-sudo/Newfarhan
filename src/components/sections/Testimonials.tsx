"use client";

import { useState, useEffect, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    quote:
      "Sebelum kerja sama dengan Farhan, brand kami kelihatan berantakan—logo dipakai tiga versi beda, warna toko sama konten ngga nyambung. Sekarang? Satu sistem visual yang rapi, dan tim langsung paham cara pakainya.",
    name: "Dimas Prayoga",
    role: "Founder, ARVA Studio",
    result: "Brand consistency naik, tim gak bingung lagi",
    accent: "#FF5A45",
  },
  {
    quote:
      "Farhan ngga cuma bikin desain yang keren—dia mikirin detail yang bikin jersey kami langsung laku. 300+ pcs sold out dalam dua minggu. That's real impact.",
    name: "Raka Aditya",
    role: "Manager, PSN Football Club",
    result: "300+ jersey sold dalam 2 minggu",
    accent: "#E8A33D",
  },
  {
    quote:
      "Sejak konten visual kami dikerjain Farhan, engagement naik 40%. Brand kami keliatan lebih serius dan dipercaya sama customer. Worth every rupiah.",
    name: "Sari Dewi",
    role: "Marketing Lead, Kopi Lantai",
    result: "Engagement naik 40%",
    accent: "#3F3D9E",
  },
  {
    quote:
      "Yang bikin Farhan beda dari desainer lain: dia bener-bener denger cerita brand kami dulu sebelum mulai desain. Hasilnya? Visual yang bener-bener nyambung sama audiens.",
    name: "Andi Kurniawan",
    role: "Creative Director, Halcyon",
    result: "Brand recall meningkat signifikan",
    accent: "#C96A4B",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const sectionRef = useScrollReveal();

  const next = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[active];

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
      <p
        ref={sectionRef}
        className="reveal mb-4 font-display text-xs tracking-[0.3em] text-ink/40"
      >
        TESTIMONIALS
      </p>
      <h2 className="reveal font-display text-4xl font-bold tracking-[-0.03em] md:text-5xl">
        Kata klien.
      </h2>

      <div className="mt-12 md:mt-16">
        {/* Desktop: two-column */}
        <div className="hidden md:flex md:gap-10 md:items-stretch">
          {/* Left — active quote */}
          <div
            className="relative flex w-[45%] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-ink/8 bg-chalk p-10"
            style={{ borderLeft: `4px solid ${t.accent}` }}
            key={`desktop-quote-${active}`}
          >
            <span
              className="pointer-events-none absolute -left-1 -top-3 select-none font-display text-[120px] leading-none opacity-[0.06]"
              aria-hidden
            >
              &ldquo;
            </span>

            <blockquote className="relative z-10">
              <p className="font-body text-lg leading-relaxed text-ink/75">
                &ldquo;{t.quote}&rdquo;
              </p>
            </blockquote>

            <div className="mt-8">
              <div className="flex items-center gap-4">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-chalk"
                  style={{ background: t.accent }}
                >
                  {t.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <div>
                  <p className="font-display text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-ink/45">{t.role}</p>
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-xs font-medium text-ink/70">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: t.accent }}
                />
                {t.result}
              </div>
            </div>
          </div>

          {/* Right — list + nav */}
          <div className="flex w-[55%] flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              {testimonials.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > active ? 1 : -1);
                    setActive(i);
                  }}
                  className={`w-full rounded-[1rem] border p-5 text-left transition-all duration-300 ${
                    i === active
                      ? "border-ink/10 bg-chalk shadow-[0_4px_24px_rgba(20,19,26,0.06)]"
                      : "border-transparent bg-paper/60 hover:bg-paper"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-chalk"
                      style={{ background: item.accent }}
                    >
                      {item.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-display text-sm font-semibold ${
                          i === active ? "text-ink" : "text-ink/60"
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/40">
                        {item.role}
                      </p>
                    </div>
                    {i === active && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: item.accent }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop nav */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                aria-label="Sebelumnya"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/10 bg-chalk transition-colors hover:border-coral hover:text-coral"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Selanjutnya"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/10 bg-chalk transition-colors hover:border-coral hover:text-coral"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <div className="ml-2 flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > active ? 1 : -1);
                      setActive(i);
                    }}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active ? "w-8 bg-coral" : "w-2 bg-ink/15 hover:bg-ink/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden">
          <div
            key={`mobile-quote-${active}`}
            className={`relative overflow-hidden rounded-[1.25rem] border border-ink/8 bg-chalk p-6 ${
              direction === 1 ? "animate-fade-in-right" : "animate-fade-in-left"
            }`}
            style={{ borderLeft: `3px solid ${t.accent}` }}
          >
            <span
              className="pointer-events-none absolute -left-1 -top-3 select-none font-display text-[80px] leading-none opacity-[0.06]"
              aria-hidden
            >
              &ldquo;
            </span>

            <p className="relative z-10 text-sm leading-relaxed text-ink/75">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[10px] font-bold text-chalk"
                style={{ background: t.accent }}
              >
                {t.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <div>
                <p className="font-display text-sm font-semibold">{t.name}</p>
                <p className="text-[11px] text-ink/40">{t.role}</p>
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-[11px] font-medium text-ink/70">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: t.accent }}
              />
              {t.result}
            </div>
          </div>

          {/* Mobile nav */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > active ? 1 : -1);
                    setActive(i);
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-8 bg-coral" : "w-2 bg-ink/15"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Sebelumnya"
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-chalk"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Selanjutnya"
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-chalk"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
