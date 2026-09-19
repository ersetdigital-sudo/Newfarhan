"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function CoverImage() {
  const ref = useScrollReveal();

  return (
    <section className="mx-auto max-w-[1200px] px-6">
      <div
        ref={ref}
        className="reveal relative h-[320px] overflow-hidden rounded-[2rem] border border-ink/8 md:h-[560px]"
        style={{ background: "#F7F1E7" }}
      >
        <img
          data-zoom=""
          src="/images/269ea28f-c1ae-4aaf-9557-277451504028.png"
          alt="ARVA — brand identity &amp; guidelines board"
          className="h-full w-full object-contain object-top"
        />
      </div>
    </section>
  );
}
