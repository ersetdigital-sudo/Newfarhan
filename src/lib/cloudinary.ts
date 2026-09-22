import { PAD_COLOR } from "@/lib/site-slots";

const UPLOAD_MARKER = "/image/upload/";

/** "#F7F1E7" -> "F7F1E7" (format yang diminta Cloudinary). */
const PAD_HEX = PAD_COLOR.replace("#", "").toUpperCase();

/**
 * Sisipkan transformasi Cloudinary ke sebuah URL gambar.
 *
 * `c_pad` = foto diperkecil supaya muat utuh di kanvas, sisa ruangnya diisi
 * warna latar. Jadi NOL bagian foto yang terpotong, dan kanvasnya selalu
 * persis rasio yang diminta — inilah yang bikin layout nggak bisa rusak.
 * `f_auto,q_auto` = Cloudinary otomatis kirim WebP/AVIF + kualitas optimal.
 *
 * URL non-Cloudinary (mis. gambar lama "/images/x.png") dibiarkan apa adanya.
 */
export function cloudinaryImage(url: string, width: number, height: number): string {
  if (!url) return url;

  const index = url.indexOf(UPLOAD_MARKER);
  if (index === -1) return url;

  const transform = `c_pad,w_${width},h_${height},b_rgb:${PAD_HEX},f_auto,q_auto`;
  return (
    url.slice(0, index + UPLOAD_MARKER.length) +
    transform +
    "/" +
    url.slice(index + UPLOAD_MARKER.length)
  );
}

/** True kalau gambar disimpan di Cloudinary. */
export function isCloudinaryUrl(url: string): boolean {
  return Boolean(url) && url.includes(UPLOAD_MARKER);
}

/** Ambil public_id dari URL Cloudinary (buat referensi/cleanup manual). */
export function cloudinaryPublicId(url: string): string | null {
  const index = url.indexOf(UPLOAD_MARKER);
  if (index === -1) return null;

  let rest = url.slice(index + UPLOAD_MARKER.length);
  // Buang segmen transformasi kalau ada, lalu versi (v1234/) kalau ada.
  rest = rest.replace(/^(?:[a-z]+_[^/]+\/)+/i, "");
  rest = rest.replace(/^v\d+\//, "");
  return rest.replace(/\.[a-z0-9]+$/i, "") || null;
}
