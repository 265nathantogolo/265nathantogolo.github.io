import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { frenchTypo } from "./rich-text";

/**
 * Texte qui apparaît lettre par lettre, du flou au net (CSS uniquement,
 * voir .intro-enter dans globals.css). En pause pendant l'écran de
 * chargement, lancé à sa sortie. Les lecteurs d'écran lisent le texte entier.
 */
export function BlurText({ text, delay = 0, step = 22 }: { text: string; delay?: number; step?: number }) {
  const words = frenchTypo(text).split(" ");
  let index = 0;
  return (
    <>
      <span className="sr-only">{frenchTypo(text)}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <Fragment key={w}>
            {/* Un mot ne se coupe jamais entre deux lignes. */}
            <span className="inline-block whitespace-nowrap">
              {[...word].map((char) => {
                const i = index++;
                return (
                  <span key={i} className="intro-enter inline-block" style={{ "--delay": `${delay + i * step}ms` } as React.CSSProperties}>
                    {char}
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </>
  );
}

/** Bloc qui apparaît du flou au net, en même temps que le hero. */
export function BlurIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={cn("intro-enter", className)} style={{ "--delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}
