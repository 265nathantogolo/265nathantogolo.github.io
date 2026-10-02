import { useRef, type CSSProperties } from "react";
import { categoryById } from "@/data/categories";
import { coverOf, type Project } from "@/data/projects";
import { Link, paths } from "@/lib/router";
import { setSharedElement } from "@/lib/shared";
import { clamp, cn } from "@/lib/utils";
import { Img } from "./primitives";

export type CardSlot = "wide" | "narrow";

export function ProjectCard({ project, slot, priority }: { project: Project; slot: CardSlot; priority?: boolean }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const cover = coverOf(project);
  const style = {
    "--vt": `card-${project.slug}`,
    "--ar-wide": clamp(cover.ratio, 1.15, 1.6),
    "--ar-narrow": clamp(cover.ratio, 0.74, 1),
    // une petite image ne remplit pas un grand emplacement : pas d'agrandissement au-delà de 1,3×
    "--maxw": `${Math.round(cover.width * 1.3)}px`,
  } as CSSProperties;

  return (
    <article className={cn("card", `card--${slot}`)} style={style} data-reveal="">
      <Link
        to={paths.project(project.slug)}
        className="card__link"
        data-cursor="Voir"
        navOptions={{ kind: "project" }}
        onNavigate={() => setSharedElement(imgRef.current)}
      >
        <div className="card__media" style={{ backgroundColor: cover.color }}>
          <Img
            ref={imgRef}
            image={cover}
            alt=""
            priority={priority}
            sizes={slot === "wide" ? "(max-width: 899px) 100vw, 58vw" : "(max-width: 899px) 100vw, 34vw"}
          />
        </div>
        <div className="card__info">
          <span className="card__num">{project.number}</span>
          <h2 className="card__title">{project.title}</h2>
          <p className="card__cats">{project.categories.map((c) => categoryById[c].short).join(" · ")}</p>
        </div>
      </Link>
    </article>
  );
}
