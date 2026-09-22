"use client";

import { BRAND_SWATCHES } from "@/lib/site-settings";

interface PaletteEditorProps {
  /** Nilai mentah dari database: "#FF5A45 Coral" per baris. */
  value: string;
  /** Terima string dengan format yang sama, biar datanya nggak berubah bentuk. */
  onChange: (next: string) => void;
}

interface Row {
  hex: string;
  name: string;
}

/**
 * Editor palet warna pakai color picker bawaan browser.
 *
 * Datanya tetap disimpan dengan format lama ("#FF5A45 Nama" per baris), jadi
 * situs nggak perlu tahu apa-apa soal UI ini — admin cuma nggak perlu lagi
 * mencari kode heksanya sendiri.
 *
 * Sengaja stateless: baris diturunkan langsung dari `value` setiap render, jadi
 * nggak ada state lokal yang bisa beda dengan yang tersimpan.
 */
export function PaletteEditor({ value, onChange }: PaletteEditorProps) {
  const rows: Row[] = parseRows(value);

  function commit(next: Row[]) {
    onChange(
      next
        .map((row) => `${row.hex}${row.name ? ` ${row.name}` : ""}`)
        .join("\n")
    );
  }

  function update(index: number, patch: Partial<Row>) {
    commit(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  }

  function remove(index: number) {
    commit(rows.filter((_, i) => i !== index));
  }

  function add(hex = "#FF5A45", name = "") {
    commit([...rows, { hex, name }]);
  }

  const dipakai = new Set(rows.map((row) => row.hex.toUpperCase()));

  return (
    <div className="mt-2 rounded-xl border border-ink/12 bg-paper p-3">
      <p className="text-[11px] text-ink/50">
        Klik kotak warnanya untuk memilih warna — nggak perlu tahu kodenya. Nama warna opsional,
        cuma muncul sebagai keterangan saat kursor diarahkan ke kotak warnanya di situs.
      </p>

      <div className="mt-3 space-y-2">
        {rows.map((row, index) => (
          <div key={`${row.hex}-${index}`} className="flex items-center gap-2">
            <input
              type="color"
              value={row.hex}
              onChange={(event) => update(index, { hex: event.target.value.toUpperCase() })}
              className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-ink/12 bg-chalk p-1"
              aria-label={`Warna ${index + 1}`}
            />
            <code className="hidden w-16 shrink-0 text-[11px] text-ink/45 sm:block">{row.hex}</code>
            <input
              value={row.name}
              onChange={(event) => update(index, { name: event.target.value })}
              placeholder="Nama warna (opsional)"
              className="min-w-0 flex-1 rounded-lg border border-ink/12 bg-chalk px-3 py-2 text-xs outline-none transition-colors focus:border-coral"
            />
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="rounded-lg border border-ink/12 px-2 py-1.5 text-[11px] disabled:opacity-30"
              title="Naikkan"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === rows.length - 1}
              className="rounded-lg border border-ink/12 px-2 py-1.5 text-[11px] disabled:opacity-30"
              title="Turunkan"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-lg border border-coral/40 px-2 py-1.5 text-[11px] text-coral"
              title="Hapus warna"
            >
              ✕
            </button>
          </div>
        ))}

        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ink/15 px-3 py-4 text-center text-[11px] text-ink/45">
            Belum ada warna. Klik “Tambah warna” di bawah.
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => add()}
          className="rounded-full border border-ink/15 px-4 py-2 text-[11px] font-medium transition-colors hover:border-coral hover:text-coral"
        >
          + Tambah warna
        </button>
        <span className="text-[11px] text-ink/40">{rows.length} warna</span>
      </div>

      <div className="mt-3 border-t border-ink/10 pt-3">
        <p className="text-[11px] text-ink/50">Ambil cepat dari warna yang sudah dipakai situs:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BRAND_SWATCHES.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              title={`${swatch.name} — ${swatch.hex}`}
              onClick={() => add(swatch.hex, swatch.name)}
              disabled={dipakai.has(swatch.hex)}
              className="flex items-center gap-1.5 rounded-full border border-ink/12 py-1 pl-1 pr-2.5 text-[10px] transition-colors hover:border-coral disabled:opacity-35"
            >
              <span
                className="h-4 w-4 rounded-full border border-ink/10"
                style={{ background: swatch.hex }}
              />
              {swatch.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Baca nilai jadi baris warna. Baris yang kodenya nggak valid tetap
 * ditampilkan (dengan kode default) supaya teksnya nggak hilang diam-diam
 * waktu admin menyimpan.
 */
function parseRows(value: string): Row[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/);
      if (!match) return { hex: "#FF5A45", name: line };
      return { hex: match[0].toUpperCase(), name: line.replace(match[0], "").trim() };
    });
}
