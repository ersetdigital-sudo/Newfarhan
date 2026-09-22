"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
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
      <input
        id="password"
        type="password"
        autoFocus
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="••••••••"
        className="input mt-2 py-3"
      />

      {error ? <p className="mt-3 text-xs text-coral">{error}</p> : null}

      <button
        type="submit"
        disabled={busy || password.length === 0}
        className="mt-5 w-full rounded-full bg-ink px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-coral disabled:opacity-50"
      >
        {busy ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
