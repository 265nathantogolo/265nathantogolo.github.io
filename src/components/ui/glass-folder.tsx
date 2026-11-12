"use client";

import * as React from "react";
import Link from "next/link";
import useMeasure from "react-use-measure";

/*
  Glass Folder Cards (composant fourni par Nathan). Adaptations :
  1. Verre liquide au lieu de verre dépoli : la façade et l'ombre n'utilisent
     plus aucun flou CSS (règle du site) ; la façade passe par le filtre SVG
     #container-glass-soft, avec un reflet laiteux et une arête lumineuse.
     La déformation n'est rendue que par Chromium ; ailleurs, verre laiteux.
  2. Contenu : les fiches sont des projets (couverture, titre, année, lien) ;
     le bouton « + » devient une flèche vers tous les projets du savoir-faire.
     Ajout de fiches, menu « ··· » et animation de dépôt retirés.
  3. Largeur fluide : le dossier se mesure et met sa scène à l'échelle.
  4. Textes en français, police du site (Inter), focus aux couleurs du site.
  5. La peinture du fond ne démarre qu'à l'approche de l'écran, pour ne pas
     concurrencer l'écran de chargement et le hero.
  6. Styles injectés une seule fois (<style href precedence> de React 19).
*/

export type ArtRecipe = {
  /** `marble` replie les couleurs les unes dans les autres ; `streak` les étire en pose longue. */
  style: "marble" | "streak";
  colors: string[];
  scale?: number;
  warp?: number;
  angle?: number;
  gloss?: number;
  veins?: number;
};

export type FolderFile = {
  name: string;
  /** Seconde ligne courte : année, format, poids. */
  meta?: string;
  /** Image de la fiche ; sans image, la fiche est une feuille de papier. */
  image?: string;
  href: string;
  /** Nom du fichier : la fiche télécharge un document (href déjà préfixé du basePath). */
  download?: string;
};

export type GlassFolderProps = {
  label: string;
  meta?: string;
  art: ArtRecipe;
  seed?: number;
  files: FolderFile[];
  /** Lien de la flèche : tous les projets de ce savoir-faire. */
  href: string;
  hrefLabel: string;
  appearDelay?: number;
  className?: string;
};

// #region peinture du fond
/** `#rgb` ou `#rrggbb` en triplet. Illisible : gris moyen. */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = /^[0-9a-f]{6}$/i.test(h) ? parseInt(h, 16) : 0x808080;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Petit générateur pseudo-aléatoire initialisable (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Petit entier stable pour une chaîne : l'inclinaison d'une fiche suit son nom. */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Bruit de gradient initialisable, sommé en octaves fractales avec rotation entre chaque. */
function makeFbm(seed: number): (x: number, y: number, octaves: number) => number {
  const r = rng(seed);
  const perm = new Uint8Array(512);
  const grad = new Float32Array(512);
  const p: number[] = [];
  for (let i = 0; i < 256; i++) p.push(i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  for (let i = 0; i < 256; i++) {
    const a = r() * Math.PI * 2;
    grad[i * 2] = Math.cos(a);
    grad[i * 2 + 1] = Math.sin(a);
  }
  const noise = (x: number, y: number): number => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const X = xi & 255;
    const Y = yi & 255;
    const h00 = perm[X + perm[Y]] * 2;
    const h10 = perm[X + 1 + perm[Y]] * 2;
    const h01 = perm[X + perm[Y + 1]] * 2;
    const h11 = perm[X + 1 + perm[Y + 1]] * 2;
    const d00 = grad[h00] * xf + grad[h00 + 1] * yf;
    const d10 = grad[h10] * (xf - 1) + grad[h10 + 1] * yf;
    const d01 = grad[h01] * xf + grad[h01 + 1] * (yf - 1);
    const d11 = grad[h11] * (xf - 1) + grad[h11 + 1] * (yf - 1);
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    return d00 + u * (d10 - d00) + v * (d01 - d00 + u * (d11 - d01 - d10 + d00));
  };
  return (x, y, octaves) => {
    let sum = 0;
    let amp = 0.5;
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x, y);
      const nx = 1.6 * x + 1.2 * y + 7.1;
      y = -1.2 * x + 1.6 * y + 3.3;
      x = nx;
      amp *= 0.5;
    }
    return sum;
  };
}

type ArtJob = {
  width: number;
  height: number;
  pixels: Uint8ClampedArray<ArrayBuffer>;
  /** Peint jusqu'à `rows` lignes de plus. Renvoie true quand l'image est terminée. */
  step: (rows: number) => boolean;
};

/**
 * La peinture, découpée en tâche étalée sur plusieurs images : un champ de
 * bruit replié deux fois sur lui-même, normalisé par ses percentiles, puis
 * éclairé comme une surface liquide (diffus, spéculaire, fines stries).
 */
function createArtJob(width: number, height: number, recipe: ArtRecipe, seed: number): ArtJob {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const colors = recipe.colors.length >= 2 ? recipe.colors : ["#111111", "#eeeeee"];
  const stops = colors.map((c, i) => ({ t: i / (colors.length - 1), c: hexToRgb(c) }));
  const scale = recipe.scale ?? 0.7;
  const warp = recipe.warp ?? 3;
  const gloss = recipe.gloss ?? 0.4;
  const veins = recipe.veins ?? 0;
  const streak = recipe.style === "streak";
  const fbm = makeFbm(seed * 977 + 13);
  const r = rng(seed + 1);
  const ox = r() * 50;
  const oy = r() * 50;
  const angle = (recipe.angle ?? 0) + (r() - 0.5) * 0.5;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const m = Math.min(w, h);
  // Champ échantillonné à demi-résolution (avec une marge d'une case), puis
  // agrandi en Catmull-Rom : la pente reste continue pour l'éclairage.
  const gw = Math.ceil(w / 2) + 3;
  const gh = Math.ceil(h / 2) + 3;
  const G = new Float32Array(gw * gh);
  const GQ = new Float32Array(gw * gh);
  const F = new Float32Array(w * h);
  const Q = new Float32Array(w * h);
  const pixels = new Uint8ClampedArray(w * h * 4);
  let row = 0;

  const field = (gy: number) => {
    for (let gx = 0; gx < gw; gx++) {
      const u = ((gx - 1) * 2 - w / 2) / m;
      const v = ((gy - 1) * 2 - h / 2) / m;
      let px = (u * ca - v * sa) * scale;
      let py = (u * sa + v * ca) * scale;
      if (streak) {
        px *= 0.14;
        py *= 2.2;
      }
      px += ox;
      py += oy;
      const qx = fbm(px, py, 3);
      const qy = fbm(px + 5.2, py + 1.3, 3);
      const rx = fbm(px + warp * qx + 1.7, py + warp * qy + 9.2, 3);
      const ry = fbm(px + warp * qx + 8.3, py + warp * qy + 2.8, 3);
      G[gy * gw + gx] = fbm(px + warp * rx, py + warp * ry, 4);
      GQ[gy * gw + gx] = Math.sqrt(qx * qx + qy * qy);
    }
  };

  const upsample = () => {
    const cr = (a: number, b: number, c: number, d: number) => (-a + 9 * b + 9 * c - d) / 16;
    const T = new Float32Array(w * gh);
    for (let gy = 0; gy < gh; gy++) {
      const rr = gy * gw;
      for (let x = 0; x < w; x++) {
        const c = (x >> 1) + 1;
        T[gy * w + x] = x & 1 ? cr(G[rr + c - 1], G[rr + c], G[rr + c + 1], G[rr + c + 2]) : G[rr + c];
      }
    }
    for (let y = 0; y < h; y++) {
      const c = (y >> 1) + 1;
      for (let x = 0; x < w; x++) {
        F[y * w + x] = y & 1 ? cr(T[(c - 1) * w + x], T[c * w + x], T[(c + 1) * w + x], T[(c + 2) * w + x]) : T[c * w + x];
        const gx = (x >> 1) + 1;
        const q0 = GQ[c * gw + gx];
        const qx = x & 1 ? (q0 + GQ[c * gw + gx + 1]) / 2 : q0;
        const q1 = y & 1 ? (x & 1 ? (GQ[(c + 1) * gw + gx] + GQ[(c + 1) * gw + gx + 1]) / 2 : GQ[(c + 1) * gw + gx]) : qx;
        Q[y * w + x] = (qx + q1) / 2;
      }
    }
  };

  const colorize = () => {
    const sample: number[] = [];
    const stride = Math.max(1, Math.floor(F.length / 4096));
    for (let i = 0; i < F.length; i += stride) sample.push(F[i]);
    sample.sort((a, b) => a - b);
    const lo = sample[Math.floor(sample.length * 0.02)];
    const hi = sample[Math.floor(sample.length * 0.98)];
    const k = 1 / (hi - lo || 1);
    const lx = -0.55;
    const ly = -0.65;
    const lz = 0.52;
    const slope = k * m * 0.012;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let t = (F[i] - lo) * k;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        let j = 1;
        while (j < stops.length - 1 && stops[j].t < t) j++;
        const a = stops[j - 1];
        const b = stops[j];
        let f = (t - a.t) / (b.t - a.t || 1);
        f = f < 0 ? 0 : f > 1 ? 1 : f;
        f = f * f * (3 - 2 * f);
        const gx = (F[x < w - 1 ? i + 1 : i] - F[x > 0 ? i - 1 : i]) * slope;
        const gy = (F[y < h - 1 ? i + w : i] - F[y > 0 ? i - w : i]) * slope;
        const nd = (-gx * lx - gy * ly + lz) / Math.sqrt(gx * gx + gy * gy + 1);
        const spec = Math.pow(nd > 0 ? nd : 0, 24) * gloss * 255;
        const silk = 1 + 0.035 * Math.sin(t * 150 + Q[i] * 24);
        const vein = veins * Math.max(0, 1 - Math.abs(Q[i] - 0.42) * 14) * 0.6;
        const lit = (0.82 + 0.28 * nd) * silk * (1 - vein);
        pixels[i * 4] = (a.c[0] + (b.c[0] - a.c[0]) * f) * lit + spec;
        pixels[i * 4 + 1] = (a.c[1] + (b.c[1] - a.c[1]) * f) * lit + spec;
        pixels[i * 4 + 2] = (a.c[2] + (b.c[2] - a.c[2]) * f) * lit + spec;
        pixels[i * 4 + 3] = 255;
      }
    }
  };

  const step = (rows: number): boolean => {
    if (row >= gh) return true;
    const end = Math.min(gh, row + Math.max(1, rows));
    while (row < end) field(row++);
    if (row < gh) return false;
    upsample();
    colorize();
    return true;
  };

  return { width: w, height: h, pixels, step };
}

/** Place d'une fiche dans l'éventail : -1 … 1, 0 pour une fiche seule. */
function fanSlot(index: number, count: number): number {
  return count <= 1 ? 0 : (index / (count - 1)) * 2 - 1;
}

// Un seul peintre pour toute la page : chaque dossier met sa peinture en file,
// et la file ne prend que quelques millisecondes par image.
const artCache = new Map<string, Promise<HTMLCanvasElement>>();
const queue: { job: ArtJob; done: (c: HTMLCanvasElement) => void }[] = [];
let pumping = false;

function pump() {
  if (pumping) return;
  pumping = true;
  const tick = () => {
    const until = performance.now() + 7;
    while (queue.length && performance.now() < until) {
      const head = queue[0];
      if (head.job.step(4)) {
        queue.shift();
        const c = document.createElement("canvas");
        c.width = head.job.width;
        c.height = head.job.height;
        c.getContext("2d")?.putImageData(new ImageData(head.job.pixels, c.width, c.height), 0, 0);
        head.done(c);
      }
    }
    if (queue.length) requestAnimationFrame(tick);
    else pumping = false;
  };
  requestAnimationFrame(tick);
}

function paint(recipe: ArtRecipe, seed: number, w: number, h: number): Promise<HTMLCanvasElement> {
  const key = JSON.stringify([recipe, seed, w, h]);
  let p = artCache.get(key);
  if (!p) {
    p = new Promise<HTMLCanvasElement>((done) => {
      queue.push({ job: createArtJob(w, h, recipe, seed), done });
      pump();
    });
    artCache.set(key, p);
  }
  return p;
}

function ArtCanvas({ art, seed, w, h, density, enabled }: { art: ArtRecipe; seed: number; w: number; h: number; density: number; enabled: boolean }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = React.useState(false);
  const key = JSON.stringify(art);
  const pw = Math.round(w * density);
  const ph = Math.round(h * density);

  React.useEffect(() => {
    if (!enabled) return;
    let live = true;
    paint(JSON.parse(key) as ArtRecipe, seed, pw, ph).then((src) => {
      const c = ref.current;
      if (!live || !c) return;
      c.width = src.width;
      c.height = src.height;
      c.getContext("2d")?.drawImage(src, 0, 0);
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [key, seed, pw, ph, enabled]);

  return <canvas ref={ref} aria-hidden="true" className="gf-art" data-ready={ready || undefined} style={{ width: w, height: h, maxWidth: "none" }} />;
}
// #endregion

// Géométrie, en unités du dossier : la scène est dessinée en 340 × 272 puis
// mise à l'échelle de la largeur mesurée.
const W = 340;
const H = 272;
const HEADROOM = 54; // place au-dessus du fond pour que les fiches s'élèvent
const FRONT_TOP = 74;
const FRONT_H = H - FRONT_TOP;
const SHEET_W = 272;
const SHEET_H = 184;

const BACK_PATH =
  "M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z";
const FRONT_PATH =
  "M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 " +
  (FRONT_H - 22) +
  "A22 22 0 0 1 318 " +
  FRONT_H +
  "L22 " +
  FRONT_H +
  "A22 22 0 0 1 0 " +
  (FRONT_H - 22) +
  "Z";

const MAX_VISIBLE = 4;
const frontClip = `path('${FRONT_PATH}')`;

/** Fiche : lien de page (basePath géré par Next) ou téléchargement d'un document. */
function SheetLink({ file, ...props }: { file: FolderFile; className: string; style: React.CSSProperties; children: React.ReactNode }) {
  return file.download ? <a href={file.href} download={file.download} {...props} /> : <Link href={file.href} {...props} />;
}

export function GlassFolder({ label, meta, art, seed = 3, files, href, hrefLabel, appearDelay = 0, className }: GlassFolderProps) {
  const uid = React.useId().replace(/:/g, "");
  const [measureRef, bounds] = useMeasure();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const filesRef = React.useRef<HTMLDivElement>(null);
  const hitRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [entered, setEntered] = React.useState(false);
  const [near, setNear] = React.useState(false);

  const width = bounds.width || W;
  const k = width / W;
  // Seulement pour la résolution du canevas (jamais dans le balisage) : pas d'écart d'hydratation.
  const [dpr] = React.useState(() => (typeof window === "undefined" ? 1 : Math.min(1.5, Math.max(1, window.devicePixelRatio || 1))));
  const density = dpr * k;

  const setRoot = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      measureRef(node);
    },
    [measureRef],
  );

  // Peinture à l'approche de l'écran, assemblage la première fois qu'il y entre.
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      setEntered(true);
      return;
    }
    let t = 0;
    const nearIo = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        nearIo.disconnect();
        setNear(true);
      },
      { rootMargin: "800px 0px" },
    );
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        t = window.setTimeout(() => setEntered(true), appearDelay);
      },
      { threshold: 0.25 },
    );
    nearIo.observe(el);
    io.observe(el);
    return () => {
      nearIo.disconnect();
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [appearDelay]);

  // Lumière et parallaxe suivent le pointeur, sans re-rendu.
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const write = () => {
      raf = 0;
      el.style.setProperty("--gf-px", px.toFixed(3));
      el.style.setProperty("--gf-py", py.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const leave = () => {
      px = 0;
      py = 0;
      if (!raf) raf = requestAnimationFrame(write);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Dossier fermé : les fiches sortent de l'ordre de tabulation.
  React.useEffect(() => {
    filesRef.current?.toggleAttribute("inert", !open);
  }, [open]);

  // Échap et un appui à côté referment le dossier.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      hitRef.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Les fiches les plus récentes sont devant, contre le verre.
  const start = Math.max(0, files.length - MAX_VISIBLE);
  const visible = files.slice(start);
  const count = files.length;
  const metaLine = meta ?? `${count} projet${count > 1 ? "s" : ""}`;

  return (
    <div
      ref={setRoot}
      className={"gf-root" + (className ? " " + className : "")}
      data-open={open || undefined}
      data-entered={entered || undefined}
      style={{ aspectRatio: `${W} / ${H + HEADROOM}` }}
    >
      <style href="glass-folder" precedence="medium">
        {GF_CSS}
      </style>
      <div className="gf-stage" style={{ transform: `translateY(${HEADROOM * k}px) scale(${k})` }}>
        <div className="gf-tilt">
          <div className="gf-shadow" aria-hidden="true" />

          {/* fond du dossier et sa peinture */}
          <div className="gf-back" style={{ clipPath: `path('${BACK_PATH}')` }} aria-hidden="true">
            <ArtCanvas art={art} seed={seed} w={W + 24} h={H + 24} density={density} enabled={near} />
            <div className="gf-back-sheen" />
          </div>
          <svg className="gf-rim gf-back-rim" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <path d={BACK_PATH} />
          </svg>

          {/* façade en verre liquide, articulée sur son bord bas */}
          {/* Découpe posée sur chaque calque et non sur la façade : un parent découpé
              empêcherait le verre de déformer les fiches et la peinture derrière lui. */}
          <div className="gf-front">
            <div className="gf-glass" aria-hidden="true" style={{ clipPath: frontClip }} />
            <div className="gf-tint" aria-hidden="true" style={{ clipPath: frontClip }} />
            <div className="gf-spec" aria-hidden="true" style={{ clipPath: frontClip }} />
            <svg className="gf-rim gf-front-rim" viewBox={`0 0 ${W} ${FRONT_H}`} aria-hidden="true">
              <defs>
                <linearGradient id={`gf-rim-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="0.35" stopColor="#fff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path d={FRONT_PATH} stroke={`url(#gf-rim-${uid})`} />
            </svg>
            <button
              ref={hitRef}
              type="button"
              className="gf-hit"
              style={{ clipPath: frontClip }}
              aria-expanded={open}
              aria-label={`${open ? "Fermer" : "Ouvrir"} le dossier ${label}, ${metaLine}`}
              onClick={() => setOpen(!open)}
            />
            <div className="gf-label">
              <span className="gf-title">{label}</span>
              <span className="gf-meta">{metaLine}</span>
            </div>
          </div>

          {/* le contenu : après le verre dans l'ordre de tabulation, derrière à l'écran */}
          <div ref={filesRef} className="gf-files" role="list" aria-label={`Contenu du dossier ${label}`}>
            {visible.map((file, v) => {
              const slot = fanSlot(v, visible.length);
              const jitter = rng(hashString(file.name) + start + v);
              return (
                <div key={file.name} role="listitem" className="gf-sheet-slot">
                  <SheetLink
                    file={file}
                    className={"gf-sheet" + (file.image ? " gf-sheet--art" : "")}
                    style={
                      {
                        "--gf-slot": slot,
                        "--gf-depth": visible.length - 1 - v,
                        "--gf-jx": ((jitter() - 0.5) * 10).toFixed(2) + "px",
                        "--gf-jr": ((jitter() - 0.5) * 3.2).toFixed(2) + "deg",
                        zIndex: v + 1,
                      } as React.CSSProperties
                    }
                  >
                    {file.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="gf-sheet-art" src={file.image} alt="" width={SHEET_W} height={SHEET_H} loading="lazy" decoding="async" draggable={false} />
                    ) : (
                      <span className="gf-lines" aria-hidden="true">
                        <i style={{ width: "86%" }} />
                        <i style={{ width: "92%" }} />
                        <i style={{ width: "64%" }} />
                        <i style={{ width: "88%" }} />
                        <i style={{ width: "42%" }} />
                      </span>
                    )}
                    <span className="gf-sheet-head">
                      <span className="gf-sheet-name">{file.name}</span>
                      {file.meta ? <span className="gf-sheet-meta">{file.meta}</span> : null}
                    </span>
                  </SheetLink>
                </div>
              );
            })}
          </div>

          <Link href={href} className="gf-key" aria-label={hrefLabel}>
            <svg className="gf-glyph" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17 17 7M8.5 7H17v8.5" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

const GF_CSS = `
.gf-root {
  --gf-px: 0;
  --gf-py: 0;
  --gf-ease: cubic-bezier(.2, .8, .2, 1);
  --gf-spring: cubic-bezier(.34, 1.36, .5, 1);
  --gf-hinge: 0deg;
  --gf-lift: 42px;
  --gf-spread: 0px;
  --gf-fan: 0deg;
  --gf-stack: 15px;
  --gf-ink: #141416;
  --gf-ink-soft: rgba(20, 20, 22, .6);
  position: relative;
  display: block;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
}
.gf-root:hover, .gf-root:focus-within { --gf-hinge: -11deg; --gf-lift: -34px; --gf-spread: 8px; --gf-fan: 1.4deg; --gf-stack: 10px; z-index: 10; }
.gf-root[data-open] { --gf-hinge: -24deg; --gf-lift: -96px; --gf-spread: 40px; --gf-fan: 5deg; --gf-stack: 30px; z-index: 20; }

.gf-stage {
  position: absolute;
  left: 0;
  top: 0;
  width: 340px;
  height: 272px;
  transform-origin: 0 0;
}
.gf-tilt {
  position: absolute;
  inset: 0;
  transform: perspective(1400px) rotateX(calc(var(--gf-py) * -3deg)) rotateY(calc(var(--gf-px) * 4deg));
  transition: transform .9s var(--gf-ease);
}

/* Ombre portée sans filtre de flou : un dégradé radial. */
.gf-shadow {
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: -26px;
  height: 80px;
  background: radial-gradient(closest-side, rgba(16, 18, 24, .3), rgba(16, 18, 24, .12) 55%, rgba(16, 18, 24, 0));
  transform: translateX(calc(var(--gf-px) * -8px));
  transition: transform .9s var(--gf-ease), opacity .9s var(--gf-ease);
}

.gf-back {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #f3f3f4 0%, #e3e3e6 100%);
}
.gf-art {
  position: absolute;
  left: -12px;
  top: -12px;
  max-width: none;
  opacity: 0;
  transform: translate(calc(var(--gf-px) * -7px), calc(var(--gf-py) * -6px)) scale(1.02);
  transition: transform 1.1s var(--gf-ease), opacity 1.2s var(--gf-ease);
}
.gf-art[data-ready] { opacity: 1; }
.gf-back-sheen {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .22) 0%, rgba(255, 255, 255, 0) 22%),
    radial-gradient(120% 80% at 80% 0%, rgba(255, 255, 255, .16), rgba(255, 255, 255, 0) 60%);
  pointer-events: none;
}

.gf-rim {
  position: absolute;
  left: 0;
  top: 0;
  max-width: none;
  overflow: visible;
  pointer-events: none;
  fill: none;
}
.gf-back-rim { width: 340px; height: 272px; }
.gf-back-rim path { stroke: rgba(255, 255, 255, .45); stroke-width: 1; }

/* ---- fiches ---- */
.gf-files {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  /* rien ne dépasse sous la poche, quelle que soit la hauteur de la pile */
  clip-path: inset(-400px -400px 10px -400px);
}
.gf-sheet-slot { display: contents; }
.gf-sheet {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  left: 34px;
  top: 96px;
  width: 272px;
  height: 184px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  pointer-events: auto;
  background: linear-gradient(180deg, #ffffff 0%, #f2f2f0 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .9),
    0 0 0 .5px rgba(0, 0, 0, .1),
    0 10px 26px -8px rgba(10, 12, 20, .28);
  transform-origin: 50% 100%;
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1))
    rotate(calc(var(--gf-jr) + var(--gf-slot) * var(--gf-fan)));
  transition:
    transform .75s var(--gf-spring) calc(var(--gf-depth) * 40ms),
    box-shadow .4s var(--gf-ease),
    translate .9s var(--gf-ease),
    opacity .9s var(--gf-ease);
}
.gf-sheet--art { background: #1a1a1d; }
.gf-root[data-open] .gf-sheet:hover,
.gf-root[data-open] .gf-sheet:focus-visible {
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1 - 18px))
    rotate(calc(var(--gf-slot) * var(--gf-fan) * .6));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .9), 0 0 0 .5px rgba(0, 0, 0, .1), 0 22px 40px -12px rgba(10, 12, 20, .42);
  transition-delay: 0s;
}
.gf-sheet:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
.gf-sheet-art {
  position: absolute;
  left: 0;
  top: 0;
  width: 272px;
  height: 184px;
  max-width: none;
  object-fit: cover;
}
.gf-sheet--art::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, 0) 38%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .2);
  pointer-events: none;
}
.gf-sheet-head {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 11px;
  z-index: 1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  white-space: nowrap;
}
.gf-sheet-name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -.005em;
  color: #18181b;
}
.gf-sheet-meta {
  flex: none;
  font-size: 10.5px;
  font-variant-numeric: tabular-nums;
  color: rgba(24, 24, 27, .55);
}
.gf-sheet--art .gf-sheet-name { color: #fafafa; }
.gf-sheet--art .gf-sheet-meta { color: rgba(250, 250, 250, .75); }
.gf-lines {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 40px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.gf-lines i {
  display: block;
  height: 5px;
  border-radius: 3px;
  background: rgba(24, 24, 27, .08);
}
.gf-lines i:first-child { height: 9px; margin-bottom: 4px; background: rgba(24, 24, 27, .14); }

/* ---- façade en verre liquide (sans flou) ---- */
.gf-front {
  position: absolute;
  left: 0;
  top: 74px;
  width: 340px;
  height: 198px;
  z-index: 10;
  transform-origin: 50% 100%;
  transform: perspective(760px) rotateX(var(--gf-hinge));
  transition: transform .8s var(--gf-spring), translate 1s var(--gf-ease), opacity 1s var(--gf-ease);
}
.gf-glass {
  position: absolute;
  inset: 0;
  -webkit-backdrop-filter: url("#container-glass-soft");
  backdrop-filter: url("#container-glass-soft");
}
.gf-tint {
  position: absolute;
  inset: 0;
  /* Voile laiteux : sans flou, c'est lui qui estompe les fiches derrière le nom du dossier. */
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .34) 0%, rgba(255, 255, 255, .7) 38%, rgba(250, 250, 251, .95) 72%, rgba(250, 250, 251, .97) 100%);
  box-shadow:
    inset 0 2px 1px -1px rgba(255, 255, 255, .95),
    inset 0 -10px 24px -14px rgba(0, 0, 0, .22),
    inset 0 0 18px 4px rgba(255, 255, 255, .25);
}
.gf-spec {
  position: absolute;
  inset: 0;
  background: radial-gradient(260px 200px at calc(50% + var(--gf-px) * 46%) calc(30% + var(--gf-py) * 40%), rgba(255, 255, 255, .55), rgba(255, 255, 255, 0) 70%);
  mix-blend-mode: soft-light;
  opacity: .9;
  pointer-events: none;
}
.gf-front-rim { width: 340px; height: 198px; }
.gf-front-rim path { stroke-width: 2.4; transition: stroke-width .3s var(--gf-ease); }

.gf-hit {
  all: unset;
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
}
.gf-hit:focus-visible ~ .gf-label .gf-title { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 4px; }
.gf-front:has(.gf-hit:focus-visible) .gf-front-rim path { stroke-width: 5; }

.gf-label {
  position: absolute;
  left: 28px;
  bottom: 30px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 210px;
  pointer-events: none;
  color: var(--gf-ink);
}
.gf-title {
  font-size: 19px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gf-meta {
  font-size: 12.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--gf-ink-soft);
  white-space: nowrap;
}

/* ---- la touche ↗ : tous les projets du savoir-faire ---- */
.gf-key {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  right: 22px;
  bottom: 22px;
  z-index: 12;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #fff;
  background: radial-gradient(120% 90% at 50% 0%, #3a3a3f 0%, #121214 55%, #050506 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .22),
    inset 0 -3px 8px rgba(0, 0, 0, .7),
    0 0 0 1px rgba(0, 0, 0, .75),
    0 14px 22px -8px rgba(0, 0, 0, .55),
    0 3px 6px -2px rgba(0, 0, 0, .35);
  transition: transform .35s var(--gf-spring), background .35s var(--gf-ease), opacity .6s var(--gf-ease) .7s, scale .7s var(--gf-spring) .7s;
}
.gf-key:hover { transform: translateY(-2px); background: radial-gradient(120% 90% at 50% 0%, #ff6b90 0%, #ff205c 55%, #c80040 100%); }
.gf-key:active { transform: translateY(0) scale(.93); transition-duration: .12s; }
.gf-key:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
.gf-glyph { display: block; width: 24px; height: 24px; max-width: none; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

/* ---- entrée : le dossier s'assemble ---- */
.gf-root:not([data-entered]) .gf-back,
.gf-root:not([data-entered]) .gf-back-rim { translate: 0 22px; opacity: 0; }
.gf-root:not([data-entered]) .gf-sheet { translate: 0 -120px; opacity: 0; }
.gf-root:not([data-entered]) .gf-front { translate: 0 46px; opacity: 0; }
.gf-root:not([data-entered]) .gf-key { opacity: 0; scale: .6; }
.gf-root:not([data-entered]) .gf-shadow { opacity: 0; }
.gf-back, .gf-back-rim { transition: translate 1s var(--gf-ease), opacity .9s var(--gf-ease); }
.gf-root[data-entered] .gf-sheet { transition-delay: calc(var(--gf-depth) * 40ms), 0s, calc(.18s + var(--gf-depth) * 90ms), calc(.18s + var(--gf-depth) * 90ms); }
.gf-root[data-entered] .gf-front { transition-delay: 0s, .42s, .42s; }

@media (prefers-reduced-motion: reduce) {
  .gf-root *, .gf-root *::before, .gf-root *::after {
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    animation: none !important;
  }
  .gf-tilt { transform: none; }
}
`;
