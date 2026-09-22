"use client";

import { useEffect, useRef } from "react";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  category: string;
  title: string;
  description: string;
}

export function QuickViewModal({
  isOpen,
  onClose,
  image,
  category,
  title,
  description,
}: QuickViewModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <div
      id="quickview"
      className={`pointer-events-none fixed inset-0 z-[850] grid place-items-center p-4 opacity-0 transition-opacity duration-300 sm:p-6 ${
        isOpen ? "pointer-events-auto opacity-100" : ""
      }`}
    >
      <div data-qv-close="" className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        data-qv-panel=""
        className="relative max-h-[90vh] w-full max-w-[920px] overflow-hidden rounded-[2rem] border border-ink/10 bg-paper shadow-[0_30px_80px_rgba(20,19,26,.28)] transition-transform duration-[350ms]"
        style={{ transform: isOpen ? "translateY(0) scale(1)" : "translateY(18px) scale(.98)" }}
      >
        <button
          data-qv-close=""
          aria-label="Tutup"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-[1.15fr,1fr] md:overflow-hidden">
          <div className="h-[240px] bg-[#F7F1E7] md:h-[460px]">
            {image ? (
              <img id="qv-img" src={image} alt={title} className="h-full w-full object-contain" />
            ) : null}
          </div>
          <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
            <p id="qv-cat" className="text-[10px] uppercase tracking-[0.22em]">
              {category}
            </p>
            <h3 id="qv-title" className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl">
              {title}
            </h3>
            <p id="qv-desc" className="text-sm leading-relaxed text-ink/65">
              {description}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a href="#contact" data-qv-close="" onClick={onClose} className="rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-paper transition-colors hover:bg-coral">
                Tanya project serupa
              </a>
              <button data-qv-close="" onClick={onClose} className="rounded-full border border-ink/12 bg-chalk px-5 py-3 text-[13px] transition-colors hover:border-coral hover:text-coral">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
