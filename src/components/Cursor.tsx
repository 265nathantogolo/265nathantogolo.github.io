import { useEffect, useRef } from "react";
import { finePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Curseur contextuel : invisible par défaut (le curseur système reste),
 * il n'apparaît qu'au-dessus des éléments [data-cursor="Voir"] pour annoncer l'action.
 * Absent sur écran tactile.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!finePointer()) return;
    const el = ref.current!;
    const label = labelRef.current!;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const reduce = prefersReducedMotion();

    let x = -200;
    let y = -200;
    let cx = x;
    let cy = y;
    let raf = 0;
    let target: Element | null = null;

    const setTarget = (next: Element | null) => {
      if (next === target) return;
      target = next;
      const text = next?.getAttribute("data-cursor") || "";
      if (text) label.textContent = text;
      el.classList.toggle("is-active", !!next);
    };

    const tick = () => {
      const k = reduce ? 1 : 0.2;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!target) {
        // pas d'inertie à l'apparition : le disque naît sous la souris
        cx = x;
        cy = y;
      }
      setTarget((e.target as Element).closest?.("[data-cursor]") ?? null);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const under = document.elementFromPoint(x, y);
      setTarget(under?.closest("[data-cursor]") ?? null);
    };
    const onLeave = () => setTarget(null);
    const onDown = () => el.classList.add("is-pressed");
    const onUp = () => el.classList.remove("is-pressed");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <div className="cursor__disc">
        <span ref={labelRef} className="cursor__label" />
      </div>
    </div>
  );
}
