import type { SupabaseClient } from "@supabase/supabase-js";
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
  /** Foto utama — ini yang jadi thumbnail kartu. */
  image: string;
  /**
   * Foto tambahan dari karya yang sama (tanpa foto utama). Kalau ada isinya,
   * kartu di grid menampilkannya sebagai carousel yang bisa digeser.
   */
  images: string[];
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

interface ExtraImageRow {
  item_slug: string;
  image_url: string;
  sort_order: number | null;
}

/**
 * Kelompokkan foto tambahan per karya: { slug: [url, url, …] } sesuai urutan.
 * Kalau tabelnya belum ada / query gagal, balikin objek kosong — foto utama
 * tetap tampil, jadi situs nggak ikut rusak.
 */
async function extrasBySlug(
  client: SupabaseClient,
  slugs: string[]
): Promise<Record<string, string[]>> {
  if (slugs.length === 0) return {};

  try {
    const { data, error } = await client
      .from("portfolio_item_images")
      .select("item_slug, image_url, sort_order")
      .in("item_slug", slugs)
      .order("sort_order", { ascending: true });

    if (error || !data) return {};

    const out: Record<string, string[]> = {};
    for (const row of data as ExtraImageRow[]) {
      if (!row.image_url) continue;
      (out[row.item_slug] ??= []).push(row.image_url);
    }
    return out;
  } catch {
    return {};
  }
}

function toPublicItem(row: PortfolioRow, extras: string[]): PortfolioItem {
  return {
    id: row.slug,
    title: row.title,
    description: row.subtitle ?? "",
    category: row.category,
    image: row.image_url,
    images: extras,
    quickView: { description: row.description ?? "" },
  };
}

function toAdminItem(row: PortfolioRow, extras: string[]): AdminPortfolioItem {
  return {
    ...toPublicItem(row, extras),
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
  if (!isSupabaseConfigured) return fallbackItems.map((item) => ({ ...item, images: [] }));

  try {
    const { data, error } = await supabaseRead()
      .from("portfolio_items")
      .select("slug, title, category, subtitle, description, image_url, image_alt, sort_order, published")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackItems.map((item) => ({ ...item, images: [] }));
    }

    const rows = data as PortfolioRow[];
    const extras = await extrasBySlug(supabaseRead(), rows.map((row) => row.slug));
    return rows.map((row) => toPublicItem(row, extras[row.slug] ?? []));
  } catch {
    return fallbackItems.map((item) => ({ ...item, images: [] }));
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

  const rows = (data ?? []) as PortfolioRow[];
  const extras = await extrasBySlug(supabaseAdmin(), rows.map((row) => row.slug));
  return rows.map((row) => toAdminItem(row, extras[row.slug] ?? []));
}

/** Ganti seluruh daftar foto tambahan sebuah karya (urutannya ikut disimpan). */
export async function saveExtraImages(slug: string, urls: string[]): Promise<void> {
  const admin = supabaseAdmin();

  const { error: deleteError } = await admin
    .from("portfolio_item_images")
    .delete()
    .eq("item_slug", slug);

  if (deleteError) throw new Error(deleteError.message);
  if (urls.length === 0) return;

  const { error } = await admin.from("portfolio_item_images").insert(
    urls.map((image_url, index) => ({ item_slug: slug, image_url, sort_order: index + 1 }))
  );
  if (error) throw new Error(error.message);
}
