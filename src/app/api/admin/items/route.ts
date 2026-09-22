import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardAdminApi } from "@/lib/admin-auth";
import { validCategoryKeys } from "@/lib/categories.server";
import { GRID_SPEC } from "@/lib/site-slots";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "proyek";
}

/** Cek kategori ke daftar di database, bukan daftar yang dipatok di kode. */
function isCategory(value: unknown, allowed: string[]): value is string {
  return typeof value === "string" && allowed.includes(value);
}

export async function POST(request: Request) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Body nggak valid." }, { status: 400 });

  const title = String(body.title ?? "").trim();
  const imageUrl = String(body.image_url ?? "").trim();

  if (!title) return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
  if (!imageUrl) return NextResponse.json({ error: "Foto wajib di-upload dulu." }, { status: 400 });
  if (!isCategory(body.category, await validCategoryKeys())) {
    return NextResponse.json({ error: "Kategori nggak valid." }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const { data: last } = await admin
    .from("portfolio_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = ((last?.sort_order as number | null) ?? 0) + 1;

  const baseSlug = String(body.slug ?? "").trim() || slugify(title);

  const payload = {
    slug: baseSlug,
    title,
    category: body.category,
    subtitle: String(body.subtitle ?? "").trim() || GRID_SPEC.label,
    description: String(body.description ?? "").trim(),
    image_url: imageUrl,
    image_alt: String(body.image_alt ?? "").trim() || title,
    sort_order: nextOrder,
    published: body.published !== false,
  };

  let { data, error } = await admin.from("portfolio_items").insert(payload).select().single();

  // Slug bentrok? Kasih suffix unik, jangan sampai admin kehilangan inputnya.
  if (error && error.code === "23505") {
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;
    ({ data, error } = await admin
      .from("portfolio_items")
      .insert({ ...payload, slug: uniqueSlug })
      .select()
      .single());
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/project");
  return NextResponse.json({ ok: true, item: data });
}
