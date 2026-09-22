/**
 * Kategori portofolio.
 *
 * `key` dipisah dari `label` dengan sengaja: `key` yang disimpan di
 * `portfolio_items.category`, `label` yang tampil di situs. Jadi mengganti
 * nama kategori sama sekali nggak menyentuh baris proyeknya.
 *
 * File ini SENGAJA nggak mengimpor apa pun dari server supaya aman dipakai
 * di komponen client. Yang baca/tulis database ada di `categories.server.ts`.
 */

export interface Category {
  key: string;
  label: string;
  sortOrder: number;
  /** Jumlah proyek yang memakai kategori ini — cuma diisi di halaman admin. */
  itemCount?: number;
}

/**
 * Isi bawaan, dipakai kalau Supabase belum dikonfigurasi atau tabelnya belum
 * ada — jadi situs tetap utuh walaupun database belum siap.
 */
export const DEFAULT_CATEGORIES: Category[] = [
  { key: "branding", label: "Branding", sortOrder: 1 },
  { key: "logo", label: "Logo Design", sortOrder: 2 },
  { key: "apparel", label: "Jersey & Apparel", sortOrder: 3 },
  { key: "social", label: "Social Media", sortOrder: 4 },
  { key: "poster", label: "Banner & Poster", sortOrder: 5 },
];

/** Key cuma boleh huruf kecil, angka, dan tanda hubung. */
export const CATEGORY_KEY_PATTERN = /^[a-z0-9][a-z0-9-]{0,29}$/;

/** Ubah nama kategori jadi key yang aman dipakai di database. */
export function categoryKeyFromLabel(label: string): string {
  const key = label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return key || "kategori";
}

export function isCategoryKey(value: unknown): value is string {
  return typeof value === "string" && CATEGORY_KEY_PATTERN.test(value);
}

/**
 * Nama tampilan sebuah kategori. Kalau key-nya nggak ada di daftar (mis. baris
 * kategorinya sudah dihapus duluan), key itu sendiri yang dipakai — jadi
 * proyeknya tetap kelihatan, bukan menghilang diam-diam.
 */
export function categoryLabel(categories: Category[], key: string): string {
  return categories.find((category) => category.key === key)?.label || key;
}

/** Cari kategori berdasarkan key. */
export function findCategory(categories: Category[], key: string): Category | undefined {
  return categories.find((category) => category.key === key);
}

/** Pastikan kategori yang dipilih masih ada; kalau nggak, ambil yang pertama. */
export function resolveCategoryKey(categories: Category[], key: unknown): string {
  return findCategory(categories, String(key))?.key ?? categories[0]?.key ?? "";
}
