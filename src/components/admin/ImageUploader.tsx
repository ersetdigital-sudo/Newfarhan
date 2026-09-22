"use client";

import { useRef, useState } from "react";

interface UploadResult {
  url: string;
  originalWidth: number | null;
  originalHeight: number | null;
  canvasWidth: number;
  canvasHeight: number;
  bytes: number;
  originalBytes: number;
}

interface ImageUploaderProps {
  currentUrl: string;
  /** Rasio kotak yang dikunci, mis. "4:5" */
  aspect: string;
  folder?: string;
  buttonLabel?: string;
  /** Dipanggil setelah upload sukses & file tersimpan di Storage */
  onUploaded: (url: string) => Promise<void> | void;
}

export function ImageUploader({
  currentUrl,
  aspect,
  folder = "portfolio",
  buttonLabel = "Ganti foto",
  onUploaded,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setNote(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("aspect", aspect);
      form.append("folder", folder);

      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || `Upload gagal (${response.status}).`);
      }

      const result = payload as UploadResult;
      await onUploaded(result.url);

      const originalKb = Math.round(result.originalBytes / 1024);
      const asli =
        result.originalWidth && result.originalHeight
          ? `${result.originalWidth}×${result.originalHeight}`
          : "foto";
      setNote(
        `${asli} → otomatis dipadu ke kanvas ${result.canvasWidth}×${result.canvasHeight}, ` +
          `nggak ada bagian yang kepotong (${originalKb} KB)`
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload gagal.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div
        className="relative overflow-hidden rounded-xl border border-ink/10 bg-[#F7F1E7]"
        style={{ aspectRatio: aspect.replace(":", " / ") }}
      >
        {currentUrl ? (
          // object-contain disamakan dengan yang dipakai situs, supaya yang
          // kelihatan di admin persis sama dengan yang tampil di halaman.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="" className="h-full w-full object-contain" />
        ) : (
          <div className="grid h-full place-items-center text-xs text-ink/40">Belum ada foto</div>
        )}

        {busy ? (
          <div className="absolute inset-0 grid place-items-center bg-ink/60 text-xs font-medium text-white">
            Mengunggah…
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/tiff"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-full bg-ink px-4 py-2.5 text-xs font-medium text-paper transition-colors hover:bg-coral disabled:opacity-50"
      >
        {busy ? "Memproses…" : buttonLabel}
      </button>

      {note ? <p className="text-[11px] leading-snug text-ink/55">{note}</p> : null}
      {error ? <p className="text-[11px] leading-snug text-coral">{error}</p> : null}
    </div>
  );
}
