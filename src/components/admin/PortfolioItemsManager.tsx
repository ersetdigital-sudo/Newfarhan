"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AdminPortfolioItem } from "@/lib/portfolio";
import type { Category } from "@/lib/categories";
import { GRID_SPEC } from "@/lib/site-slots";
import { ExtraPhotosEditor } from "./ExtraPhotosEditor";
import { ImageUploader } from "./ImageUploader";

interface ManagerProps {
  items: AdminPortfolioItem[];
  categories: Category[];
}

export function PortfolioItemsManager({ items, categories }: ManagerProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function persistOrder(slugs: string[]) {
    const response = await fetch("/api/admin/items/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error || "Gagal menyimpan urutan.");
      return;
    }
    router.refresh();
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const slugs = items.map((item) => item.slug);
    [slugs[index], slugs[target]] = [slugs[target], slugs[index]];
    void persistOrder(slugs);
  }

  async function remove(slug: string, title: string) {
    if (!window.confirm(`Hapus "${title}"? Foto di Storage ikut dihapus.`)) return;
    const response = await fetch(`/api/admin/items/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error || "Gagal menghapus.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-ink/10 bg-paper px-5 py-4">
        <p className="text-xs text-ink/60">
          Semua foto di sini otomatis dipadu ke kanvas{" "}
          <strong className="text-ink">
            {GRID_SPEC.width}×{GRID_SPEC.height}px ({GRID_SPEC.aspect})
          </strong>
          . Mau foto apa pun yang di-upload, bentuk kartunya nggak akan berubah.
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl border border-coral/30 bg-coral/5 px-4 py-3 text-xs text-coral">
          {error}
        </p>
      ) : null}

      <NewItemForm categories={categories} onCreated={() => router.refresh()} />

      <div className="space-y-4">
        {items.map((item, index) => (
          <ItemCard
            key={item.slug}
            item={item}
            categories={categories}
            index={index}
            total={items.length}
            onMove={move}
            onDelete={() => remove(item.slug, item.title)}
            onSaved={() => router.refresh()}
            onError={setError}
          />
        ))}
      </div>
    </div>
  );
}

function NewItemForm({
  categories,
  onCreated,
}: {
  categories: Category[];
  onCreated: () => void;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(categories[0]?.key ?? "");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missing = !imageUrl
    ? "Upload fotonya dulu — kartu baru muncul di grid setelah ada gambar."
    : !title.trim()
      ? "Judulnya belum diisi."
      : null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (missing) {
      setError(missing);
      return;
    }
    setBusy(true);
    setError(null);

    const response = await fetch("/api/admin/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        subtitle,
        description,
        image_url: imageUrl,
        image_alt: title,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error || "Gagal menambah proyek.");
      setBusy(false);
      return;
    }

    setImageUrl("");
    setTitle("");
    setSubtitle("");
    setDescription("");
    setBusy(false);
    onCreated();
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-ink/10 bg-chalk p-5">
      <h3 className="font-display text-sm font-semibold">Tambah Proyek Baru</h3>
      <p className="mt-1 text-[11px] leading-snug text-ink/50">
        Proyek baru masuk ke <strong className="text-ink/70">urutan paling akhir</strong> di grid.
        Urutannya diatur pakai tombol ↑↓ di kartu di bawah. Tab kategori di homepage ikut
        menyesuaikan sendiri.
      </p>

      {/* Dua kolom mulai dari `sm`, bukan `md` — dan catatan penting: pemisah
          track grid harus spasi (`_`), BUKAN koma. Koma bikin deklarasi
          `grid-template-columns` invalid & dibuang browser, jadi grid-nya
          kolaps jadi 1 kolom dan fotonya ngebentang selebar halaman. */}
      <div className="mt-4 grid gap-4 sm:grid-cols-[150px_1fr]">
        <div className="mx-auto w-full max-w-[200px] sm:mx-0 sm:max-w-none">
          <ImageUploader
            currentUrl={imageUrl}
            aspect={GRID_SPEC.aspect}
            folder="grid"
            buttonLabel="Upload foto"
            onUploaded={setImageUrl}
          />
        </div>

        <div className="grid content-start gap-3">
          <Field label="Judul">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Nexus FC — Away Kit"
              className="input"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Kategori">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="input"
              >
                {categories.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Label kecil di kartu">
              <input
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
                placeholder="Jersey & Apparel"
                className="input"
              />
            </Field>
          </div>

          <Field label="Deskripsi (isi popup)">
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Cerita singkat proyeknya…"
              className="input resize-none"
            />
          </Field>
        </div>
      </div>

      {error ? <p className="mt-3 text-xs text-coral">{error}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy || Boolean(missing)}
          className="rounded-full bg-coral px-5 py-2.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {busy ? "Menyimpan…" : "Tambah ke grid"}
        </button>

        {/* Tombol yang kelabu tanpa penjelasan bikin bingung — jadi alasannya
            ditulis langsung di sebelahnya. */}
        {missing ? <span className="text-[11px] text-ink/50">{missing}</span> : null}
      </div>
    </form>
  );
}

function ItemCard({
  item,
  categories,
  index,
  total,
  onMove,
  onDelete,
  onSaved,
  onError,
}: {
  item: AdminPortfolioItem;
  categories: Category[];
  index: number;
  total: number;
  onMove: (index: number, direction: -1 | 1) => void;
  onDelete: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const [draft, setDraft] = useState({
    title: item.title,
    category: item.category,
    subtitle: item.subtitle,
    description: item.popupDescription,
    image_url: item.image,
    published: item.published,
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [extras, setExtras] = useState<string[]>(item.images);

  /**
   * Foto tambahan disimpan langsung (nggak nunggu tombol simpan), sama seperti
   * foto utama — biar nggak ada foto yang hilang gara-gara lupa klik simpan.
   */
  async function saveExtras(next: string[]) {
    const response = await fetch(`/api/admin/items/${encodeURIComponent(item.slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: next }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || "Gagal menyimpan foto lain.");
    }

    setExtras(next);
    onSaved();
  }

  async function save() {
    setBusy(true);
    setSaved(false);

    const response = await fetch(`/api/admin/items/${encodeURIComponent(item.slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      onError(payload?.error || "Gagal menyimpan perubahan.");
      setBusy(false);
      return;
    }

    setBusy(false);
    setSaved(true);
    onSaved();
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-chalk p-5">
      <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
        <div className="mx-auto w-full max-w-[200px] sm:mx-0 sm:max-w-none">
          <ImageUploader
            currentUrl={draft.image_url}
            aspect={GRID_SPEC.aspect}
            folder="grid"
            buttonLabel="Ganti foto"
            onUploaded={async (url) => {
              setDraft((prev) => ({ ...prev, image_url: url }));
              // Langsung simpan supaya foto baru nggak hilang kalau admin
              // lupa klik tombol simpan.
              const response = await fetch(
                `/api/admin/items/${encodeURIComponent(item.slug)}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ image_url: url }),
                }
              );
              if (!response.ok) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.error || "Foto ter-upload tapi gagal disimpan.");
              }
              onSaved();
            }}
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              className="flex-1 rounded-lg border border-ink/12 py-1.5 text-xs disabled:opacity-30"
              title="Naikkan urutan"
            >
              ↑
            </button>
            <span className="text-[11px] text-ink/40">
              {index + 1}/{total}
            </span>
            <button
              type="button"
              onClick={() => onMove(index, 1)}
              disabled={index === total - 1}
              className="flex-1 rounded-lg border border-ink/12 py-1.5 text-xs disabled:opacity-30"
              title="Turunkan urutan"
            >
              ↓
            </button>
          </div>
        </div>

        <div className="grid content-start gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <code className="min-w-0 break-all text-[11px] text-ink/40">{item.slug}</code>
            <label className="flex shrink-0 items-center gap-2 text-[11px] text-ink/60">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, published: event.target.checked }))
                }
              />
              Tampil di situs
            </label>
          </div>

          <Field label="Judul">
            <input
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              className="input"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Kategori">
              <select
                value={draft.category}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, category: event.target.value }))
                }
                className="input"
              >
                {categories.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Label kecil di kartu">
              <input
                value={draft.subtitle}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, subtitle: event.target.value }))
                }
                className="input"
              />
            </Field>
          </div>

          <Field label="Deskripsi (isi popup)">
            <textarea
              value={draft.description}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={3}
              className="input resize-none"
            />
          </Field>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded-full bg-ink px-5 py-2.5 text-xs font-medium text-paper transition-colors hover:bg-coral disabled:opacity-50"
            >
              {busy ? "Menyimpan…" : "Simpan perubahan"}
            </button>

            {saved ? <span className="text-[11px] text-ink/45">Tersimpan ✓</span> : null}

            <button
              type="button"
              onClick={onDelete}
              className="ml-auto text-[11px] text-coral hover:underline"
            >
              Hapus proyek
            </button>
          </div>
        </div>
      </div>

      <ExtraPhotosEditor
        photos={extras}
        onChange={saveExtras}
        aspect={GRID_SPEC.aspect}
        folder="grid"
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-ink/55">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
