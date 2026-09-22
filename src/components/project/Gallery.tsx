"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cloudinaryImage } from "@/lib/cloudinary";
import type { SiteImage } from "@/lib/portfolio";
import { slotCanvas, slotSpec } from "@/lib/site-slots";

interface GalleryProps {
  slots: Record<string, SiteImage>;
}

/**
 * Tiga kartu gallery. Lebar kolom dan rasionya dikunci di sini, jadi admin
 * cuma bisa mengganti isi gambarnya.
 */
const GALLERY_LAYOUT = [
  { slot: "project_gallery_1", span: "col-span-full md:col-span-4", aspect: "aspect-[16/9]" },
  { slot: "project_gallery_2", span: "col-span-full md:col-span-2", aspect: "aspect-[5/6]" },
  { slot: "project_gallery_3", span: "col-span-full", aspect: "aspect-[13/5]" },
];

export function Gallery({ slots }: GalleryProps) {
  const ref = useScrollReveal();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");

  const images = GALLERY_LAYOUT.map((entry) => {
    const spec = slotSpec(entry.slot);
    const image = slots[entry.slot];
    const canvas = slotCanvas(entry.slot);
    return {
      src: cloudinaryImage(image?.image_url || spec?.fallback || "", canvas.width, canvas.height),
      alt: image?.alt || spec?.alt || spec?.title || "",
      span: entry.span,
      aspect: entry.aspect,
    };
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };

    if (lightboxOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-6 pb-20">
        <p ref={ref} className="reveal mb-4 font-display text-xs tracking-[0.3em] text-ink/40">GALLERY</p>
        <div className="reveal mb-10 flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl font-bold tracking-[-0.03em] md:text-5xl">Galeri</h2>
          <p className="hidden text-sm text-ink/50 sm:block">Klik gambar untuk lihat versi besar</p>
        </div>
        <div className="grid gap-5 md:grid-cols-6">
          {images.map((img, i) => (
            <div key={i} className={`reveal overflow-hidden rounded-[1.75rem] border border-ink/8 ${img.span}`}>
              <div className={`relative w-full ${img.aspect} bg-[#F7F1E7]`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-zoom=""
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-[1100ms] hover:scale-[1.05]"
                  onClick={() => {
                    setLightboxSrc(img.src);
                    setLightboxOpen(true);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <div
        id="lightbox"
        className={`fixed inset-0 z-[900] place-items-center bg-ink/92 p-6 backdrop-blur ${
          lightboxOpen ? "grid" : "hidden"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLightboxOpen(false);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id="lightbox-img"
          src={lightboxSrc}
          alt=""
          className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain"
        />
        <button
          id="lightbox-close"
          aria-label="Tutup"
          className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white"
          onClick={() => setLightboxOpen(false)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </>
  );
}
