"use client";

import { useRef, useState } from "react";

interface ExtraPhotosEditorProps {
  photos: string[];
  /** Dipanggil setiap daftar berubah — pemanggil yang menyimpan ke database. */
  onChange: (next: string[]) => Promise<void> | void;
  aspect: string;
  folder?: string;
}

/**
 * Foto tambahan sebuah karya.
 *
 * Foto utama diatur di uploader besar di atas; komponen ini nambah foto lain
 * dari karya yang sama. Semuanya tampil sebagai carousel di kartu grid, jadi
 * urutan di sini = urutan geser di situs.
 *
 * Perubahannya langsung disimpan (nggak nunggu tombol "Simpan perubahan"),
 * sama seperti foto utama — biar nggak ada foto yang hilang gara-gara lupa
 * klik simpan.
 */
export function ExtraPhotosEditor({
  photos,
  onChange,
  aspect,
  folder = "grid",
}: ExtraPhotosEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function persist(next: string[]) {
    try {
      await onChange(next);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Gagal menyimpan foto.");
    }
  }

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("aspect", aspect);
        form.append("folder", folder);

        const response = await fetch("/api/admin/upload", { method: "POST", body: form });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.error || `Upload gagal (${response.status}).`);
        }
        uploaded.push(payload.url as string);
      }

      await persist([...photos, ...uploaded]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload gagal.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;

    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    void persist(next);
  }

  return (
    <div className="mt-3 rounded-2xl border border-ink/10 bg-paper p-3">
      <p className="text-[11px] font-medium text-ink/60">
        Foto lain ({photos.length})
      </p>
      <p className="mt-0.5 text-[10px] leading-snug text-ink/45">
        Foto utama ada di atas. Yang ini tampil sebagai carousel yang bisa digeser di kartu grid.
      </p>

      {photos.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {photos.map((photo, index) => (
            <div key={photo + index} className="w-[68px]">
              <div className="relative overflow-hidden rounded-lg border border-ink/10 bg-[#F7F1E7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="h-[85px] w-full object-contain" />
                <span className="absolute left-1 top-1 rounded bg-ink/70 px-1 text-[9px] font-medium text-white">
                  {index + 2}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || busy}
                  className="flex-1 rounded border border-ink/12 py-0.5 text-[10px] disabled:opacity-30"
                  title="Majukan"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === photos.length - 1 || busy}
                  className="flex-1 rounded border border-ink/12 py-0.5 text-[10px] disabled:opacity-30"
                  title="Mundurkan"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => void persist(photos.filter((_, i) => i !== index))}
                  disabled={busy}
                  className="rounded border border-coral/40 px-1.5 py-0.5 text-[10px] text-coral disabled:opacity-30"
                  title="Hapus foto"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/avif,image/tiff"
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) void handleFiles(event.target.files);
        }}
      />

      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="mt-3 rounded-full border border-ink/15 px-4 py-2 text-[11px] font-medium transition-colors hover:border-coral hover:text-coral disabled:opacity-40"
      >
        {busy ? "Mengunggah…" : "+ Tambah foto lain"}
      </button>

      {error ? <p className="mt-2 text-[10px] leading-snug text-coral">{error}</p> : null}
    </div>
  );
}
