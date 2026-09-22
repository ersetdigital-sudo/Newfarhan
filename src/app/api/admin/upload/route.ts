import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-auth";
import { GRID_SPEC, sizeForAspect } from "@/lib/site-slots";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/tiff", "image/gif"];

/**
 * Terima file dari halaman admin, terus teruskan ke Cloudinary.
 *
 * File aslinya disimpan UTUH di Cloudinary. Pemaduan ke kanvas rasio slot
 * dikerjakan Cloudinary saat pengiriman (lihat src/lib/cloudinary.ts),
 * jadi nggak ada proses gambar di server dan foto asli tetap bisa diunduh
 * kapan-kapan.
 *
 * Preset upload-nya unsigned, tapi endpoint ini dilindungi sesi admin —
 * jadi preset name-nya nggak pernah bocor ke browser.
 */
export async function POST(request: Request) {
  const denied = await guardAdminApi();
  if (denied) return denied;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return NextResponse.json(
      {
        error:
          "Cloudinary belum dikonfigurasi. Isi CLOUDINARY_CLOUD_NAME dan CLOUDINARY_UPLOAD_PRESET di environment.",
      },
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Form data nggak terbaca." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File nggak ketemu." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File-nya kosong." }, { status: 400 });
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: `Format ${file.type} nggak didukung. Pakai PNG/JPG/WebP.` },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File ${(file.size / 1024 / 1024).toFixed(1)} MB, maksimal 25 MB.` },
      { status: 413 }
    );
  }

  const aspect = String(form.get("aspect") || GRID_SPEC.aspect);
  const folder = String(form.get("folder") || "portfolio").replace(/[^a-z0-9/_-]/gi, "") || "portfolio";

  const upstream = new FormData();
  upstream.append("file", file);
  upstream.append("upload_preset", uploadPreset);
  upstream.append("folder", `farhan-portfolio/${folder}`);

  let payload: Record<string, unknown>;
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: upstream,
    });
    payload = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      const message =
        (payload?.error as { message?: string } | undefined)?.message ||
        `Cloudinary menolak upload (${response.status}).`;
      return NextResponse.json({ error: message }, { status: 502 });
    }
  } catch {
    return NextResponse.json(
      { error: "Nggak bisa menghubungi Cloudinary. Cek koneksi lalu coba lagi." },
      { status: 502 }
    );
  }

  const canvas = sizeForAspect(aspect);

  return NextResponse.json({
    url: payload.secure_url,
    publicId: payload.public_id,
    aspect,
    // Dimensi file asli — pemaduan ke kanvas terjadi saat pengiriman.
    originalWidth: payload.width ?? null,
    originalHeight: payload.height ?? null,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    bytes: payload.bytes ?? file.size,
    originalBytes: file.size,
    format: payload.format ?? null,
  });
}
