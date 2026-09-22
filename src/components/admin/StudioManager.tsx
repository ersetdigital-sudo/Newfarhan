"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteImage } from "@/lib/portfolio";
import { STUDIO_GROUPS, type SettingsMap } from "@/lib/site-settings";
import { GRID_SPEC, slotSpec } from "@/lib/site-slots";
import { ImageUploader } from "./ImageUploader";
import { SettingInput } from "./SettingInput";

interface StudioManagerProps {
  slots: Record<string, SiteImage>;
  settings: SettingsMap;
}

/**
 * Tab "Beranda & Project".
 *
 * Tiap bagian halaman (Featured Work, hero project, Case Study) jadi satu kartu
 * yang isinya FOTO + TEKSNYA sekaligus — jadi nggak perlu pindah tab waktu mau
 * ganti gambar dan kata-katanya. Urutannya mengikuti urutan halaman.
 *
 * Foto langsung tersimpan begitu di-upload (sama seperti sebelumnya). Teks
 * disimpan lewat satu tombol di bawah, biar salah ketik bisa dibatalkan dulu.
 */
export function StudioManager({ slots, settings }: StudioManagerProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<SettingsMap>(settings);
  const [localSlots, setLocalSlots] = useState(slots);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: string, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function savePhoto(slot: string, url: string) {
    const response = await fetch(`/api/admin/slots/${encodeURIComponent(slot)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: url }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error || "Foto ter-upload tapi gagal disimpan.");
    }

    setLocalSlots((prev) => ({
      ...prev,
      [slot]: { slot, image_url: url, label: "", alt: "", aspect: "" },
    }));
    router.refresh();
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
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-mustard/40 bg-mustard/10 px-5 py-4">
        <p className="text-xs leading-relaxed text-ink/70">
          <strong className="text-ink">Foto dan teks tiap bagian ada di satu kartu.</strong> Fotonya
          tersimpan otomatis begitu selesai di-upload; teksnya disimpan setelah menekan{" "}
          <em>Simpan perubahan</em> di bawah. Semua kotak foto sudah dikunci rasionya — foto apa pun
          yang dipasang, bentuk layout-nya nggak berubah.
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl border border-coral/30 bg-coral/5 px-4 py-3 text-xs text-coral">
          {error}
        </p>
      ) : null}

      {STUDIO_GROUPS.map((group) => {
        const groupSlots = group.slots ?? [];
        const many = groupSlots.length > 1;

        return (
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

            {groupSlots.length > 0 ? (
              many ? (
                <>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {groupSlots.map((slot) => (
                      <PhotoSlot
                        key={slot}
                        slot={slot}
                        image={localSlots[slot]}
                        onUploaded={savePhoto}
                      />
                    ))}
                  </div>
                  {group.fields.length > 0 ? (
                    <div className="mt-6 grid gap-5 border-t border-ink/10 pt-5 sm:grid-cols-2">
                      {group.fields.map((field) => (
                        <SettingInput
                          key={field.key}
                          field={field}
                          value={draft[field.key] ?? ""}
                          onChange={update}
                        />
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="mt-5 grid gap-6 sm:grid-cols-[200px_1fr]">
                  <div className="mx-auto w-full max-w-[220px] sm:mx-0 sm:max-w-none">
                    <PhotoSlot
                      slot={groupSlots[0]}
                      image={localSlots[groupSlots[0]]}
                      onUploaded={savePhoto}
                    />
                  </div>
                  <div className="grid content-start gap-5 sm:grid-cols-2">
                    {group.fields.map((field) => (
                      <SettingInput
                        key={field.key}
                        field={field}
                        value={draft[field.key] ?? ""}
                        onChange={update}
                      />
                    ))}
                  </div>
                </div>
              )
            ) : (
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
            )}
          </section>
        );
      })}

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
        <span className="text-[11px] text-ink/40">
          Foto tersimpan sendiri, nggak perlu ikut tombol ini.
        </span>
      </div>
    </div>
  );
}

function PhotoSlot({
  slot,
  image,
  onUploaded,
}: {
  slot: string;
  image?: SiteImage;
  onUploaded: (slot: string, url: string) => Promise<void>;
}) {
  const spec = slotSpec(slot);

  return (
    <div>
      <ImageUploader
        currentUrl={image?.image_url || spec?.fallback || ""}
        aspect={spec?.aspect || GRID_SPEC.aspect}
        folder="slots"
        buttonLabel="Ganti foto"
        onUploaded={(url) => onUploaded(slot, url)}
      />
      <p className="mt-2 text-[11px] leading-snug text-ink/45">
        <span className="font-medium text-ink/60">{spec?.title ?? slot}</span>
        {spec ? ` · ${spec.aspect} · ${spec.width}×${spec.height}px` : null}
      </p>
    </div>
  );
}
