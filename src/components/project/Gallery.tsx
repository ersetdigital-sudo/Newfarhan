"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function Gallery() {
  const ref = useScrollReveal();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");

  const images = [
    { src: "/images/80931dd2-bdaa-4375-809d-307fa7ccf0e0.png", alt: "ARVA — stationery suite", className: "col-span-full overflow-hidden rounded-[1.75rem] border border-ink/8 md:col-span-4" },
    { src: "/images/d70331f8-fda6-4948-a310-7da323f5f60b.png", alt: "ARVA — social feed system", className: "col-span-full overflow-hidden rounded-[1.75rem] border border-ink/8 md:col-span-2" },
    { src: "/images/6b73f91c-313e-4ee0-b3ae-5988bf16bf95.png", alt: "ARVA — signage &amp; facade", className: "col-span-full overflow-hidden rounded-[1.75rem] border border-ink/8" },
  ];

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
            <div key={i} className={`reveal ${img.className}`}>
              <img
                data-zoom=""
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-[1100ms] hover:scale-[1.05] md:h-[440px]"
                onClick={() => {
                  setLightboxSrc(img.src);
                  setLightboxOpen(true);
                }}
              />
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
        <img
          id="lightbox-img"
          src={lightboxSrc}
          alt=""
          className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain"
        />
        <button
          id="lightbox-close"
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
