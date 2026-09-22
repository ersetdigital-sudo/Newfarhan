import { portfolioItems as fallbackItems } from "@/data/portfolio";
import { SITE_SLOTS } from "@/lib/site-slots";
import { isSupabaseConfigured, supabaseRead, supabaseAdmin } from "@/lib/supabase";

/**
 * Bentuk data yang dipakai komponen publik. Sengaja dipertahankan sama persis
 * seperti `src/data/portfolio.ts` supaya komponen lama (PortfolioGrid,
 * QuickViewModal) nggak perlu diubah.
 */
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  quickView: { description: string };
}

/** Satu slot foto tetap (homepage / /project / About). */
export interface SiteImage {
  slot: string;
  image_url: string;
  label: string;
  alt: string;
  aspect: string;
}

/** Bentuk lengkap untuk halaman admin (termasuk yang belum published). */
export interface AdminPortfolioItem extends PortfolioItem {
  slug: string;
  subtitle: string;
  popupDescription: string;
  imageAlt: string;
  sortOrder: number;
  published: boolean;
}

interface PortfolioRow {
  slug: string;
  title: string;
  category: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  image_alt: string | null;
  sort_order: number | null;
  published: boolean | null;
}

function toPublicItem(row: PortfolioRow): PortfolioItem {
  return {
    id: row.slug,
    title: row.title,
    description: row.subtitle ?? "",
    category: row.category,
    image: row.image_url,
    quickView: { description: row.description ?? "" },
  };
}

function toAdminItem(row: PortfolioRow): AdminPortfolioItem {
  return {
    ...toPublicItem(row),
    slug: row.slug,
    subtitle: row.subtitle ?? "",
    popupDescription: row.description ?? "",
    imageAlt: row.image_alt ?? "",
    sortOrder: row.sort_order ?? 0,
    published: row.published !== false,
  };
}

/** Slot foto default, dipakai kalau Supabase belum dikonfigurasi. */
export function fallbackSiteImages(): Record<string, SiteImage> {
  const out: Record<string, SiteImage> = {};
  for (const spec of SITE_SLOTS) {
    out[spec.slot] = {
      slot: spec.slot,
      image_url: spec.fallback,
      label: spec.label,
      alt: spec.alt,
      aspect: spec.aspect,
    };
  }
  return out;
}

/**
 * Item grid portofolio untuk situs publik.
 * Kalau Supabase belum diset / sedang error, otomatis balik ke data statis
 * supaya situs nggak pernah kosong.
 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!isSupabaseConfigured) return fallbackItems;

  try {
    const { data, error } = await supabaseRead()
      .from("portfolio_items")
      .select("slug, title, category, subtitle, description, image_url, image_alt, sort_order, published")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return fallbackItems;
    return (data as PortfolioRow[]).map(toPublicItem);
  } catch {
    return fallbackItems;
  }
}

/** Slot foto tetap untuk situs publik. */
export async function getSiteImages(): Promise<Record<string, SiteImage>> {
  const fallback = fallbackSiteImages();
  if (!isSupabaseConfigured) return fallback;

  try {
    const { data, error } = await supabaseRead().from("site_images").select("*");
    if (error || !data || data.length === 0) return fallback;

    const out = { ...fallback };
    for (const row of data as SiteImage[]) {
      if (row.image_url) {
        // rasio tetap diambil dari kode, bukan dari DB, biar layout nggak
        // bisa diubah dari halaman admin.
        out[row.slot] = { ...out[row.slot], ...row, aspect: fallback[row.slot]?.aspect ?? row.aspect };
      }
    }
    return out;
  } catch {
    return fallback;
  }
}

/** Semua item termasuk yang unpublished — khusus halaman admin. */
export async function getAdminItems(): Promise<AdminPortfolioItem[]> {
  const { data, error } = await supabaseAdmin()
    .from("portfolio_items")
    .select("slug, title, category, subtitle, description, image_url, image_alt, sort_order, published")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as PortfolioRow[]).map(toAdminItem);
}
