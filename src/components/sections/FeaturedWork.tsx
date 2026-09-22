"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cloudinaryImage } from "@/lib/cloudinary";
import type { SiteImage } from "@/lib/portfolio";
import { settingValue, type SettingsMap } from "@/lib/site-settings";
import { slotCanvas, slotSpec } from "@/lib/site-slots";

interface FeaturedWorkProps {
  slots: Record<string, SiteImage>;
  settings?: SettingsMap;
}

/**
 * Tiga kartu kecil di sebelah kanan foto utama.
 *
 * Teksnya dibaca dari `site_settings` lewat `settingValue`, jadi admin bisa
 * menggantinya tanpa menyentuh kode — kalau fieldnya dikosongkan, otomatis
 * balik ke teks bawaan. Pemetaannya per-POSISI (kartu 1/2/3), bukan per-label,
 * supaya mengganti nama label nggak diam-diam ngubah urutan teks.
 */
const SECONDARY_CARDS = [
  {
    slot: "featured_stationery",
    badgeKey: "featured_card1_badge",
    titleKey: "featured_card1_title",
  },
  {
    slot: "featured_environmental",
    badgeKey: "featured_card2_badge",
    titleKey: "featured_card2_title",
  },
  {
    slot: "featured_digital",
    badgeKey: "featured_card3_badge",
    titleKey: "featured_card3_title",
  },
];

export function FeaturedWork({ slots, settings }: FeaturedWorkProps) {
  const ref = useScrollReveal();

  const main = slots.featured_main;
  const mainCanvas = slotCanvas("featured_main");
  const mainSrc = cloudinaryImage(
    main?.image_url || slotSpec("featured_main")?.fallback || "",
    mainCanvas.width,
    mainCanvas.height
  );

  // Teks bisa diganti dari admin. Semua elemen teks di kartu diposisikan
  // absolut di dalam kotak yang ukurannya udah dikunci, jadi panjang-pendeknya
  // nggak bisa menggeser layout. Line-clamp cuma jaring pengaman terakhir biar
  // teks panjang nggak meluber keluar kartu di layar kecil.
  const kicker = settingValue(settings, "featured_kicker");
  const title1 = settingValue(settings, "featured_title_1");
  const title2 = settingValue(settings, "featured_title_2");
  const intro = settingValue(settings, "featured_intro");

  const mainBadge = settingValue(settings, "featured_main_badge");
  const mainTitle = settingValue(settings, "featured_main_title");
  const mainDesc = settingValue(settings, "featured_main_desc");

  return (
    <section id="portfolio" className="mx-auto max-w-[1200px] px-6 pt-24">
      <p ref={ref} className="reveal mb-4 font-display text-xs tracking-[0.3em] text-ink/40">
        {kicker}
      </p>
      <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="min-w-0 font-display text-4xl font-bold tracking-[-0.03em] md:max-w-[720px] md:text-6xl">
          {title1}
          {title2 ? (
            <>
              {" "}
              <span className="grad-text">{title2}</span>
            </>
          ) : null}
        </h2>
        <p className="max-w-sm shrink-0 whitespace-pre-line text-sm leading-relaxed text-ink/60">
          {intro}
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
            <span className="inline-flex max-w-[85%] truncate rounded-full bg-coral px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
              {mainBadge}
            </span>
            <h3
              title={mainTitle}
              className="mt-5 line-clamp-3 font-display text-2xl font-bold leading-tight text-white md:text-4xl"
            >
              {mainTitle}
            </h3>
            <p title={mainDesc} className="mt-3 line-clamp-2 max-w-sm text-sm text-white/70">
              {mainDesc}
            </p>
          </div>
        </a>

        {/* Kartu kecil — rasio dikunci 2:1, sama persis dengan kanvas upload.
            object-contain bikin foto yang belum lewat Cloudinary pun tampil
            utuh, bukan dipotong jadi strip tipis. */}
        {SECONDARY_CARDS.map(({ slot, badgeKey, titleKey }) => {
          const spec = slotSpec(slot);
          const image = slots[slot];
          const label = settingValue(settings, badgeKey) || spec?.label || "";
          const title = settingValue(settings, titleKey) || label;
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
                <span className="inline-flex max-w-[85%] truncate rounded-full bg-mustard/95 text-ink px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]">
                  {label}
                </span>
                <h3
                  title={title}
                  className="mt-2.5 line-clamp-2 font-display text-lg font-bold leading-tight text-white"
                >
                  {title}
                </h3>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
