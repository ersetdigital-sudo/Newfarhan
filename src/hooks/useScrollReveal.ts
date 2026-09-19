"use client";

import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    const initGSAP = async () => {
      try {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default || gsapModule.gsap;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
          el,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );

        cleanup = () => {
          ScrollTrigger.getAll().forEach((t) => t.kill());
        };
      } catch {
        // GSAP not available
      }
    };

    initGSAP();

    return () => {
      cleanup?.();
    };
  }, []);

  return ref;
}
