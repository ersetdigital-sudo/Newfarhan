"use client";

import { useState } from "react";
import Link from "next/link";

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/75 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-[15px] font-extrabold tracking-tight">
            Farhan Raka<span className="text-coral">.K</span>
          </Link>
          <ul className="hidden items-center gap-1 rounded-full border border-ink/10 bg-chalk px-2 py-1.5 text-[13px] shadow-[0_1px_2px_rgba(20,19,26,.04)] md:flex">
            <li><a href="#home" className="rounded-full px-4 py-1.5 transition-colors hover:bg-ink/5">Home</a></li>
            <li><a href="#portfolio" className="rounded-full px-4 py-1.5 transition-colors hover:bg-ink/5">Portfolio</a></li>
            <li><a href="#about" className="rounded-full px-4 py-1.5 transition-colors hover:bg-ink/5">About</a></li>
            <li><a href="#contact" className="rounded-full px-4 py-1.5 transition-colors hover:bg-ink/5">Contact</a></li>
          </ul>
          <a href="#contact" className="hidden rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-coral md:inline-flex">
            Start a Project
          </a>

          <button
            id="menu-btn"
            aria-label="Buka menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/12 bg-chalk md:hidden"
          >
            <span className="relative block h-[14px] w-[18px]">
              <span className="mb-line absolute left-0 top-0 block h-[2px] w-full rounded-full bg-ink transition-transform duration-300" />
              <span className="mb-line absolute left-0 top-[6px] block h-[2px] w-full rounded-full bg-ink transition-opacity duration-200" />
              <span className="mb-line absolute left-0 top-[12px] block h-[2px] w-full rounded-full bg-ink transition-transform duration-300" />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        /* `pointer-events-none` dipilih lewat kondisi yang sama dengan
           `pointer-events-auto` — kalau ditulis sebagai class statis, dia
           selalu menang (urutannya lebih belakang di CSS build) dan seluruh
           isi menu jadi nggak bisa diklik. */
        className={`fixed inset-0 z-[80] transition-opacity duration-300 md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          id="menu-backdrop"
          className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <nav className="absolute left-4 right-4 top-4 origin-top rounded-[1.75rem] border border-ink/10 bg-paper p-6 shadow-[0_24px_60px_rgba(20,19,26,.18)]">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-[15px] font-extrabold tracking-tight">
              Farhan Raka<span className="text-coral">.K</span>
            </span>
            <button
              id="menu-close"
              aria-label="Tutup menu"
              onClick={() => setMenuOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/12 bg-chalk"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <ul className="space-y-1 font-display text-2xl font-bold tracking-[-0.02em]">
            <li><a data-menu-link="" href="#home" onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-ink/8 py-3">Home</a></li>
            <li><a data-menu-link="" href="#portfolio" onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-ink/8 py-3">Portfolio</a></li>
            <li><a data-menu-link="" href="#about" onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-ink/8 py-3">About</a></li>
            <li><a data-menu-link="" href="#contact" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3">Contact</a></li>
          </ul>
          <a data-menu-link="" href="#contact" onClick={() => setMenuOpen(false)} className="mt-6 flex items-center justify-center rounded-full bg-ink px-5 py-3.5 text-[14px] font-medium text-paper">
            Mulai Project
          </a>
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-ink/40">Indonesia · Available for work</p>
        </nav>
      </div>
    </>
  );
}
