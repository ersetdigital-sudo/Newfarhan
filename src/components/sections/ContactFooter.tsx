"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function ContactFooter() {
  const ref = useScrollReveal();

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-ink/10">
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-mustard/18 blur-[130px]" />
      <div className="relative mx-auto max-w-[1200px] px-6 py-24">
        <p ref={ref} className="reveal mb-4 font-display text-xs tracking-[0.3em] text-ink/40">CONTACT</p>
        <div className="reveal flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] md:text-6xl">
            Mari kerjakan<br />
            <span className="grad-text">project Anda.</span>
          </h2>
          <div className="flex items-center gap-3">
            <a data-magnetic="" href="#" aria-label="Instagram" className="grid h-12 w-12 place-items-center rounded-full border border-ink/12 bg-chalk transition-colors hover:border-coral hover:text-coral">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" />
              </svg>
            </a>
            <a data-magnetic="" href="#" aria-label="Behance" className="grid h-12 w-12 place-items-center rounded-full border border-ink/12 bg-chalk transition-colors hover:border-mustard hover:text-mustard">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M3 6h5.5a3 3 0 0 1 0 6H3z" />
                <path d="M3 12h6a3 3 0 0 1 0 6H3z" />
                <path d="M14 14h7a3.5 3.5 0 1 0-7 0v.5a3.5 3.5 0 0 0 6 2" />
              </svg>
            </a>
            <a data-magnetic="" href="#" aria-label="WhatsApp" className="grid h-12 w-12 place-items-center rounded-full border border-ink/12 bg-chalk transition-colors hover:border-indigo hover:text-indigo">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M21 12a9 9 0 0 1-13.2 7.9L3 21l1.2-4.6A9 9 0 1 1 21 12Z" />
              </svg>
            </a>
            <a data-magnetic="" href="mailto:hello@farhanraka.design" aria-label="Email" className="grid h-12 w-12 place-items-center rounded-full border border-ink/12 bg-chalk transition-colors hover:border-clay hover:text-clay">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
          </div>
        </div>
        <p className="reveal mt-8 max-w-md text-sm leading-relaxed text-ink/60">
          Ceritakan kebutuhan brand Anda, dan saya bantu susun arah visualnya. Balasan biasanya di hari yang sama.
        </p>
        <p className="reveal mt-3 font-display text-lg font-bold">hello@farhanraka.design</p>
        <div className="mt-16 flex flex-col gap-3 border-t border-ink/10 pt-6 text-xs text-ink/50 sm:flex-row sm:justify-between">
          <p>© 2026 Farhan Raka.K. All rights reserved.</p>
          <p>Creative Designer · Visual Design · Branding</p>
        </div>
      </div>
    </footer>
  );
}
