import {
  CATEGORY_KEY_PATTERN,
  DEFAULT_CATEGORIES,
  categoryKeyFromLabel,
  type Category,
} from "@/lib/categories";
import { isSupabaseConfigured, supabaseAdmin, supabaseRead } from "@/lib/supabase";

interface CategoryRow {
  key: string;
  label: string | null;
  sort_order: number | null;
}

function toCategory(row: CategoryRow): Category {
  return {
    key: row.key,
    label: row.label?.trim() || row.key,
    sortOrder: row.sort_order ?? 0,
  };
}

/**
 * Kategori untuk halaman publik. Balik ke daftar bawaan kalau Supabase belum
 * diset atau tabelnya belum ada, jadi tab filter nggak pernah kosong.
 */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return [...DEFAULT_CATEGORIES];

  try {
    const { data, error } = await supabaseRead()
      .from("categories")
      .select("key, label, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return [...DEFAULT_CATEGORIES];
    return (data as CategoryRow[]).map(toCategory);
  } catch {
    return [...DEFAULT_CATEGORIES];
  }
}

/** Jumlah proyek per kategori (termasuk yang unpublished). */
async function countByCategory(): Promise<Record<string, number>> {
  const { data, error } = await supabaseAdmin().from("portfolio_items").select("category");
  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { category: string }[]) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }
  return counts;
}

/** Versi buat panel admin — lengkap dengan jumlah proyek & proyek "yatim". */
export async function getAdminCategories(): Promise<Category[]> {
  const [result, counts] = await Promise.all([
    supabaseAdmin().from("categories").select("key, label, sort_order").order("sort_order"),
    countByCategory(),
  ]);

  if (result.error) throw new Error(`Gagal membaca categories: ${result.error.message}`);

  const categories = ((result.data ?? []) as CategoryRow[]).map((row) => ({
    ...toCategory(row),
    itemCount: counts[row.key] ?? 0,
  }));

  /**
   * Jaga-jaga: kalau ada proyek yang kategori key-nya nggak ada di tabel
   * (mis. barisnya dihapus langsung lewat SQL), kategori itu tetap
   * ditampilkan di admin — daripada proyeknya nggak kelihatan sama sekali.
   */
  const known = new Set(categories.map((category) => category.key));
  for (const [key, count] of Object.entries(counts)) {
    if (!known.has(key)) {
      categories.push({ key, label: `${key} (kategori hilang)`, sortOrder: 999, itemCount: count });
    }
  }

  return categories;
}

/** Key unik: kalau sudah dipakai, tambahin angka di belakangnya. */
async function uniqueKey(base: string): Promise<string> {
  const admin = supabaseAdmin();
  const { data } = await admin.from("categories").select("key");

  const taken = new Set(((data ?? []) as { key: string }[]).map((row) => row.key));
  if (!taken.has(base)) return base;

  for (let suffix = 2; suffix < 100; suffix += 1) {
    const candidate = `${base}-${suffix}`.slice(0, 30);
    if (!taken.has(candidate) && CATEGORY_KEY_PATTERN.test(candidate)) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`.slice(0, 30);
}

export async function createCategory(rawLabel: string): Promise<Category> {
  const label = rawLabel.trim();
  if (!label) throw new Error("Nama kategori wajib diisi.");
  if (label.length > 40) throw new Error("Nama kategori maksimal 40 karakter.");

  const admin = supabaseAdmin();

  const { data: last } = await admin
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const key = await uniqueKey(categoryKeyFromLabel(label));
  const { data, error } = await admin
    .from("categories")
    .insert({ key, label, sort_order: ((last?.sort_order as number | null) ?? 0) + 1 })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toCategory(data as CategoryRow);
}

/**
 * Ganti nama kategori.
 *
 * Key-nya sengaja TIDAK ikut berubah — itulah yang membuat rename aman:
 * semua proyek tetap nunjuk ke key yang sama, jadi nggak ada yang perlu
 * dipindahin.
 */
export async function renameCategory(key: string, rawLabel: string): Promise<Category> {
  const label = rawLabel.trim();
  if (!label) throw new Error("Nama kategori wajib diisi.");
  if (label.length > 40) throw new Error("Nama kategori maksimal 40 karakter.");

  const { data, error } = await supabaseAdmin()
    .from("categories")
    .update({ label, updated_at: new Date().toISOString() })
    .eq("key", key)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Kategori "${key}" nggak ditemukan.`);
  return toCategory(data as CategoryRow);
}

/**
 * Hapus kategori.
 *
 * Ditolak kalau masih ada proyek yang memakainya — daripada proyeknya jadi
 * nggak muncul di tab mana pun. Pesannya menyebut jumlah proyeknya supaya
 * admin tahu harus memindahkan berapa.
 */
export async function deleteCategory(key: string): Promise<{ movedToHint: number }> {
  const admin = supabaseAdmin();

  const { count, error: countError } = await admin
    .from("portfolio_items")
    .select("slug", { count: "exact", head: true })
    .eq("category", key);

  if (countError) throw new Error(countError.message);
  if ((count ?? 0) > 0) {
    throw new Error(
      `Masih ada ${count} proyek yang pakai kategori ini. Pindahkan dulu kategorinya di tab Grid Portofolio, baru hapus.`
    );
  }

  const { error } = await admin.from("categories").delete().eq("key", key);
  if (error) throw new Error(error.message);
  return { movedToHint: 0 };
}

/** Simpan urutan tab. Body: daftar key sesuai urutan tampil. */
export async function reorderCategories(keys: string[]): Promise<number> {
  const admin = supabaseAdmin();
  const now = new Date().toISOString();

  for (let index = 0; index < keys.length; index += 1) {
    const { error } = await admin
      .from("categories")
      .update({ sort_order: index + 1, updated_at: now })
      .eq("key", keys[index]);

    if (error) throw new Error(`Gagal menyimpan urutan di posisi ${index + 1}: ${error.message}`);
  }
  return keys.length;
}

/** Semua key kategori yang sah — dipakai buat validasi input proyek. */
export async function validCategoryKeys(): Promise<string[]> {
  const categories = await getCategories();
  return categories.map((category) => category.key);
}
