"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cloudinaryImage } from "@/lib/cloudinary";
import type { SiteImage } from "@/lib/portfolio";
import { slotCanvas, slotSpec } from "@/lib/site-slots";

interface FeaturedWorkProps {
  slots: Record<string, SiteImage>;
}

/** Urutan kartu kecil di sebelah kanan foto utama. */
const SECONDARY_SLOTS = ["featured_stationery", "featured_environmental", "featured_digital"];

const SECONDARY_TITLES: Record<string, string> = {
  Stationery: "Business Card, Letterhead & Tag",
  Environmental: "Blade Signage & Facade",
  Digital: "Social Feed System",
};

export function FeaturedWork({ slots }: FeaturedWorkProps) {
  const ref = useScrollReveal();

  const main = slots.featured_main;
  const mainCanvas = slotCanvas("featured_main");
  const mainSrc = cloudinaryImage(
    main?.image_url || slotSpec("featured_main")?.fallback || "",
    mainCanvas.width,
    mainCanvas.height
  );

  return (
    <section id="portfolio" className="mx-auto max-w-[1200px] px-6 pt-24">
      <p ref={ref} className="reveal mb-4 font-display text-xs tracking-[0.3em] text-ink/40">FEATURED WORK</p>
      <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-4xl font-bold tracking-[-0.03em] md:text-6xl">
          ARVA <span className="grad-text">Identity</span>
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-ink/60">
          Brand identity lengkap untuk studio kreatif ARVA: logo suite, palet warna, tipografi, stationery, signage, dan aset digital.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-5 md:grid-rows-3">
        {/* Kartu utama — foto ditampilkan utuh (object-contain), jadi rasio
            apa pun tetap aman dan nggak ada bagian yang terpotong. */}
        <a href="/project" data-card="" data-cat="branding" className="reveal group relative col-span-full overflow-hidden rounded-[2rem] border border-ink/8 bg-chalk md:col-span-3 md:row-span-3">
          <div className="relative h-[360px] w-full overflow-hidden bg-[#F7F1E7] md:h-full md:min-h-[640px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainSrc}
              alt={main?.alt || "ARVA — brand identity & guidelines board"}
              className="h-full w-full object-contain object-top transition-transform duration-[1200ms] group-hover:scale-[1.03]"
            />
          </div>
          <div className="shine absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,19,26,.95) 0%, rgba(20,19,26,.55) 32%, rgba(20,19,26,0) 62%)" }} />
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
            <span className="inline-flex rounded-full bg-coral px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
              Featured · Branding
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-white md:text-4xl">
              ARVA —<br />Brand Identity System
            </h3>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              Logo suite, palet warna, tipografi, dan guideline dalam satu papan identitas.
            </p>
          </div>
        </a>

        {/* Kartu kecil — rasio dikunci 2:1, sama persis dengan kanvas upload.
            object-contain bikin foto yang belum lewat Cloudinary pun tampil
            utuh, bukan dipotong jadi strip tipis. */}
        {SECONDARY_SLOTS.map((slot) => {
          const spec = slotSpec(slot);
          const image = slots[slot];
          const label = image?.label || spec?.label || "";
          const canvas = slotCanvas(slot);
          const src = cloudinaryImage(
            image?.image_url || spec?.fallback || "",
            canvas.width,
            canvas.height
          );

          return (
            <a key={slot} href="/project" data-card="" data-cat="branding" className="reveal group relative col-span-full overflow-hidden rounded-[2rem] border border-ink/8 bg-chalk md:col-span-2">
              <div className="relative aspect-[2/1] w-full overflow-hidden bg-[#F7F1E7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={image?.alt || label}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-[1200ms] group-hover:scale-[1.05]"
                />
              </div>
              <div className="shine absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,19,26,.95) 0%, rgba(20,19,26,.5) 42%, rgba(20,19,26,0) 78%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-flex rounded-full bg-mustard/95 text-ink px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]">
                  {label}
                </span>
                <h3 className="mt-2.5 font-display text-lg font-bold leading-tight text-white">
                  {SECONDARY_TITLES[label] ?? label}
                </h3>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
