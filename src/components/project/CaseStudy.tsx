"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCounter } from "@/hooks/useCounter";

export function CaseStudy() {
  const ref = useScrollReveal();
  const counter40 = useCounter(40);
  const counter18 = useCounter(18);
  const counter24 = useCounter(24);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20">
      <div className="grid gap-14 md:grid-cols-[1fr,1.45fr]">
        {/* Sidebar */}
        <div ref={ref} className="reveal md:sticky md:top-28 md:self-start">
          <p className="mb-3 font-display text-xs tracking-[0.3em] text-ink/40">CASE STUDY</p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.03em] md:text-5xl">
            From idea<br />
            <span className="grad-text">to visual.</span>
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-ink/60">
            <li className="flex gap-3">
              <span className="h-1.5 w-1.5 shrink-0 translate-y-2 rounded-full" style={{ background: "#FF5A45" }} />
              Discover
            </li>
            <li className="flex gap-3">
              <span className="h-1.5 w-1.5 shrink-0 translate-y-2 rounded-full" style={{ background: "#E8A33D" }} />
              Concept
            </li>
            <li className="flex gap-3">
              <span className="h-1.5 w-1.5 shrink-0 translate-y-2 rounded-full" style={{ background: "#3F3D9E" }} />
              Design &amp; Refine
            </li>
          </ul>
          <div className="mt-10 grid grid-cols-4 gap-2">
            <span className="h-12 rounded-xl border border-ink/5" style={{ background: "#14131A" }} />
            <span className="h-12 rounded-xl border border-ink/5" style={{ background: "#F26A21" }} />
            <span className="h-12 rounded-xl border border-ink/5" style={{ background: "#F5B324" }} />
            <span className="h-12 rounded-xl border border-ink/5" style={{ background: "#F7F1E7" }} />
          </div>
          <p className="mt-3 text-xs text-ink/50">Palet final brand</p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-coral">Discover</p>
            <p className="mt-4 leading-relaxed text-ink/70">
              ARVA sudah punya pelanggan tetap, tapi tampilannya belum satu suara: logo dipakai
              dalam tiga versi berbeda, warna toko dan warna konten tidak sama, dan setiap materi
              promosi dibuat ulang dari nol. Audit awal memetakan seluruh titik sentuh brand lalu
              menetapkan satu arah: tenang, hangat, dan terlihat mapan.
            </p>
          </div>
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-mustard">Concept</p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Arah visual dibangun dari kombinasi bentuk geometris sederhana dan palet
              ink–orange–amber di atas dasar cream. Hasilnya satu sistem yang rapi: primary logo, monogram, versi
              horizontal, aturan ruang kosong, dan pasangan tipografi untuk judul dan teks panjang.
            </p>
          </div>
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo">Design &amp; Refine</p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Sistem diturunkan ke materi nyata: stationery suite siap cetak, signage dan facade
              toko, serta template feed sosial media yang bisa diisi sendiri oleh tim. Semua aturan
              dirangkum dalam brand guideline 18 halaman beserta file siap produksi.
            </p>
          </div>
          <div className="reveal grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-ink/8 bg-chalk p-5">
              <p className="font-display text-3xl font-bold">
                <span ref={counter40} className="counter" data-to="40">0</span>%
              </p>
              <p className="mt-1 text-xs text-ink/55">Engagement naik</p>
            </div>
            <div className="rounded-2xl border border-ink/8 bg-chalk p-5">
              <p className="font-display text-3xl font-bold">
                <span ref={counter18} className="counter" data-to="18">0</span>
              </p>
              <p className="mt-1 text-xs text-ink/55">Halaman guideline</p>
            </div>
            <div className="rounded-2xl border border-ink/8 bg-chalk p-5">
              <p className="font-display text-3xl font-bold">
                <span ref={counter24} className="counter" data-to="24">0</span>
              </p>
              <p className="mt-1 text-xs text-ink/55">Titik sentuh brand</p>
            </div>
          </div>
          <blockquote className="reveal rounded-[2rem] p-8 text-white md:p-10" style={{ background: "linear-gradient(140deg,#FF5A45,#C96A4B)" }}>
            <p className="font-display text-xl font-semibold leading-snug md:text-2xl">
              &quot;Sekarang brand kami kelihatan rapi di mana pun dipasang, dan timnya gampang ikut aturannya.&quot;
            </p>
            <footer className="mt-5 text-sm text-white/80">— Dimas, owner ARVA</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
