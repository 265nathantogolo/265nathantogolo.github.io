import { useRef, type CSSProperties } from "react";
import { coverOf, projects, type Project } from "@/data/projects";
import { Link, paths } from "@/lib/router";
import { setSharedElement } from "@/lib/shared";
import { Img } from "./primitives";

/**
 * Bande d'accueil : les dix couvertures côte à côte, comme une planche-contact.
 * La vignette survolée s'ouvre en accordéon ; sur mobile, la bande défile au doigt.
 */
export function ProjectStrip() {
  return (
    <ul className="strip" aria-label="Les dix projets" data-reveal="">
      {projects.map((p, i) => (
        <StripItem key={p.slug} project={p} index={i} />
      ))}
    </ul>
  );
}

function StripItem({ project, index }: { project: Project; index: number }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const cover = coverOf(project);
  return (
    <li className="strip__item" style={{ "--i": index } as CSSProperties}>
      <Link
        to={paths.project(project.slug)}
        className="strip__link"
        data-cursor="Voir"
        navOptions={{ kind: "project" }}
        onNavigate={() => setSharedElement(imgRef.current)}
        style={{ backgroundColor: cover.color }}
      >
        <Img ref={imgRef} image={cover} alt="" priority={index < 5} sizes="(max-width: 899px) 60vw, 36vw" />
        <span className="strip__meta">
          <span className="strip__num">{project.number}</span>
          <span className="strip__title">{project.title}</span>
        </span>
      </Link>
    </li>
  );
}
