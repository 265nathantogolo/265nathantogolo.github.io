import { useEffect } from "react";
import { clamp } from "./utils";

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Disponibilité (après le loader) ---------- */

let ready = false;
const readyCallbacks: (() => void)[] = [];

export function setReady() {
  if (ready) return;
  ready = true;
  document.documentElement.classList.add("is-ready");
  readyCallbacks.splice(0).forEach((cb) => cb());
}

export function whenReady(cb: () => void) {
  if (ready) cb();
  else readyCallbacks.push(cb);
}

/* ---------- Révélations au scroll ---------- */

let io: IntersectionObserver | null = null;

function observer() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io!.unobserve(entry.target);
        }
      },
      // marge nulle : un élément décalé par son animation d'entrée reste détectable en bas d'écran
      { rootMargin: "0px", threshold: 0 }
    );
  }
  return io;
}

export function observeReveals(root: ParentNode = document) {
  const obs = observer();
  root.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => obs.observe(el));
}

/** À appeler dans chaque page : observe les éléments [data-reveal] montés. */
export function useReveals(deps: unknown[] = []) {
  useEffect(() => {
    const raf = requestAnimationFrame(() => whenReady(() => observeReveals()));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ---------- Parallaxe et zoom liés au scroll ---------- */

/**
 * [data-speed="0.9"] : décalage vertical léger selon la position dans l'écran.
 * [data-zoom]        : l'image passe de 1.12 à 1 en entrant dans l'écran.
 * Désactivé sur écran tactile, sous 900 px et si l'utilisateur réduit les animations.
 */
export function useScrollEffects(deps: unknown[] = []) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const speedEls = Array.from(document.querySelectorAll<HTMLElement>("[data-speed]"));
    const zoomEls = Array.from(document.querySelectorAll<HTMLElement>("[data-zoom]"));
    if (!speedEls.length && !zoomEls.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const parallax = finePointer() && window.innerWidth >= 900;
      for (const el of speedEls) {
        if (!parallax) {
          el.style.transform = "";
          continue;
        }
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const speed = parseFloat(el.dataset.speed || "1");
        const offset = (r.top + r.height / 2 - vh / 2) * (1 - speed);
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
      for (const el of zoomEls) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const p = clamp((vh - r.top) / (vh * 0.9), 0, 1);
        el.style.transform = `scale(${(1.12 - 0.12 * p).toFixed(4)})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      speedEls.forEach((el) => (el.style.transform = ""));
      zoomEls.forEach((el) => (el.style.transform = ""));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
