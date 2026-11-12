"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

import type { ProjectImage } from "@/data/projects";
import { imageMeta, imageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";

type LightboxContextValue = {
  open: (id: string) => void;
  register: (id: string, node: HTMLButtonElement | null) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

/**
 * Visionneuse plein écran partagée par toutes les images d'une page projet
 * (récit et autres visuels) : ← → pour naviguer, Échap pour fermer, focus
 * rendu à la vignette d'origine.
 */
export function Lightbox({ images, title, children }: { images: ProjectImage[]; title: string; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const [index, setIndex] = useState<number | null>(null);
  const lastId = useRef<string | null>(null);
  const isOpen = index !== null;

  const open = useCallback(
    (id: string) => {
      const i = images.findIndex((image) => image.id === id);
      if (i < 0) return;
      setIndex(i);
      dialogRef.current?.showModal();
    },
    [images],
  );

  const register = useCallback((id: string, node: HTMLButtonElement | null) => {
    if (node) triggers.current.set(id, node);
    else triggers.current.delete(id);
  }, []);

  // Mémorise l'image affichée pour rendre le focus à sa vignette à la fermeture.
  useEffect(() => {
    if (index !== null) lastId.current = images[index].id;
  }, [index, images]);

  // Bloque le défilement de la page tant que la visionneuse est ouverte.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [isOpen]);

  // Fermeture explicite : on ne dépend pas seulement de l'événement `close`,
  // qui peut être différé (onglet en arrière-plan).
  const close = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setIndex(null);
    if (lastId.current) triggers.current.get(lastId.current)?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => setIndex((current) => (current === null ? current : (current + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setIndex(null);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const current = index === null ? null : images[index];

  return (
    <LightboxContext.Provider value={{ open, register }}>
      {children}

      <dialog
        ref={dialogRef}
        aria-label={`Visionneuse : ${title}`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/92"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        {current && index !== null && (
          <div className="flex h-full flex-col text-white" onClick={(event) => event.target === event.currentTarget && close()}>
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <p className="text-sm font-medium tabular-nums text-white/80" aria-live="polite">
                {index + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Fermer la visionneuse"
              >
                <X className="size-5" />
              </button>
            </div>

            <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 sm:px-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={current.id}
                src={imageSrc(current.id, 1920)}
                width={imageMeta(current.id).w}
                height={imageMeta(current.id).h}
                alt={current.alt}
                className="max-h-[calc(100dvh-10rem)] w-auto max-w-full rounded-tile object-contain"
              />
              <figcaption className="max-w-2xl text-center text-sm text-white/75">{current.alt}</figcaption>
            </figure>

            {images.length > 1 && (
              <div className="flex justify-center gap-3 py-4 sm:pointer-events-none sm:absolute sm:inset-x-4 sm:top-1/2 sm:-translate-y-1/2 sm:justify-between sm:py-0">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="pointer-events-auto inline-flex size-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="pointer-events-auto inline-flex size-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="size-6" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </LightboxContext.Provider>
  );
}

/** Vignette cliquable qui ouvre la visionneuse sur son image. */
export function Zoomable({ id, alt, className, children }: { id: string; alt: string; className?: string; children: React.ReactNode }) {
  const context = useContext(LightboxContext);
  return (
    <button
      ref={(node) => context?.register(id, node)}
      type="button"
      onClick={() => context?.open(id)}
      className={cn("group relative block w-full cursor-zoom-in overflow-hidden", className)}
      aria-label={`Agrandir : ${alt}`}
    >
      {children}
      <span
        aria-hidden
        className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Maximize2 className="size-4" />
      </span>
    </button>
  );
}
