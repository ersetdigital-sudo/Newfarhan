"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminPortfolioItem, SiteImage } from "@/lib/portfolio";
import type { SettingsMap } from "@/lib/site-settings";
import type { Category } from "@/lib/categories";
import { CategoriesManager } from "./CategoriesManager";
import { PortfolioItemsManager } from "./PortfolioItemsManager";
import { SettingsManager } from "./SettingsManager";
import { StudioManager } from "./StudioManager";

interface DashboardProps {
  items: AdminPortfolioItem[];
  slots: Record<string, SiteImage>;
  settings: SettingsMap;
  categories: Category[];
}

export function AdminDashboard({ items, slots, settings, categories }: DashboardProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"studio" | "items" | "categories" | "text">("studio");

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
            Foto dan teks tiap bagian ada di satu tempat — rasio tiap kotak foto dikunci, jadi
            layout nggak bisa rusak.
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

      <nav className="mt-8 flex flex-wrap gap-2">
        {(
          [
            { key: "studio", label: "Beranda & Project" },
            { key: "items", label: `Grid Portofolio (${items.length})` },
            { key: "categories", label: `Kategori (${categories.length})` },
            { key: "text", label: "Teks & Kontak" },
          ] as const
        ).map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setTab(entry.key)}
            className={`rounded-full px-4 py-2 text-[12px] font-medium transition-colors sm:px-5 sm:py-2.5 sm:text-[13px] ${
              tab === entry.key
                ? "bg-coral text-white"
                : "border border-ink/12 bg-chalk hover:border-coral hover:text-coral"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </nav>

      {tab === "studio" ? (
        <StudioManager slots={slots} settings={settings} />
      ) : tab === "items" ? (
        <section className="mt-8">
          <PortfolioItemsManager items={items} categories={categories} />
        </section>
      ) : tab === "categories" ? (
        <CategoriesManager categories={categories} />
      ) : (
        <SettingsManager settings={settings} />
      )}
    </main>
  );
}
