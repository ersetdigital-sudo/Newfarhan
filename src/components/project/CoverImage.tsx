"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cloudinaryImage } from "@/lib/cloudinary";
import { slotCanvas } from "@/lib/site-slots";

interface CoverImageProps {
  src: string;
  alt?: string;
}

export function CoverImage({ src, alt }: CoverImageProps) {
  const ref = useScrollReveal();

  return (
    <section className="mx-auto max-w-[1200px] px-6">
      {/* Rasio dikunci 2:1 (kanvas upload 1600x800). Foto ditampilkan utuh
          dengan object-contain, jadi ganti foto nggak akan merusak layout. */}
      <div
        ref={ref}
        className="reveal relative aspect-[2/1] overflow-hidden rounded-[2rem] border border-ink/8"
        style={{ background: "#F7F1E7" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-zoom=""
          src={cloudinaryImage(src, slotCanvas("project_cover").width, slotCanvas("project_cover").height)}
          alt={alt || "ARVA — brand identity & guidelines board"}
          className="h-full w-full object-contain object-top"
        />
      </div>
    </section>
  );
}
