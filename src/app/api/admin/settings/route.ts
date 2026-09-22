import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardAdminApi } from "@/lib/admin-auth";
import { saveSiteSettings } from "@/lib/site-settings.server";

export const runtime = "nodejs";

/**
 * Simpan teks section kontak & footer.
 *
 * Body: { values: { contact_email: "…", footer_left: "…" } }
 * Cuma key yang ada di whitelist `SETTING_KEYS` yang ikut ditulis, jadi
 * sembarang key dari browser diabaikan diam-diam.
 */
export async function PATCH(request: Request) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const values = body?.values;
  if (!values || typeof values !== "object") {
    return NextResponse.json({ error: "Body harus berisi objek `values`." }, { status: 400 });
  }

  try {
    const saved = await saveSiteSettings(values as Record<string, unknown>);
    if (saved.length === 0) {
      return NextResponse.json({ error: "Nggak ada field yang dikenali." }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/project");
    return NextResponse.json({ ok: true, saved });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menyimpan." },
      { status: 500 }
    );
  }
}
