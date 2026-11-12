import { cn } from "@/lib/utils";
import { glassShadow } from "./glass";

type GlassSurfaceProps = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "nav" | "section" | "aside";
  /** Fond sous le verre : arêtes sombres sur clair, claires sur sombre. */
  surface?: "light" | "dark";
  /** Distorsion : douce pour les grandes surfaces (nav, panneaux), forte pour les petites. */
  distortion?: "soft" | "strong";
};

/**
 * Surface en verre liquide (nav, panneaux, barre de projet) : même recette
 * que LiquidButton, sans flou de fond. Le rayon se règle sur l'élément
 * (`rounded-*`), les calques en héritent.
 */
export function GlassSurface({
  as: Tag = "div",
  surface = "light",
  distortion = "soft",
  className,
  children,
  ...props
}: GlassSurfaceProps) {
  return (
    <Tag className={cn("relative isolate", className)} {...props}>
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 -z-10 rounded-[inherit]", glassShadow(surface))}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden rounded-[inherit]"
        style={{ backdropFilter: `url("#container-glass${distortion === "soft" ? "-soft" : ""}")` }}
      />
      {children}
    </Tag>
  );
}
