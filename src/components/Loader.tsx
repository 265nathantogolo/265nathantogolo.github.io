import { useEffect, useRef, useState } from "react";
import { coverOf, projects } from "@/data/projects";
import { prefersReducedMotion, setReady } from "@/lib/motion";
import { smallSrc } from "@/lib/utils";
import { Signature } from "./primitives";

const KEY = "nt-portfolio-seen";

function seenThisSession() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Écran d'ouverture (une fois par session) : la signature s'écrit pendant que
 * les couvertures se préchargent, puis le rideau se lève.
 */
export function Loader() {
  const [state, setState] = useState<"on" | "leaving" | "off">(() =>
    seenThisSession() || prefersReducedMotion() ? "off" : "on"
  );
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (state === "off") {
      setReady();
      return;
    }
    if (state !== "on") return;

    const root = document.documentElement;
    root.style.overflow = "hidden";
    const start = performance.now();
    const assets = projects.map((p) => {
      const c = coverOf(p);
      return c.small ? smallSrc(c.src) : c.src;
    });
    const total = assets.length + 1;
    let done = 0;
    let shown = 0;
    let finished = false;
    let raf = 0;

    const bump = () => {
      done = Math.min(total, done + 1);
    };
    assets.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = bump;
      img.src = src;
    });
    (document.fonts?.ready ?? Promise.resolve()).then(bump);

    const leave = () => {
      if (finished) return;
      finished = true;
      setState("leaving");
      setReady();
      root.style.overflow = "";
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* navigation privée : le loader réapparaîtra, sans conséquence */
      }
      window.setTimeout(() => setState("off"), 1000);
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      const target = elapsed > 2600 ? 100 : (done / total) * 100;
      shown += (target - shown) * 0.12;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(shown)).padStart(2, "0");
      if (shown > 99.4 && elapsed > 1200) {
        if (pctRef.current) pctRef.current.textContent = "100";
        leave();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // filet de sécurité : onglet en arrière-plan (rAF suspendu) ou réseau lent
    const safety = window.setTimeout(leave, 3500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
      root.style.overflow = "";
    };
  }, [state]);

  if (state === "off") return null;
  return (
    <div className={`loader dark${state === "leaving" ? " is-leaving" : ""}`} role="status" aria-label="Chargement du portfolio">
      <Signature className="loader__sig" />
      <div className="loader__bottom">
        <span className="loader__name">
          Nathan Togolo
          <br />
          <span className="loader__muted">Portfolio</span>
        </span>
        <span className="loader__pct" aria-hidden="true">
          <span ref={pctRef}>00</span>
        </span>
      </div>
    </div>
  );
}
