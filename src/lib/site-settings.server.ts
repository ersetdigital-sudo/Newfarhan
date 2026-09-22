import {
  SETTING_DEFAULTS,
  SETTING_KEYS,
  type SettingsMap,
} from "@/lib/site-settings";
import { isSupabaseConfigured, supabaseAdmin, supabaseRead } from "@/lib/supabase";

interface SettingRow {
  key: string;
  value: string | null;
}

function mergeRows(rows: SettingRow[] | null): SettingsMap {
  const out: SettingsMap = { ...SETTING_DEFAULTS };
  for (const row of rows ?? []) {
    if (typeof row.value === "string") out[row.key] = row.value;
  }
  return out;
}

/**
 * Teks situs untuk halaman publik. Kalau Supabase belum diset / sedang error,
 * balik ke nilai default supaya section kontak nggak pernah kosong.
 */
export async function getSiteSettings(): Promise<SettingsMap> {
  if (!isSupabaseConfigured) return { ...SETTING_DEFAULTS };

  try {
    const { data, error } = await supabaseRead().from("site_settings").select("key, value");
    if (error || !data) return { ...SETTING_DEFAULTS };
    return mergeRows(data as SettingRow[]);
  } catch {
    return { ...SETTING_DEFAULTS };
  }
}

/** Versi buat panel admin — errornya dilempar biar kelihatan, bukan disembunyiin. */
export async function getAdminSettings(): Promise<SettingsMap> {
  const { data, error } = await supabaseAdmin().from("site_settings").select("key, value");
  if (error) throw new Error(`Gagal membaca site_settings: ${error.message}`);
  return mergeRows(data as SettingRow[]);
}

/**
 * Simpan beberapa nilai sekaligus.
 *
 * Cuma key yang ada di whitelist `SETTING_KEYS` yang ditulis, jadi admin nggak
 * bisa nyelipin baris sembarangan ke database. Nilai dikirim mentah (tanpa
 * trim) supaya spasi sengaja tetap tersimpan.
 */
export async function saveSiteSettings(values: Record<string, unknown>): Promise<string[]> {
  const rows = SETTING_KEYS.filter((key) => typeof values[key] === "string").map((key) => ({
    key,
    value: (values[key] as string).replace(/\r\n/g, "\n"),
    updated_at: new Date().toISOString(),
  }));

  if (rows.length === 0) return [];

  const { error } = await supabaseAdmin()
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) throw new Error(error.message);
  return rows.map((row) => row.key);
}
