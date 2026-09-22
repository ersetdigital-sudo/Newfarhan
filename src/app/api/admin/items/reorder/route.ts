import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardAdminApi } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Simpan urutan baru. Body: { slugs: string[] } sesuai urutan tampil.
 * Dipakai tombol naik/turun di halaman admin.
 */
export async function POST(request: Request) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as { slugs?: unknown } | null;
  const slugs = Array.isArray(body?.slugs) ? body.slugs.map(String) : null;

  if (!slugs || slugs.length === 0) {
    return NextResponse.json({ error: "Daftar urutan kosong." }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const now = new Date().toISOString();

  for (let index = 0; index < slugs.length; index += 1) {
    const { error } = await admin
      .from("portfolio_items")
      .update({ sort_order: index + 1, updated_at: now })
      .eq("slug", slugs[index]);

    if (error) {
      return NextResponse.json(
        { error: `Gagal menyimpan urutan di posisi ${index + 1}: ${error.message}` },
        { status: 500 }
      );
    }
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true, count: slugs.length });
}
