/**
 * Kontrak layout untuk slot foto tetap.
 *
 * Rasio di sini SENGAJA dikunci: admin cuma bisa mengganti isi gambarnya,
 * nggak bisa mengubah bentuk kotaknya. Jadi mengganti foto nggak akan
 * pernah merusak layout, di breakpoint mana pun.
 *
 * CATATAN PENTING: slot itu per-TEMPAT, bukan per-FOTO. Foto yang sama
 * boleh dipakai di beberapa slot sekaligus (mis. foto signage ARVA dipakai
 * di kartu "Environmental" homepage DAN di gallery halaman /project), tapi
 * mengganti di satu slot nggak otomatis mengubah slot lain. Jadi di panel
 * admin setiap slot ditandai halaman mana yang kena.
 */

export interface SlotSpec {
  slot: string;
  /** Judul yang tampil di halaman admin */
  title: string;
  /** Halaman tempat foto ini muncul — dipakai buat mengelompokkan di admin */
  page: string;
  /** Path halaman terkait, buat tombol "Lihat di situs" */
  pagePath: string;
  /** Keterangan posisinya di halaman */
  where: string;
  /** Rasio terkunci, format "w:h" */
  aspect: string;
  /** Ukuran kanvas yang dipakai saat gambar dikirim (Cloudinary memadu ke sini) */
  width: number;
  height: number;
  /** Gambar lama, dipakai sebagai fallback kalau database belum diisi */
  fallback: string;
  /** Label kecil yang tampil di kartu (kosongkan kalau nggak dipakai) */
  label: string;
  alt: string;
}

/** Warna kanvas untuk bantalan foto (nyatu sama bg section di situs). */
export const PAD_COLOR = "#F7F1E7";

export const SITE_SLOTS: SlotSpec[] = [
  // ── HOMEPAGE ──────────────────────────────────────────────
  {
    slot: "featured_main",
    title: "ARVA — kartu besar",
    page: "Homepage",
    pagePath: "/#portfolio",
    where: "Featured Work · kartu besar di kiri",
    aspect: "1:1",
    width: 1200,
    height: 1200,
    fallback: "/images/269ea28f-c1ae-4aaf-9557-277451504028.png",
    label: "",
    alt: "ARVA — brand identity & guidelines board",
  },
  {
    slot: "featured_stationery",
    title: "ARVA — kartu kecil 1 (Stationery)",
    page: "Homepage",
    pagePath: "/#portfolio",
    where: "Featured Work · kartu kecil paling atas di kanan",
    aspect: "2:1",
    width: 1600,
    height: 800,
    fallback: "/images/80931dd2-bdaa-4375-809d-307fa7ccf0e0.png",
    label: "Stationery",
    alt: "ARVA — stationery suite",
  },
  {
    slot: "featured_environmental",
    title: "ARVA — kartu kecil 2 (Environmental)",
    page: "Homepage",
    pagePath: "/#portfolio",
    where: "Featured Work · kartu kecil di kanan, tengah",
    aspect: "2:1",
    width: 1600,
    height: 800,
    fallback: "/images/6b73f91c-313e-4ee0-b3ae-5988bf16bf95.png",
    label: "Environmental",
    alt: "ARVA — signage & facade",
  },
  {
    slot: "featured_digital",
    title: "ARVA — kartu kecil 3 (Digital)",
    page: "Homepage",
    pagePath: "/#portfolio",
    where: "Featured Work · kartu kecil paling bawah di kanan",
    aspect: "2:1",
    width: 1600,
    height: 800,
    fallback: "/images/d70331f8-fda6-4948-a310-7da323f5f60b.png",
    label: "Digital",
    alt: "ARVA — social feed system",
  },
  {
    slot: "profile",
    title: "Foto profil (bulat)",
    page: "Homepage",
    pagePath: "/#about",
    where: "About · foto bulat di kartu profil",
    aspect: "1:1",
    width: 800,
    height: 800,
    fallback: "/images/c98c49c7-b8f7-4763-ba04-805ebfb930e0.png",
    label: "",
    alt: "Farhan Raka.K",
  },

  // ── HALAMAN PROJECT ───────────────────────────────────────
  {
    slot: "project_cover",
    title: "ARVA — cover besar",
    page: "Halaman Project",
    pagePath: "/project",
    where: "Gambar besar tepat di bawah judul",
    aspect: "2:1",
    width: 1600,
    height: 800,
    fallback: "/images/269ea28f-c1ae-4aaf-9557-277451504028.png",
    label: "",
    alt: "ARVA — brand identity & guidelines board",
  },
  {
    slot: "project_gallery_1",
    title: "Gallery 1 — kartu lebar",
    page: "Halaman Project",
    pagePath: "/project",
    where: "Galeri · kartu lebar (2/3) di baris pertama",
    aspect: "16:9",
    width: 1600,
    height: 900,
    fallback: "/images/80931dd2-bdaa-4375-809d-307fa7ccf0e0.png",
    label: "Stationery",
    alt: "ARVA — stationery suite",
  },
  {
    slot: "project_gallery_2",
    title: "Gallery 2 — kartu kecil",
    page: "Halaman Project",
    pagePath: "/project",
    where: "Galeri · kartu kecil (1/3) di baris pertama",
    aspect: "5:6",
    width: 1000,
    height: 1200,
    fallback: "/images/d70331f8-fda6-4948-a310-7da323f5f60b.png",
    label: "Social",
    alt: "ARVA — social feed system",
  },
  {
    slot: "project_gallery_3",
    title: "Gallery 3 — full width",
    page: "Halaman Project",
    pagePath: "/project",
    where: "Galeri · kartu lebar penuh di baris bawah",
    aspect: "2.6:1",
    width: 2080,
    height: 800,
    fallback: "/images/6b73f91c-313e-4ee0-b3ae-5988bf16bf95.png",
    label: "Environmental",
    alt: "ARVA — signage & facade",
  },
];

/** Spesifikasi untuk kartu di grid portofolio. */
export const GRID_SPEC = {
  aspect: "4:5",
  width: 1200,
  height: 1500,
  label: "Kartu grid portofolio",
  where: "Homepage · Selected Works + popup quick view",
};

/** Urutan halaman di panel admin. */
export const SLOT_PAGES = ["Homepage", "Halaman Project"];

export const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  branding: "Branding",
  logo: "Logo Design",
  apparel: "Jersey & Apparel",
  social: "Social Media",
  poster: "Banner & Poster",
};

export const CATEGORY_KEYS = ["branding", "logo", "apparel", "social", "poster"] as const;

export function slotSpec(slot: string): SlotSpec | undefined {
  return SITE_SLOTS.find((s) => s.slot === slot);
}

/** Ukuran kanvas untuk sebuah slot, dengan fallback aman ke ukuran grid. */
export function slotCanvas(slot: string): { width: number; height: number } {
  const spec = slotSpec(slot);
  return { width: spec?.width ?? GRID_SPEC.width, height: spec?.height ?? GRID_SPEC.height };
}

/** Terjemahan rasio -> ukuran kanvas upload. */
export function sizeForAspect(aspect: string): { width: number; height: number } {
  const grid = findKnownAspect(aspect);
  if (grid) return grid;
  return { width: GRID_SPEC.width, height: GRID_SPEC.height };
}

function findKnownAspect(aspect: string): { width: number; height: number } | null {
  if (aspect === GRID_SPEC.aspect) {
    return { width: GRID_SPEC.width, height: GRID_SPEC.height };
  }
  const hit = SITE_SLOTS.find((s) => s.aspect === aspect);
  return hit ? { width: hit.width, height: hit.height } : null;
}
