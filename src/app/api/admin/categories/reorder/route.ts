import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardAdminApi } from "@/lib/admin-auth";
import { reorderCategories } from "@/lib/categories.server";

export const runtime = "nodejs";

/** Simpan urutan tab. Body: { keys: string[] } sesuai urutan tampil. */
export async function POST(request: Request) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as { keys?: unknown } | null;
  const keys = Array.isArray(body?.keys) ? body.keys.map(String) : null;

  if (!keys || keys.length === 0) {
    return NextResponse.json({ error: "Daftar urutan kosong." }, { status: 400 });
  }

  try {
    const count = await reorderCategories(keys);
    revalidatePath("/");
    return NextResponse.json({ ok: true, count });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menyimpan urutan." },
      { status: 500 }
    );
  }
}
