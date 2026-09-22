"use client";

import { useEffect, useRef } from "react";

/** Diameter cincin dalam px — harus sinkron dengan class `h-12 w-12` di bawah. */
const RING_SIZE = 48;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Kursor asli disembunyikan HANYA selama komponen ini hidup. Halaman yang
    // nggak merender CustomCursor (mis. /admin) nggak ikut kena, jadi kursornya
    // tetap kelihatan normal.
    const root = document.documentElement;
    root.classList.add("cursor-custom");

    let disposed = false;
    let onMouseMove: ((event: MouseEvent) => void) | null = null;
    const magneticCleanups: Array<() => void> = [];

    const init = async () => {
      try {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default || gsapModule.gsap;
        if (disposed) return;

        gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

        const resetRing = () => {
          gsap.to(ring, { scale: 1, backgroundColor: "rgba(0,0,0,0)", duration: 0.3 });
          ring.style.borderColor = "";
          gsap.to(label, { opacity: 0, duration: 0.2 });
          gsap.to(dot, { opacity: 1, duration: 0.25 });
        };

        onMouseMove = (event: MouseEvent) => {
          gsap.set(dot, { x: event.clientX, y: event.clientY });
          gsap.to(ring, { x: event.clientX, y: event.clientY, duration: 0.28, ease: "power3.out" });
        };
        window.addEventListener("mousemove", onMouseMove);

        // Elemen magnetik: cincin membesar mengikuti UKURAN elemennya.
        //
        // Dulu selalu membesar 2.5x (48px → 120px). Untuk tombol sosial yang
        // cuma 48px, cincin raksasa itu nutupin tombol sebelahnya dan bikin
        // susah diklik. Sekarang besarannya proporsional: tombol kecil dapat
        // cincin kecil, tombol lebar tetap dapat cincin besar + label "Lihat".
        document.querySelectorAll("[data-magnetic]").forEach((element) => {
          const onEnter = () => {
            const rect = element.getBoundingClientRect();
            const longest = Math.max(rect.width, rect.height);
            const scale = Math.min(2.4, Math.max(1, (longest + 20) / RING_SIZE));

            gsap.to(ring, {
              scale,
              backgroundColor: "#FF5A45",
              duration: 0.22,
              ease: "power3.out",
            });
            ring.style.borderColor = "#FF5A45";
            gsap.to(label, { opacity: scale >= 1.7 ? 1 : 0, duration: 0.18 });
            gsap.to(dot, { opacity: 0, duration: 0.2 });
          };

          element.addEventListener("mouseenter", onEnter);
          element.addEventListener("mouseleave", resetRing);
          magneticCleanups.push(() => {
            element.removeEventListener("mouseenter", onEnter);
            element.removeEventListener("mouseleave", resetRing);
          });
        });
      } catch {
        // GSAP nggak tersedia — biarkan kursor asli tetap tampil.
        if (root.classList.contains("cursor-custom")) {
          root.classList.remove("cursor-custom");
        }
      }
    };

    void init();

    return () => {
      disposed = true;
      root.classList.remove("cursor-custom");
      if (onMouseMove) window.removeEventListener("mousemove", onMouseMove);
      magneticCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[999] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink md:block"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[999] hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink/35 md:flex"
      >
        <span
          ref={labelRef}
          className="font-display text-[8px] font-semibold uppercase tracking-[0.18em] text-white opacity-0"
        >
          Lihat
        </span>
      </div>
    </>
  );
}
