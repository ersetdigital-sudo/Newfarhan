"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cloudinaryImage } from "@/lib/cloudinary";
import type { PortfolioItem } from "@/lib/portfolio";
import { CATEGORY_KEYS, CATEGORY_LABELS, GRID_SPEC } from "@/lib/site-slots";

interface PortfolioGridProps {
  items: PortfolioItem[];
  onQuickView: (item: PortfolioItem) => void;
}

export function PortfolioGrid({ items, onQuickView }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const ref = useScrollReveal();

  /**
   * Tab filter cuma muncul untuk kategori yang benar-benar ada isinya.
   *
   * Sebelumnya daftarnya dipatok di kode, jadi kategori yang proyeknya sudah
   * dihapus/di-hide tetap nampil — dan diklik hasilnya grid kosong tanpa
   * keterangan apa pun. Sekarang kategori baru otomatis muncul begitu ada
   * proyek pertamanya, dan hilang sendiri kalau isinya habis. Urutannya tetap
   * konsisten karena diambil dari CATEGORY_KEYS, bukan urutan item.
   */
  const availableCategories: string[] = CATEGORY_KEYS.filter((key) =>
    items.some((item) => item.category === key)
  );

  // Kalaupun filter yang aktif sudah nggak punya isi (mis. proyek terakhirnya
  // baru dihapus), halaman balik ke "All" daripada nampil grid kosong.
  const activeFilterKey =
    activeFilter === "all" || availableCategories.includes(activeFilter)
      ? activeFilter
      : "all";

  const filters = availableCategories.length > 1 ? ["all", ...availableCategories] : [];

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
                {CATEGORY_LABELS[key] ?? key}
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

  return (
    <a
      role="button"
      tabIndex={0}
      data-quick=""
      data-desc={item.quickView.description}
      data-cat={item.category}
      data-card=""
      data-tilt=""
      className="reveal tilt group relative block overflow-hidden rounded-[1.75rem] border border-ink/8 bg-chalk"
      onClick={(e) => {
        e.preventDefault();
        onQuickView(item);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onQuickView(item);
      }}
    >
      {/*
        Rasio 4:5 dikunci di sini. Foto yang di-upload lewat /admin sudah
        dipadu Cloudinary ke kanvas 1200x1500, dan object-contain bikin foto
        lama (yang belum lewat Cloudinary) juga tampil utuh — jadi nggak ada
        bagian yang terpotong, dari sumber mana pun.
      */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F7F1E7]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cloudinaryImage(item.image, GRID_SPEC.width, GRID_SPEC.height)}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
        />
      </div>
      <div
        className="shine absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(to top, rgba(20,19,26,.9), rgba(20,19,26,.1) 55%, transparent)" }}
      />
      <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
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
    </a>
  );
}
