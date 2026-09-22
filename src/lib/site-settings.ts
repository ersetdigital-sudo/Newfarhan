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
  type?: "text" | "email" | "url";
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

/** Semua key yang masih "#" (tautan belum diisi). */
export function emptyLinkKeys(settings: SettingsMap): string[] {
  return SETTING_KEYS.filter(
    (key) => key.startsWith("social_") && (settings[key] ?? "").trim() === "#"
  );
}
