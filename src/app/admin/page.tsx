import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { isAdmin } from "@/lib/admin-auth";
import { getAdminItems, getSiteImages } from "@/lib/portfolio";
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
      <main className="mx-auto max-w-[720px] px-6 py-20">
        <div className="rounded-[2rem] border border-coral/30 bg-coral/5 p-8">
          <h1 className="font-display text-xl font-bold">Supabase belum dikonfigurasi</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            Isi <code className="rounded bg-chalk px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code className="rounded bg-chalk px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
            dan <code className="rounded bg-chalk px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> di
            file <code className="rounded bg-chalk px-1.5 py-0.5">.env.local</code>, lalu jalankan
            ulang dev server.
          </p>
        </div>
      </main>
    );
  }

  try {
    const [items, slots] = await Promise.all([getAdminItems(), getSiteImages()]);
    return <AdminDashboard items={items} slots={slots} />;
  } catch (error) {
    return (
      <main className="mx-auto max-w-[720px] px-6 py-20">
        <div className="rounded-[2rem] border border-coral/30 bg-coral/5 p-8">
          <h1 className="font-display text-xl font-bold">Gagal memuat data</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            {error instanceof Error ? error.message : "Terjadi kesalahan tak terduga."}
          </p>
        </div>
      </main>
    );
  }
}
