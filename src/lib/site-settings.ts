/**
 * Teks & tautan yang bisa diatur dari panel admin.
 *
 * File ini SENGAJA nggak mengimpor apa pun dari server (Supabase dsb) supaya
 * aman dipakai di komponen client. Bagian yang baca/tulis database ada di
 * `src/lib/site-settings.server.ts`.
 */

/**
 * Nilai awal — sama persis dengan teks yang dulu di-hardcode di
 * `ContactFooter.tsx`. Dipakai kalau barisnya belum ada di database, jadi
 * situs nggak pernah nampilin teks kosong.
 */
export const SETTING_DEFAULTS: Record<string, string> = {
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
  path: string;
  fields: SettingField[];
}

export const SETTING_GROUPS: SettingGroup[] = [
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

/** Semua key yang masih "#" (tautan belum diisi). */
export function emptyLinkKeys(settings: SettingsMap): string[] {
  return SETTING_KEYS.filter(
    (key) => key.startsWith("social_") && (settings[key] ?? "").trim() === "#"
  );
}
