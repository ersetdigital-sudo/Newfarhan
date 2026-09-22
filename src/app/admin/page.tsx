import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { isAdmin } from "@/lib/admin-auth";
import { getAdminItems, getSiteImages, type AdminPortfolioItem, type SiteImage } from "@/lib/portfolio";
import { getAdminSettings } from "@/lib/site-settings.server";
import type { SettingsMap } from "@/lib/site-settings";
import { getAdminCategories } from "@/lib/categories.server";
import type { Category } from "@/lib/categories";
import { isSupabaseConfigured } from "@/lib/supabase";

// Halaman admin selalu dirender fresh, nggak boleh di-cache.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Portofolio",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  if (!isSupabaseConfigured) {
    return (
      <Notice title="Supabase belum dikonfigurasi">
        Isi <code className="rounded bg-chalk px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="rounded bg-chalk px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, dan{" "}
        <code className="rounded bg-chalk px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> di file{" "}
        <code className="rounded bg-chalk px-1.5 py-0.5">.env.local</code>, lalu jalankan ulang dev
        server.
      </Notice>
    );
  }

  // Pengambilan data dipisah dari render supaya errornya bisa ditangani dulu
  // sebelum ada JSX yang dibuat.
  let items: AdminPortfolioItem[] = [];
  let slots: Record<string, SiteImage> = {};
  let settings: SettingsMap = {};
  let categories: Category[] = [];
  let loadError: string | null = null;

  try {
    [items, slots, settings, categories] = await Promise.all([
      getAdminItems(),
      getSiteImages(),
      getAdminSettings(),
      getAdminCategories(),
    ]);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Terjadi kesalahan tak terduga.";
  }

  if (loadError) {
    return <Notice title="Gagal memuat data">{loadError}</Notice>;
  }

  return (
    <AdminDashboard items={items} slots={slots} settings={settings} categories={categories} />
  );
}

function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-20">
      <div className="rounded-[2rem] border border-coral/30 bg-coral/5 p-8">
        <h1 className="font-display text-xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">{children}</p>
      </div>
    </main>
  );
}
