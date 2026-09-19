"use client";

import { useEffect, useRef } from "react";

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

    let gsap: any;
    let cleanup = false;

    const init = async () => {
      try {
        const gsapModule = await import("gsap");
        gsap = gsapModule.default || gsapModule.gsap;

        gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

        const onMouseMove = (e: MouseEvent) => {
          if (cleanup) return;
          gsap.set(dot, { x: e.clientX, y: e.clientY });
          gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.55, ease: "power3.out" });
        };

        const resetRing = () => {
          gsap.to(ring, { scale: 1, backgroundColor: "rgba(0,0,0,0)", duration: 0.3 });
          ring.style.borderColor = "";
          gsap.to(label, { opacity: 0, duration: 0.2 });
          gsap.to(dot, { opacity: 1, duration: 0.25 });
        };

        window.addEventListener("mousemove", onMouseMove);

        // Handle magnetic hover elements
        document.querySelectorAll("[data-magnetic]").forEach((el) => {
          el.addEventListener("mouseenter", () => {
            gsap.to(ring, { scale: 2.5, backgroundColor: "#FF5A45", duration: 0.35, ease: "power3.out" });
            ring.style.borderColor = "#FF5A45";
            gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.05 });
            gsap.to(dot, { opacity: 0, duration: 0.2 });
          });
          el.addEventListener("mouseleave", resetRing);
        });

        return () => {
          cleanup = true;
          window.removeEventListener("mousemove", onMouseMove);
        };
      } catch {
        // GSAP not available
      }
    };

    init();
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
