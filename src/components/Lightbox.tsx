import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ProjectImage } from "@/data/projects";
import { Arrow, useScrollLock } from "./primitives";
import { LiquidButton } from "./ui/liquid-glass-button";

type Props = {
  title: string;
  images: ProjectImage[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Visionneuse plein écran : clavier (← → Échap), glisser au doigt, focus piégé. */
export function Lightbox({ title, images, index, onIndex, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const n = images.length;
  const image = images[index];
  const prev = () => onIndex((index - 1 + n) % n);
  const next = () => onIndex((index + 1) % n);
  useScrollLock(true);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLButtonElement>(".lightbox__close")?.focus();
    return () => opener?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // précharge les voisines
  useEffect(() => {
    [images[(index + 1) % n], images[(index - 1 + n) % n]].forEach((im) => {
      const img = new Image();
      img.src = im.src;
    });
  }, [index, images, n]);

  // rendue dans <body> : au-dessus de l'en-tête, hors du contexte d'empilement de <main>
  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox dark"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — visionneuse`}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 60 && n > 1) (dx < 0 ? next : prev)();
      }}
    >
      <div className="lightbox__bar">
        <p className="label">
          {title} <span className="lightbox__count">{pad(index + 1)} / {pad(n)}</span>
        </p>
        <LiquidButton size="lg" className="lightbox__close" onClick={onClose}>
          <span>Fermer</span>
        </LiquidButton>
      </div>

      <figure className="lightbox__stage" key={image.src}>
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} draggable={false} />
        <figcaption className="lightbox__cap" aria-live="polite">
          {image.alt}
        </figcaption>
      </figure>

      {n > 1 && (
        <>
          <LiquidButton
            size="icon"
            className="lightbox__nav lightbox__nav--prev absolute size-13 -translate-y-1/2"
            aria-label="Image précédente"
            onClick={prev}
          >
            <Arrow dir="left" />
          </LiquidButton>
          <LiquidButton
            size="icon"
            className="lightbox__nav lightbox__nav--next absolute size-13 -translate-y-1/2"
            aria-label="Image suivante"
            onClick={next}
          >
            <Arrow />
          </LiquidButton>
        </>
      )}
    </div>,
    document.body
  );
}
