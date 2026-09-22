import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardAdminApi } from "@/lib/admin-auth";
import { slotSpec } from "@/lib/site-slots";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type Params = { params: Promise<{ slot: string }> };

/**
 * Ganti foto di sebuah slot tetap.
 *
 * Yang disimpan cuma URL Cloudinary-nya. Pemaduan ke kanvas rasio slot
 * dikerjakan Cloudinary saat pengiriman, jadi foto yang di-upload admin
 * nggak perlu diproses dan bentuk layout-nya nggak bisa berubah.
 *
 * Foto lama tetap ada di Cloudinary (nggak dihapus otomatis) supaya salah
 * upload nggak berarti kehilangan aset — bersihkan manual dari Media Library
 * kalau perlu.
 */
export async function PATCH(request: Request, { params }: Params) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const { slot } = await params;
  const spec = slotSpec(slot);
  if (!spec) {
    return NextResponse.json({ error: `Slot "${slot}" nggak dikenal.` }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const imageUrl = typeof body?.image_url === "string" ? body.image_url.trim() : "";
  if (!imageUrl) {
    return NextResponse.json({ error: "image_url wajib diisi." }, { status: 400 });
  }

  const { error } = await supabaseAdmin().from("site_images").upsert(
    {
      slot,
      image_url: imageUrl,
      label: typeof body?.label === "string" ? body.label.trim() : spec.label,
      alt: typeof body?.alt === "string" && body.alt.trim() ? body.alt.trim() : spec.alt,
      // Rasio sengaja ditulis dari kode, bukan dari input admin.
      aspect: spec.aspect,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slot" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/project");
  return NextResponse.json({ ok: true, slot, image_url: imageUrl, aspect: spec.aspect });
}
