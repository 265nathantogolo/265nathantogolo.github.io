import { useRef } from "react";
import { categoryById } from "@/data/categories";
import type { Project, ProjectImage } from "@/data/projects";
import { Link, paths } from "@/lib/router";
import { setSharedElement } from "@/lib/shared";
import { cn } from "@/lib/utils";
import { Arrow, FitText, Img } from "./primitives";

type Layout = "wide" | "pair" | "trio" | "split";

const speeds: Record<Layout, number[]> = {
  wide: [1, 0.92],
  pair: [1, 0.9],
  trio: [1, 0.88, 1.06],
  split: [1, 0.9],
};

/** Composition asymétrique pour la sélection de l'accueil (2 ou 3 images + texte). */
export function FeaturedProject({ project, images, layout }: { project: Project; images: string[]; layout: Layout }) {
  const mainRef = useRef<HTMLImageElement>(null);
  const imgs = images
    .map((idx) => project.images.find((im) => im.index === idx))
    .filter((im): im is ProjectImage => Boolean(im));
  const to = paths.project(project.slug);
  const share = () => setSharedElement(mainRef.current);

  return (
    <article className={cn("feat", `feat--${layout}`)}>
      {imgs.map((im, k) => (
        <Link
          key={im.index}
          to={to}
          className={cn("feat__img", `feat__img--${k}`)}
          data-cursor="Voir"
          tabIndex={-1}
          aria-hidden="true"
          navOptions={{ kind: "project" }}
          onNavigate={share}
        >
          <div className="feat__parallax" data-speed={speeds[layout][k] ?? 1}>
            <div className="feat__frame" data-reveal="" style={{ aspectRatio: `${im.width} / ${im.height}`, backgroundColor: im.color }}>
              <Img
                ref={k === 0 ? mainRef : undefined}
                image={im}
                alt=""
                sizes={k === 0 ? "(max-width: 899px) 100vw, 60vw" : "(max-width: 899px) 50vw, 26vw"}
              />
            </div>
          </div>
        </Link>
      ))}
      <div className="feat__text" data-reveal="">
        <p className="label feat__label">
          <span className="feat__num">{project.number}</span>
          {project.categories.map((c) => categoryById[c].short).join(" · ")}
        </p>
        <h3 className="feat__title">
          <Link to={to} className="feat__title-link" navOptions={{ kind: "project" }} onNavigate={share}>
            {/* le titre s'ajuste à sa colonne, sans dépasser la taille d'affichage */}
            <FitText text={project.title} max={136} />
          </Link>
        </h3>
        <p className="feat__summary">{project.summary}</p>
        <span className="feat__cta" aria-hidden="true">
          Voir le projet <Arrow />
        </span>
      </div>
    </article>
  );
}
