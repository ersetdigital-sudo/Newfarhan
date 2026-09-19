"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  {
    color: "#FF5A45",
    title: "Logo & Brand Identity",
    description: "Logo, palet warna, tipografi, dan guideline agar brand tetap konsisten di setiap media.",
  },
  {
    color: "#E8A33D",
    title: "Jersey & Apparel Design",
    description: "Desain jersey dan apparel lengkap dengan mockup depan-belakang serta artwork siap produksi.",
  },
  {
    color: "#3F3D9E",
    title: "Social Media & Marketing",
    description: "Konten feed, banner, dan poster campaign yang rapi dan tetap terbaca di setiap ukuran.",
  },
];

export function Services() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pt-20">
      <p className="reveal mb-4 font-display text-xs tracking-[0.3em] text-ink/40">WHAT I DO</p>
      <h2 className="reveal max-w-2xl font-display text-4xl font-bold tracking-[-0.03em] md:text-5xl">
        Desain dengan tujuan yang jelas.
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {services.map((service, i) => (
          <ServiceCard key={i} {...service} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ color, title, description }: { color: string; title: string; description: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="reveal group rounded-[1.75rem] border border-ink/8 bg-chalk p-8 transition-transform duration-500 hover:-translate-y-1">
      <span className="block h-1.5 w-10 rounded-full" style={{ background: color }} />
      <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">{description}</p>
    </div>
  );
}
