import { useEffect, useRef, useState, type FocusEvent } from "react";
import { categoryById } from "@/data/categories";
import { coverOf, type Project } from "@/data/projects";
import { finePointer, prefersReducedMotion } from "@/lib/motion";
import { Link, paths } from "@/lib/router";
import { cn } from "@/lib/utils";
import { Img } from "./primitives";

/**
 * Vue « index » : une ligne par projet, en très grand.
 * Au survol (ou au focus clavier), la couverture flotte à côté du pointeur.
 * Sur écran tactile, une vignette est intégrée à chaque ligne.
 */
export function ProjectList({ items }: { items: Project[] }) {
  const [active, setActive] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, cx: 0, cy: 0, raf: 0 });

  useEffect(() => {
    if (!finePointer()) return;
    const p = pos.current;
    const reduce = prefersReducedMotion();
    const tick = () => {
      const k = reduce ? 1 : 0.14;
      p.cx += (p.x - p.cx) * k;
      p.cy += (p.y - p.cy) * k;
      if (previewRef.current) previewRef.current.style.transform = `translate3d(${p.cx}px, ${p.cy}px, 0)`;
      p.raf = Math.abs(p.x - p.cx) + Math.abs(p.y - p.cy) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      p.x = e.clientX;
      p.y = e.clientY;
      if (!p.raf) p.raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(p.raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  const onFocus = (slug: string) => (e: FocusEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const p = pos.current;
    p.x = p.cx = r.right - r.width * 0.28;
    p.y = p.cy = r.top + r.height / 2;
    if (previewRef.current) previewRef.current.style.transform = `translate3d(${p.cx}px, ${p.cy}px, 0)`;
    setActive(slug);
  };

  return (
    <div className="plist-wrap page-pad" onPointerLeave={() => setActive(null)}>
      <ol className={cn("plist", active && "has-active")}>
        {items.map((p) => (
          <li key={p.slug} className="plist__item" data-reveal="" style={{ ["--vt" as string]: `card-${p.slug}` }}>
            <Link
              to={paths.project(p.slug)}
              className={cn("plist__link", active === p.slug && "is-active")}
              navOptions={{ kind: "project" }}
              onPointerEnter={(e) => {
                const pt = pos.current;
                pt.x = e.clientX;
                pt.y = e.clientY;
                if (!active) {
                  // première apparition : pas de glissement depuis l'ancienne position
                  pt.cx = pt.x;
                  pt.cy = pt.y;
                  if (previewRef.current) previewRef.current.style.transform = `translate3d(${pt.cx}px, ${pt.cy}px, 0)`;
                }
                setActive(p.slug);
              }}
              onFocus={onFocus(p.slug)}
              onBlur={() => setActive(null)}
            >
              <span className="plist__num">{p.number}</span>
              <span className="plist__title">{p.title}</span>
              <span className="plist__cats">{p.categories.map((c) => categoryById[c].short).join(" · ")}</span>
              <span className="plist__count">{p.images.length} visuels</span>
              <span className="plist__thumb" aria-hidden="true">
                <Img image={coverOf(p)} alt="" sizes="30vw" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div ref={previewRef} className={cn("plist-preview", active && "is-visible")} aria-hidden="true">
        {items.map((p) => {
          const c = coverOf(p);
          return (
            <div
              key={p.slug}
              className={cn("plist-preview__frame", active === p.slug && "is-active")}
              style={{ aspectRatio: `${c.width} / ${c.height}`, backgroundColor: c.color }}
            >
              <Img image={c} alt="" sizes="26vw" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
