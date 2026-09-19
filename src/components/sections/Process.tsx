"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    color: "#FF5A45",
    title: "Discover",
    description: "Memahami brand, target pasar, dan arah visual yang diinginkan.",
  },
  {
    color: "#E8A33D",
    title: "Concept",
    description: "Moodboard, arah tipografi, dan sketsa awal untuk disepakati.",
  },
  {
    color: "#3F3D9E",
    title: "Design",
    description: "Eksekusi visual dan penerapannya pada media yang dituju.",
  },
  {
    color: "#C96A4B",
    title: "Refine",
    description: "Revisi, penyesuaian detail, lalu penyerahan file siap produksi.",
  },
];

export function Process() {
  const ref = useScrollReveal();

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <p ref={ref} className="reveal mb-4 font-display text-xs tracking-[0.3em] text-ink/40">PROCESS</p>
      <h2 className="reveal font-display text-4xl font-bold tracking-[-0.03em] md:text-5xl">Proses kerja.</h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <StepCard key={i} {...step} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ color, title, description }: { color: string; title: string; description: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="reveal rounded-[1.5rem] border border-ink/8 bg-chalk p-7">
      <span className="block h-1.5 w-8 rounded-full" style={{ background: color }} />
      <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-ink/60">{description}</p>
    </div>
  );
}
