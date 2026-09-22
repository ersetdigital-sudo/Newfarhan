"use client";

import { useEffect } from "react";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { ProjectNavigation } from "@/components/nav/ProjectNavigation";
import { ProgressBar } from "@/components/project/ProgressBar";
import { ProjectHero } from "@/components/project/ProjectHero";
import { CoverImage } from "@/components/project/CoverImage";
import { CaseStudy } from "@/components/project/CaseStudy";
import { Gallery } from "@/components/project/Gallery";
import { NextProjectCTA } from "@/components/project/NextProjectCTA";
import { ProjectFooter } from "@/components/project/ProjectFooter";
import type { SiteImage } from "@/lib/portfolio";
import type { SettingsMap } from "@/lib/site-settings";
import { slotSpec } from "@/lib/site-slots";

interface ProjectViewProps {
  slots: Record<string, SiteImage>;
  settings: SettingsMap;
}

export function ProjectView({ slots, settings }: ProjectViewProps) {
  useEffect(() => {
    const init = async () => {
      try {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default || gsapModule.gsap;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        gsap.registerPlugin(ScrollTrigger);
        document.documentElement.classList.add("js-on");

        // Reveal animations
        document.querySelectorAll(".reveal").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 44, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

        // Fallback
        setTimeout(() => {
          gsap.set(".reveal", { opacity: 1, y: 0, clearProps: "transform" });
        }, 2200);

        // Parallax
        document.querySelectorAll("[data-parallax]").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: (img as HTMLElement).parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });

        // Counter animations
        document.querySelectorAll(".counter").forEach((el) => {
          const obj = { v: 0 };
          const to = Number((el as HTMLElement).dataset.to) || 0;
          gsap.to(obj, {
            v: to,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
            },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
          });
        });

        // Fallback counters
        setTimeout(() => {
          document.querySelectorAll(".counter").forEach((el) => {
            if (el.textContent === "0") {
              el.textContent = (el as HTMLElement).dataset.to || "0";
            }
          });
        }, 2600);
      } catch {
        // GSAP not available
      }
    };

    init();
  }, []);

  const cover = slots.project_cover;
  const coverSpec = slotSpec("project_cover");

  return (
    <>
      <CustomCursor />
      <ProjectNavigation />
      <ProgressBar />

      <main>
        <ProjectHero settings={settings} />
        <CoverImage
          src={cover?.image_url || coverSpec?.fallback || ""}
          alt={cover?.alt || coverSpec?.alt}
        />
        <CaseStudy settings={settings} />
        <Gallery slots={slots} settings={settings} />
        <NextProjectCTA />
      </main>

      <ProjectFooter />
    </>
  );
}
