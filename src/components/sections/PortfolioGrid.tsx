"use client";

import { useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cloudinaryImage } from "@/lib/cloudinary";
import type { PortfolioItem } from "@/lib/portfolio";
import { categoryLabel, type Category } from "@/lib/categories";
import { GRID_SPEC } from "@/lib/site-slots";

interface PortfolioGridProps {
  items: PortfolioItem[];
  categories: Category[];
  onQuickView: (item: PortfolioItem) => void;
}

export function PortfolioGrid({ items, categories, onQuickView }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const ref = useScrollReveal();

  /**
   * Tab filter cuma muncul untuk kategori yang benar-benar ada isinya.
   *
   * Urutannya ngikut daftar kategori di database (diatur dari panel admin),
   * bukan urutan proyeknya — jadi tab nggak ikut lompat-lompat waktu urutan
   * grid diubah. Kategori yang belum punya proyek nggak nampil, dan kalau
   * isinya habis tabnya hilang sendiri.
   */
  const usedKeys = Array.from(new Set(items.map((item) => item.category)));
  const orderedKeys = [
    ...categories.filter((category) => usedKeys.includes(category.key)).map((c) => c.key),
    // Proyek yang kategori key-nya nggak ada di daftar tetap dapat tab sendiri,
    // biar nggak ada proyek yang "nggak kelihatan" di tab mana pun.
    ...usedKeys.filter((key) => !categories.some((category) => category.key === key)),
  ];

  // Kalaupun filter yang aktif sudah nggak punya isi (mis. proyek terakhirnya
  // baru dihapus), halaman balik ke "All" daripada nampil grid kosong.
  const activeFilterKey =
    activeFilter === "all" || orderedKeys.includes(activeFilter) ? activeFilter : "all";

  const filters = orderedKeys.length > 1 ? ["all", ...orderedKeys] : [];

  // Diturunkan langsung dari props, bukan disimpan di state — biar nggak ada
  // render berantai waktu filter atau daftar item berubah.
  const filteredItems =
    activeFilterKey === "all"
      ? items
      : items.filter((item) => item.category === activeFilterKey);

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-6 pt-12">
        <p ref={ref} className="reveal mt-24 mb-4 font-display text-xs tracking-[0.3em] text-ink/40">SELECTED WORKS</p>
        {filters.length > 0 ? (
          <div className="reveal flex flex-wrap gap-2.5" id="filters">
            {filters.map((key) => (
              <button
                key={key}
                data-filter={key}
                aria-pressed={activeFilterKey === key}
                onClick={() => setActiveFilter(key)}
                className={`filter-btn rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors ${
                  activeFilterKey === key
                    ? "bg-coral text-white"
                    : "border border-ink/12 bg-chalk hover:border-coral hover:text-coral"
                }`}
              >
                {categoryLabel(categories, key)}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-12">
        {filteredItems.length === 0 ? (
          <p className="rounded-[1.75rem] border border-dashed border-ink/15 bg-chalk px-6 py-16 text-center text-sm text-ink/50">
            Belum ada proyek di kategori ini. Tambah lewat panel admin → tab Grid Portofolio.
          </p>
        ) : (
          <div id="grid" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <PortfolioCard key={item.id} item={item} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function PortfolioCard({
  item,
  onQuickView,
}: {
  item: PortfolioItem;
  onQuickView: (item: PortfolioItem) => void;
}) {
  const categoryColors: Record<string, string> = {
    apparel: "#FF5A45",
    poster: "#E8A33D",
    logo: "#8FBF8F",
    branding: "#9DBE9D",
    social: "#E8A33D",
  };

  const bgColors: Record<string, string> = {
    apparel: "#FF5A45",
    poster: "#E8A33D",
    logo: "#2E5E3A",
    branding: "#C96A4B",
    social: "#E8A33D",
  };

  // Foto utama dulu, baru foto tambahan. Kalau cuma satu, kartunya biasa aja
  // (nggak ada tombol geser atau titik indikator).
  const photos = [item.image, ...item.images].filter(Boolean);
  const many = photos.length > 1;

  const [index, setIndex] = useState(0);
  // Index bisa ketinggalan kalau daftar fotonya berubah (mis. foto dihapus).
  const active = index >= 0 && index < photos.length ? index : 0;

  const go = (step: number) => setIndex((active + step + photos.length) % photos.length);

  /** Tombol di dalam kartu jangan sampai ikut membuka popup. */
  const isolate = (action: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };

  // Geser pakai jari di HP: cukup bandingkan posisi awal & akhir sentuhan.
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null || !many) return;

    const delta = (event.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(delta) < 40) return;
    go(delta < 0 ? 1 : -1);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-quick=""
      data-desc={item.quickView.description}
      data-cat={item.category}
      data-card=""
      data-tilt=""
      className="reveal tilt group relative block cursor-pointer overflow-hidden rounded-[1.75rem] border border-ink/8 bg-chalk"
      onClick={() => onQuickView(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onQuickView(item);
        }
      }}
    >
      {/*
        Rasio 4:5 dikunci di sini. Foto yang di-upload lewat /admin sudah
        dipadu Cloudinary ke kanvas 1200x1500, dan object-contain bikin foto
        lama (yang belum lewat Cloudinary) juga tampil utuh — jadi nggak ada
        bagian yang terpotong, dari sumber mana pun.
      */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#F7F1E7]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {photos.map((photo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${photo}-${i}`}
            src={cloudinaryImage(photo, GRID_SPEC.width, GRID_SPEC.height)}
            alt={i === 0 ? item.title : `${item.title} — foto ${i + 1}`}
            loading="lazy"
            aria-hidden={i !== active}
            className={`absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-out group-hover:scale-[1.07] ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {many ? (
          <>
            <button
              type="button"
              aria-label="Foto sebelumnya"
              onClick={isolate(() => go(-1))}
              className="absolute left-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ink/50 text-white opacity-0 backdrop-blur transition-opacity hover:bg-coral focus-visible:opacity-100 group-hover:opacity-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 6 9 12l6 6" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Foto berikutnya"
              onClick={isolate(() => go(1))}
              className="absolute right-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ink/50 text-white opacity-0 backdrop-blur transition-opacity hover:bg-coral focus-visible:opacity-100 group-hover:opacity-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
              {photos.map((photo, i) => (
                <button
                  key={photo + i}
                  type="button"
                  aria-label={`Lihat foto ${i + 1} dari ${photos.length}`}
                  aria-current={i === active}
                  onClick={isolate(() => setIndex(i))}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
      <div
        className="shine absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(to top, rgba(20,19,26,.9), rgba(20,19,26,.1) 55%, transparent)" }}
      />
      <div
        className={`absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 ${
          many ? "pb-10" : ""
        }`}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: categoryColors[item.category] || "#FF5A45" }}>
              {item.description}
            </p>
            <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white">{item.title}</h3>
          </div>
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white"
            style={{ background: bgColors[item.category] || "#FF5A45" }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
