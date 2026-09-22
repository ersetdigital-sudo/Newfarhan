"use client";

import Link from "next/link";

export function ProjectNavigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-[15px] font-extrabold tracking-tight"
        >
          Farhan Raka<span className="text-coral">.K</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/12 bg-chalk px-4 py-2.5 text-[12px] transition-colors hover:border-coral hover:text-coral md:px-5 md:text-[13px]"
        >
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 12H5M11 18l-6-6 6-6"></path>
          </svg>{" "}
          Semua Karya
        </Link>

        <Link
          href="/#contact"
          className="whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-[12px] font-medium text-paper transition-colors hover:bg-coral md:px-5 md:text-[13px]"
        >
          Start a Project
        </Link>
      </nav>
    </header>
  );
}
