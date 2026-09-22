"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  settingBlocks,
  settingColors,
  settingList,
  settingStats,
  settingValue,
  type SettingsMap,
} from "@/lib/site-settings";

interface CaseStudyProps {
  settings?: SettingsMap;
}

/** Warna label tiap blok cerita, dipakai bergilir sesuai urutan. */
const BLOCK_COLORS = ["text-coral", "text-mustard", "text-indigo"];
/** Warna titik langkah proses, bergilir juga. */
const STEP_DOTS = ["#FF5A45", "#E8A33D", "#3F3D9E"];

export function CaseStudy({ settings }: CaseStudyProps) {
  const ref = useScrollReveal();

  const steps = settingList(settings, "case_steps");
  const palette = settingColors(settings, "case_palette");
  const blocks = settingBlocks(settings, "case_blocks");
  const stats = settingStats(settings, "case_stats");
  const quote = settingValue(settings, "case_quote");
  const quoteBy = settingValue(settings, "case_quote_by");

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20">
      <div className="grid gap-14 md:grid-cols-[1fr_1.45fr]">
        {/* Sidebar */}
        <div ref={ref} className="reveal md:sticky md:top-28 md:self-start">
          <p className="mb-3 font-display text-xs tracking-[0.3em] text-ink/40">
            {settingValue(settings, "case_kicker")}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.03em] md:text-5xl">
            {settingValue(settings, "case_title_1")}
            <br />
            <span className="grad-text">{settingValue(settings, "case_title_2")}</span>
          </h2>

          {steps.length > 0 ? (
            <ul className="mt-8 space-y-3 text-sm text-ink/60">
              {steps.map((step, index) => (
                <li key={`${step}-${index}`} className="flex gap-3">
                  <span
                    className="h-1.5 w-1.5 shrink-0 translate-y-2 rounded-full"
                    style={{ background: STEP_DOTS[index % STEP_DOTS.length] }}
                  />
                  {step}
                </li>
              ))}
            </ul>
          ) : null}

          {palette.length > 0 ? (
            <div>
              <div className="mt-10 grid grid-cols-4 gap-2">
                {palette.map((color) => (
                  <span
                    key={color.hex}
                    title={color.name || color.hex}
                    className="h-12 rounded-xl border border-ink/5"
                    style={{ background: color.hex }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-ink/50">
                {settingValue(settings, "case_palette_label")}
              </p>
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="space-y-12">
          {blocks.map((block, index) => (
            <div key={`${block.title}-${index}`} className="reveal">
              <p
                className={`text-xs uppercase tracking-[0.2em] ${
                  BLOCK_COLORS[index % BLOCK_COLORS.length]
                }`}
              >
                {block.title}
              </p>
              <p className="mt-4 leading-relaxed text-ink/70">{block.body}</p>
            </div>
          ))}

          {stats.length > 0 ? (
            <div className="reveal grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="rounded-2xl border border-ink/8 bg-chalk p-5"
                >
                  <p className="font-display text-3xl font-bold">
                    {/* Angka menghitung naik — dianimasikan bareng `.counter` lain
                        di ProjectView, jadi jumlah kartunya bebas. */}
                    <span className="counter" data-to={stat.value}>
                      0
                    </span>
                    {stat.suffix}
                  </p>
                  <p className="mt-1 text-xs text-ink/55">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}

          {quote ? (
            <blockquote
              className="reveal rounded-[2rem] p-8 text-white md:p-10"
              style={{ background: "linear-gradient(140deg,#FF5A45,#C96A4B)" }}
            >
              <p className="font-display text-xl font-semibold leading-snug md:text-2xl">
                &quot;{quote}&quot;
              </p>
              <footer className="mt-5 text-sm text-white/80">{quoteBy}</footer>
            </blockquote>
          ) : null}
        </div>
      </div>
    </section>
  );
}
