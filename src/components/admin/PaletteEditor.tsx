"use client";

import { useState, type FormEvent } from "react";
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
 * Editor palet warna. Tiga cara pakai, semuanya jalan bersamaan:
 *
 * 1. **Color picker** — klik kotak warnanya, pilih warna (nggak perlu tahu kode).
 * 2. **Tempel kode** — kolom hex di tiap baris bisa ditempel langsung
 *    (`#FF5A45`, `FF5A45`, atau `FF5`), otomatis dirapikan jadi huruf besar.
 * 3. **Tempel massal** — kolom di bawah: tempel beberapa kode sekaligus
 *    (dipisah spasi, koma, atau baris baru), langsung jadi beberapa baris.
 *
 * Datanya tetap disimpan dengan format lama ("#FF5A45 Nama" per baris), jadi
 * situs nggak perlu tahu apa-apa soal UI ini.
 */
export function PaletteEditor({ value, onChange }: PaletteEditorProps) {
  const rows: Row[] = parseRows(value);

  /** Teks mentah yang sedang diketik di kolom hex — biar kursor nggak lompat. */
  const [typing, setTyping] = useState<{ index: number; text: string } | null>(null);
  const [tempel, setTempel] = useState("");
  const [pesan, setPesan] = useState<string | null>(null);

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
    setTyping(null);
    commit(rows.filter((_, i) => i !== index));
  }

  function add(hex = "#FF5A45", name = "") {
    commit([...rows, { hex, name }]);
  }

  /**
   * Tempel beberapa kode sekaligus, dipisah spasi / koma / baris baru.
   * Kalau ada teks yang bukan kode, teks itu jadi nama warna di belakangnya —
   * jadi menempel "#FF5A45 Coral" sekaligus namanya langsung kebaca.
   */
  function tempelBanyak(event: FormEvent) {
    event.preventDefault();
    const potongan = tempel.split(/[\s,;]+/).filter(Boolean);
    const sudahAda = new Set(rows.map((row) => row.hex.toUpperCase()));

    const baru: Row[] = [];
    let ditolak = 0;
    let dobel = 0;

    for (const potonganKode of potongan) {
      // Di kolom tempel massal kodenya WAJIB 6 digit. Kalau 3 digit ikut
      // diterima, nama kayak "Amber" (a-b-e semuanya heksa) kebaca jadi kode
      // #AABBEE. Singkatan 3 digit tetap bisa di kolom kode per baris, karena
      // di sana konteksnya jelas.
      const hex = normalizeHex6(potonganKode);

      if (!hex) {
        // Bukan kode: anggap nama warna terakhir — asal belum punya nama.
        const terakhir = baru[baru.length - 1];
        if (terakhir && !terakhir.name) {
          terakhir.name = potonganKode.replace(/[,;:-]+$/, "");
        } else {
          ditolak += 1;
        }
        continue;
      }

      if (sudahAda.has(hex)) {
        dobel += 1;
        continue;
      }
      sudahAda.add(hex);
      baru.push({ hex, name: "" });
    }

    if (baru.length > 0) commit([...rows, ...baru]);

    const catatan = [
      baru.length > 0 ? `${baru.length} warna ditambahkan` : "nggak ada warna baru",
      dobel > 0 ? `${dobel} sudah ada di daftar` : null,
      ditolak > 0 ? `${ditolak} kode nggak valid` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    setPesan(catatan);
    if (baru.length > 0) setTempel("");
  }

  const dipakai = new Set(rows.map((row) => row.hex.toUpperCase()));

  return (
    <div className="mt-2 rounded-xl border border-ink/12 bg-paper p-3">
      <p className="text-[11px] leading-snug text-ink/50">
        Pilih warnanya lewat color picker, <strong className="text-ink/70">atau tempel kodenya</strong>{" "}
        (mis. <code>#FF5A45</code>) di kolom kode. Nama warna opsional — cuma muncul sebagai keterangan
        saat kursor diarahkan ke kotak warnanya di situs.
      </p>

      <div className="mt-3 space-y-2">
        {rows.map((row, index) => {
          const sedangKetik = typing?.index === index ? typing.text : null;
          const teksKode = sedangKetik ?? row.hex;
          const kodeValid = sedangKetik === null || normalizeHex(sedangKetik) !== null;

          return (
            <div key={`${row.hex}-${index}`} className="flex flex-wrap items-center gap-2">
              <input
                type="color"
                value={row.hex}
                onChange={(event) => {
                  setTyping(null);
                  update(index, { hex: event.target.value.toUpperCase() });
                }}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-ink/12 bg-chalk p-1"
                aria-label={`Warna ${index + 1}`}
              />

              <input
                value={teksKode}
                onChange={(event) => {
                  const text = event.target.value;
                  setTyping({ index, text });
                  setPesan(null);
                  const hex = normalizeHex(text);
                  // Baru disimpan kalau kodenya udah utuh, biar nggak nyimpen ketikan setengah jalan.
                  if (hex && hex !== row.hex) update(index, { hex });
                }}
                onBlur={() => setTyping(null)}
                spellCheck={false}
                placeholder="#FF5A45"
                aria-label={`Kode warna ${index + 1}`}
                className={`w-24 shrink-0 rounded-lg border bg-chalk px-2.5 py-2 font-mono text-[11px] uppercase outline-none transition-colors ${
                  kodeValid ? "border-ink/12 focus:border-coral" : "border-coral text-coral"
                }`}
              />

              <input
                value={row.name}
                onChange={(event) => update(index, { name: event.target.value })}
                placeholder="Nama warna (opsional)"
                className="min-w-[120px] flex-1 rounded-lg border border-ink/12 bg-chalk px-3 py-2 text-xs outline-none transition-colors focus:border-coral"
              />

              <div className="flex shrink-0 gap-1">
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

              {!kodeValid ? (
                <span className="w-full text-[10px] text-coral">
                  Kode warna harus 3 atau 6 karakter heksa, mis. #FF5A45.
                </span>
              ) : null}
            </div>
          );
        })}

        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ink/15 px-3 py-4 text-center text-[11px] text-ink/45">
            Belum ada warna. Klik “Tambah warna”, atau tempel kodenya di bawah.
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

      {/* Tempel banyak kode sekaligus */}
      <form onSubmit={tempelBanyak} className="mt-3 border-t border-ink/10 pt-3">
        <label className="block">
          <span className="block text-[11px] font-medium text-ink/60">
            Tempel kode warna (bisa beberapa sekaligus)
          </span>
          <span className="mt-0.5 block text-[10px] leading-snug text-ink/45">
            Pakai kode lengkap 6 karakter, dipisah spasi / koma / baris baru. Namanya boleh ikut
            ditulis di belakang kodenya. Contoh: <code>#FF5A45 Coral, #E8A33D Amber</code>
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              value={tempel}
              onChange={(event) => {
                setTempel(event.target.value);
                setPesan(null);
              }}
              placeholder="#FF5A45, #3F3D9E"
              spellCheck={false}
              className="min-w-[180px] flex-1 rounded-lg border border-ink/12 bg-chalk px-3 py-2 font-mono text-[11px] outline-none transition-colors focus:border-coral"
            />
            <button
              type="submit"
              disabled={!tempel.trim()}
              className="shrink-0 rounded-full bg-ink px-4 py-2 text-[11px] font-medium text-paper transition-colors hover:bg-coral disabled:opacity-40"
            >
              Tambahkan
            </button>
          </div>
        </label>
        {pesan ? <p className="mt-2 text-[10px] text-ink/55">{pesan}</p> : null}
      </form>

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
 * Rapikan kode warna jadi "#RRGGBB" huruf besar. Terima "FF5A45", "#ff5a45",
 * "#F5A" (singkatan 3 karakter), dan spasi di sekelilingnya.
 * Balikin null kalau bukan kode heksa yang sah.
 */
/** Sama seperti normalizeHex, tapi hanya menerima kode lengkap 6 digit. */
function normalizeHex6(raw: string): string | null {
  const bersih = raw.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(bersih)) return null;
  return `#${bersih.toUpperCase()}`;
}

function normalizeHex(raw: string): string | null {
  const bersih = raw.trim().replace(/^#/, "").replace(/[^0-9a-fA-F]/g, "");
  if (bersih.length === 3) {
    return `#${bersih
      .split("")
      .map((c) => c + c)
      .join("")
      .toUpperCase()}`;
  }
  if (bersih.length === 6) return `#${bersih.toUpperCase()}`;
  return null;
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
