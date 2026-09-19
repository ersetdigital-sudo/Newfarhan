"use client";

import { useEffect } from "react";

export function ProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("bar");
    if (!bar) return;

    const handleScroll = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      bar.style.width = `${p * 100}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <div id="bar" />;
}
