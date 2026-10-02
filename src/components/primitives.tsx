import {
  Fragment,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import { cn, smallSrc } from "@/lib/utils";
import type { ProjectImage } from "@/data/projects";
import { SIGNATURE_PATH, SIGNATURE_VIEWBOX } from "./signature-path";

/* ---------- Signature ---------- */

export function Signature({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      className={cn("signature", className)}
      viewBox={SIGNATURE_VIEWBOX}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={SIGNATURE_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/* ---------- Flèche ---------- */

export function Arrow({ className, dir = "right" }: { className?: string; dir?: "right" | "left" | "up" | "down" }) {
  const rotate = { right: 0, down: 90, left: 180, up: -90 }[dir];
  return (
    <svg
      className={cn("arrow", className)}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <path d="M4 12h15M13 5.5 19.5 12 13 18.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

/* ---------- Image responsive ---------- */

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  image: ProjectImage;
  priority?: boolean;
};

export const Img = forwardRef<HTMLImageElement, ImgProps>(function Img(
  { image, priority, className, sizes = "100vw", alt, ...rest },
  ref
) {
  const local = useRef<HTMLImageElement | null>(null);
  useLayoutEffect(() => {
    const el = local.current;
    if (el?.complete && el.naturalWidth) el.classList.add("is-loaded");
  }, [image.src]);
  return (
    <img
      ref={(el) => {
        local.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      src={image.src}
      srcSet={image.small ? `${smallSrc(image.src)} ${image.small}w, ${image.src} ${image.width}w` : undefined}
      sizes={image.small ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...({ fetchpriority: priority ? "high" : "auto" } as Record<string, string>)}
      className={cn("img", className)}
      onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
      draggable={false}
      {...rest}
    />
  );
});

/* ---------- Texte ajusté à la largeur ---------- */

type FitTextProps = {
  text: string;
  className?: string;
  /** en dessous de cette largeur d'écran, la taille CSS reprend la main (retour à la ligne) */
  disableBelow?: number;
  max?: number;
};

export function FitText({ text, className, disableBelow = 0, max = 2000 }: FitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    let lastWidth = -1;
    const fit = (force = false) => {
      const cs = getComputedStyle(parent);
      const width = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (!force && width === lastWidth) return;
      lastWidth = width;
      if (window.innerWidth < disableBelow) {
        el.style.fontSize = "";
        el.classList.remove("is-fitted");
        return;
      }
      el.style.fontSize = "100px";
      el.classList.add("is-fitted");
      const natural = el.scrollWidth;
      if (natural > 0) el.style.fontSize = `${Math.min(max, (100 * width) / natural) - 0.05}px`;
    };
    fit(true);
    const ro = new ResizeObserver(() => fit());
    ro.observe(parent);
    document.fonts?.ready.then(() => fit(true));
    return () => ro.disconnect();
  }, [text, disableBelow, max]);
  return (
    <span ref={ref} className={cn("fit-text", className)}>
      {text}
    </span>
  );
}

/* ---------- Mots révélés un à un ---------- */

export function SplitWords({
  text,
  className,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const words = text.split(" ");
  return (
    <Tag className={cn("split", className)} data-reveal="" style={{ "--d": `${delay}ms` } as CSSProperties}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split__w" aria-hidden="true">
            <span className="split__i" style={{ "--i": i } as CSSProperties}>
              {w}
            </span>
          </span>
          {/* l'espace reste hors du bloc masqué, sinon il serait supprimé */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ---------- Libellé de section ---------- */

export function SectionHead({
  num,
  title,
  kicker,
  id,
  children,
}: {
  num?: string;
  title: string;
  kicker?: string;
  id?: string;
  children?: ReactNode;
}) {
  return (
    <header className="section-head">
      <p className="label section-head__label" data-reveal="">
        {num && <span className="section-head__num">{num}</span>}
        {kicker && <span>{kicker}</span>}
      </p>
      <SplitWords as="h2" text={title} className="section-head__title" />
      {children}
      {id && <span id={id} />}
    </header>
  );
}

/* ---------- Petit utilitaire : fige le scroll (lightbox, loader) ---------- */

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    root.style.paddingRight = gap ? `${gap}px` : "";
    return () => {
      root.style.overflow = "";
      root.style.paddingRight = "";
    };
  }, [active]);
}
