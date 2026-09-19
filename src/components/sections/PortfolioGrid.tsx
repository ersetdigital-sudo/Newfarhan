"use client";

import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { portfolioItems, filterCategories } from "@/data/portfolio";

interface PortfolioGridProps {
  onQuickView: (item: typeof portfolioItems[0]) => void;
}

export function PortfolioGrid({ onQuickView }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState(portfolioItems);
  const ref = useScrollReveal();

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter((item) => item.category === activeFilter));
    }
  }, [activeFilter]);

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-6 pt-12">
        <p ref={ref} className="reveal mt-24 mb-4 font-display text-xs tracking-[0.3em] text-ink/40">SELECTED WORKS</p>
        <div className="reveal flex flex-wrap gap-2.5" id="filters">
          {filterCategories.map((cat) => (
            <button
              key={cat.key}
              data-filter={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`filter-btn rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors ${
                activeFilter === cat.key
                  ? "bg-coral text-white"
                  : "border border-ink/12 bg-chalk hover:border-coral hover:text-coral"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-12">
        <div id="grid" className="masonry columns-1 sm:columns-2 lg:columns-3">
          {filteredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} onQuickView={onQuickView} />
          ))}
        </div>
      </section>
    </>
  );
}

function PortfolioCard({
  item,
  onQuickView,
}: {
  item: typeof portfolioItems[0];
  onQuickView: (item: typeof portfolioItems[0]) => void;
}) {
  const revealRef = useScrollReveal();

  const categoryColors: Record<string, string> = {
    apparel: "#FF5A45",
    poster: "#E8A33D",
    logo: "#8FBF8F",
    branding: "#9DBE9D",
    social: "#E8A33D",
  };

  const bgColors: Record<string, string> = {
    apparel: "#FF5A45",
    poster: "#E8A33D",
    logo: "#2E5E3A",
    branding: "#C96A4B",
    social: "#E8A33D",
  };

  return (
    <a
      role="button"
      tabIndex={0}
      data-quick=""
      data-desc={item.quickView.description}
      data-cat={item.category}
      data-card=""
      data-tilt=""
      className="reveal tilt group relative block overflow-hidden rounded-[1.75rem] border border-ink/8 bg-chalk"
      onClick={(e) => {
        e.preventDefault();
        onQuickView(item);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onQuickView(item);
      }}
    >
      <div className="h-[420px] w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
        />
      </div>
      <div
        className="shine absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(to top, rgba(20,19,26,.9), rgba(20,19,26,.1) 55%, transparent)" }}
      />
      <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: categoryColors[item.category] || "#FF5A45" }}>
              {item.description}
            </p>
            <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white">{item.title}</h3>
          </div>
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white"
            style={{ background: bgColors[item.category] || "#FF5A45" }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
