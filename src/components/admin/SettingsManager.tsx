"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEXT_GROUPS, type SettingsMap } from "@/lib/site-settings";
import { SettingInput } from "./SettingInput";

interface SettingsManagerProps {
  settings: SettingsMap;
}

export function SettingsManager({ settings }: SettingsManagerProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<SettingsMap>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkFields = TEXT_GROUPS.flatMap((group) => group.fields).filter(
    (field) => field.type === "url"
  );
  const emptyLinks = linkFields.filter((field) => (draft[field.key] ?? "").trim() === "#");

  function update(key: string, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: draft }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) throw new Error(payload?.error || "Gagal menyimpan.");

      setSaved(true);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-2xl border border-mustard/40 bg-mustard/10 px-5 py-4">
        <p className="text-xs leading-relaxed text-ink/70">
          <strong className="text-ink">Teks ini yang bikin kata-kata di situs bisa diganti.</strong>{" "}
          Mengosongkan sebuah field akan mengembalikannya ke teks bawaan, jadi situs nggak pernah
          nampil teks bolong. Teks Featured Work, hero project, dan Case Study ada di tab{" "}
          <strong className="text-ink">Beranda &amp; Project</strong> karena di sana digabung dengan
          fotonya.
        </p>
        {emptyLinks.length > 0 ? (
          <p className="mt-2 text-xs leading-relaxed text-ink/70">
            Tombol yang tautannya masih <code className="rounded bg-chalk px-1.5 py-0.5">#</code>{" "}
            belum mengarah ke mana-mana: {emptyLinks.map((field) => field.label).join(", ")}. Isi
            tautan aslinya biar bisa diklik pengunjung.
          </p>
        ) : null}
      </div>

      {TEXT_GROUPS.map((group) => (
        <section key={group.title} className="rounded-2xl border border-ink/10 bg-chalk p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">{group.title}</h2>
              <p className="mt-1 text-[11px] leading-snug text-ink/50">{group.where}</p>
            </div>
            <a
              href={group.path}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-[11px] font-medium text-coral hover:underline"
            >
              Lihat di situs ↗
            </a>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {group.fields.map((field) => (
              <SettingInput
                key={field.key}
                field={field}
                value={draft[field.key] ?? ""}
                onChange={update}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-6 flex flex-wrap items-center gap-4 rounded-2xl border border-ink/10 bg-chalk/95 px-5 py-4 backdrop-blur">
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="rounded-full bg-ink px-6 py-2.5 text-xs font-medium text-paper transition-colors hover:bg-coral disabled:opacity-50"
        >
          {saving ? "Menyimpan…" : "Simpan perubahan"}
        </button>
        {saved ? <span className="text-xs text-ink/60">Tersimpan ✓ — cek situsnya</span> : null}
        {error ? <span className="text-xs text-coral">{error}</span> : null}
      </div>
    </div>
  );
}
