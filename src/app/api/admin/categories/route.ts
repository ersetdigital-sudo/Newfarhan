import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardAdminApi } from "@/lib/admin-auth";
import { createCategory } from "@/lib/categories.server";

export const runtime = "nodejs";

/** Tambah kategori baru. Body: { label: "Packaging" } */
export async function POST(request: Request) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const label = typeof body?.label === "string" ? body.label : "";

  try {
    const category = await createCategory(label);
    revalidatePath("/");
    return NextResponse.json({ ok: true, category });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menambah kategori." },
      { status: 400 }
    );
  }
}
