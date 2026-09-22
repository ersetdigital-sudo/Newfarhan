"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Spasi/enter yang kebawa waktu paste dibuang di sini, biar yang dikirim
  // ke server cuma karakter aslinya.
  const cleaned = password.trim();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: cleaned }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Login gagal.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login gagal.");
      setBusy(false);
      // Biar gampang ngetik ulang tanpa harus hapus manual.
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-[2rem] border border-ink/10 bg-chalk p-8 shadow-[0_24px_60px_rgba(20,19,26,.08)]"
    >
      <p className="font-display text-xs tracking-[0.3em] text-ink/40">ADMIN</p>
      <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">Masuk Panel</h1>
      <p className="mt-2 text-sm text-ink/55">Kelola foto portofolio Farhan Raka.K.</p>

      <label className="mt-7 block text-xs font-medium text-ink/60" htmlFor="password">
        Password
      </label>

      <div className="relative mt-2">
        <input
          ref={inputRef}
          id="password"
          type={show ? "text" : "password"}
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          // new-password bikin browser nggak nyodori password lama yang tersimpan.
          autoComplete="new-password"
          className="input py-3 pr-20"
        />
        <button
          type="button"
          onClick={() => setShow((value) => !value)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-[11px] font-medium text-ink/50 transition-colors hover:text-coral"
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        >
          {show ? "Sembunyi" : "Lihat"}
        </button>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-ink/40">
        Klik <strong className="text-ink/60">Lihat</strong> buat memastikan nggak ada spasi atau
        enter yang kebawa saat paste.
      </p>

      {error ? <p className="mt-3 text-xs text-coral">{error}</p> : null}

      <button
        type="submit"
        disabled={busy || cleaned.length === 0}
        className="mt-5 w-full rounded-full bg-ink px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-coral disabled:opacity-50"
      >
        {busy ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
