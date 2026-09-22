import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardAdminApi } from "@/lib/admin-auth";
import { validCategoryKeys } from "@/lib/categories.server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Body nggak valid." }, { status: 400 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (typeof body.title === "string" && body.title.trim()) update.title = body.title.trim();
  if (typeof body.subtitle === "string") update.subtitle = body.subtitle.trim();
  if (typeof body.description === "string") update.description = body.description.trim();
  if (typeof body.image_alt === "string") update.image_alt = body.image_alt.trim();
  if (typeof body.published === "boolean") update.published = body.published;
  if (typeof body.sort_order === "number") update.sort_order = body.sort_order;

  if (typeof body.image_url === "string" && body.image_url.trim()) {
    update.image_url = body.image_url.trim();
  }

  if (typeof body.category === "string") {
    // Validasi dari daftar kategori di database, bukan daftar di kode —
    // supaya kategori yang baru ditambah lewat admin langsung bisa dipakai.
    if (!(await validCategoryKeys()).includes(body.category)) {
      return NextResponse.json({ error: "Kategori nggak valid." }, { status: 400 });
    }
    update.category = body.category;
  }

  const { data, error } = await supabaseAdmin()
    .from("portfolio_items")
    .update(update)
    .eq("slug", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/project");
  return NextResponse.json({ ok: true, item: data });
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const { id } = await params;

  // Foto lama sengaja dibiarkan di Cloudinary supaya salah hapus nggak
  // langsung menghilangkan aset. Bersihkan manual dari Media Library.
  const { error } = await supabaseAdmin().from("portfolio_items").delete().eq("slug", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/project");
  return NextResponse.json({ ok: true });
}
