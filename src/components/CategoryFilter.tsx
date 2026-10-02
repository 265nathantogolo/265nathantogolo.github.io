import { useLayoutEffect, useRef } from "react";
import { categories, type CategoryId } from "@/data/categories";
import { LiquidGlassLayers } from "./ui/liquid-glass-button";

type Props = {
  value: CategoryId | null;
  onChange: (value: CategoryId | null) => void;
  counts: Record<CategoryId, number>;
  total: number;
};

/**
 * Dock de filtres flottant en Liquid Glass, au-dessus des projets.
 * Une pastille d'encre glisse vers le filtre actif.
 */
export function CategoryFilter({ value, onChange, counts, total }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const place = () => {
      const scroller = scrollRef.current;
      const thumb = thumbRef.current;
      const btn = scroller?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (!scroller || !thumb || !btn) return;
      thumb.style.width = `${btn.offsetWidth}px`;
      thumb.style.transform = `translateX(${btn.offsetLeft}px)`;
      const target = btn.offsetLeft - (scroller.clientWidth - btn.offsetWidth) / 2;
      scroller.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    };
    place();
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [value]);

  return (
    <div className="filter-dock">
      <LiquidGlassLayers />
      <div className="filter-dock__scroll" ref={scrollRef} role="group" aria-label="Filtrer les projets par compétence">
        <span className="filter-dock__thumb" ref={thumbRef} aria-hidden="true" />
        <button type="button" className="chip" aria-pressed={value === null} onClick={() => onChange(null)}>
          Tout <sup>{total}</sup>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className="chip"
            aria-pressed={value === c.id}
            onClick={() => onChange(c.id)}
            title={c.label}
          >
            {c.short} <sup>{counts[c.id]}</sup>
          </button>
        ))}
      </div>
    </div>
  );
}
