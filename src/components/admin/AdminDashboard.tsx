"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminPortfolioItem, SiteImage } from "@/lib/portfolio";
import { SITE_SLOTS, SLOT_PAGES } from "@/lib/site-slots";
import type { SettingsMap } from "@/lib/site-settings";
import { ImageUploader } from "./ImageUploader";
import { PortfolioItemsManager } from "./PortfolioItemsManager";
import { SettingsManager } from "./SettingsManager";

interface DashboardProps {
  items: AdminPortfolioItem[];
  slots: Record<string, SiteImage>;
  settings: SettingsMap;
}

export function AdminDashboard({ items, slots, settings }: DashboardProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"slots" | "items" | "text">("slots");
  const [localSlots, setLocalSlots] = useState(slots);
  const [savedSlot, setSavedSlot] = useState<string | null>(null);

  async function saveSlot(slot: string, imageUrl: string) {
    const response = await fetch(`/api/admin/slots/${encodeURIComponent(slot)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || "Foto ter-upload tapi gagal disimpan.");
    }

    setLocalSlots((prev) => ({
      ...prev,
      [slot]: { ...prev[slot], slot, image_url: imageUrl },
    }));
    setSavedSlot(slot);
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs tracking-[0.3em] text-ink/40">ADMIN</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
            Kelola Portofolio
          </h1>
          <p className="mt-2 text-sm text-ink/55">
            Ganti foto tanpa mengubah bentuk layout — rasio tiap slot dikunci.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink/12 px-5 py-2.5 text-xs font-medium transition-colors hover:border-coral hover:text-coral"
          >
            Lihat situs ↗
          </a>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-ink px-5 py-2.5 text-xs font-medium text-paper transition-colors hover:bg-coral"
          >
            Keluar
          </button>
        </div>
      </header>

      <nav className="mt-8 flex gap-2">
        {(
          [
            { key: "slots", label: "Foto Halaman" },
            { key: "items", label: `Grid Portofolio (${items.length})` },
            { key: "text", label: "Teks Kontak & Footer" },
          ] as const
        ).map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setTab(entry.key)}
            className={`rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors ${
              tab === entry.key
                ? "bg-coral text-white"
                : "border border-ink/12 bg-chalk hover:border-coral hover:text-coral"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </nav>

      {tab === "slots" ? (
        <section className="mt-8">
          <div className="rounded-2xl border border-mustard/40 bg-mustard/10 px-5 py-4">
            <p className="text-xs leading-relaxed text-ink/70">
              <strong className="text-ink">Tiap slot itu per-tempat, bukan per-foto.</strong> Foto
              yang sama boleh dipakai di beberapa slot, tapi mengganti di satu slot nggak otomatis
              mengubah slot lain. Jadi kalau satu subjek muncul di homepage <em>dan</em> halaman
              project, ganti di dua-duanya.
            </p>
          </div>

          {SLOT_PAGES.map((page) => {
            const specs = SITE_SLOTS.filter((spec) => spec.page === page);
            if (specs.length === 0) return null;

            return (
              <div key={page} className="mt-9">
                <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-3">
                  <h2 className="font-display text-lg font-bold tracking-tight">{page}</h2>
                  <a
                    href={specs[0].pagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-medium text-coral hover:underline"
                  >
                    Lihat di situs ↗
                  </a>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {specs.map((spec) => (
                    <div key={spec.slot} className="rounded-2xl border border-ink/10 bg-chalk p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-sm font-semibold">{spec.title}</h3>
                          <p className="mt-0.5 text-[11px] leading-snug text-ink/45">
                            {spec.where}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-[10px] font-medium text-ink/60">
                          {spec.aspect}
                        </span>
                      </div>

                      <div className="mt-4">
                        <ImageUploader
                          currentUrl={localSlots[spec.slot]?.image_url ?? spec.fallback}
                          aspect={spec.aspect}
                          folder="slots"
                          buttonLabel="Ganti foto"
                          onUploaded={(url) => saveSlot(spec.slot, url)}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-ink/45">
                        <span>
                          Kanvas {spec.width}×{spec.height}px
                        </span>
                        {savedSlot === spec.slot ? <span>Tersimpan ✓</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ) : tab === "items" ? (
        <section className="mt-8">
          <PortfolioItemsManager items={items} />
        </section>
      ) : (
        <SettingsManager settings={settings} />
      )}
    </main>
  );
}
