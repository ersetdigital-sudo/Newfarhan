"use client";

import { settingItemCount, type SettingField } from "@/lib/site-settings";
import { PaletteEditor } from "./PaletteEditor";

interface SettingInputProps {
  field: SettingField;
  value: string;
  onChange: (key: string, value: string) => void;
}

/**
 * Satu field teks di panel admin. Dipakai bareng oleh tab "Teks & Kontak" dan
 * "Beranda & Project" biar tampilan & perilakunya persis sama.
 */
export function SettingInput({ field, value, onChange }: SettingInputProps) {
  // Dihitung dari nilai yang sedang diketik (bukan yang tersimpan), jadi
  // admin langsung lihat hasilnya sebelum menekan simpan.
  const info = settingItemCount({ [field.key]: value }, field);

  return (
    <label className={field.multiline || field.widget ? "sm:col-span-2" : undefined}>
      <span className="block font-display text-[13px] font-semibold">{field.label}</span>
      {field.hint ? (
        <span className="mt-0.5 block text-[11px] leading-snug text-ink/45">{field.hint}</span>
      ) : null}

      {field.widget === "palette" ? (
        <PaletteEditor value={value} onChange={(next) => onChange(field.key, next)} />
      ) : field.multiline ? (
        <textarea
          rows={field.list ? 6 : 3}
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
          className="mt-2 w-full resize-y rounded-xl border border-ink/12 bg-paper px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-coral"
        />
      ) : (
        <input
          type={field.type === "email" ? "email" : field.type === "number" ? "number" : "text"}
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
          className="mt-2 w-full rounded-xl border border-ink/12 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-coral"
        />
      )}

      {info ? (
        <span className="mt-1.5 block text-[11px] text-ink/40">
          Terbaca {info.count} {info.unit}
          {info.skipped > 0 ? (
            <span className="text-coral">
              {" "}
              · {info.skipped} baris kelewat (kode warnanya nggak valid)
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
