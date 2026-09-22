/**
 * Teks & tautan yang bisa diatur dari panel admin.
 *
 * File ini SENGAJA nggak mengimpor apa pun dari server (Supabase dsb) supaya
 * aman dipakai di komponen client. Bagian yang baca/tulis database ada di
 * `src/lib/site-settings.server.ts`.
 *
 * Grup dibagi dua panel:
 * - `panel: "studio"` → tab **Beranda & Project**. Tiap grup = satu bagian di
 *   halaman (Featured Work, hero project, Case Study), dan fotonya nempel di
 *   grup yang sama lewat `slot`/`slots`. Jadi foto + teks satu tempat.
 * - tanpa `panel` → tab **Teks & Kontak** (About, kontak, footer).
 */

/**
 * Nilai awal — sama persis dengan teks yang dulu di-hardcode di komponen.
 * Dipakai kalau barisnya belum ada di database, jadi situs nggak pernah
 * nampilin teks kosong.
 */
export const SETTING_DEFAULTS: Record<string, string> = {
  // ── Featured Work (homepage) ─────────────────────────────
  featured_kicker: "FEATURED WORK",
  featured_title_1: "ARVA",
  featured_title_2: "Identity",
  featured_intro:
    "Brand identity lengkap untuk studio kreatif ARVA: logo suite, palet warna, tipografi, stationery, signage, dan aset digital.",
  featured_main_badge: "Featured · Branding",
  featured_main_title: "ARVA — Brand Identity System",
  featured_main_desc:
    "Logo suite, palet warna, tipografi, dan guideline dalam satu papan identitas.",
  featured_card1_badge: "Stationery",
  featured_card1_title: "Business Card, Letterhead & Tag",
  featured_card2_badge: "Environmental",
  featured_card2_title: "Blade Signage & Facade",
  featured_card3_badge: "Digital",
  featured_card3_title: "Social Feed System",

  // ── Halaman /project ─────────────────────────────────────
  project_eyebrow: "Brand Identity System · 2025",
  project_title: "ARVA",
  project_intro:
    "Identitas visual menyeluruh: logo suite, sistem warna dan tipografi, stationery, signage toko, sampai template konten sosial media yang bisa dijalankan sendiri oleh tim.",
  // /project — daftar label|nilai untuk baris keterangan di bawah judul
  project_meta:
    "Klien|ARVA\nLayanan|Identity & Brand System\nDurasi|6 minggu\nPeran|Designer & Art Direction",
  gallery_kicker: "GALLERY",
  gallery_title: "Galeri",
  gallery_hint: "Klik gambar untuk lihat versi besar",

  // ── Case Study ───────────────────────────────────────────
  case_kicker: "CASE STUDY",
  case_title_1: "From idea",
  case_title_2: "to visual.",
  case_steps: "Discover\nConcept\nDesign & Refine",
  case_palette: "#14131A Ink\n#F26A21 Orange\n#F5B324 Amber\n#F7F1E7 Cream",
  case_palette_label: "Palet final brand",
  case_blocks:
    "Discover\nARVA sudah punya pelanggan tetap, tapi tampilannya belum satu suara: logo dipakai dalam tiga versi berbeda, warna toko dan warna konten tidak sama, dan setiap materi promosi dibuat ulang dari nol. Audit awal memetakan seluruh titik sentuh brand lalu menetapkan satu arah: tenang, hangat, dan terlihat mapan.\n\nConcept\nArah visual dibangun dari kombinasi bentuk geometris sederhana dan palet ink–orange–amber di atas dasar cream. Hasilnya satu sistem yang rapi: primary logo, monogram, versi horizontal, aturan ruang kosong, dan pasangan tipografi untuk judul dan teks panjang.\n\nDesign & Refine\nSistem diturunkan ke materi nyata: stationery suite siap cetak, signage dan facade toko, serta template feed sosial media yang bisa diisi sendiri oleh tim. Semua aturan dirangkum dalam brand guideline 18 halaman beserta file siap produksi.",
  // angka|akhiran|keterangan
  case_stats: "40|%|Engagement naik\n18||Halaman guideline\n24||Titik sentuh brand",
  case_quote:
    "Sekarang brand kami kelihatan rapi di mana pun dipasang, dan timnya gampang ikut aturannya.",
  case_quote_by: "— Dimas, owner ARVA",

  // ── About (homepage) ─────────────────────────────────────
  about_kicker: "ABOUT",
  about_heading: "Halo, saya Farhan.",
  about_role: "Creative Designer · Indonesia",
  about_bio:
    "Enam tahun mengerjakan identitas visual untuk brand kecil hingga menengah: branding, logo, jersey & apparel, serta kebutuhan konten digital. Tiga hal yang selalu saya pegang: clarity, character, consistency.",
  about_skills: "Adobe Illustrator\nAdobe Photoshop\nInDesign\nFigma\nCanva\nCorelDRAW",
  about_stat_value: "98",
  about_stat_suffix: "%",
  about_stat_label: "Klien kembali untuk project berikutnya.",
  about_principles_title: "Principles",
  about_principles:
    "Clarity — pesan terbaca lebih dulu\nCharacter — punya ciri, bukan template\nConsistency — konsisten di semua media",

  // ── Kontak & footer ─────────────────────────────────────
  contact_kicker: "CONTACT",
  contact_heading_1: "Mari kerjakan",
  contact_heading_2: "project Anda.",
  contact_description:
    "Ceritakan kebutuhan brand Anda, dan saya bantu susun arah visualnya. Balasan biasanya di hari yang sama.",
  contact_email: "hello@farhanraka.design",
  social_instagram: "#",
  social_behance: "#",
  social_whatsapp: "#",
  footer_left: "© 2026 Farhan Raka.K. All rights reserved.",
  footer_right: "Creative Designer · Visual Design · Branding",
};

export type SettingsMap = Record<string, string>;

export interface SettingField {
  key: string;
  label: string;
  /** Keterangan kecil di bawah input. */
  hint?: string;
  multiline?: boolean;
  type?: "text" | "email" | "url" | "number";
  /** Field ini isinya daftar (satu item per baris / dipisah koma). */
  list?: boolean;
}

export interface SettingGroup {
  title: string;
  /** Keterangan posisi di situs. */
  where: string;
  /** Path halaman terkait, buat tombol "Lihat di situs" */
  path: string;
  fields: SettingField[];
  /** Tab panel: "studio" = Beranda & Project. Kosong = Teks & Kontak. */
  panel?: "studio";
  /** Slot foto yang nempel di bagian ini (lihat src/lib/site-slots.ts). */
  slots?: string[];
}

export const SETTING_GROUPS: SettingGroup[] = [
  // ══════════════════════════════════════════════════════════
  // Panel "Beranda & Project" — urut mengikuti urutan halaman
  // ══════════════════════════════════════════════════════════
  {
    title: "Homepage · Featured Work — judul section",
    where: "Homepage · bagian paling atas Featured Work",
    path: "/#portfolio",
    panel: "studio",
    fields: [
      { key: "featured_kicker", label: "Label kecil di atas judul", hint: 'Biasanya ditulis "FEATURED WORK".' },
      { key: "featured_title_1", label: "Judul — bagian biasa", hint: 'Contoh: "ARVA".' },
      {
        key: "featured_title_2",
        label: "Judul — bagian gradien",
        hint: "Kata setelah judul, tampil dengan warna gradien. Kosongkan kalau nggak perlu.",
      },
      {
        key: "featured_intro",
        label: "Kalimat pengantar",
        multiline: true,
        hint: "Muncul di sebelah kanan judul. Boleh ditulis beberapa baris.",
      },
    ],
  },
  {
    title: "Homepage · Featured Work — kartu besar",
    where: "Homepage · kartu besar di kiri (fotonya di sebelah kiri formulir ini)",
    path: "/#portfolio",
    panel: "studio",
    slots: ["featured_main"],
    fields: [
      { key: "featured_main_badge", label: "Label kecil di dalam kartu", hint: 'Contoh: "Featured · Branding".' },
      {
        key: "featured_main_title",
        label: "Judul di kartu",
        hint: "Maksimal 3 baris — lebih dari itu dipotong otomatis (teks utuhnya muncul saat kursor diarahkan ke judul).",
      },
      {
        key: "featured_main_desc",
        label: "Keterangan di bawah judul",
        multiline: true,
        hint: "Maksimal 2 baris biar kartunya tetap rapi.",
      },
    ],
  },
  {
    title: "Homepage · Featured Work — kartu kecil 1",
    where: "Homepage · kartu kecil paling atas di kolom kanan",
    path: "/#portfolio",
    panel: "studio",
    slots: ["featured_stationery"],
    fields: [
      { key: "featured_card1_badge", label: "Label kecil di kartu" },
      { key: "featured_card1_title", label: "Judul kartu", hint: "Maksimal 2 baris." },
    ],
  },
  {
    title: "Homepage · Featured Work — kartu kecil 2",
    where: "Homepage · kartu kecil di tengah kolom kanan",
    path: "/#portfolio",
    panel: "studio",
    slots: ["featured_environmental"],
    fields: [
      { key: "featured_card2_badge", label: "Label kecil di kartu" },
      { key: "featured_card2_title", label: "Judul kartu", hint: "Maksimal 2 baris." },
    ],
  },
  {
    title: "Homepage · Featured Work — kartu kecil 3",
    where: "Homepage · kartu kecil paling bawah di kolom kanan",
    path: "/#portfolio",
    panel: "studio",
    slots: ["featured_digital"],
    fields: [
      { key: "featured_card3_badge", label: "Label kecil di kartu" },
      { key: "featured_card3_title", label: "Judul kartu", hint: "Maksimal 2 baris." },
    ],
  },
  {
    title: "Homepage · About — foto profil",
    where: "Homepage · foto bulat di kartu profil. Teksnya di tab Teks & Kontak.",
    path: "/#about",
    panel: "studio",
    slots: ["profile"],
    fields: [],
  },
  {
    title: "Project · hero & cover",
    where: "Halaman /project · judul besar, keterangan, dan gambar cover di bawahnya",
    path: "/project",
    panel: "studio",
    slots: ["project_cover"],
    fields: [
      { key: "project_eyebrow", label: "Label kecil di atas judul", hint: 'Contoh: "Brand Identity System · 2025".' },
      { key: "project_title", label: "Judul besar", hint: "Tampil dengan warna gradien." },
      {
        key: "project_intro",
        label: "Paragraf pembuka",
        multiline: true,
        hint: "Muncul di bawah judul besar.",
      },
      {
        key: "project_meta",
        label: "Baris keterangan (4 kolom)",
        multiline: true,
        list: true,
        hint: 'Satu baris satu kolom, format "Label|Isi". Contoh: Klien|ARVA. Jumlah barisnya bebas.',
      },
    ],
  },
  {
    title: "Project · galeri",
    where: "Halaman /project · tiga foto di bagian Galeri",
    path: "/project",
    panel: "studio",
    slots: ["project_gallery_1", "project_gallery_2", "project_gallery_3"],
    fields: [
      { key: "gallery_kicker", label: "Label kecil di atas judul", hint: 'Biasanya ditulis "GALLERY".' },
      { key: "gallery_title", label: "Judul bagian" },
      { key: "gallery_hint", label: "Keterangan kanan", hint: "Tampil di desktop saja." },
    ],
  },
  {
    title: "Case Study · judul",
    where: "Halaman /project · blok CASE STUDY di kiri",
    path: "/project",
    panel: "studio",
    fields: [
      { key: "case_kicker", label: "Label kecil di atas judul", hint: 'Biasanya ditulis "CASE STUDY".' },
      { key: "case_title_1", label: "Judul — baris 1" },
      { key: "case_title_2", label: "Judul — baris 2", hint: "Baris ini tampil dengan warna gradien." },
    ],
  },
  {
    title: "Case Study · langkah proses",
    where: "Halaman /project · daftar bertitik di bawah judul CASE STUDY",
    path: "/project",
    panel: "studio",
    fields: [
      {
        key: "case_steps",
        label: "Daftar langkah",
        multiline: true,
        list: true,
        hint: "Satu langkah per baris, jumlahnya bebas. Titik warnanya bergilir coral → mustard → indigo.",
      },
    ],
  },
  {
    title: "Case Study · palet warna",
    where: "Halaman /project · deretan kotak warna di bawah daftar langkah",
    path: "/project",
    panel: "studio",
    fields: [
      {
        key: "case_palette",
        label: "Warna",
        multiline: true,
        list: true,
        hint: 'Satu warna per baris, format "#KODE Nama" — contoh: #FF5A45 Coral. Namanya opsional (muncul saat kursor diarahkan ke kotak warnanya).',
      },
      { key: "case_palette_label", label: "Keterangan di bawah kotak warna" },
    ],
  },
  {
    title: "Case Study · isi cerita",
    where: "Halaman /project · blok Discover / Concept / Design & Refine di kanan",
    path: "/project",
    panel: "studio",
    fields: [
      {
        key: "case_blocks",
        label: "Blok cerita",
        multiline: true,
        list: true,
        hint: "Baris pertama tiap blok jadi judulnya, baris berikutnya jadi isi ceritanya. Pisahkan antar blok dengan satu baris kosong. jumlah bloknya bebas, warnanya bergilir.",
      },
    ],
  },
  {
    title: "Case Study · angka",
    where: "Halaman /project · tiga kartu angka di bawah cerita",
    path: "/project",
    panel: "studio",
    fields: [
      {
        key: "case_stats",
        label: "Daftar angka",
        multiline: true,
        list: true,
        hint: 'Satu angka per baris, format "angka|akhiran|keterangan". Contoh: 40|%|Engagement naik. Akhiran boleh dikosongkan (18||Halaman guideline).',
      },
    ],
  },
  {
    title: "Case Study · kutipan klien",
    where: "Halaman /project · kotak kutipan di paling bawah",
    path: "/project",
    panel: "studio",
    fields: [
      { key: "case_quote", label: "Isi kutipan", multiline: true, hint: "Kosongkan kalau mau menyembunyikan kotak kutipannya." },
      { key: "case_quote_by", label: "Sumber kutipan", hint: 'Contoh: "— Dimas, owner ARVA".' },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // Panel "Teks & Kontak"
  // ══════════════════════════════════════════════════════════
  {
    title: "Section About",
    where: "Homepage · kartu profil, keahlian, dan statistik di kanan",
    path: "/#about",
    fields: [
      { key: "about_kicker", label: "Label kecil di atas section", hint: 'Biasanya ditulis "ABOUT".' },
      { key: "about_heading", label: "Sapaan besar" },
      { key: "about_role", label: "Jabatan / lokasi", hint: "Baris kecil berwarna coral di bawah sapaan." },
      { key: "about_bio", label: "Paragraf perkenalan", multiline: true },
      {
        key: "about_skills",
        label: "Keahlian",
        multiline: true,
        list: true,
        hint: "Satu keahlian per baris. Kalau ditulis dalam satu baris saja, pisahkan dengan koma.",
      },
      {
        key: "about_stat_value",
        label: "Angka statistik",
        type: "number",
        hint: "Ditampilkan sebagai angka yang menghitung naik saat di-scroll.",
      },
      {
        key: "about_stat_suffix",
        label: "Akhiran angka",
        hint: 'Tanda setelah angka — mis. "%" atau " tahun". Dikosongkan akan kembali ke "%".',
      },
      { key: "about_stat_label", label: "Keterangan statistik" },
    ],
  },
  {
    title: "Principles",
    where: "Homepage · kartu di kanan bawah section About",
    path: "/#about",
    fields: [
      { key: "about_principles_title", label: "Judul kartu", hint: 'Biasanya ditulis "Principles".' },
      {
        key: "about_principles",
        label: "Daftar prinsip",
        multiline: true,
        list: true,
        hint: "Satu prinsip per baris — koma di dalam kalimat aman. Titik warnanya bergilir coral → mustard → indigo, dan jumlah barisnya bebas.",
      },
    ],
  },
  {
    title: "Section Kontak",
    where: "Homepage · paling bawah, sebelum baris copyright",
    path: "/",
    fields: [
      { key: "contact_kicker", label: "Label kecil di atas judul", hint: 'Biasanya ditulis "CONTACT".' },
      { key: "contact_heading_1", label: "Judul — baris 1" },
      { key: "contact_heading_2", label: "Judul — baris 2", hint: "Baris ini tampil dengan warna gradien." },
      {
        key: "contact_description",
        label: "Kalimat ajakan",
        multiline: true,
        hint: "Muncul di bawah judul.",
      },
      {
        key: "contact_email",
        label: "Email",
        type: "email",
        hint: "Dipakai di teks besar maupun tombol email.",
      },
    ],
  },
  {
    title: "Tombol Sosial",
    where: "Homepage · deretan 4 tombol bulat di kanan judul kontak",
    path: "/",
    fields: [
      {
        key: "social_instagram",
        label: "Instagram",
        type: "url",
        hint: 'Tulis "#" kalau belum ada, atau tautan penuh (https://instagram.com/…).',
      },
      {
        key: "social_behance",
        label: "Behance",
        type: "url",
        hint: 'Tulis "#" kalau belum ada, atau tautan penuh.',
      },
      {
        key: "social_whatsapp",
        label: "WhatsApp",
        type: "url",
        hint: "Bisa pakai format https://wa.me/62812…",
      },
    ],
  },
  {
    title: "Baris Footer",
    where: "Homepage · baris paling bawah setelah garis",
    path: "/",
    fields: [
      { key: "footer_left", label: "Teks kiri" },
      { key: "footer_right", label: "Teks kanan" },
    ],
  },
];

/** Grup untuk tab "Beranda & Project" (foto + teks per bagian halaman). */
export const STUDIO_GROUPS: SettingGroup[] = SETTING_GROUPS.filter(
  (group) => group.panel === "studio"
);

/** Grup untuk tab "Teks & Kontak". */
export const TEXT_GROUPS: SettingGroup[] = SETTING_GROUPS.filter(
  (group) => group.panel !== "studio"
);

/** Semua key yang boleh ditulis dari admin (whitelist). */
export const SETTING_KEYS: string[] = SETTING_GROUPS.flatMap((group) =>
  group.fields.map((field) => field.key)
);

/**
 * Ambil satu nilai. Kalau kosong / nggak ada, jatuh ke nilai default —
 * jadi mengosongkan sebuah field nggak bikin situs nampil teks bolong.
 */
export function settingValue(settings: SettingsMap | undefined, key: string): string {
  const value = settings?.[key]?.trim();
  return value || SETTING_DEFAULTS[key] || "";
}

/**
 * Nilai mentah yang dipecah per BARIS (baris kosong dibuang).
 *
 * Dipakai field berstruktur seperti "Klien|ARVA" atau "40|%|Engagement naik".
 * Sengaja nggak pakai pemisah koma, karena isi tiap baris sering mengandung
 * koma di tengah kalimat.
 */
export function settingLines(settings: SettingsMap | undefined, key: string): string[] {
  const raw = settingValue(settings, key);
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Pecah satu baris jadi sel-sel, dipisah tanda "|". */
export function settingCells(line: string): string[] {
  return line.split("|").map((cell) => cell.trim());
}

/**
 * Pecah field bertipe daftar jadi array.
 *
 * Aturannya: kalau isinya lebih dari satu baris, TIAP BARIS jadi satu item —
 * koma di tengah kalimat dibiarkan apa adanya ("Character — punya ciri, bukan
 * template" tetap satu prinsip, bukan dua). Baru kalau semuanya ditulis dalam
 * satu baris, koma dipakai sebagai pemisah, biar "Figma, Canva" tetap kebaca
 * dua item.
 */
export function settingList(settings: SettingsMap | undefined, key: string): string[] {
  const raw = settingValue(settings, key).trim();
  if (!raw) return [];

  const parts = raw.includes("\n") ? raw.split("\n") : raw.split(",");
  return parts.map((entry) => entry.trim()).filter(Boolean);
}

/**
 * Angka buat statistik. Dikembalikan null kalau isinya bukan angka, supaya
 * pemanggilnya bisa jatuh ke nilai default daripada nampilin "NaN".
 */
export function settingNumber(settings: SettingsMap | undefined, key: string): number | null {
  const raw = settingValue(settings, key).replace(/[^\d.]/g, "");
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

/**
 * Pasangan label–nilai, satu per baris dengan format "Label|Nilai".
 * Baris tanpa tanda "|" dianggap nilai saja (labelnya kosong).
 */
export function settingPairs(
  settings: SettingsMap | undefined,
  key: string
): { label: string; value: string }[] {
  return settingLines(settings, key).map((line) => {
    const [label, ...rest] = settingCells(line);
    return rest.length ? { label, value: rest.join("|") } : { label: "", value: line };
  });
}

/**
 * Blok cerita: baris pertama jadi judul, sisanya jadi isi. Antar blok
 * dipisahkan satu baris kosong. Jumlah bloknya bebas.
 */
export function settingBlocks(
  settings: SettingsMap | undefined,
  key: string
): { title: string; body: string }[] {
  const raw = settingValue(settings, key);
  if (!raw.trim()) return [];

  return raw
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split("\n").map((line) => line.trim());
      const [title, ...rest] = lines;
      return { title, body: rest.join(" ").trim() };
    })
    .filter((block) => block.title);
}

/**
 * Kotak warna palet. Tiap baris: "#KODE" atau "#KODE Nama".
 * Baris yang nggak mengandung kode warna yang valid dilewati, jadi salah tulis
 * nggak bikin kotak warnanya jadi transparan.
 */
export function settingColors(
  settings: SettingsMap | undefined,
  key: string
): { hex: string; name: string }[] {
  return settingLines(settings, key)
    .map((line) => {
      const match = line.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/);
      if (!match) return null;
      const hex = match[0].toUpperCase();
      const name = line.replace(match[0], "").trim();
      return { hex, name };
    })
    .filter((entry): entry is { hex: string; name: string } => entry !== null);
}

/** Daftar angka statistik: "angka|akhiran|keterangan". */
export function settingStats(
  settings: SettingsMap | undefined,
  key: string
): { value: number; suffix: string; label: string }[] {
  return settingLines(settings, key)
    .map((line) => {
      const [rawValue, rawSuffix, ...rest] = settingCells(line);
      const value = Number(rawValue.replace(/[^\d.-]/g, ""));
      if (!Number.isFinite(value)) return null;
      return {
        value,
        suffix: rawSuffix ?? "",
        label: rest.join("|").trim(),
      };
    })
    .filter((entry): entry is { value: number; suffix: string; label: string } => entry !== null);
}

/**
 * Berapa item yang terbaca dari sebuah field daftar — dipakai panel admin biar
 * admin tahu hasil parsingnya sesuai atau ada baris yang kelewat.
 */
export function settingItemCount(
  settings: SettingsMap | undefined,
  field: SettingField
): { count: number; unit: string; skipped: number } | null {
  if (!field.list) return null;

  const lines = settingLines(settings, field.key).length;
  const key = field.key;

  if (key.endsWith("_blocks")) {
    return { count: settingBlocks(settings, key).length, unit: "blok cerita", skipped: 0 };
  }
  if (key.endsWith("_stats")) {
    return { count: settingStats(settings, key).length, unit: "angka", skipped: 0 };
  }
  if (key.endsWith("_palette")) {
    const count = settingColors(settings, key).length;
    return { count, unit: "warna", skipped: lines - count };
  }
  if (key.endsWith("_meta")) {
    return { count: settingPairs(settings, key).length, unit: "baris", skipped: 0 };
  }

  const raw = settingValue(settings, key).trim();
  const count = raw && !raw.includes("\n") ? raw.split(",").filter((s) => s.trim()).length : lines;
  return { count, unit: "item", skipped: 0 };
}

/** Semua key yang masih "#" (tautan belum diisi). */
export function emptyLinkKeys(settings: SettingsMap): string[] {
  return SETTING_KEYS.filter(
    (key) => key.startsWith("social_") && (settings[key] ?? "").trim() === "#"
  );
}
