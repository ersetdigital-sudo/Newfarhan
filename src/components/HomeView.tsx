"use client";

import { useState, useEffect } from "react";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Navigation } from "@/components/nav/Navigation";
import { QuickViewModal } from "@/components/modal/QuickViewModal";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { cloudinaryImage } from "@/lib/cloudinary";
import type { PortfolioItem, SiteImage } from "@/lib/portfolio";
import { GRID_SPEC } from "@/lib/site-slots";

interface HomeViewProps {
  items: PortfolioItem[];
  slots: Record<string, SiteImage>;
}

export function HomeView({ items, slots }: HomeViewProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const handleQuickView = (item: PortfolioItem) => {
    setSelectedItem(item);
    setQuickViewOpen(true);
  };

  // Init GSAP animations
  useEffect(() => {
    const init = async () => {
      try {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default || gsapModule.gsap;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        gsap.registerPlugin(ScrollTrigger);
        document.documentElement.classList.add("js-on");

        // Reveal animations for elements not handled by hooks
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

        // Fallback: ensure all reveals visible after 2.2s
        setTimeout(() => {
          gsap.set(".reveal", { opacity: 1, y: 0, clearProps: "transform" });
        }, 2200);

        // Parallax for data-parallax images
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

        // Marquee scrub
        gsap.to(".marquee-track", {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".marquee-track",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        // Tilt effect
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (fine) {
          document.querySelectorAll("[data-tilt]").forEach((card) => {
            card.addEventListener("mousemove", ((e: MouseEvent) => {
              const r = (card as HTMLElement).getBoundingClientRect();
              gsap.to(card, {
                rotationX: ((e.clientY - r.top) / r.height - 0.5) * -6,
                rotationY: ((e.clientX - r.left) / r.width - 0.5) * 6,
                transformPerspective: 900,
                duration: 0.4,
                ease: "power2.out",
              });
            }) as EventListener);
            card.addEventListener("mouseleave", () => {
              gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power3.out" });
            });
          });

          // Magnetic hover
          document.querySelectorAll("[data-magnetic]").forEach((el) => {
            el.addEventListener("mousemove", ((e: MouseEvent) => {
              const r = (el as HTMLElement).getBoundingClientRect();
              gsap.to(el, {
                x: (e.clientX - (r.left + r.width / 2)) * 0.22,
                y: (e.clientY - (r.top + r.height / 2)) * 0.28,
                duration: 0.35,
              });
            }) as EventListener);
            el.addEventListener("mouseleave", () => {
              gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,.4)" });
            });
          });
        }
      } catch {
        // GSAP not available
      }
    };

    init();
  }, []);

  return (
    <>
      <CustomCursor />
      <Navigation />

      <main>
        <Hero />
        <Services />
        <FeaturedWork slots={slots} />
        <PortfolioGrid items={items} onQuickView={handleQuickView} />
        <Process />
        <Testimonials />
        <About profileUrl={slots.profile?.image_url} profileAlt={slots.profile?.alt} />
        <ContactFooter />
      </main>

      <QuickViewModal
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        image={
          selectedItem
            ? cloudinaryImage(selectedItem.image, GRID_SPEC.width, GRID_SPEC.height)
            : ""
        }
        category={selectedItem?.description || ""}
        title={selectedItem?.title || ""}
        description={selectedItem?.quickView?.description || ""}
      />
    </>
  );
}
