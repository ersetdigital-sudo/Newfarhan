"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/categories";

interface CategoriesManagerProps {
  categories: Category[];
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function call(url: string, init: RequestInit): Promise<boolean> {
    const response = await fetch(url, init);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error || `Gagal (${response.status}).`);
      return false;
    }
    setError(null);
    router.refresh();
    return true;
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;

    const keys = categories.map((category) => category.key);
    [keys[index], keys[target]] = [keys[target], keys[index]];
    void call("/api/admin/categories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys }),
    });
  }

  async function remove(category: Category) {
    if (!window.confirm(`Hapus kategori "${category.label}"?`)) return;
    await call(`/api/admin/categories/${encodeURIComponent(category.key)}`, { method: "DELETE" });
  }

  const totalItems = categories.reduce((sum, category) => sum + (category.itemCount ?? 0), 0);

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-2xl border border-mustard/40 bg-mustard/10 px-5 py-4">
        <p className="text-xs leading-relaxed text-ink/70">
          <strong className="text-ink">Kategori inilah yang jadi tab filter di homepage.</strong>{" "}
          Urutannya di sini = urutan tab di situs (yang kosong nggak nampil). Mengganti nama aman —
          proyek yang sudah pakai kategori itu nggak ikut berubah, karena yang disimpan di
          proyeknya cuma kode di belakang layar.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink/70">
          Total {categories.length} kategori, dipakai {totalItems} proyek.
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl border border-coral/30 bg-coral/5 px-4 py-3 text-xs text-coral">
          {error}
        </p>
      ) : null}

      <NewCategoryForm onCreated={() => router.refresh()} />

      <div className="space-y-3">
        {categories.map((category, index) => (
          <CategoryRow
            key={category.key}
            category={category}
            index={index}
            total={categories.length}
            onMove={move}
            onDelete={() => remove(category)}
            onError={setError}
            onSaved={() => router.refresh()}
          />
        ))}
      </div>
    </div>
  );
}

function NewCategoryForm({ onCreated }: { onCreated: () => void }) {
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error || "Gagal menambah kategori.");
      setBusy(false);
      return;
    }

    setLabel("");
    setBusy(false);
    onCreated();
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-ink/10 bg-chalk p-5">
      <h3 className="font-display text-sm font-semibold">Tambah Kategori Baru</h3>
      <p className="mt-1 text-[11px] leading-snug text-ink/50">
        Kategori baru langsung muncul sebagai tab di homepage begitu ada proyek yang memakainya.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Packaging"
          className="w-56 rounded-xl border border-ink/12 bg-paper px-4 py-2.5 text-sm outline-none transition-colors focus:border-coral"
        />
        <button
          type="submit"
          disabled={busy || !label.trim()}
          className="rounded-full bg-coral px-5 py-2.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {busy ? "Menyimpan…" : "Tambah kategori"}
        </button>
        {!label.trim() ? (
          <span className="text-[11px] text-ink/50">Isi namanya dulu.</span>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-xs text-coral">{error}</p> : null}
    </form>
  );
}

function CategoryRow({
  category,
  index,
  total,
  onMove,
  onDelete,
  onError,
  onSaved,
}: {
  category: Category;
  index: number;
  total: number;
  onMove: (index: number, direction: -1 | 1) => void;
  onDelete: () => void;
  onError: (message: string) => void;
  onSaved: () => void;
}) {
  const [label, setLabel] = useState(category.label);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = label.trim() !== category.label;
  const used = category.itemCount ?? 0;

  async function save() {
    setBusy(true);
    setSaved(false);

    const response = await fetch(`/api/admin/categories/${encodeURIComponent(category.key)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      onError(payload?.error || "Gagal mengganti nama kategori.");
      setBusy(false);
      return;
    }

    setBusy(false);
    setSaved(true);
    onSaved();
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-chalk p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="rounded-lg border border-ink/12 px-2.5 py-1.5 text-xs disabled:opacity-30"
            title="Geser ke kiri"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            className="rounded-lg border border-ink/12 px-2.5 py-1.5 text-xs disabled:opacity-30"
            title="Geser ke kanan"
          >
            ↓
          </button>
        </div>

        <span className="w-6 shrink-0 text-center text-[11px] text-ink/40">{index + 1}</span>

        <input
          value={label}
          onChange={(event) => {
            setLabel(event.target.value);
            setSaved(false);
          }}
          className="w-56 rounded-xl border border-ink/12 bg-paper px-4 py-2.5 text-sm outline-none transition-colors focus:border-coral"
        />

        <code className="text-[11px] text-ink/40">{category.key}</code>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
            used > 0 ? "bg-paper text-ink/60" : "bg-coral/10 text-coral"
          }`}
        >
          {used > 0 ? `${used} proyek` : "belum dipakai"}
        </span>

        <button
          type="button"
          onClick={save}
          disabled={busy || !dirty || !label.trim()}
          className="rounded-full bg-ink px-4 py-2 text-[11px] font-medium text-paper transition-colors hover:bg-coral disabled:opacity-40"
        >
          {busy ? "Menyimpan…" : "Simpan nama"}
        </button>

        {saved ? <span className="text-[11px] text-ink/45">Tersimpan ✓</span> : null}

        <button
          type="button"
          onClick={onDelete}
          className="ml-auto text-[11px] text-coral hover:underline"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
