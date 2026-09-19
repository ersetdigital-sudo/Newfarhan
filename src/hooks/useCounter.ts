"use client";

import { useEffect, useRef } from "react";

export function useCounter(target: number) {
  const ref = useRef<HTMLSpanElement>(null);

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

        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });

        cleanup = () => {
          ScrollTrigger.getAll().forEach((t) => t.kill());
        };
      } catch {
        // Fallback: show final value
        el.textContent = String(target);
      }
    };

    initGSAP();

    // Fallback if GSAP doesn't load
    const timeout = setTimeout(() => {
      if (el.textContent === "0") {
        el.textContent = String(target);
      }
    }, 2600);

    return () => {
      clearTimeout(timeout);
      cleanup?.();
    };
  }, [target]);

  return ref;
}
