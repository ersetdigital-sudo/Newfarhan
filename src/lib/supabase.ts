import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase dipakai untuk DATA portofolio saja (judul, kategori, urutan, slot).
 * File gambarnya disimpan di Cloudinary — lihat src/lib/cloudinary.ts.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True kalau env Supabase lengkap. Kalau false, situs pakai data statis. */
export const isSupabaseConfigured = Boolean(url && anonKey && serviceKey);

/**
 * Client untuk BACA data publik. Pakai anon key, jadi tetap tunduk ke RLS
 * (cuma bisa lihat item yang published = true).
 */
let readClient: SupabaseClient | null = null;

export function supabaseRead(): SupabaseClient {
  if (!url || !anonKey) throw new Error("Supabase env belum lengkap.");
  if (!readClient) {
    readClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return readClient;
}

/**
 * Client untuk TULIS dari halaman admin. Pakai service_role, bypass RLS.
 * JANGAN pernah diimpor dari komponen client.
 */
let adminClient: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (!url || !serviceKey) throw new Error("Supabase admin env belum lengkap.");
  if (!adminClient) {
    adminClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
