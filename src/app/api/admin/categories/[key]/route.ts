import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardAdminApi } from "@/lib/admin-auth";
import { deleteCategory, renameCategory } from "@/lib/categories.server";

export const runtime = "nodejs";

type Params = { params: Promise<{ key: string }> };

/**
 * Ganti nama kategori. Body: { label: "Packaging" }
 *
 * Key-nya nggak ikut berubah, jadi proyek yang sudah memakai kategori ini
 * tetap nyambung — nggak ada yang perlu dipindahin.
 */
export async function PATCH(request: Request, { params }: Params) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const { key } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const label = typeof body?.label === "string" ? body.label : "";

  try {
    const category = await renameCategory(key, label);
    revalidatePath("/");
    return NextResponse.json({ ok: true, category });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengganti nama." },
      { status: 400 }
    );
  }
}

/** Hapus kategori. Ditolak kalau masih ada proyek yang memakainya. */
export async function DELETE(_request: Request, { params }: Params) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const { key } = await params;

  try {
    await deleteCategory(key);
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menghapus kategori." },
      { status: 400 }
    );
  }
}
